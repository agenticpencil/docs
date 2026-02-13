import FadeIn from "./FadeIn";

export default function FinalCta() {
  return (
    <section className="final-cta">
      <FadeIn>
        <h2>Know what to write.</h2>
        <p>
          The content strategy API for agents, teams, and agencies who are done
          guessing.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: 15, padding: "16px 40px" }}
        >
          Get API Key &mdash; Free &rarr;
        </button>
      </FadeIn>
    </section>
  );
}
