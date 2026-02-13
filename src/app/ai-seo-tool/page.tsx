import type { Metadata } from "next";
import Link from "next/link";
import ContentPageFaq from "@/components/ContentPageFaq";

export const metadata: Metadata = {
  title: "AI SEO Tool — Content Mapping & Visibility Intelligence | AgenticPencil",
  description:
    "AI SEO tool that combines keyword research, competitor analysis, and AI visibility tracking into a prioritized content map. Built for agents, teams, and agencies.",
  alternates: { canonical: "/ai-seo-tool" },
  openGraph: {
    title: "AI SEO Tool — Content Mapping & AI Visibility | AgenticPencil",
    description:
      "AI-powered SEO tool that tells you exactly what to write, based on real data.",
  },
};

const faqs = [
  {
    question: "What makes AgenticPencil different from other AI SEO tools?",
    answer:
      "Most AI SEO tools focus on writing content faster. AgenticPencil focuses on knowing what to write in the first place. We combine traditional keyword research with AI visibility intelligence — tracking how ChatGPT, Perplexity, and Gemini cite content — to build a prioritized content strategy. We're the strategist, not the writer.",
  },
  {
    question: "Is AgenticPencil an AI content writer?",
    answer:
      "AgenticPencil is primarily a content intelligence and strategy tool. Our core product is the content map — a prioritized list of what to write and why. We also offer an Enterprise Writer API for teams that want end-to-end content production, but the strategic intelligence layer is what makes us unique.",
  },
  {
    question: "How does the AI SEO tool build a content map?",
    answer:
      "We analyze four data sources: keyword research data (search volume, difficulty, intent), AI visibility data (which domains get cited by AI models for which queries), competitor content (what they cover that you don't), and your existing sitemap (to detect cannibalization). The output is a prioritized list ranked by impact.",
  },
  {
    question: "Can I use AgenticPencil with my existing SEO tools?",
    answer:
      "Yes. AgenticPencil complements tools like Ahrefs, Semrush, and Surfer SEO. Those tools give you data and optimization; we give you strategy. Use AgenticPencil to decide what to write, then use your existing tools to optimize individual pieces.",
  },
  {
    question: "What's the best AI tool for SEO content strategy?",
    answer:
      "For content strategy specifically — deciding what to write and in what order — AgenticPencil is purpose-built. We combine keyword intelligence, AI visibility tracking, competitor analysis, and sitemap auditing into a single prioritized content plan. Other AI SEO tools focus on writing or optimizing individual articles, which is a different (and complementary) problem.",
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
  headline: "AI SEO Tool: Content Mapping & Visibility Intelligence",
  description:
    "AI-powered SEO tool that combines keyword research, competitor analysis, and AI visibility tracking into a prioritized content map.",
  author: { "@type": "Organization", name: "AgenticPencil" },
  publisher: { "@type": "Organization", name: "AgenticPencil" },
  datePublished: "2026-02-13",
  dateModified: "2026-02-13",
};

export default function AiSeoToolPage() {
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
        <p className="content-page-label">AI-Powered SEO Intelligence</p>
        <h1>AI SEO Tool: Know What to Write Before You Write It</h1>
        <p className="content-page-subtitle">
          Most AI SEO tools help you write faster. AgenticPencil tells you what
          to write in the first place — backed by keyword data, competitor
          intelligence, and{" "}
          <Link href="/answer-engine-optimization">
            AI visibility tracking
          </Link>
          .
        </p>

        <section>
          <h2>The problem with most AI SEO tools</h2>
          <p>
            The market is flooded with tools that use AI to write content faster.
            But writing speed was never the bottleneck. The bottleneck is
            strategy — knowing which topics will drive results, which gaps exist
            in your content, and where AI models are citing your competitors
            instead of you.
          </p>
          <p>
            50 articles is easy. The right 50 is hard. That&apos;s the problem
            AgenticPencil solves.
          </p>
        </section>

        <section>
          <h2>How AgenticPencil works</h2>
          <p>
            Give us your domain. We give you your next 100 articles, ranked by
            impact. Here&apos;s what happens under the hood:
          </p>

          <h3>Content mapping</h3>
          <p>
            Full topic clustering and prioritization. We analyze keyword
            opportunities, search intent, and topical authority gaps to build a
            comprehensive content plan — not just a keyword list.
          </p>

          <h3>AI visibility intelligence</h3>
          <p>
            We monitor how ChatGPT, Perplexity, Gemini, Google AI Mode, AI
            Overview, and Copilot surface content in your industry. Real
            browser-based UI scraping — not API calls. This tells you where AI
            models cite competitors but not you.
          </p>

          <h3>Sitemap cannibalization audit</h3>
          <p>
            Before adding more content, we analyze what you already have. Our
            audit detects pages competing against each other, thin duplicates,
            and internal competition. Fix the foundation before building on it.
          </p>

          <h3>Competitor cross-analysis</h3>
          <p>
            Map your content against up to 10 competitors simultaneously. See
            every topic they cover that you don&apos;t, and every opportunity
            both of you are missing.
          </p>
        </section>

        <section>
          <h2>Built for the agentic era</h2>
          <p>
            AgenticPencil isn&apos;t just a dashboard — it&apos;s an{" "}
            <Link href="/seo-api">API</Link>. AI agents, Claude Code, and{" "}
            <Link href="/mcp-server-seo">MCP-enabled tools</Link> can call our
            API to get a content strategy before generating any content. The
            future of content is agentic, and your AI agents need a strategist.
          </p>
        </section>

        <section>
          <h2>How we compare</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Focus</th>
                <th>Missing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ahrefs / Semrush</td>
                <td>Keyword &amp; backlink data</td>
                <td>No AI visibility. No content plan.</td>
              </tr>
              <tr>
                <td>Surfer / Clearscope</td>
                <td>Single article optimization</td>
                <td>Doesn&apos;t tell you which articles to write.</td>
              </tr>
              <tr>
                <td>MarketMuse</td>
                <td>Topic modeling</td>
                <td>No agentic API. No AI visibility layer.</td>
              </tr>
              <tr>
                <td>AgenticPencil</td>
                <td>Content strategy + AI visibility</td>
                <td>Strategy first. Writing second.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Get started free</h2>
          <p>
            100 free API calls. No credit card. See your{" "}
            <Link href="/content-gap-analysis">content gaps</Link> and AI
            visibility score in seconds.
          </p>
          <div className="content-page-cta">
            <Link href="/" className="btn-primary">
              Get Started Free &rarr;
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
