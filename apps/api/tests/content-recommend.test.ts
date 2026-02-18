// Content Recommend v2 - Integration Tests
// Run against live API: npx tsx tests/content-recommend.test.ts

const API_BASE = 'https://api.agenticpencil.com';
const API_KEY = 'ap_90a3eecf4fcf4c08b1174c30ab3c0f76';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ ${msg}`); }
}

async function test(name: string, fn: () => Promise<void>) {
  console.log(`\n▸ ${name}`);
  try { await fn(); } catch (e: any) { failed++; console.error(`  ✗ EXCEPTION: ${e.message}`); }
}

async function post(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log('Content Recommend v2 Tests\n========================');

  await test('Missing domain returns 400', async () => {
    const { status, data } = await post('/v1/content/recommend', {});
    assert(status === 400, `Status 400 (got ${status})`);
    assert(data.error?.code === 'VALIDATION_ERROR', 'VALIDATION_ERROR code');
  });

  await test('Missing auth returns 401', async () => {
    const res = await fetch(`${API_BASE}/v1/content/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: 'test.com' }),
    });
    assert(res.status === 401, `Status 401 (got ${res.status})`);
  });

  await test('Real domain (sonant.ai) with full params', async () => {
    const { status, data } = await post('/v1/content/recommend', {
      domain: 'sonant.ai',
      brand_context: 'AI receptionist for insurance agencies',
      competitors: ['smith.ai', 'dialpad.com'],
      focus_topics: ['ai receptionist', 'insurance automation', 'voice ai'],
      country: 'US',
      limit: 10,
    });
    assert(status === 200, `Status 200 (got ${status})`);
    assert(data.success === true, 'success: true');
    assert(Array.isArray(data.data?.recommendations), 'recommendations is array');
    assert(data.data?.recommendations?.length > 0, `Got ${data.data?.recommendations?.length} recommendations`);
    assert(data.meta?.credits_used === 15, `Credits used: 15 (got ${data.meta?.credits_used})`);

    if (data.data?.recommendations?.length > 0) {
      const rec = data.data.recommendations[0];
      assert(typeof rec.priority === 'number', 'Has priority');
      assert(typeof rec.title === 'string' && rec.title.length > 0, 'Has title');
      assert(typeof rec.target_keyword === 'string', 'Has target_keyword');
      assert(typeof rec.search_volume === 'number', 'Has search_volume');
      assert(typeof rec.keyword_difficulty === 'number', 'Has keyword_difficulty');
      assert(typeof rec.weighted_difficulty === 'number', 'Has weighted_difficulty');
      assert(typeof rec.cpc === 'number', 'Has cpc');
      assert(typeof rec.search_intent === 'string', 'Has search_intent');
      assert(typeof rec.concept === 'string' && rec.concept.length > 10, 'Has concept');
      assert(Array.isArray(rec.outline) && rec.outline.length > 0, 'Has outline');
      assert(typeof rec.content_type === 'string', 'Has content_type');
      assert(typeof rec.opportunity_score === 'number', 'Has opportunity_score');

      if (rec.outline?.length > 0) {
        assert(typeof rec.outline[0].h2 === 'string', 'Outline has h2');
        assert(Array.isArray(rec.outline[0].target_keywords), 'Outline has target_keywords');
      }
    }

    // Check plan_id returned
    assert(typeof data.data?.plan_id === 'string' || data.data?.plan_id === null, 'Has plan_id');
    // Check cannibalization
    assert(Array.isArray(data.data?.cannibalization), 'Has cannibalization array');
  });

  await test('Domain with only focus_topics (no ranked keywords expected)', async () => {
    const { status, data } = await post('/v1/content/recommend', {
      domain: 'example-tiny-site-xyz.com',
      focus_topics: ['content marketing', 'seo tools'],
      limit: 5,
    });
    assert(status === 200, `Status 200 (got ${status})`);
    assert(data.success === true, 'success: true');
    // Should still return recommendations from focus_topics
    assert(Array.isArray(data.data?.recommendations), 'Has recommendations array');
  });

  console.log(`\n========================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
