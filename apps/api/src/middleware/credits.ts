import { Context, Next } from 'hono';
import { getSupabase } from '../lib/supabase';
import type { Env } from '../index';

const ENDPOINT_CREDITS: Record<string, number> = {
  '/v1/keywords/research': 5,
  '/v1/keywords/gaps': 10,
  '/v1/content/audit': 15,
  '/v1/content/recommend': 10,
  '/v1/ai/citations': 20,
};

export async function creditsMiddleware(c: Context<Env>, next: Next) {
  const path = c.req.path;
  const creditsNeeded = ENDPOINT_CREDITS[path] || 5;
  const creditsRemaining = c.get('creditsRemaining');

  if (creditsRemaining < creditsNeeded) {
    return c.json({
      success: false,
      error: {
        code: 'INSUFFICIENT_CREDITS',
        message: `This endpoint requires ${creditsNeeded} credits. You have ${creditsRemaining} remaining. Upgrade at https://platform.agenticpencil.com/billing`,
      },
    }, 402);
  }

  // Execute the handler
  await next();

  // Deduct credits after successful response
  if (c.res.status >= 200 && c.res.status < 300) {
    const db = getSupabase();
    const userId = c.get('userId');
    const apiKeyId = c.get('apiKeyId');

    // Increment credits used
    await db.rpc('increment_credits', { p_user_id: userId, p_amount: creditsNeeded }).catch(() => {
      // Fallback: direct update
      db.from('profiles')
        .update({ credits_used: creditsRemaining - creditsNeeded >= 0 ? creditsNeeded : 0 })
        .eq('id', userId)
        .then(() => {});
    });

    // Log usage
    await db.from('usage_logs').insert({
      api_key_id: apiKeyId,
      user_id: userId,
      endpoint: path,
      credits_used: creditsNeeded,
      status_code: c.res.status,
    }).catch(() => {});
  }
}
