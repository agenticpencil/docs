import { Context } from 'hono';
import type { Env } from '../index';

interface RequestBody {
  domain: string;
  sitemap_url?: string;
  max_pages?: number;
}

async function discoverSitemap(domain: string): Promise<string[]> {
  const urls: string[] = [];
  const sitemapUrls = [
    `https://${domain}/sitemap.xml`,
    `https://www.${domain}/sitemap.xml`,
    `https://${domain}/sitemap_index.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'AgenticPencil/1.0' } });
      if (!res.ok) continue;
      const text = await res.text();
      
      // Extract URLs from sitemap
      const locMatches = text.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi);
      for (const match of locMatches) {
        const url = match[1];
        if (url.endsWith('.xml')) {
          // Sitemap index — fetch sub-sitemap
          try {
            const subRes = await fetch(url, { headers: { 'User-Agent': 'AgenticPencil/1.0' } });
            if (subRes.ok) {
              const subText = await subRes.text();
              const subMatches = subText.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi);
              for (const sub of subMatches) {
                if (!sub[1].endsWith('.xml')) urls.push(sub[1]);
              }
            }
          } catch {}
        } else {
          urls.push(url);
        }
      }
      if (urls.length > 0) break;
    } catch {}
  }

  return urls;
}

async function fetchPageInfo(url: string): Promise<any> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AgenticPencil/1.0' },
      redirect: 'follow',
    });
    const html = await res.text();
    
    const title = html.match(/<title[^>]*>(.*?)<\/title>/si)?.[1]?.trim() || '';
    const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/si)?.[1]?.trim() || '';
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/si)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
    
    // Rough word count (strip HTML)
    const textContent = html.replace(/<script[^>]*>.*?<\/script>/gsi, '')
      .replace(/<style[^>]*>.*?<\/style>/gsi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(/\s+/).length;

    return {
      url,
      title,
      meta_description: metaDesc,
      h1,
      word_count: wordCount,
      status_code: res.status,
    };
  } catch {
    return { url, title: '', meta_description: '', h1: '', word_count: 0, status_code: 0 };
  }
}

function detectCannibalization(pages: any[]): any[] {
  const titleWords: Map<string, string[]> = new Map();
  
  for (const page of pages) {
    const keywords = page.title.toLowerCase()
      .split(/[\s\-|:,]+/)
      .filter((w: string) => w.length > 3);
    
    for (const kw of keywords) {
      if (!titleWords.has(kw)) titleWords.set(kw, []);
      titleWords.get(kw)!.push(page.url);
    }
  }

  const risks: any[] = [];
  for (const [keyword, urls] of titleWords) {
    if (urls.length > 1) {
      risks.push({
        keyword,
        pages: urls,
        severity: urls.length > 3 ? 'high' : urls.length > 2 ? 'medium' : 'low',
        recommendation: `${urls.length} pages target "${keyword}". Consider consolidating or differentiating content.`,
      });
    }
  }

  return risks.sort((a, b) => {
    const sev = { high: 3, medium: 2, low: 1 };
    return (sev[b.severity as keyof typeof sev] || 0) - (sev[a.severity as keyof typeof sev] || 0);
  }).slice(0, 20);
}

export async function contentAudit(c: Context<Env>) {
  const body = await c.req.json<RequestBody>().catch(() => null);

  if (!body?.domain) {
    return c.json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'domain is required' },
    }, 400);
  }

  const { domain, sitemap_url, max_pages = 100 } = body;

  try {
    // Discover sitemap
    let urls: string[];
    if (sitemap_url) {
      const res = await fetch(sitemap_url);
      const text = await res.text();
      urls = [...text.matchAll(/<loc>\s*(.*?)\s*<\/loc>/gi)].map(m => m[1]);
    } else {
      urls = await discoverSitemap(domain);
    }

    urls = urls.slice(0, max_pages);

    // Fetch page info (parallel, batched)
    const batchSize = 10;
    const pages: any[] = [];
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(fetchPageInfo));
      pages.push(...results);
    }

    const thinContent = pages.filter(p => p.word_count < 300 && p.word_count > 0);
    const cannibalization = detectCannibalization(pages);

    return c.json({
      success: true,
      data: {
        domain,
        pages_crawled: pages.length,
        pages,
        thin_content: thinContent,
        cannibalization_risks: cannibalization,
        summary: {
          total_pages: pages.length,
          thin_pages: thinContent.length,
          cannibalization_issues: cannibalization.length,
          avg_word_count: Math.round(pages.reduce((s, p) => s + p.word_count, 0) / pages.length),
        },
      },
      meta: {
        credits_used: 15,
        credits_remaining: c.get('creditsRemaining') - 15,
        request_id: crypto.randomUUID(),
      },
    });
  } catch (err: any) {
    console.error('Content audit error:', err);
    return c.json({
      success: false,
      error: { code: 'AUDIT_ERROR', message: 'Failed to audit content. Check the domain is accessible.' },
    }, 502);
  }
}
