import { Context, Next } from 'hono';
import { createHash } from 'crypto';
import { getSupabase } from '../lib/supabase';
import type { Env } from '../index';

export async function authMiddleware(c: Context<Env>, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header. Use: Bearer ap_yourkey' },
    }, 401);
  }

  const apiKey = authHeader.slice(7).trim();
  
  if (!apiKey.startsWith('ap_')) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid API key format. Keys start with "ap_"' },
    }, 401);
  }

  // Hash the key and look it up
  const keyHash = createHash('sha256').update(apiKey).digest('hex');
  const db = getSupabase();

  const { data: keyData, error } = await db
    .from('api_keys')
    .select('id, user_id, is_active, revoked_at')
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .is('revoked_at', null)
    .single();

  if (error || !keyData) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid API key' },
    }, 401);
  }

  // Get user profile
  const { data: profile } = await db
    .from('profiles')
    .select('id, plan_id, credits_used, credits_reset_at')
    .eq('id', keyData.user_id)
    .single();

  if (!profile) {
    return c.json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'User not found' },
    }, 401);
  }

  // Reset credits if needed
  if (new Date(profile.credits_reset_at) <= new Date()) {
    await db.rpc('reset_credits_if_needed', { p_user_id: profile.id });
    profile.credits_used = 0;
  }

  // Update last_used_at
  db.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyData.id).then(() => {});

  // Set context
  c.set('userId', profile.id);
  c.set('apiKeyId', keyData.id);
  c.set('planId', profile.plan_id);

  // Calculate remaining credits
  const plans: Record<string, number> = { free: 50, pro: 1000, scale: 5000, enterprise: 999999 };
  c.set('creditsRemaining', (plans[profile.plan_id] || 50) - profile.credits_used);

  await next();
}
