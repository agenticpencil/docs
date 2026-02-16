import { serve } from '@hono/node-server';
import { app } from './index';

serve({ fetch: app.fetch, port: 3001 });
console.log('🖊️  AgenticPencil API running on http://localhost:3001');
