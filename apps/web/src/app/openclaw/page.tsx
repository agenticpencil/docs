import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SEO & Content Intelligence for OpenClaw | AgenticPencil",
  description:
    "Give your OpenClaw agent SEO superpowers. One API call and your agent knows exactly what to write, what keywords to target, and where you're missing visibility.",
  openGraph: {
    title: "SEO & Content Intelligence for OpenClaw | AgenticPencil",
    description:
      "Give your OpenClaw agent SEO superpowers. One API call and your agent knows exactly what to write, what keywords to target, and where you're missing visibility.",
    url: "https://agenticpencil.com/openclaw",
    type: "website",
  },
  alternates: {
    canonical: "https://agenticpencil.com/openclaw",
  },
};

function Step({
  number,
  emoji,
  title,
  children,
}: {
  number: number;
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-6 pb-12 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-lg border border-emerald-500/30">
          {number}
        </div>
        <div className="w-px flex-1 bg-white/10 mt-3" />
      </div>
      <div className="pt-1.5">
        <div className="text-2xl mb-2">{emoji}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <div className="text-white/60 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function ChatBubble({
  from,
  children,
}: {
  from: "user" | "agent";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex gap-3 ${from === "user" ? "justify-end" : "justify-start"}`}
    >
      {from === "agent" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">
          ✏️
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          from === "user"
            ? "bg-emerald-600/30 text-white border border-emerald-500/20"
            : "bg-white/5 text-white/80 border border-white/10"
        }`}
      >
        {children}
      </div>
      {from === "user" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
          YOU
        </div>
      )}
    </div>
  );
}

export default function OpenClawPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm text-white/60">
            <span className="text-emerald-400">Your OpenClaw</span>
            <span>+</span>
            <span className="text-emerald-400 font-semibold">✏️ AgenticPencil</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Give your OpenClaw agent{" "}
            <span className="text-emerald-400">SEO superpowers</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            One API call and your agent knows exactly what to write, what
            keywords to target, and where you&apos;re missing visibility. Content
            strategy on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://platform.agenticpencil.com"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-colors"
            >
              Get Your API Key
            </a>
            <a
              href="https://docs.agenticpencil.com"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-colors"
            >
              Read the Docs
            </a>
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Setup in 3 Steps
        </h2>
        <p className="text-white/50 text-center mb-16 max-w-lg mx-auto">
          From zero to autonomous SEO content in under 5 minutes.
        </p>

        <div className="space-y-0">
          <Step number={1} emoji="🔑" title="Get Your API Key">
            <a
              href="https://platform.agenticpencil.com"
              className="text-emerald-400 hover:underline"
            >
              Sign up at platform.agenticpencil.com
            </a>{" "}
            — free tier gives you 50 credits/month. No credit card required.
          </Step>

          <Step number={2} emoji="⚡" title="Add to Your OpenClaw">
            Add your API key to your{" "}
            <code className="bg-white/10 px-2 py-0.5 rounded text-emerald-300 text-sm font-mono">
              TOOLS.md
            </code>{" "}
            workspace file:
            <div className="mt-3 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-sm text-emerald-300">
              <div className="text-white/40 mb-1">## AgenticPencil</div>
              <div>API Key: ap_your_key_here</div>
              <div>Base URL: https://api.agenticpencil.com</div>
            </div>
          </Step>

          <Step number={3} emoji="🚀" title="Ask Your Agent">
            Just tell your OpenClaw agent what you need. It will call AgenticPencil
            automatically to get SEO intelligence before writing.
          </Step>
        </div>
      </section>

      {/* Chat Demo */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Just tell your agent what to do.
        </h2>
        <p className="text-white/50 text-center mb-12">
          No dashboards. No spreadsheets. Just a conversation.
        </p>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <ChatBubble from="user">
            Find me content gaps for my SaaS blog. I want to rank higher than my competitors.
          </ChatBubble>
          <ChatBubble from="agent">
            Found 47 keyword gaps across 3 competitors. Top opportunities: &quot;AI
            workflow automation&quot; (2.4k vol, KD 28), &quot;no-code API builder&quot; (1.8k
            vol, KD 22), &quot;automated testing tools&quot; (3.1k vol, KD 35). I&apos;ve
            grouped them into 6 topic clusters. Want me to start writing the
            pillar articles?
          </ChatBubble>

          <div className="border-t border-white/5 pt-6" />

          <ChatBubble from="user">
            What should I write next for maximum SEO impact?
          </ChatBubble>
          <ChatBubble from="agent">
            Based on your current content audit: you have 3 pages cannibalizing
            each other on &quot;workflow automation&quot;. I recommend consolidating them
            into one pillar page. Then write these 4 supporting articles to build
            topical authority. Estimated traffic gain: +2,800 visits/month.
          </ChatBubble>

          <div className="border-t border-white/5 pt-6" />

          <ChatBubble from="user">
            How&apos;s my site doing in AI search engines?
          </ChatBubble>
          <ChatBubble from="agent">
            Your site is cited in 12% of relevant AI responses (ChatGPT, Perplexity, Claude). 
            Your top competitor is at 34%. Biggest gaps: you&apos;re not mentioned for &quot;enterprise 
            workflow tools&quot; or &quot;API integration platforms&quot;. I&apos;ve prepared a content plan 
            to close this gap.
          </ChatBubble>
        </div>
      </section>

      {/* What Your Agent Gets */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          What your agent gets
        </h2>
        <p className="text-white/50 text-center mb-12 max-w-lg mx-auto">
          Real SEO data wrapped in a clean API. Strategy before writing.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Keyword Research",
              desc: "Discover high-value keywords with search volume, difficulty, intent, and clustering — all from one API call.",
              credits: "5 credits",
              endpoint: "POST /v1/keywords/research",
            },
            {
              title: "Competitor Gap Analysis",
              desc: "Find keywords your competitors rank for that you don't. Uncover content opportunities instantly.",
              credits: "10 credits",
              endpoint: "POST /v1/keywords/gaps",
            },
            {
              title: "Content Audit",
              desc: "Detect cannibalization, thin content, and missing topics. Know exactly what to fix and what to write.",
              credits: "15 credits",
              endpoint: "POST /v1/content/audit",
            },
            {
              title: "Content Recommendations",
              desc: "AI-powered suggestions for what to write next based on your existing content and market gaps.",
              credits: "10 credits",
              endpoint: "POST /v1/content/recommend",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full">
                  {feature.credits}
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-3">
                {feature.desc}
              </p>
              <code className="text-xs font-mono text-white/30">
                {feature.endpoint}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Pricing
        </h2>
        <p className="text-white/50 text-center mb-12">
          Start free. Scale when your agent needs more.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              plan: "Free",
              price: "$0",
              credits: "50 credits/mo",
              cta: "Get Started",
              highlight: false,
            },
            {
              plan: "Pro",
              price: "$49",
              credits: "1,000 credits/mo",
              cta: "Upgrade",
              highlight: true,
            },
            {
              plan: "Scale",
              price: "$199",
              credits: "5,000 credits/mo",
              cta: "Upgrade",
              highlight: false,
            },
          ].map((tier) => (
            <div
              key={tier.plan}
              className={`rounded-xl p-6 text-center ${
                tier.highlight
                  ? "bg-emerald-500/10 border-2 border-emerald-500/40"
                  : "bg-white/[0.02] border border-white/10"
              }`}
            >
              <h3 className="text-lg font-semibold text-white mb-1">
                {tier.plan}
              </h3>
              <div className="text-3xl font-bold text-white mb-1">
                {tier.price}
                <span className="text-sm font-normal text-white/40">/mo</span>
              </div>
              <p className="text-white/50 text-sm mb-6">{tier.credits}</p>
              <a
                href="https://platform.agenticpencil.com"
                className={`block w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  tier.highlight
                    ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to let your agent do SEO?
        </h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">
          Get your API key and give your OpenClaw agent the content intelligence
          it needs. Free to start, no credit card required.
        </p>
        <a
          href="https://platform.agenticpencil.com"
          className="inline-flex items-center justify-center px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-lg transition-colors"
        >
          Get Your API Key — It&apos;s Free
        </a>
      </section>

      <Footer />
    </>
  );
}
