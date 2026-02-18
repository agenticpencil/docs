import { supabase } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.agenticpencil.com'

// ── Types ──────────────────────────────────────────────

export interface ApiKeyRow {
  id: string
  profile_id: string
  key_prefix: string
  is_active: boolean
  created_at: string
}

export interface UsageData {
  credits_used: number
  credits_limit: number
  plan: string
}

export interface UsageLogRow {
  id: string
  api_key_id: string
  user_id: string
  endpoint: string
  credits_used: number
  status_code: number
  created_at: string
}

export interface ProfileRow {
  id: string
  email: string
  plan_id: string
  credits_used: number
  credits_reset_at: string
  stripe_customer_id: string | null
}

// ── API helpers (real endpoints) ──────────────────────

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${body || res.statusText}`)
  }
  return res.json()
}

// ── Real API calls ───────────────────────────────────

export async function getUsage(): Promise<UsageData> {
  return apiFetch<UsageData>('/v1/usage')
}

export async function createCheckoutSession(planId: string): Promise<{ checkout_url: string }> {
  return apiFetch<{ checkout_url: string }>('/v1/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan_id: planId }),
  })
}

export async function registerApiKey(email: string): Promise<{ api_key: string }> {
  return apiFetch<{ api_key: string }>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// ── Supabase direct queries (RLS-protected) ──────────

export async function getProfile(): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single()
  if (error) {
    console.error('getProfile error:', error)
    return null
  }
  return data
}

export async function getApiKeys(): Promise<ApiKeyRow[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('getApiKeys error:', error)
    return []
  }
  return data ?? []
}

export async function deactivateApiKey(keyId: string): Promise<boolean> {
  const { error } = await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('id', keyId)
  if (error) {
    console.error('deactivateApiKey error:', error)
    return false
  }
  return true
}

export async function getUsageLogs(limit = 50): Promise<UsageLogRow[]> {
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('getUsageLogs error:', error)
    return []
  }
  return data ?? []
}
