import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AgenticPencil",
  description: "AgenticPencil terms of service and acceptable use policy.",
};

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: February 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using AgenticPencil (&quot;the Service&quot;), you
          agree to be bound by these Terms of Service. If you do not agree, do
          not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of Service</h2>
        <p>
          AgenticPencil provides content strategy intelligence via API and web
          interface, including content mapping, AI visibility tracking, sitemap
          analysis, competitor analysis, and content generation services.
        </p>
      </section>

      <section>
        <h2>3. Account and API Keys</h2>
        <p>
          You are responsible for maintaining the security of your account and
          API keys. Do not share your API keys publicly. You are responsible for
          all activity under your account.
        </p>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to reverse-engineer or extract our proprietary data, models, or analysis methods</li>
          <li>Resell API access without authorization</li>
          <li>Exceed rate limits or abuse the API in a way that degrades service for others</li>
          <li>Submit domains you do not own or have authorization to analyze (for competitor analysis, publicly available data is used)</li>
        </ul>
      </section>

      <section>
        <h2>5. Billing and Payments</h2>
        <p>
          Paid plans are billed monthly or annually. You may cancel at any time;
          access continues until the end of your billing period. Refunds are not
          provided for partial months. Usage-based charges (Enterprise Writer
          API) are billed at the end of each billing cycle.
        </p>
      </section>

      <section>
        <h2>6. Data and Ownership</h2>
        <p>
          You retain ownership of your data. We retain ownership of our analysis
          outputs, algorithms, and aggregated insights. You may use analysis
          results for your own business purposes. Content generated via the
          Enterprise Writer API is owned by you.
        </p>
      </section>

      <section>
        <h2>7. Service Availability</h2>
        <p>
          We aim for high availability but do not guarantee 100% uptime. We are
          not liable for temporary outages, data from third-party sources
          (search engines, AI models) that may change, or delays in data
          processing.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          AgenticPencil provides content strategy intelligence as a tool, not as
          guaranteed business advice. We are not responsible for business
          decisions made based on our analysis. Our liability is limited to the
          amount you paid for the Service in the 12 months preceding any claim.
        </p>
      </section>

      <section>
        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate your account for violation of these terms.
          You may close your account at any time. Upon termination, your data
          will be deleted within 30 days.
        </p>
      </section>

      <section>
        <h2>10. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          Service after changes constitutes acceptance. We will notify you of
          material changes via email.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these terms? Email us at legal@agenticpencil.com.
        </p>
      </section>
    </main>
  );
}
