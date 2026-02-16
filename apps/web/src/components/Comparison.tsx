import FadeIn from "./FadeIn";

const comparisons = [
  {
    tool: "Ahrefs / Semrush",
    does: "Keyword data",
    missing: "No AI citation intelligence. No prioritized content plan.",
  },
  {
    tool: "Surfer / Clearscope",
    does: "Optimizes single articles",
    missing: "Doesn\u2019t tell you which articles to write.",
  },
  {
    tool: "MarketMuse",
    does: "Topic modeling",
    missing: "No agentic API. No AI visibility layer.",
  },
  {
    tool: "Claude Code alone",
    does: "Writes anything",
    missing: "Guesses what to write. No real data.",
  },
];

export default function Comparison() {
  return (
    <section className="comparison">
      <FadeIn>
        <p className="comparison-label">Why AgenticPencil</p>
        <h2 className="comparison-title">
          We sit upstream of everything
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it does</th>
              <th>What it doesn&apos;t</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c, i) => (
              <tr key={i}>
                <td>{c.tool}</td>
                <td>{c.does}</td>
                <td>{c.missing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FadeIn>
    </section>
  );
}
