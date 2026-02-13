import type { Metadata } from "next";
import Link from "next/link";
import ContentPageFaq from "@/components/ContentPageFaq";

export const metadata: Metadata = {
  title: "SEO API — Content Strategy & Audit API for Developers | AgenticPencil",
  description:
    "SEO API for content strategy, site audits, and AI visibility tracking. One API call returns a prioritized content map with keyword data, competitor analysis, and citation gaps.",
  alternates: { canonical: "/seo-api" },
  openGraph: {
    title: "SEO API — Content Strategy & Data API | AgenticPencil",
    description:
      "API-first SEO intelligence. Content mapping, site audits, AI visibility data — one endpoint.",
  },
};

const faqs = [
  {
    question: "What is an SEO API?",
    answer:
      "An SEO API is a programmatic interface that gives developers and AI agents access to SEO data and intelligence — keyword research, site audits, competitor analysis, ranking data, and content recommendations. Instead of using a dashboard, you integrate SEO data directly into your code, workflows, or AI agents.",
  },
  {
    question: "How is AgenticPencil's SEO API different from Ahrefs or Semrush APIs?",
    answer:
      "Ahrefs and Semrush APIs give you raw keyword and backlink data — you still have to figure out what to do with it. AgenticPencil's API returns a prioritized content map: what to write, why, and in what order. It combines keyword data with AI visibility intelligence and competitor analysis into actionable strategy, not just data.",
  },
  {
    question: "Can AI agents use the SEO API directly?",
    answer:
      "Yes — that's exactly what it's built for. AI agents like Claude Code, custom LLM workflows, or MCP-enabled tools can call the AgenticPencil API to get a content strategy before generating content. The response is structured JSON designed for machine consumption.",
  },
  {
    question: "What data does the SEO API return?",
    answer:
      "The API returns a full content map including: prioritized content opportunities ranked by impact, AI citation gaps across ChatGPT/Perplexity/Gemini, keyword data, competitor coverage analysis, sitemap cannibalization issues, and recommended actions (create new, consolidate, redirect).",
  },
  {
    question: "What does the SEO audit API check?",
    answer:
      "The audit API crawls your sitemap and analyzes your existing content for cannibalization (pages competing against each other), thin content, keyword overlap, internal competition, and AI visibility gaps. It returns specific recommendations: which URLs to consolidate, which to redirect, and which topics need new content.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SEO API: Content Strategy & Audit API for Developers",
  description:
    "API-first SEO intelligence for developers and AI agents. Content mapping, site audits, and AI visibility data.",
  author: { "@type": "Organization", name: "AgenticPencil" },
  publisher: { "@type": "Organization", name: "AgenticPencil" },
  datePublished: "2026-02-13",
  dateModified: "2026-02-13",
};

export default function SeoApiPage() {
  return (
    <main className="content-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        <p className="content-page-label">API for Developers &amp; Agents</p>
        <h1>SEO API: Content Strategy &amp; Audit Intelligence</h1>
        <p className="content-page-subtitle">
          An SEO API that doesn&apos;t just return data — it returns a strategy.
          One endpoint gives you a prioritized content map with keyword
          intelligence, competitor gaps, and AI visibility scores.
        </p>

        <section>
          <h2>Why an SEO API?</h2>
          <p>
            Most SEO tools are built for humans clicking through dashboards.
            But the future of content is agentic — AI agents and automated
            workflows need programmatic access to SEO intelligence. They
            need an API that tells them what to do, not just raw keyword
            volumes.
          </p>
          <p>
            AgenticPencil is the SEO API built for this future. Pass a domain,
            get back a full content strategy. No dashboard required.
          </p>
        </section>

        <section>
          <h2>What the API returns</h2>
          <p>
            A single call to <code>POST /api/content-map</code> returns:
          </p>
          <ul>
            <li>
              <strong>Prioritized content opportunities</strong> — ranked by
              impact, with titles, target keywords, and recommended actions
            </li>
            <li>
              <strong>AI citation gaps</strong> — where ChatGPT, Perplexity,
              and Gemini cite competitors but not you (see{" "}
              <Link href="/answer-engine-optimization">
                answer engine optimization
              </Link>
              )
            </li>
            <li>
              <strong>Sitemap cannibalization report</strong> — pages competing
              against each other for the same queries
            </li>
            <li>
              <strong>Competitor cross-analysis</strong> — content gaps across
              up to 10 competitors
            </li>
            <li>
              <strong>AI visibility score</strong> — your domain&apos;s overall
              presence across major AI models
            </li>
          </ul>
        </section>

        <section>
          <h2>SEO data API endpoints</h2>

          <h3>Content Map API</h3>
          <p>
            The core endpoint. Returns a prioritized list of content
            opportunities for any domain, combining keyword data, AI visibility
            intelligence, and competitor analysis into a single actionable plan.
          </p>

          <h3>SEO Audit API</h3>
          <p>
            Crawls your sitemap and detects cannibalization, thin content,
            keyword overlap, and internal competition. Returns specific
            recommendations: consolidate, redirect, or create new. See our{" "}
            <Link href="/content-gap-analysis">
              content gap analysis
            </Link>{" "}
            page for more on the methodology.
          </p>

          <h3>AI Visibility API</h3>
          <p>
            Track how AI models surface your content across ChatGPT, Perplexity,
            Gemini, Google AI Mode, AI Overview, and Copilot. Real browser-based
            monitoring across 50+ geographies.
          </p>
        </section>

        <section>
          <h2>Built for agents and automation</h2>
          <p>
            AgenticPencil&apos;s API is designed for programmatic consumption.
            AI agents using Claude Code,{" "}
            <Link href="/mcp-server-seo">MCP servers</Link>, or custom LLM
            workflows can call the API to get a content strategy before
            generating any content. The response is structured JSON — no
            parsing HTML or scraping dashboards.
          </p>
          <p>
            The typical workflow: agent calls the content map API &rarr; gets
            back 50-100 prioritized articles &rarr; generates content for the
            highest-priority items &rarr; publishes via CMS integration &rarr;
            checks AI visibility scores over time.
          </p>
        </section>

        <section>
          <h2>Compare: SEO APIs</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>API</th>
                <th>What it gives you</th>
                <th>What&apos;s missing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ahrefs API</td>
                <td>Backlink &amp; keyword data</td>
                <td>No content strategy. No AI visibility.</td>
              </tr>
              <tr>
                <td>Semrush API</td>
                <td>Keyword &amp; competitor data</td>
                <td>No prioritized content plan. No AI citations.</td>
              </tr>
              <tr>
                <td>DataForSEO</td>
                <td>Raw SERP &amp; keyword data</td>
                <td>Data only — no intelligence layer.</td>
              </tr>
              <tr>
                <td>AgenticPencil</td>
                <td>Full content map + AI visibility + audit</td>
                <td>Strategy, not just data.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Get started</h2>
          <p>
            100 free API calls. No credit card required. Pass your domain and
            get your first content map in seconds.
          </p>
          <div className="content-page-cta">
            <Link href="/" className="btn-primary">
              Get API Key &mdash; Free &rarr;
            </Link>
          </div>
        </section>

        <section>
          <h2>Frequently asked questions</h2>
          <ContentPageFaq faqs={faqs} />
        </section>
      </article>
    </main>
  );
}
