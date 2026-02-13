import FadeIn from "./FadeIn";

const analysisFeatures = [
  {
    number: "01",
    title: "Sitemap Cannibalization Audit",
    desc: "We crawl your sitemap and detect pages competing against each other for the same queries. See which URLs are cannibalizing traffic, which to consolidate, and which to redirect \u2014 before you create more content that makes it worse.",
    detail:
      "Detects keyword overlap, thin duplicates, and internal competition across your entire site architecture.",
  },
  {
    number: "02",
    title: "Competitor Cross-Analysis",
    desc: "Map your content against up to 10 competitors simultaneously. See every topic they cover that you don\u2019t, every piece where you outrank them, and where both of you are missing opportunities AI models are looking for.",
    detail:
      "Combines traditional SERP overlap with AI citation share-of-voice for a complete competitive picture.",
  },
  {
    number: "03",
    title: "Multi-Geography Intelligence",
    desc: "Content strategy changes by market. What ChatGPT recommends in the US is different from Germany, Brazil, or Japan. Run your full analysis across any geography and language to build region-specific content maps.",
    detail:
      "Supports 50+ countries. AI visibility tracked per-region across all major models.",
  },
];

const sitemapRows = [
  {
    url: "/blog/ai-voice-agents",
    kw: "ai voice agents",
    status: "cannibalized",
    label: "Cannibalized",
  },
  {
    url: "/product/voice-ai",
    kw: "ai voice agents",
    status: "cannibalized",
    label: "Cannibalized",
  },
  {
    url: "/blog/ivr-replacement",
    kw: "ivr replacement software",
    status: "ok",
    label: "OK",
  },
  {
    url: "/blog/ai-call-center",
    kw: "ai call center software",
    status: "consolidate",
    label: "Consolidate",
  },
  {
    url: "/guides/ai-call-center-guide",
    kw: "ai call center software",
    status: "consolidate",
    label: "Consolidate",
  },
];

const geos = [
  "\ud83c\uddfa\ud83c\uddf8 United States",
  "\ud83c\uddec\ud83c\udde7 United Kingdom",
  "\ud83c\udde9\ud83c\uddea Germany",
  "\ud83c\uddeb\ud83c\uddf7 France",
  "\ud83c\udde7\ud83c\uddf7 Brazil",
  "\ud83c\uddea\ud83c\uddf8 Spain",
  "\ud83c\uddf5\ud83c\uddf9 Portugal",
  "\ud83c\uddef\ud83c\uddf5 Japan",
  "\ud83c\uddee\ud83c\uddf3 India",
  "\ud83c\udde6\ud83c\uddfa Australia",
  "\ud83c\udde8\ud83c\udde6 Canada",
  "\ud83c\uddf3\ud83c\uddf1 Netherlands",
  "\ud83c\uddee\ud83c\uddf9 Italy",
  "\ud83c\uddf2\ud83c\uddfd Mexico",
  "\ud83c\uddf8\ud83c\uddea Sweden",
  "+ 35 more",
];

export default function Analysis() {
  return (
    <section className="analysis">
      <FadeIn>
        <p className="api-section-label">Deep Analysis</p>
        <h2 className="api-section-title" style={{ marginBottom: 8 }}>
          Audit before you build
        </h2>
        <p className="api-section-sub" style={{ marginBottom: 0 }}>
          Most teams add content on top of a broken foundation. We analyze what
          you already have first.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="sitemap-visual">
          <div className="sitemap-header">
            <span className="sitemap-header-title">
              Sitemap Cannibalization Report &mdash; acme.io
            </span>
            <span className="sitemap-header-badge">3 conflicts found</span>
          </div>
          <div
            className="sitemap-row"
            style={{
              borderBottom: "1px solid #F0F0EC",
              paddingBottom: 8,
              marginBottom: 4,
            }}
          >
            <span className="sitemap-table-header">URL</span>
            <span className="sitemap-table-header">Competing for</span>
            <span
              className="sitemap-table-header"
              style={{ textAlign: "right" }}
            >
              Status
            </span>
          </div>
          {sitemapRows.map((row, i) => (
            <div key={i} className="sitemap-row">
              <span className="sitemap-url">{row.url}</span>
              <span className="sitemap-keyword">{row.kw}</span>
              <span style={{ textAlign: "right" }}>
                <span className={`sitemap-status status-${row.status}`}>
                  {row.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </FadeIn>

      {analysisFeatures.map((f, i) => (
        <FadeIn key={i} delay={i * 0.08}>
          <div className="analysis-item">
            <span className="analysis-number">{f.number}</span>
            <div>
              <h3 className="analysis-title">{f.title}</h3>
              <p className="analysis-desc">{f.desc}</p>
              <span className="analysis-detail">{f.detail}</span>
            </div>
          </div>
        </FadeIn>
      ))}

      <FadeIn delay={0.3}>
        <div className="geo-bar">
          {geos.map((geo, i) => (
            <span key={i} className="geo-pill">
              {geo}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
