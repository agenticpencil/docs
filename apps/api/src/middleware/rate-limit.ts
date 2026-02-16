import { Context, Next } from 'hono';
import { getSupabase } from '../lib/supabase';
import type { Env } from '../index';

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 60,
  scale: 120,
  enterprise: 300,
};

export async function rateLimitMiddleware(c: Context<Env>, next: Next) {
  const apiKeyId = c.get('apiKeyId');
  const planId = c.get('planId');
  const rateLimit = PLAN_LIMITS[planId] || 10;

  const db = getSupabase();
  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

  // Upsert rate limit counter
  const { data, error } = await db
    .from('rate_limits')
    .upsert(
      { api_key_id: apiKeyId, window_start: windowStart.toISOString(), request_count: 1 },
      { onConflict: 'api_key_id,window_start' }
    )
    .select('request_count')
    .single();

  if (error) {
    // If upsert conflict, increment
    const { data: updated } = await db
      .from('rate_limits')
      .update({ request_count: data?.request_count ? data.request_count + 1 : 1 })
      .eq('api_key_id', apiKeyId)
      .eq('window_start', windowStart.toISOString())
      .select('request_count')
      .single();

    if (updated && updated.request_count > rateLimit) {
      c.header('X-RateLimit-Limit', String(rateLimit));
      c.header('X-RateLimit-Remaining', '0');
      c.header('Retry-After', '60');
      return c.json({
        success: false,
        error: { code: 'RATE_LIMITED', message: `Rate limit exceeded. ${rateLimit} requests/minute on ${planId} plan.` },
      }, 429);
    }
  }

  // Set rate limit headers
  const remaining = Math.max(0, rateLimit - (data?.request_count || 1));
  c.header('X-RateLimit-Limit', String(rateLimit));
  c.header('X-RateLimit-Remaining', String(remaining));

  await next();
}
