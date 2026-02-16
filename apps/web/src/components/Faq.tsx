"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does AgenticPencil actually do?",
    answer:
      "AgenticPencil analyzes your domain, competitors, and AI visibility across ChatGPT, Perplexity, Gemini, and other models — then returns a prioritized content map. It tells you exactly what to write, why, and in what order, based on real SEO and AI citation data. One API call, your full content strategy.",
  },
  {
    question: "How is this different from Ahrefs, Semrush, or Surfer SEO?",
    answer:
      "Traditional SEO tools give you keyword data or optimize individual articles. They don't tell you what to write or track how AI models cite your content. AgenticPencil sits upstream — it combines keyword intelligence, competitor analysis, sitemap auditing, and AI visibility tracking into a single prioritized content plan. We're the strategist, not the editor.",
  },
  {
    question: "What is AI visibility intelligence?",
    answer:
      "We monitor how AI models like ChatGPT, Perplexity, Gemini, and Google AI Mode surface and cite content. This isn't API-level data — we use real browser-based scraping of the actual user interfaces, the same technique used by top AI SEO companies. You see exactly what users see when they ask AI about your industry.",
  },
  {
    question: "Can AI agents use the AgenticPencil API directly?",
    answer:
      "Yes — that's exactly what it's built for. AI agents like Claude Code or custom workflows can call our API to get a content map before generating any content. Instead of guessing what to write, your agent gets a data-driven plan with priorities, competitor gaps, and AI citation opportunities. One API call returns everything the agent needs.",
  },
  {
    question: "How does the sitemap cannibalization audit work?",
    answer:
      "We crawl your sitemap and detect pages competing against each other for the same queries. The audit identifies which URLs are cannibalizing traffic, which should be consolidated, and which to redirect — before you create more content that makes the problem worse. It includes keyword overlap detection, thin duplicate identification, and internal competition analysis across your entire site architecture.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <p className="api-section-label">FAQ</p>
      <h2 className="api-section-title" style={{ marginBottom: 48 }}>
        Common questions
      </h2>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${openIndex === i ? "faq-item--open" : ""}`}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-icon">{openIndex === i ? "\u2212" : "+"}</span>
            </div>
            <div
              className="faq-answer"
              style={{
                maxHeight: openIndex === i ? 300 : 0,
                opacity: openIndex === i ? 1 : 0,
                marginTop: openIndex === i ? 12 : 0,
              }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
