"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function ContentPageFaq({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list" style={{ marginTop: 48 }}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`faq-item ${openIndex === i ? "faq-item--open" : ""}`}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <div className="faq-question">
            <span>{faq.question}</span>
            <span className="faq-icon">
              {openIndex === i ? "\u2212" : "+"}
            </span>
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
  );
}
