import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import { createHash, randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─── Types ───────────────────────────────────────────────
type Env = {
  Variables: {
    userId: string;
    apiKeyId: string;
    planId: string;
    creditsRemaining: number;
  };
};

const PLAN_CREDITS: Record<string, number> = { free: 50, pro: 1000, scale: 5000, enterprise: 999999 };
const PLAN_RATES: Record<string, number> = { free: 10, pro: 60, scale: 120, enterprise: 300 };
const ENDPOINT_CREDITS: Record<string, number> = {
  '/v1/keywords/research': 5,
  '/v1/keywords/gaps': 10,
  '/v1/content/audit': 15,
  '/v1/content/recommend': 10,
  '/v1/ai/citations': 20,
};

// ─── Clients ─────────────────────────────────────────────
function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function getStripe() {
  const Stripe = require('stripe');
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getDataForSEOAuth() {
  return Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');
}

// ─── App ─────────────────────────────────────────────────
const app = new Hono<Env>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health
app.get('/', (c) => c.json({
  name: 'AgenticPencil API',
  version: '1.0.0',
  docs: 'https://docs.agenticpencil.com',
  endpoints: {
    'POST /v1/keywords/research': 'Keyword research with clustering (5 credits)',
    'POST /v1/keywords/gaps': 'Competitor keyword gaps (10 credits)',
    'POST /v1/content/audit': 'Content audit with cannibalization detection (15 credits)',
    'POST /v1/content/recommend': 'AI-powered content recommendations (10 credits)',
    'GET /v1/usage': 'Check usage and credits (free)',
    'POST /v1/auth/register': 'Register and get API key (free)',
    'POST /v1/billing/checkout': 'Upgrade plan (returns Stripe checkout URL)',
  },
  status: 'operational',
}));

app.get('/health', (c) => c.json({ status: 'ok' }));

// ─── Auth Middleware ─────────────────────────────────────
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header. Use: Bearer ap_yourkey' } }, 401);
  }

  const apiKey = authHeader.slice(7).trim();
  if (!apiKey.startsWith('ap_')) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid API key format. Keys start with "ap_"' } }, 401);
  }

  const keyHash = createHash('sha256').update(apiKey).digest('hex');
  const db = getSupabase();

  const { data: keyData } = await db.from('api_keys').select('id, user_id').eq('key_hash', keyHash).eq('is_active', true).is('revoked_at', null).single();
  if (!keyData) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid API key' } }, 401);

  const { data: profile } = await db.from('profiles').select('id, plan_id, credits_used, credits_reset_at').eq('id', keyData.user_id).single();
  if (!profile) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } }, 401);

  // Reset credits if billing period expired
  if (new Date(profile.credits_reset_at) <= new Date()) {
    await db.from('profiles').update({ credits_used: 0, credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }).eq('id', profile.id);
    profile.credits_used = 0;
  }

  db.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyData.id).then(() => {});

  c.set('userId', profile.id);
  c.set('apiKeyId', keyData.id);
  c.set('planId', profile.plan_id);
  c.set('creditsRemaining', (PLAN_CREDITS[profile.plan_id] || 50) - profile.credits_used);

  await next();
}

// ─── Credits Check ──────────────────────────────────────
async function creditsCheck(c: any, next: any) {
  const path = c.req.path;
  const needed = ENDPOINT_CREDITS[path] || 5;
  const remaining = c.get('creditsRemaining');

  if (remaining < needed) {
    return c.json({ success: false, error: { code: 'INSUFFICIENT_CREDITS', message: `Need ${needed} credits, have ${remaining}. Upgrade at https://platform.agenticpencil.com` } }, 402);
  }
  await next();

  if (c.res.status >= 200 && c.res.status < 300) {
    const db = getSupabase();
    await db.rpc('increment_credits', { p_user_id: c.get('userId'), p_amount: needed }).then(() => {});
    db.from('usage_logs').insert({ api_key_id: c.get('apiKeyId'), user_id: c.get('userId'), endpoint: path, credits_used: needed, status_code: c.res.status }).then(() => {});
  }
}

// ─── DataForSEO Helpers ─────────────────────────────────
async function dfsRequest(endpoint: string, body: any[]) {
  const res = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${getDataForSEOAuth()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO: ${res.status}`);
  return res.json();
}

const LOCATIONS: Record<string, string> = { us: 'United States', uk: 'United Kingdom', ca: 'Canada', au: 'Australia', de: 'Germany', fr: 'France', es: 'Spain', it: 'Italy', br: 'Brazil', pt: 'Portugal', nl: 'Netherlands', in: 'India' };
const LANGUAGES: Record<string, string> = { en: 'English', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian', pt: 'Portuguese', nl: 'Dutch', tr: 'Turkish' };

// ─── Self-Registration ──────────────────────────────────
app.post('/v1/auth/register', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.email) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'email is required' } }, 400);

  const db = getSupabase();

  // Check if email already has a profile
  const { data: existing } = await db.from('profiles').select('id').eq('email', body.email).single();
  if (existing) {
    // Check if they already have an active key
    const { data: existingKey } = await db.from('api_keys').select('key_prefix').eq('user_id', existing.id).eq('is_active', true).single();
    if (existingKey) {
      return c.json({ success: false, error: { code: 'ALREADY_EXISTS', message: `Account exists. Key prefix: ${existingKey.key_prefix}. If lost, contact support.` } }, 409);
    }
  }

  // Create profile if doesn't exist
  let userId = existing?.id;
  if (!userId) {
    userId = randomUUID();
    await db.from('profiles').insert({ id: userId, email: body.email, plan_id: 'free', credits_used: 0, credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
  }

  // Generate API key
  const rawKey = `ap_${randomUUID().replace(/-/g, '')}`;
  const keyHash = createHash('sha256').update(rawKey).digest('hex');
  const keyPrefix = rawKey.slice(0, 12) + '...';

  await db.from('api_keys').insert({ user_id: userId, key_hash: keyHash, key_prefix: keyPrefix, name: body.name || 'Default' });

  return c.json({
    success: true,
    data: {
      api_key: rawKey,
      key_prefix: keyPrefix,
      plan: 'free',
      credits: 50,
      rate_limit: '10 requests/minute',
      warning: '⚠️ Save this key — it cannot be retrieved again.',
    },
  });
});

// ─── Billing / Stripe Checkout ──────────────────────────
app.post('/v1/billing/checkout', authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => null);
  const plan = body?.plan || 'pro';
  const stripe = getStripe();

  const prices: Record<string, { amount: number; name: string }> = {
    pro: { amount: 4900, name: 'AgenticPencil Pro' },
    scale: { amount: 19900, name: 'AgenticPencil Scale' },
  };

  const priceInfo = prices[plan];
  if (!priceInfo) return c.json({ success: false, error: { code: 'INVALID_PLAN', message: 'Plan must be "pro" or "scale"' } }, 400);

  try {
  const db = getSupabase();
  const { data: profile } = await db.from('profiles').select('email, stripe_customer_id').eq('id', c.get('userId')).single();

  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: profile?.email, metadata: { user_id: c.get('userId') } });
    customerId = customer.id;
    await db.from('profiles').update({ stripe_customer_id: customerId }).eq('id', c.get('userId'));
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: priceInfo.name, description: `${plan === 'pro' ? '1,000' : '5,000'} API credits/month` },
        unit_amount: priceInfo.amount,
        recurring: { interval: 'month' },
      },
      quantity: 1,
    }],
    success_url: 'https://platform.agenticpencil.com/billing/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://platform.agenticpencil.com/billing/cancel',
    metadata: { user_id: c.get('userId'), plan },
  });

  return c.json({ success: true, data: { checkout_url: session.url, plan, price: `$${priceInfo.amount / 100}/month` } });
} catch (err: any) {
  return c.json({ success: false, error: { code: 'BILLING_ERROR', message: err?.message || 'Stripe error', type: err?.type } }, 500);
}
});

// ─── Stripe Webhook ─────────────────────────────────────
app.post('/v1/billing/webhook', async (c) => {
  const body = await c.req.text();
  const sig = c.req.header('stripe-signature');
  const stripe = getStripe();

  let event;
  try {
    // In production, verify signature with webhook secret
    event = JSON.parse(body);
  } catch { return c.json({ error: 'Invalid payload' }, 400); }

  const db = getSupabase();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan;
    if (userId && plan) {
      await db.from('profiles').update({
        plan_id: plan,
        stripe_subscription_id: session.subscription,
        credits_used: 0,
        credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }).eq('id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await db.from('profiles').update({ plan_id: 'free' }).eq('stripe_subscription_id', sub.id);
  }

  return c.json({ received: true });
});

// ─── Authenticated Routes ───────────────────────────────
const v1 = new Hono<Env>();
v1.use('*', authMiddleware);

// Usage (free)
v1.get('/usage', async (c) => {
  const db = getSupabase();
  const userId = c.get('userId');
  const planId = c.get('planId');

  const { data: logs } = await db.from('usage_logs').select('endpoint, credits_used, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);

  return c.json({
    success: true,
    data: {
      plan: planId,
      credits_used: (PLAN_CREDITS[planId] || 50) - c.get('creditsRemaining'),
      credits_limit: PLAN_CREDITS[planId] || 50,
      credits_remaining: c.get('creditsRemaining'),
      rate_limit: PLAN_RATES[planId] || 10,
      recent_calls: logs || [],
      upgrade_url: 'https://platform.agenticpencil.com/billing',
    },
  });
});

// Keywords Research (5 credits)
v1.post('/keywords/research', creditsCheck, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.domain) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'domain is required' } }, 400);

  const { domain, topic, keywords: seeds, country = 'us', language = 'en', limit = 50 } = body;

  try {
    // Check cache
    const cacheKey = createHash('md5').update(JSON.stringify({ domain, topic, seeds, country, limit })).digest('hex');
    const db = getSupabase();
    const { data: cached } = await db.from('cached_results').select('result').eq('cache_key', cacheKey).gt('expires_at', new Date().toISOString()).single();
    if (cached) return c.json({ success: true, data: cached.result, meta: { credits_used: 5, credits_remaining: c.get('creditsRemaining') - 5, request_id: randomUUID(), cached: true } });

    let allKeywords: any[] = [];

    // Get ranked keywords for domain
    const ranked = await dfsRequest('/dataforseo_labs/google/ranked_keywords/live', [{
      target: domain, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit, order_by: ['keyword_data.keyword_info.search_volume,desc'],
    }]);
    for (const item of ranked?.tasks?.[0]?.result?.[0]?.items || []) {
      allKeywords.push({
        keyword: item.keyword_data?.keyword || '',
        search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
        keyword_difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0,
        cpc: item.keyword_data?.keyword_info?.cpc || 0,
        competition_level: item.keyword_data?.keyword_info?.competition_level || 'LOW',
        search_intent: item.keyword_data?.search_intent_info?.main_intent || 'informational',
      });
    }

    // Get suggestions if topic provided
    if (topic || seeds?.length) {
      const seedList = seeds || [topic];
      const suggestions = await dfsRequest('/dataforseo_labs/google/keyword_suggestions/live', [{
        keywords: seedList, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit, include_seed_keyword: true, order_by: ['keyword_info.search_volume,desc'],
      }]);
      for (const item of suggestions?.tasks?.[0]?.result?.[0]?.items || []) {
        allKeywords.push({
          keyword: item.keyword || '',
          search_volume: item.keyword_info?.search_volume || 0,
          keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
          cpc: item.keyword_info?.cpc || 0,
          competition_level: item.keyword_info?.competition_level || 'LOW',
          search_intent: item.search_intent_info?.main_intent || 'informational',
        });
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    allKeywords = allKeywords.filter(k => { if (seen.has(k.keyword)) return false; seen.add(k.keyword); return k.keyword.length > 0; });

    // Cluster
    const clusters = clusterKeywords(allKeywords);

    const result = { domain, topic: topic || domain, country, clusters, total_keywords: allKeywords.length };

    db.from('cached_results').upsert({ cache_key: cacheKey, endpoint: '/v1/keywords/research', result, expires_at: new Date(Date.now() + 86400000).toISOString() }).then(() => {});

    return c.json({ success: true, data: result, meta: { credits_used: 5, credits_remaining: c.get('creditsRemaining') - 5, request_id: randomUUID() } });
  } catch (err: any) {
    console.error('Keywords research error:', err);
    return c.json({ success: false, error: { code: 'PROVIDER_ERROR', message: 'Failed to fetch keyword data' } }, 502);
  }
});

// Keywords Gaps (10 credits)
v1.post('/keywords/gaps', creditsCheck, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.domain) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'domain is required' } }, 400);

  const { domain, competitors = [], country = 'us', language = 'en' } = body;

  try {
    let compDomains = competitors;
    if (compDomains.length === 0) {
      const compData = await dfsRequest('/dataforseo_labs/google/competitors_domain/live', [{
        target: domain, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit: 5,
      }]);
      compDomains = (compData?.tasks?.[0]?.result?.[0]?.items || []).slice(0, 3).map((c: any) => c.domain);
    }

    if (compDomains.length === 0) return c.json({ success: true, data: { domain, gaps: [], message: 'No competitors found' }, meta: { credits_used: 10, request_id: randomUUID() } });

    const targets: Record<string, string> = { '1': domain };
    compDomains.slice(0, 3).forEach((d: string, i: number) => { targets[`${i + 2}`] = d; });

    const gapData = await dfsRequest('/dataforseo_labs/google/domain_intersection/live', [{
      targets, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit: 100,
      order_by: ['keyword_data.keyword_info.search_volume,desc'],
    }]);

    const gaps = (gapData?.tasks?.[0]?.result?.[0]?.items || []).map((item: any) => ({
      keyword: item.keyword_data?.keyword || '',
      search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
      keyword_difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0,
      cpc: item.keyword_data?.keyword_info?.cpc || 0,
      search_intent: item.keyword_data?.search_intent_info?.main_intent || 'informational',
    }));

    return c.json({ success: true, data: { domain, competitors_analyzed: compDomains, gaps, total: gaps.length }, meta: { credits_used: 10, credits_remaining: c.get('creditsRemaining') - 10, request_id: randomUUID() } });
  } catch (err: any) {
    console.error('Gaps error:', err);
    return c.json({ success: false, error: { code: 'PROVIDER_ERROR', message: 'Failed to fetch gap data' } }, 502);
  }
});

// Content Audit (15 credits)
v1.post('/content/audit', creditsCheck, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.domain) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'domain is required' } }, 400);

  const { domain, sitemap_url, max_pages = 100 } = body;

  try {
    let urls: string[] = [];
    const sitemapUrls = sitemap_url ? [sitemap_url] : [`https://${domain}/sitemap.xml`, `https://www.${domain}/sitemap.xml`];

    for (const url of sitemapUrls) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'AgenticPencil/1.0' } });
        if (!res.ok) continue;
        const text = await res.text();
        const matches = [...text.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)];
        for (const m of matches) {
          if (m[1].endsWith('.xml')) {
            try {
              const sub = await fetch(m[1], { headers: { 'User-Agent': 'AgenticPencil/1.0' } });
              if (sub.ok) { const st = await sub.text(); [...st.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)].forEach(s => { if (!s[1].endsWith('.xml')) urls.push(s[1]); }); }
            } catch {}
          } else { urls.push(m[1]); }
        }
        if (urls.length > 0) break;
      } catch {}
    }

    urls = urls.slice(0, max_pages);

    // Fetch pages in parallel batches
    const pages: any[] = [];
    for (let i = 0; i < urls.length; i += 10) {
      const batch = await Promise.all(urls.slice(i, i + 10).map(async (url) => {
        try {
          const res = await fetch(url, { headers: { 'User-Agent': 'AgenticPencil/1.0' }, redirect: 'follow' });
          const html = await res.text();
          const title = html.match(/<title[^>]*>(.*?)<\/title>/si)?.[1]?.trim() || '';
          const desc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/si)?.[1]?.trim() || '';
          const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/si)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
          const text = html.replace(/<script[^>]*>.*?<\/script>/gsi, '').replace(/<style[^>]*>.*?<\/style>/gsi, '').replace(/<[^>]+>/g, ' ');
          return { url, title, meta_description: desc, h1, word_count: text.split(/\s+/).length, status: res.status };
        } catch { return { url, title: '', meta_description: '', h1: '', word_count: 0, status: 0 }; }
      }));
      pages.push(...batch);
    }

    const thin = pages.filter(p => p.word_count > 0 && p.word_count < 300);

    // Simple cannibalization detection
    const titleMap = new Map<string, string[]>();
    pages.forEach(p => {
      p.title.toLowerCase().split(/[\s\-|:,]+/).filter((w: string) => w.length > 3).forEach((w: string) => {
        if (!titleMap.has(w)) titleMap.set(w, []);
        titleMap.get(w)!.push(p.url);
      });
    });
    const cannib = [...titleMap.entries()].filter(([_, urls]) => urls.length > 1).map(([kw, urls]) => ({
      keyword: kw, pages: urls, severity: urls.length > 3 ? 'high' : urls.length > 2 ? 'medium' : 'low',
    })).sort((a, b) => b.pages.length - a.pages.length).slice(0, 20);

    return c.json({
      success: true,
      data: { domain, pages_crawled: pages.length, pages, thin_content: thin, cannibalization_risks: cannib, summary: { total: pages.length, thin: thin.length, cannibalization_issues: cannib.length, avg_words: Math.round(pages.reduce((s, p) => s + p.word_count, 0) / (pages.length || 1)) } },
      meta: { credits_used: 15, credits_remaining: c.get('creditsRemaining') - 15, request_id: randomUUID() },
    });
  } catch (err: any) {
    console.error('Audit error:', err);
    return c.json({ success: false, error: { code: 'AUDIT_ERROR', message: 'Failed to audit. Check domain is accessible.' } }, 502);
  }
});

// Content Recommendations (10 credits)
v1.post('/content/recommend', creditsCheck, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body?.domain) return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'domain is required' } }, 400);

  const { domain, focus_topics = [], limit = 20, country = 'us', language = 'en' } = body;

  try {
    const existing = await dfsRequest('/dataforseo_labs/google/ranked_keywords/live', [{
      target: domain, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit: 100, order_by: ['keyword_data.keyword_info.search_volume,desc'],
    }]);
    const existingKws = new Set((existing?.tasks?.[0]?.result?.[0]?.items || []).map((i: any) => i.keyword_data?.keyword?.toLowerCase()));

    const seeds = focus_topics.length > 0 ? focus_topics : (existing?.tasks?.[0]?.result?.[0]?.items || []).slice(0, 5).map((i: any) => i.keyword_data?.keyword).filter(Boolean);
    if (seeds.length === 0) return c.json({ success: true, data: { domain, recommendations: [], message: 'No seed keywords found' } });

    const suggestions = await dfsRequest('/dataforseo_labs/google/keyword_suggestions/live', [{
      keywords: seeds, location_name: LOCATIONS[country] || 'United States', language_name: LANGUAGES[language] || 'English', limit: 100, order_by: ['keyword_info.search_volume,desc'],
    }]);

    const recs = (suggestions?.tasks?.[0]?.result?.[0]?.items || [])
      .filter((i: any) => !existingKws.has(i.keyword?.toLowerCase()) && (i.keyword_info?.search_volume || 0) > 0)
      .map((i: any, idx: number) => {
        const vol = i.keyword_info?.search_volume || 0;
        const kd = i.keyword_properties?.keyword_difficulty || 0;
        const intent = i.search_intent_info?.main_intent || 'informational';
        const type = intent === 'commercial' ? 'comparison' : intent === 'transactional' ? 'guide' : vol > 1000 ? 'pillar' : 'supporting';
        return {
          priority: idx + 1,
          target_keyword: i.keyword,
          search_volume: vol,
          keyword_difficulty: kd,
          search_intent: intent,
          content_type: type,
          cpc: i.keyword_info?.cpc || 0,
          opportunity_score: Math.min(100, Math.round((vol / 500) * ((100 - kd) / 100) * 50)),
          suggested_title: generateTitle(i.keyword, type),
          brief: `Write a ${type === 'pillar' ? 'comprehensive 2000+ word' : '1200-1500 word'} ${type} article targeting "${i.keyword}" (${vol} monthly searches, KD ${kd}). Focus on ${intent} intent.`,
        };
      })
      .sort((a: any, b: any) => b.opportunity_score - a.opportunity_score)
      .slice(0, limit)
      .map((r: any, i: number) => ({ ...r, priority: i + 1 }));

    return c.json({ success: true, data: { domain, recommendations: recs, total: recs.length }, meta: { credits_used: 10, credits_remaining: c.get('creditsRemaining') - 10, request_id: randomUUID() } });
  } catch (err: any) {
    console.error('Recommend error:', err);
    return c.json({ success: false, error: { code: 'PROVIDER_ERROR', message: 'Failed to generate recommendations' } }, 502);
  }
});

app.route('/v1', v1);

// 404
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found. See https://docs.agenticpencil.com' } }, 404));
app.onError((err, c) => { console.error('Error:', err); return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } }, 500); });

// ─── Helpers ─────────────────────────────────────────────
function clusterKeywords(keywords: any[]) {
  const clusters: Map<string, any[]> = new Map();
  const assigned = new Set<string>();
  const sorted = [...keywords].sort((a, b) => b.search_volume - a.search_volume);

  for (const kw of sorted) {
    if (assigned.has(kw.keyword)) continue;
    const words = kw.keyword.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
    const cluster: any[] = [kw];
    assigned.add(kw.keyword);

    for (const other of sorted) {
      if (assigned.has(other.keyword)) continue;
      const otherWords = other.keyword.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
      if (words.filter((w: string) => otherWords.includes(w)).length >= Math.min(2, words.length)) {
        cluster.push(other);
        assigned.add(other.keyword);
      }
    }
    clusters.set(kw.keyword, cluster);
  }

  return [...clusters.entries()].map(([name, kws]) => {
    const vol = kws.reduce((s, k) => s + k.search_volume, 0);
    const avgKd = kws.reduce((s, k) => s + k.keyword_difficulty, 0) / kws.length;
    return { cluster_name: name, primary_keyword: kws[0], related: kws.slice(1), total_volume: vol, avg_difficulty: Math.round(avgKd), opportunity_score: Math.min(100, Math.round((vol / 1000) * (100 - avgKd) / 100 * 10)), count: kws.length };
  }).sort((a, b) => b.opportunity_score - a.opportunity_score);
}

function generateTitle(kw: string, type: string) {
  const k = kw.charAt(0).toUpperCase() + kw.slice(1);
  return type === 'pillar' ? `The Complete Guide to ${k}` : type === 'comparison' ? `${k}: Best Options Compared` : type === 'guide' ? `How to ${k}: Step-by-Step` : `${k}: What You Need to Know`;
}

export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Convert VercelRequest to a standard Request
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value[0] : value);
  }

  let body: BodyInit | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  const request = new Request(url.toString(), {
    method: req.method || 'GET',
    headers,
    body,
  });

  const response = await app.fetch(request);

  // Set response headers
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  res.status(response.status);
  const text = await response.text();
  res.end(text);
}
