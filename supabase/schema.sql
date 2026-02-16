-- AgenticPencil Database Schema

-- ─── User Profiles ───────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  plan_id text not null default 'free' check (plan_id in ('free', 'pro', 'scale', 'enterprise')),
  credits_used integer not null default 0,
  credits_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── API Keys ────────────────────────────────────────────
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  key_hash text not null unique,
  key_prefix text not null, -- "ap_xxxx..." for display
  name text not null default 'Default',
  is_active boolean not null default true,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_api_keys_hash on public.api_keys(key_hash) where is_active = true;
create index idx_api_keys_user on public.api_keys(user_id);

-- ─── Usage Logs ──────────────────────────────────────────
create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references public.api_keys(id),
  user_id uuid not null references public.profiles(id),
  endpoint text not null,
  credits_used integer not null default 0,
  status_code integer not null,
  response_time_ms integer,
  request_body jsonb,
  created_at timestamptz not null default now()
);

create index idx_usage_logs_user on public.usage_logs(user_id, created_at desc);
create index idx_usage_logs_key on public.usage_logs(api_key_id, created_at desc);

-- ─── Cached Results ──────────────────────────────────────
create table if not exists public.cached_results (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null unique,
  endpoint text not null,
  result jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index idx_cached_results_key on public.cached_results(cache_key);

-- ─── Rate Limiting ───────────────────────────────────────
create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid not null references public.api_keys(id),
  window_start timestamptz not null,
  request_count integer not null default 1,
  unique(api_key_id, window_start)
);

create index idx_rate_limits_key on public.rate_limits(api_key_id, window_start desc);

-- ─── RLS Policies ────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.api_keys enable row level security;
alter table public.usage_logs enable row level security;

-- Users can read/update their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Users can manage their own API keys
create policy "Users can view own keys" on public.api_keys
  for select using (auth.uid() = user_id);
create policy "Users can insert own keys" on public.api_keys
  for insert with check (auth.uid() = user_id);
create policy "Users can update own keys" on public.api_keys
  for update using (auth.uid() = user_id);

-- Users can view their own usage
create policy "Users can view own usage" on public.usage_logs
  for select using (auth.uid() = user_id);

-- ─── Functions ───────────────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reset credits monthly
create or replace function public.reset_credits_if_needed(p_user_id uuid)
returns void as $$
begin
  update public.profiles
  set credits_used = 0,
      credits_reset_at = date_trunc('month', now()) + interval '1 month'
  where id = p_user_id
    and credits_reset_at <= now();
end;
$$ language plpgsql security definer;
