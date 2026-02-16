import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rate-limit';
import { creditsMiddleware } from './middleware/credits';
import { keywordsResearch } from './routes/keywords-research';
import { keywordsGaps } from './routes/keywords-gaps';
import { contentAudit } from './routes/content-audit';
import { contentRecommend } from './routes/content-recommend';
import { usage } from './routes/usage';

export type Env = {
  Variables: {
    userId: string;
    apiKeyId: string;
    planId: string;
    creditsRemaining: number;
  };
};

export const app = new Hono<Env>();

// Global middleware
app.use('*', cors({
  origin: ['https://agenticpencil.com', 'https://platform.agenticpencil.com', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger());

// Health check
app.get('/', (c) => c.json({
  name: 'AgenticPencil API',
  version: '1.0.0',
  docs: 'https://docs.agenticpencil.com',
  status: 'operational',
}));

app.get('/health', (c) => c.json({ status: 'ok' }));

// v1 routes — all require auth + rate limiting + credits
const v1 = new Hono<Env>();
v1.use('*', authMiddleware);
v1.use('*', rateLimitMiddleware);

// Usage endpoint (no credits needed)
v1.get('/usage', usage);

// Credit-consuming endpoints
v1.use('/keywords/*', creditsMiddleware);
v1.use('/content/*', creditsMiddleware);

v1.post('/keywords/research', keywordsResearch);
v1.post('/keywords/gaps', keywordsGaps);
v1.post('/content/audit', contentAudit);
v1.post('/content/recommend', contentRecommend);

app.route('/v1', v1);

// 404
app.notFound((c) => c.json({ 
  success: false, 
  error: { code: 'NOT_FOUND', message: 'Endpoint not found. See docs: https://docs.agenticpencil.com' } 
}, 404));

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ 
    success: false, 
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } 
  }, 500);
});

// For local dev
if (process.env.NODE_ENV !== 'production') {
  const { serve } = require('@hono/node-server');
  serve({ fetch: app.fetch, port: 3001 });
  console.log('🖊️  AgenticPencil API running on http://localhost:3001');
}
