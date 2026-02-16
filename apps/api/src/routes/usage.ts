import { Context } from 'hono';
import { getSupabase } from '../lib/supabase';
import type { Env } from '../index';

const PLAN_CREDITS: Record<string, number> = {
  free: 50,
  pro: 1000,
  scale: 5000,
  enterprise: 999999,
};

const PLAN_RATES: Record<string, number> = {
  free: 10,
  pro: 60,
  scale: 120,
  enterprise: 300,
};

export async function usage(c: Context<Env>) {
  const userId = c.get('userId');
  const planId = c.get('planId');
  const db = getSupabase();

  const { data: profile } = await db
    .from('profiles')
    .select('credits_used, credits_reset_at, plan_id')
    .eq('id', userId)
    .single();

  if (!profile) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } }, 404);
  }

  const creditsLimit = PLAN_CREDITS[profile.plan_id] || 50;

  // Get recent usage
  const { data: recentUsage } = await db
    .from('usage_logs')
    .select('endpoint, credits_used, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Get today's request count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count } = await db
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  return c.json({
    success: true,
    data: {
      plan: profile.plan_id,
      credits_used: profile.credits_used,
      credits_limit: creditsLimit,
      credits_remaining: Math.max(0, creditsLimit - profile.credits_used),
      requests_today: count || 0,
      rate_limit: PLAN_RATES[profile.plan_id] || 10,
      billing_period_end: profile.credits_reset_at,
      recent_calls: recentUsage || [],
    },
  });
}
