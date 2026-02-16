"use client";

import FadeIn from "./FadeIn";

const features = [
  {
    icon: "\u25CE",
    title: "Content Mapping",
    desc: "Full topic clustering, prioritization, and content gap analysis. Give us your domain \u2014 we give you your next 100 articles, ranked by impact.",
    tag: "Core",
  },
  {
    icon: "\u25C9",
    title: "AI Visibility Intelligence",
    desc: "Real browser-based monitoring \u2014 not API calls. We scrape the actual user interface of every major AI model, the same way top SEO and AI SEO companies do. What users see is what you get.",
    tag: "Differentiator",
  },
  {
    icon: "\u25C7",
    title: "Enterprise Writer API",
    desc: "14-step content pipeline built for complex content operations. Brand guidelines, schema markup, internal linking, and direct publishing to Webflow \u2014 as draft or live. Built for teams that ship at scale.",
    tag: "Premium",
  },
];

export default function Features() {
  return (
    <section className="features">
      <FadeIn>
        <p className="api-section-label">The Stack</p>
        <h2 className="api-section-title" style={{ marginBottom: 48 }}>
          Strategy first. Writing second.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-tag">{f.tag}</div>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
