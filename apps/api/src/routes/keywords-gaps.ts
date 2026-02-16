import { Context } from 'hono';
import { getCompetitorKeywords } from '../lib/dataforseo';
import type { Env } from '../index';

interface RequestBody {
  domain: string;
  competitors?: string[];
  country?: string;
  language?: string;
}

export async function keywordsGaps(c: Context<Env>) {
  const body = await c.req.json<RequestBody>().catch(() => null);

  if (!body?.domain) {
    return c.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'domain is required' },
    }, 400);
  }

  const { domain, competitors = [], country = 'us', language = 'en' } = body;

  try {
    const gaps = await getCompetitorKeywords(domain, competitors, country, language);

    return c.json({
      success: true,
      data: {
        domain,
        competitors_analyzed: competitors,
        gaps: gaps.map(k => ({
          keyword: k.keyword,
          search_volume: k.search_volume,
          keyword_difficulty: k.keyword_difficulty,
          cpc: k.cpc,
          competition_level: k.competition_level,
          search_intent: k.search_intent,
          opportunity: k.search_volume > 0 ? Math.round((k.search_volume / 100) * (100 - k.keyword_difficulty)) : 0,
        })),
        total_gaps: gaps.length,
      },
      meta: {
        credits_used: 10,
        credits_remaining: c.get('creditsRemaining') - 10,
        request_id: crypto.randomUUID(),
      },
    });
  } catch (err: any) {
    console.error('Keywords gaps error:', err);
    return c.json({
      success: false,
      error: { code: 'PROVIDER_ERROR', message: 'Failed to fetch competitor data.' },
    }, 502);
  }
}
