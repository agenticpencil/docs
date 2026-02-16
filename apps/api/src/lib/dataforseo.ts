const DATAFORSEO_BASE = 'https://api.dataforseo.com/v3';

function getAuth(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error('Missing DataForSEO credentials');
  return Buffer.from(`${login}:${password}`).toString('base64');
}

async function request(endpoint: string, body: unknown[]): Promise<any> {
  const res = await fetch(`${DATAFORSEO_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getAuth()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO error: ${res.status} ${res.statusText}`);
  return res.json();
}

export interface KeywordData {
  keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  cpc: number;
  competition: number;
  competition_level: string;
  search_intent: string;
  monthly_searches: number[];
}

export async function getKeywordsForSite(
  domain: string,
  country: string = 'us',
  language: string = 'en',
  limit: number = 50
): Promise<KeywordData[]> {
  const data = await request('/dataforseo_labs/google/ranked_keywords/live', [{
    target: domain,
    location_name: getLocationName(country),
    language_name: getLanguageName(language),
    limit,
    order_by: ['keyword_data.keyword_info.search_volume,desc'],
  }]);

  const results = data?.tasks?.[0]?.result?.[0]?.items || [];
  return results.map((item: any) => ({
    keyword: item.keyword_data?.keyword || '',
    search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
    keyword_difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0,
    cpc: item.keyword_data?.keyword_info?.cpc || 0,
    competition: item.keyword_data?.keyword_info?.competition || 0,
    competition_level: item.keyword_data?.keyword_info?.competition_level || 'LOW',
    search_intent: item.keyword_data?.search_intent_info?.main_intent || 'informational',
    monthly_searches: item.keyword_data?.keyword_info?.monthly_searches?.map((m: any) => m.search_volume) || [],
  }));
}

export async function getKeywordSuggestions(
  keywords: string[],
  country: string = 'us',
  language: string = 'en',
  limit: number = 50
): Promise<KeywordData[]> {
  const data = await request('/dataforseo_labs/google/keyword_suggestions/live', [{
    keywords,
    location_name: getLocationName(country),
    language_name: getLanguageName(language),
    limit,
    include_seed_keyword: true,
    order_by: ['keyword_info.search_volume,desc'],
  }]);

  const results = data?.tasks?.[0]?.result?.[0]?.items || [];
  return results.map((item: any) => ({
    keyword: item.keyword || '',
    search_volume: item.keyword_info?.search_volume || 0,
    keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
    cpc: item.keyword_info?.cpc || 0,
    competition: item.keyword_info?.competition || 0,
    competition_level: item.keyword_info?.competition_level || 'LOW',
    search_intent: item.search_intent_info?.main_intent || 'informational',
    monthly_searches: item.keyword_info?.monthly_searches?.map((m: any) => m.search_volume) || [],
  }));
}

export async function getCompetitorKeywords(
  domain: string,
  competitors: string[],
  country: string = 'us',
  language: string = 'en'
): Promise<KeywordData[]> {
  const data = await request('/dataforseo_labs/google/competitors_domain/live', [{
    target: domain,
    location_name: getLocationName(country),
    language_name: getLanguageName(language),
    limit: 10,
  }]);

  const competitorDomains = competitors.length > 0 
    ? competitors 
    : (data?.tasks?.[0]?.result?.[0]?.items || []).slice(0, 5).map((c: any) => c.domain);

  if (competitorDomains.length === 0) return [];

  // Get keywords that competitors rank for
  const gapData = await request('/dataforseo_labs/google/domain_intersection/live', [{
    targets: Object.fromEntries([
      ['1', domain],
      ...competitorDomains.slice(0, 3).map((d: string, i: number) => [`${i + 2}`, d]),
    ]),
    location_name: getLocationName(country),
    language_name: getLanguageName(language),
    limit: 100,
    order_by: ['keyword_data.keyword_info.search_volume,desc'],
    intersections: Object.fromEntries(
      competitorDomains.slice(0, 3).map((_: string, i: number) => [`${i + 2}`, true])
    ),
    exclude_intersections: { '1': true },
  }]);

  const results = gapData?.tasks?.[0]?.result?.[0]?.items || [];
  return results.map((item: any) => ({
    keyword: item.keyword_data?.keyword || '',
    search_volume: item.keyword_data?.keyword_info?.search_volume || 0,
    keyword_difficulty: item.keyword_data?.keyword_properties?.keyword_difficulty || 0,
    cpc: item.keyword_data?.keyword_info?.cpc || 0,
    competition: item.keyword_data?.keyword_info?.competition || 0,
    competition_level: item.keyword_data?.keyword_info?.competition_level || 'LOW',
    search_intent: item.keyword_data?.search_intent_info?.main_intent || 'informational',
    monthly_searches: item.keyword_data?.keyword_info?.monthly_searches?.map((m: any) => m.search_volume) || [],
  }));
}

function getLocationName(country: string): string {
  const map: Record<string, string> = {
    us: 'United States', uk: 'United Kingdom', ca: 'Canada', au: 'Australia',
    de: 'Germany', fr: 'France', es: 'Spain', it: 'Italy', br: 'Brazil',
    pt: 'Portugal', nl: 'Netherlands', in: 'India', jp: 'Japan', mx: 'Mexico',
  };
  return map[country.toLowerCase()] || 'United States';
}

function getLanguageName(lang: string): string {
  const map: Record<string, string> = {
    en: 'English', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian',
    pt: 'Portuguese', nl: 'Dutch', ja: 'Japanese', tr: 'Turkish',
  };
  return map[lang.toLowerCase()] || 'English';
}
