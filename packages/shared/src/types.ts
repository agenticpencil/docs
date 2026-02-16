// ─── Plans & Pricing ─────────────────────────────────────
export type PlanId = 'free' | 'pro' | 'scale' | 'enterprise';

export interface Plan {
  id: PlanId;
  name: string;
  creditsPerMonth: number;
  rateLimit: number; // requests per minute
  priceMonthly: number; // in cents
  features: string[];
}

// ─── API Keys ────────────────────────────────────────────
export interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  key_prefix: string; // "ap_xxxx" for display
  name: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  is_active: boolean;
}

// ─── Usage ───────────────────────────────────────────────
export interface UsageLog {
  id: string;
  api_key_id: string;
  user_id: string;
  endpoint: string;
  credits_used: number;
  status_code: number;
  response_time_ms: number;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface UsageSummary {
  plan: PlanId;
  credits_used: number;
  credits_limit: number;
  credits_remaining: number;
  requests_today: number;
  rate_limit: number;
  billing_period_start: string;
  billing_period_end: string;
}

// ─── User Profile ────────────────────────────────────────
export interface UserProfile {
  id: string;
  email: string;
  plan_id: PlanId;
  credits_used: number;
  credits_reset_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

// ─── Keyword Research ────────────────────────────────────
export interface KeywordResearchRequest {
  domain: string;
  topic?: string;
  keywords?: string[];
  country?: string; // ISO 2-letter, default "us"
  language?: string; // default "en"
  limit?: number; // max results, default 50
}

export interface KeywordResult {
  keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  cpc: number;
  competition: number;
  competition_level: 'LOW' | 'MEDIUM' | 'HIGH';
  search_intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  trend: number[]; // monthly search volume trend (12 months)
}

export interface KeywordCluster {
  cluster_name: string;
  primary_keyword: KeywordResult;
  related_keywords: KeywordResult[];
  total_volume: number;
  avg_difficulty: number;
  opportunity_score: number; // 0-100, higher = better opportunity
}

export interface KeywordResearchResponse {
  domain: string;
  topic: string;
  country: string;
  clusters: KeywordCluster[];
  total_keywords: number;
  credits_used: number;
}

// ─── Content Audit ───────────────────────────────────────
export interface ContentAuditRequest {
  domain: string;
  sitemap_url?: string; // auto-discovers if not provided
  max_pages?: number; // default 500
}

export interface PageInfo {
  url: string;
  title: string;
  meta_description: string;
  h1: string;
  word_count: number;
  status_code: number;
  indexed: boolean;
}

export interface CannibalizationRisk {
  keyword: string;
  pages: string[];
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface ContentAuditResponse {
  domain: string;
  pages_crawled: number;
  pages: PageInfo[];
  thin_content: PageInfo[]; // < 300 words
  cannibalization_risks: CannibalizationRisk[];
  credits_used: number;
}

// ─── Content Recommendations ─────────────────────────────
export interface ContentRecommendRequest {
  domain: string;
  focus_topics?: string[];
  limit?: number; // default 20
  country?: string;
}

export interface ContentRecommendation {
  priority: number; // 1 = highest
  title: string;
  target_keyword: string;
  search_volume: number;
  keyword_difficulty: number;
  search_intent: string;
  content_type: 'pillar' | 'supporting' | 'comparison' | 'guide' | 'listicle';
  estimated_word_count: number;
  internal_link_targets: string[];
  brief: string;
  opportunity_score: number;
}

export interface ContentRecommendResponse {
  domain: string;
  recommendations: ContentRecommendation[];
  credits_used: number;
}

// ─── API Response Wrapper ────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    credits_used: number;
    credits_remaining: number;
    request_id: string;
  };
}
