import type { Metadata } from "next";
import Link from "next/link";
import ContentPageFaq from "@/components/ContentPageFaq";

export const metadata: Metadata = {
  title: "Content Gap Analysis — Find What's Missing in Your Strategy | AgenticPencil",
  description:
    "Content gap analysis tool that combines SEO keyword gaps with AI citation gaps. Find what competitors cover that you don't — including where AI models cite them instead of you.",
  alternates: { canonical: "/content-gap-analysis" },
  openGraph: {
    title: "Content Gap Analysis — SEO & AI Visibility Gaps | AgenticPencil",
    description:
      "Find content gaps across traditional search and AI models. See what competitors cover that you don't.",
  },
};

const faqs = [
  {
    question: "What is content gap analysis?",
    answer:
      "Content gap analysis is the process of identifying topics and keywords that your competitors rank for (or get cited for by AI models) but your website doesn't cover. It reveals opportunities where creating new content or improving existing content can drive traffic, rankings, and AI visibility.",
  },
  {
    question: "How is content gap analysis different from keyword research?",
    answer:
      "Keyword research tells you what people search for. Content gap analysis tells you what you're missing relative to competitors. It's the difference between 'these keywords have volume' and 'your competitor ranks for these and you don't.' AgenticPencil adds an AI layer: 'AI models cite your competitor here and not you.'",
  },
  {
    question: "What is an AI citation gap?",
    answer:
      "An AI citation gap occurs when AI models like ChatGPT, Perplexity, or Gemini cite your competitors' content for queries relevant to your business but don't cite yours. These gaps represent missed opportunities for AI-driven traffic and brand visibility that traditional SEO tools can't detect.",
  },
  {
    question: "How does AgenticPencil detect content cannibalization?",
    answer:
      "We crawl your sitemap and analyze every URL for keyword overlap, content similarity, and search intent competition. When two or more of your pages target the same query, they cannibalize each other — splitting authority and confusing search engines. Our audit identifies exactly which URLs to consolidate, redirect, or leave alone.",
  },
  {
    question: "How many competitors can I analyze at once?",
    answer:
      "AgenticPencil supports cross-analysis against up to 10 competitors simultaneously. You see every topic they cover that you don't, every piece where you outrank them, and where both of you are missing opportunities that AI models are looking for.",
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
  headline: "Content Gap Analysis: Find What's Missing in Your Strategy",
  description:
    "How to run a content gap analysis that includes AI citation gaps, not just keyword gaps.",
  author: { "@type": "Organization", name: "AgenticPencil" },
  publisher: { "@type": "Organization", name: "AgenticPencil" },
  datePublished: "2026-02-13",
  dateModified: "2026-02-13",
};

export default function ContentGapAnalysisPage() {
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
        <p className="content-page-label">Deep Analysis</p>
        <h1>Content Gap Analysis: SEO Gaps + AI Citation Gaps</h1>
        <p className="content-page-subtitle">
          Traditional content gap analysis finds keyword gaps. AgenticPencil
          finds AI citation gaps too — where ChatGPT, Perplexity, and Gemini
          cite your competitors but not you.
        </p>

        <section>
          <h2>What is content gap analysis?</h2>
          <p>
            Content gap analysis identifies topics your competitors cover that
            you don&apos;t. It&apos;s the fastest way to find high-impact
            content opportunities — because if competitors rank for a keyword
            and you don&apos;t even have a page for it, that&apos;s a gap
            you can fill.
          </p>
          <p>
            But traditional content gap analysis only looks at search rankings.
            It misses a massive blind spot: AI citations. If Perplexity cites
            your competitor&apos;s article when users ask about your industry
            and doesn&apos;t mention you, that&apos;s a gap that Ahrefs will
            never show you.
          </p>
        </section>

        <section>
          <h2>The two types of content gaps</h2>

          <h3>SEO content gaps</h3>
          <p>
            Keywords and topics where competitors rank in Google but you
            don&apos;t have coverage. These are found through traditional
            competitor keyword analysis — comparing your keyword profile
            against competitors to find what you&apos;re missing.
          </p>

          <h3>AI citation gaps</h3>
          <p>
            Queries where AI models cite competitor content but not yours.
            These are found through{" "}
            <Link href="/answer-engine-optimization">
              answer engine optimization
            </Link>{" "}
            monitoring — tracking real AI model responses across ChatGPT,
            Perplexity, Gemini, and Google AI Mode.
          </p>
          <p>
            AgenticPencil is one of the few tools that analyzes both types of
            gaps simultaneously, giving you a complete picture of your content
            opportunities.
          </p>
        </section>

        <section>
          <h2>Sitemap cannibalization audit</h2>
          <p>
            Before filling gaps, you need to fix what you have. Many sites have
            pages competing against each other for the same queries —
            cannibalizing their own rankings. Common examples:
          </p>
          <ul>
            <li>
              A blog post and a product page targeting the same keyword
            </li>
            <li>
              Multiple blog posts covering the same topic from different angles
            </li>
            <li>
              Old content that should have been redirected to newer, more
              comprehensive pieces
            </li>
          </ul>
          <p>
            AgenticPencil crawls your sitemap and detects these conflicts
            automatically. The audit returns specific recommendations:
            consolidate, redirect, or leave alone — so you fix the foundation
            before building on it.
          </p>
        </section>

        <section>
          <h2>Competitor cross-analysis</h2>
          <p>
            Map your content against up to 10 competitors simultaneously.
            AgenticPencil shows you:
          </p>
          <ul>
            <li>Every topic they cover that you don&apos;t</li>
            <li>Every piece where you outrank them</li>
            <li>
              Opportunities both of you are missing that AI models are looking
              for
            </li>
            <li>
              Share-of-voice across traditional search and AI citations
            </li>
          </ul>
          <p>
            This combines traditional SERP overlap with AI citation
            share-of-voice for a complete competitive picture.
          </p>
        </section>

        <section>
          <h2>From analysis to action</h2>
          <p>
            A content gap analysis is only useful if it tells you what to do.
            AgenticPencil doesn&apos;t just list gaps — it prioritizes them.
            Each opportunity is ranked by estimated impact, considering search
            volume, keyword difficulty, AI citation potential, and competitor
            coverage.
          </p>
          <p>
            The output is a content map you can hand to your team or{" "}
            <Link href="/seo-api">feed to an AI agent via API</Link>. Every
            item includes: title, target keywords, why it matters, what action
            to take, and estimated impact.
          </p>
          <div className="content-page-cta">
            <Link href="/" className="btn-primary">
              Run your content gap analysis &rarr;
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
