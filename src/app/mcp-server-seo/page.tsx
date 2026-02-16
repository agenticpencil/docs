import type { Metadata } from "next";
import Link from "next/link";
import ContentPageFaq from "@/components/ContentPageFaq";
import CtaButton from "@/components/CtaButton";

export const metadata: Metadata = {
  title: "MCP Server for SEO — Agentic SEO Intelligence | AgenticPencil",
  description:
    "MCP server for SEO and content strategy. Give Claude Code, Cursor, and AI agents direct access to content mapping, AI visibility data, and SEO intelligence via Model Context Protocol.",
  alternates: { canonical: "/mcp-server-seo" },
  openGraph: {
    title: "MCP Server for SEO — Agentic SEO | AgenticPencil",
    description:
      "Give your AI agents SEO intelligence via MCP. Content mapping, AI visibility, and competitor analysis.",
  },
};

const faqs = [
  {
    question: "What is an MCP server for SEO?",
    answer:
      "An MCP (Model Context Protocol) server for SEO gives AI agents like Claude Code and Cursor direct access to SEO intelligence — content maps, keyword data, AI visibility scores, competitor analysis — as tools they can call during their workflow. Instead of you looking up data and pasting it in, the agent queries the MCP server itself.",
  },
  {
    question: "What is agentic SEO?",
    answer:
      "Agentic SEO is the practice of using AI agents to execute SEO strategy — from research to content creation to publishing. Instead of a human doing keyword research, writing briefs, and managing content calendars, an AI agent handles the workflow end-to-end. The key challenge: agents need access to real SEO data and strategy, not just writing ability.",
  },
  {
    question: "How does AgenticPencil's MCP server work with Claude Code?",
    answer:
      "You add AgenticPencil as an MCP server in your Claude Code configuration. Then Claude Code can call tools like 'get_content_map', 'check_ai_visibility', or 'audit_sitemap' directly during your conversation. When you say 'plan the next 20 articles for my site', Claude calls AgenticPencil's tools to get data-driven recommendations instead of guessing.",
  },
  {
    question: "Can I use the MCP server with Cursor or other AI tools?",
    answer:
      "Yes. Any tool that supports the Model Context Protocol can connect to AgenticPencil's MCP server. This includes Claude Code, Cursor, Windsurf, and custom agent frameworks. The MCP server exposes the same intelligence as our REST API but in a format that AI agents can call as native tools.",
  },
  {
    question: "Why do AI agents need an SEO data source?",
    answer:
      "Without real data, AI agents guess what content to create. They generate plausible-sounding article titles and outlines but have no idea what actually ranks, what competitors cover, or where AI models are citing sources. AgenticPencil gives agents the strategic intelligence they're missing — so they write what matters, not what sounds good.",
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
  headline: "MCP Server for SEO: Agentic SEO Intelligence",
  description:
    "How to give AI agents direct access to SEO intelligence via Model Context Protocol.",
  author: { "@type": "Organization", name: "AgenticPencil" },
  publisher: { "@type": "Organization", name: "AgenticPencil" },
  datePublished: "2026-02-13",
  dateModified: "2026-02-13",
};

export default function McpServerSeoPage() {
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
        <p className="content-page-label">Agentic SEO</p>
        <h1>MCP Server for SEO: Give Your AI Agents Real Data</h1>
        <p className="content-page-subtitle">
          AI agents can write anything. But they guess what to write.
          AgenticPencil&apos;s MCP server gives Claude Code, Cursor, and any
          MCP-enabled agent direct access to SEO intelligence and content
          strategy.
        </p>

        <section>
          <h2>The agentic SEO problem</h2>
          <p>
            You&apos;re in Claude Code. You say &quot;write 10 blog posts for
            my SaaS.&quot; Claude generates 10 plausible-sounding titles. But
            are they the right 10? Does Claude know which keywords have volume?
            Which topics your competitors already dominate? Where AI models are
            citing alternative sources?
          </p>
          <p>
            No. It&apos;s guessing. Intelligently, but still guessing. That&apos;s
            the agentic SEO problem — agents are great at execution but blind at
            strategy.
          </p>
        </section>

        <section>
          <h2>What is MCP?</h2>
          <p>
            Model Context Protocol (MCP) is an open standard that lets AI
            agents call external tools and data sources. Think of it as giving
            your AI agent superpowers — instead of relying on its training data,
            it can query live APIs, databases, and services.
          </p>
          <p>
            An MCP server for SEO means your AI agent can access keyword data,
            competitor analysis, AI visibility scores, and content strategy — as
            native tools it calls during conversation.
          </p>
        </section>

        <section>
          <h2>AgenticPencil MCP server</h2>
          <p>
            AgenticPencil exposes its full{" "}
            <Link href="/seo-api">SEO API</Link> as an MCP server. Available
            tools:
          </p>

          <h3>get_content_map</h3>
          <p>
            Pass a domain, get a prioritized content plan. The agent receives a
            structured list of what to write, why, and in what order — based on
            keyword data, competitor gaps, and{" "}
            <Link href="/answer-engine-optimization">AI citation gaps</Link>.
          </p>

          <h3>check_ai_visibility</h3>
          <p>
            Check how AI models surface a domain or specific page. Returns
            visibility scores across ChatGPT, Perplexity, Gemini, Google AI
            Mode, and Copilot.
          </p>

          <h3>audit_sitemap</h3>
          <p>
            Analyze a domain&apos;s sitemap for{" "}
            <Link href="/content-gap-analysis">cannibalization</Link>, thin
            content, and internal competition. Returns specific fix
            recommendations.
          </p>

          <h3>analyze_competitors</h3>
          <p>
            Cross-analyze up to 10 competitors to find content gaps,
            share-of-voice differences, and opportunities both sides are missing.
          </p>
        </section>

        <section>
          <h2>Setup with Claude Code</h2>
          <p>
            Add AgenticPencil to your Claude Code MCP configuration:
          </p>
          <div className="code-window" style={{ margin: "24px 0" }}>
            <div className="code-header">
              <div className="code-dot" style={{ background: "#FF5F57" }} />
              <div className="code-dot" style={{ background: "#FEBC2E" }} />
              <div className="code-dot" style={{ background: "#28C840" }} />
              <span className="code-header-text">
                .claude/settings.json
              </span>
            </div>
            <div className="code-body" style={{ minHeight: "auto" }}>
              <pre style={{ margin: 0, color: "rgba(255,255,255,0.7)" }}>
{`{
  "mcpServers": {
    "agenticpencil": {
      "command": "npx",
      "args": [
        "@agenticpencil/mcp-server"
      ],
      "env": {
        "AGENTICPENCIL_API_KEY": "your-api-key"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
          <p>
            Then just ask Claude: &quot;What should I write next for
            mysite.com?&quot; It calls AgenticPencil&apos;s tools and returns
            a data-driven content plan.
          </p>
        </section>

        <section>
          <h2>The agentic content workflow</h2>
          <p>
            With AgenticPencil as an MCP server, your AI agent can run the
            full content lifecycle:
          </p>
          <ol>
            <li>
              <strong>Strategy</strong> — Agent calls{" "}
              <code>get_content_map</code> to get a prioritized list of what to
              write
            </li>
            <li>
              <strong>Audit</strong> — Agent calls <code>audit_sitemap</code>{" "}
              to check for cannibalization before creating new content
            </li>
            <li>
              <strong>Write</strong> — Agent generates content for the
              highest-priority items
            </li>
            <li>
              <strong>Publish</strong> — Agent pushes to CMS (Webflow, etc.)
            </li>
            <li>
              <strong>Monitor</strong> — Agent calls{" "}
              <code>check_ai_visibility</code> to track citation performance
              over time
            </li>
          </ol>
          <p>
            No dashboard. No manual research. The agent handles the entire
            workflow, grounded in real data.
          </p>
        </section>

        <section>
          <h2>Get started</h2>
          <p>
            Get an API key and connect AgenticPencil to your agent in minutes.
            100 free API calls included.
          </p>
          <div className="content-page-cta">
            <CtaButton>Get API Key &mdash; Free &rarr;</CtaButton>
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
