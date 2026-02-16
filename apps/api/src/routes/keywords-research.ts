import { Context } from 'hono';
import { getKeywordsForSite, getKeywordSuggestions, KeywordData } from '../lib/dataforseo';
import { getSupabase } from '../lib/supabase';
import { createHash } from 'crypto';
import type { Env } from '../index';

interface RequestBody {
  domain: string;
  topic?: string;
  keywords?: string[];
  country?: string;
  language?: string;
  limit?: number;
}

function clusterKeywords(keywords: KeywordData[]): any[] {
  // Simple clustering by grouping keywords that share 2+ words
  const clusters: Map<string, KeywordData[]> = new Map();
  const assigned = new Set<string>();

  // Sort by volume desc
  const sorted = [...keywords].sort((a, b) => b.search_volume - a.search_volume);

  for (const kw of sorted) {
    if (assigned.has(kw.keyword)) continue;
    
    const words = kw.keyword.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const cluster: KeywordData[] = [kw];
    assigned.add(kw.keyword);

    for (const other of sorted) {
      if (assigned.has(other.keyword)) continue;
      const otherWords = other.keyword.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const overlap = words.filter(w => otherWords.includes(w)).length;
      if (overlap >= Math.min(2, words.length)) {
        cluster.push(other);
        assigned.add(other.keyword);
      }
    }

    clusters.set(kw.keyword, cluster);
  }

  return Array.from(clusters.entries()).map(([name, kws]) => {
    const totalVolume = kws.reduce((sum, k) => sum + k.search_volume, 0);
    const avgDifficulty = kws.reduce((sum, k) => sum + k.keyword_difficulty, 0) / kws.length;
    
    // Opportunity score: high volume + low difficulty = high opportunity
    const opportunityScore = Math.min(100, Math.round(
      (totalVolume / 1000) * (100 - avgDifficulty) / 100 * 10
    ));

    return {
      cluster_name: name,
      primary_keyword: kws[0],
      related_keywords: kws.slice(1),
      total_volume: totalVolume,
      avg_difficulty: Math.round(avgDifficulty),
      opportunity_score: opportunityScore,
      keyword_count: kws.length,
    };
  }).sort((a, b) => b.opportunity_score - a.opportunity_score);
}

export async function keywordsResearch(c: Context<Env>) {
  const body = await c.req.json<RequestBody>().catch(() => null);
  
  if (!body?.domain) {
    return c.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'domain is required' },
    }, 400);
  }

  const { domain, topic, keywords: seedKeywords, country = 'us', language = 'en', limit = 50 } = body;

  // Check cache
  const cacheKey = createHash('md5').update(JSON.stringify({ domain, topic, seedKeywords, country, language, limit })).digest('hex');
  const db = getSupabase();
  
  const { data: cached } = await db
    .from('cached_results')
    .select('result')
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (cached) {
    return c.json({
      success: true,
      data: cached.result,
      meta: {
        credits_used: 5,
        credits_remaining: c.get('creditsRemaining') - 5,
        request_id: crypto.randomUUID(),
        cached: true,
      },
    });
  }

  try {
    let allKeywords: KeywordData[] = [];

    // Get keywords from domain ranking data
    const siteKeywords = await getKeywordsForSite(domain, country, language, limit);
    allKeywords.push(...siteKeywords);

    // If topic or seed keywords provided, get suggestions
    if (topic || seedKeywords?.length) {
      const seeds = seedKeywords || [topic!];
      const suggestions = await getKeywordSuggestions(seeds, country, language, limit);
      allKeywords.push(...suggestions);
    }

    // Deduplicate
    const seen = new Set<string>();
    allKeywords = allKeywords.filter(k => {
      if (seen.has(k.keyword)) return false;
      seen.add(k.keyword);
      return true;
    });

    // Cluster
    const clusters = clusterKeywords(allKeywords);

    const result = {
      domain,
      topic: topic || domain,
      country,
      clusters,
      total_keywords: allKeywords.length,
    };

    // Cache for 24 hours
    await db.from('cached_results').upsert({
      cache_key: cacheKey,
      endpoint: '/v1/keywords/research',
      result,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }).catch(() => {});

    return c.json({
      success: true,
      data: result,
      meta: {
        credits_used: 5,
        credits_remaining: c.get('creditsRemaining') - 5,
        request_id: crypto.randomUUID(),
        cached: false,
      },
    });
  } catch (err: any) {
    console.error('Keywords research error:', err);
    return c.json({
      success: false,
      error: { code: 'PROVIDER_ERROR', message: 'Failed to fetch keyword data. Please try again.' },
    }, 502);
  }
}
