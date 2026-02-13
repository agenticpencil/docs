import FadeIn from "./FadeIn";

export default function Statement() {
  return (
    <section className="statement">
      <FadeIn>
        <div className="divider" style={{ marginBottom: 56 }} />
        <p className="statement-text">
          50 articles is easy.{" "}
          <span className="muted">The right 50 is hard.</span> AgenticPencil
          tells your agents exactly what to write, grounded in real SEO and AI
          citation data.{" "}
          <span className="muted">Not vibes. Not guesses. Data.</span>
        </p>
        <div className="divider" style={{ marginTop: 56 }} />
      </FadeIn>
    </section>
  );
}
