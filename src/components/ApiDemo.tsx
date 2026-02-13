"use client";

import { useState, useEffect } from "react";
import FadeIn from "./FadeIn";

const apiExample = `{
  "domain": "acme.io",
  "geography": "US",
  "strategy": {
    "total_opportunities": 47,
    "high_priority": 12,
    "ai_citation_gaps": 31,
    "cannibalization_issues": 3
  },
  "content_map": [
    {
      "priority": 1,
      "title": "AI Voice Agents vs Traditional IVR",
      "ai_citation_gap": "high",
      "competing_sources": 4,
      "your_coverage": "cannibalized",
      "action": "consolidate /blog/ai-voice + /product/voice",
      "estimated_impact": "\u2605\u2605\u2605\u2605\u2605"
    },
    {
      "priority": 2,
      "title": "Insurance Claims Automation Guide",
      "ai_citation_gap": "medium",
      "competing_sources": 7,
      "your_coverage": "none",
      "action": "create_new",
      "estimated_impact": "\u2605\u2605\u2605\u2605"
    }
  ]
}`;

function colorizeLine(line: string) {
  return line
    .replace(/"([^"]+)":/g, '<span class="code-key">"$1"</span>:')
    .replace(/: "([^"]+)"/g, ': <span class="code-string">"$1"</span>')
    .replace(/: (\d+)/g, ': <span class="code-number">$1</span>')
    .replace(/\u2605/g, '<span class="code-star">\u2605</span>')
    .replace(/([{}\[\]])/g, '<span class="code-bracket">$1</span>');
}

export default function ApiDemo() {
  const codeLines = apiExample.split("\n");
  const [typedLines, setTypedLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypedLines((prev) => {
        if (prev >= codeLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [codeLines.length]);

  return (
    <section className="api-section">
      <FadeIn>
        <p className="api-section-label">How it works</p>
        <h2 className="api-section-title">One call. Your full content map.</h2>
        <p className="api-section-sub">
          Pass a domain. Get back a prioritized list of exactly what to write,
          why, and in what order.
        </p>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div className="code-window">
          <div className="code-header">
            <div className="code-dot" style={{ background: "#FF5F57" }} />
            <div className="code-dot" style={{ background: "#FEBC2E" }} />
            <div className="code-dot" style={{ background: "#28C840" }} />
            <span className="code-header-text">
              POST /api/content-map?geo=US &mdash; response
            </span>
          </div>
          <div className="code-body">
            {codeLines.slice(0, typedLines).map((line, i) => (
              <div key={i}>
                <span className="code-line-num">{i + 1}</span>
                <span dangerouslySetInnerHTML={{ __html: colorizeLine(line) }} />
              </div>
            ))}
            {typedLines < codeLines.length && (
              <div>
                <span className="code-line-num">{typedLines + 1}</span>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 16,
                    background: "rgba(255,255,255,0.5)",
                    animation: "pulse 1s infinite",
                    verticalAlign: "middle",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
