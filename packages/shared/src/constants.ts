import type { Plan, PlanId } from './types';

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    creditsPerMonth: 50,
    rateLimit: 10, // 10 req/min
    priceMonthly: 0,
    features: ['50 credits/month', 'Keyword research', 'Content audit', 'Community support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    creditsPerMonth: 1000,
    rateLimit: 60,
    priceMonthly: 4900, // $49
    features: ['1,000 credits/month', 'All endpoints', 'Content recommendations', 'Priority support'],
  },
  scale: {
    id: 'scale',
    name: 'Scale',
    creditsPerMonth: 5000,
    rateLimit: 120,
    priceMonthly: 19900, // $199
    features: ['5,000 credits/month', 'All endpoints', 'AI citations', 'Dedicated support', 'Custom integrations'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    creditsPerMonth: -1, // unlimited
    rateLimit: 300,
    priceMonthly: -1, // custom
    features: ['Unlimited credits', 'All endpoints', 'SLA', 'Custom models', 'White-label'],
  },
};

// Credits cost per endpoint
export const ENDPOINT_CREDITS: Record<string, number> = {
  '/v1/keywords/research': 5,
  '/v1/keywords/gaps': 10,
  '/v1/content/audit': 15,
  '/v1/content/recommend': 10,
  '/v1/ai/citations': 20,
  '/v1/usage': 0,
};
