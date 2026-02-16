import FadeIn from "./FadeIn";

const sources = [
  "ChatGPT",
  "Perplexity",
  "Gemini",
  "Google AI Mode",
  "AI Overview",
  "Copilot",
  "Google Search",
];

export default function DataSources() {
  return (
    <section className="sources">
      <FadeIn>
        <p className="sources-label">
          Real user interface data from every major AI and search platform
        </p>
        <div className="sources-logos">
          {sources.map((s) => (
            <span key={s} className="source-item">
              {s}
            </span>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
