import { Context } from 'hono';
import { getKeywordsForSite, getKeywordSuggestions, KeywordData } from '../lib/dataforseo';
import type { Env } from '../index';

interface RequestBody {
  domain: string;
  focus_topics?: string[];
  limit?: number;
  country?: string;
  language?: string;
}

function determineContentType(intent: string, volume: number, difficulty: number): string {
  if (intent === 'informational' && volume > 1000) return 'pillar';
  if (intent === 'informational') return 'supporting';
  if (intent === 'commercial') return 'comparison';
  if (intent === 'transactional') return 'guide';
  return 'supporting';
}

function generateBrief(keyword: string, intent: string, contentType: string): string {
  const briefs: Record<string, string> = {
    pillar: `Create a comprehensive, in-depth guide covering all aspects of "${keyword}". Include sections for beginners and advanced users. Target 2000+ words with rich media, examples, and actionable takeaways. This should be the definitive resource on the topic.`,
    supporting: `Write a focused article on "${keyword}" that supports your pillar content. Target 1000-1500 words. Include specific examples, data points, and link back to the main topic pillar page.`,
    comparison: `Create a detailed comparison or review article for "${keyword}". Include pros/cons, pricing, features, and a clear recommendation. Target 1500-2000 words with comparison tables.`,
    guide: `Write a step-by-step practical guide for "${keyword}". Focus on actionable steps, screenshots/examples, and clear outcomes. Target 1200-1800 words.`,
    listicle: `Create a curated list article for "${keyword}". Include 10-15 items with brief descriptions and links. Target 1500-2000 words.`,
  };
  return briefs[contentType] || briefs.supporting;
}

function estimateWordCount(contentType: string): number {
  const counts: Record<string, number> = {
    pillar: 2500, supporting: 1200, comparison: 1800, guide: 1500, listicle: 1800,
  };
  return counts[contentType] || 1200;
}

export async function contentRecommend(c: Context<Env>) {
  const body = await c.req.json<RequestBody>().catch(() => null);

  if (!body?.domain) {
    return c.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'domain is required' },
    }, 400);
  }

  const { domain, focus_topics = [], limit = 20, country = 'us', language = 'en' } = body;

  try {
    // Get current site keywords (what they already rank for)
    const existingKeywords = await getKeywordsForSite(domain, country, language, 100);
    const existingSet = new Set(existingKeywords.map(k => k.keyword.toLowerCase()));

    // Get keyword suggestions based on domain + topics
    let opportunities: KeywordData[] = [];
    
    if (focus_topics.length > 0) {
      const suggestions = await getKeywordSuggestions(focus_topics, country, language, 100);
      opportunities = suggestions.filter(k => !existingSet.has(k.keyword.toLowerCase()));
    } else {
      // Use top existing keywords as seeds
      const topSeeds = existingKeywords.slice(0, 5).map(k => k.keyword);
      if (topSeeds.length > 0) {
        const suggestions = await getKeywordSuggestions(topSeeds, country, language, 100);
        opportunities = suggestions.filter(k => !existingSet.has(k.keyword.toLowerCase()));
      }
    }

    // Score and rank recommendations
    const recommendations = opportunities
      .filter(k => k.search_volume > 0)
      .map((k, idx) => {
        const contentType = determineContentType(k.search_intent, k.search_volume, k.keyword_difficulty);
        const opportunityScore = Math.min(100, Math.round(
          (k.search_volume / 500) * ((100 - k.keyword_difficulty) / 100) * 50
        ));

        return {
          priority: 0, // set after sort
          title: generateTitle(k.keyword, contentType),
          target_keyword: k.keyword,
          search_volume: k.search_volume,
          keyword_difficulty: k.keyword_difficulty,
          search_intent: k.search_intent,
          content_type: contentType,
          estimated_word_count: estimateWordCount(contentType),
          brief: generateBrief(k.keyword, k.search_intent, contentType),
          opportunity_score: opportunityScore,
          cpc: k.cpc,
        };
      })
      .sort((a, b) => b.opportunity_score - a.opportunity_score)
      .slice(0, limit)
      .map((rec, idx) => ({ ...rec, priority: idx + 1 }));

    return c.json({
      success: true,
      data: {
        domain,
        existing_keywords: existingKeywords.length,
        recommendations,
        total_recommendations: recommendations.length,
      },
      meta: {
        credits_used: 10,
        credits_remaining: c.get('creditsRemaining') - 10,
        request_id: crypto.randomUUID(),
      },
    });
  } catch (err: any) {
    console.error('Content recommend error:', err);
    return c.json({
      success: false,
      error: { code: 'PROVIDER_ERROR', message: 'Failed to generate recommendations.' },
    }, 502);
  }
}

function generateTitle(keyword: string, contentType: string): string {
  const kw = keyword.charAt(0).toUpperCase() + keyword.slice(1);
  switch (contentType) {
    case 'pillar': return `The Complete Guide to ${kw}`;
    case 'comparison': return `${kw}: Best Options Compared`;
    case 'guide': return `How to ${kw}: A Step-by-Step Guide`;
    case 'listicle': return `Top ${kw} You Should Know About`;
    default: return `${kw}: What You Need to Know`;
  }
}
