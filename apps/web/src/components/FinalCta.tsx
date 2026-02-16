import FadeIn from "./FadeIn";
import CtaButton from "./CtaButton";

export default function FinalCta() {
  return (
    <section className="final-cta">
      <FadeIn>
        <h2>Know what to write.</h2>
        <p>
          The content strategy API for agents, teams, and agencies who are done
          guessing.
        </p>
        <CtaButton
          className="btn-primary"
          style={{ fontSize: 15, padding: "16px 40px" }}
        >
          Get API Key &mdash; Free &rarr;
        </CtaButton>
      </FadeIn>
    </section>
  );
}
