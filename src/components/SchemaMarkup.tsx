const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does AgenticPencil actually do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AgenticPencil analyzes your domain, competitors, and AI visibility across ChatGPT, Perplexity, Gemini, and other models — then returns a prioritized content map. It tells you exactly what to write, why, and in what order, based on real SEO and AI citation data. One API call, your full content strategy.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from Ahrefs, Semrush, or Surfer SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional SEO tools give you keyword data or optimize individual articles. They don't tell you what to write or track how AI models cite your content. AgenticPencil sits upstream — it combines keyword intelligence, competitor analysis, sitemap auditing, and AI visibility tracking into a single prioritized content plan. We're the strategist, not the editor.",
      },
    },
    {
      "@type": "Question",
      name: "What is AI visibility intelligence?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We monitor how AI models like ChatGPT, Perplexity, Gemini, and Google AI Mode surface and cite content. This isn't API-level data — we use real browser-based scraping of the actual user interfaces, the same technique used by top AI SEO companies. You see exactly what users see when they ask AI about your industry.",
      },
    },
    {
      "@type": "Question",
      name: "Can AI agents use the AgenticPencil API directly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — that's exactly what it's built for. AI agents like Claude Code or custom workflows can call our API to get a content map before generating any content. Instead of guessing what to write, your agent gets a data-driven plan with priorities, competitor gaps, and AI citation opportunities.",
      },
    },
    {
      "@type": "Question",
      name: "How does the sitemap cannibalization audit work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We crawl your sitemap and detect pages competing against each other for the same queries. The audit identifies which URLs are cannibalizing traffic, which should be consolidated, and which to redirect — before you create more content that makes the problem worse.",
      },
    },
  ],
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AgenticPencil",
  url: "https://agenticpencil.com",
  description:
    "AI visibility intelligence, keyword research, and competitor analysis — turned into a prioritized content map.",
  sameAs: [
    "https://twitter.com/agenticpencil",
    "https://github.com/goncalocanhoto/agenticpencil",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AgenticPencil",
  url: "https://agenticpencil.com",
  description:
    "Your agentic content strategist. Stop guessing what to publish.",
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AgenticPencil",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Content strategy API that turns AI visibility intelligence, keyword research, and competitor analysis into a prioritized content map.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier — 100 free API calls",
  },
};

export default function SchemaMarkup() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
