import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AgenticPencil",
  description: "AgenticPencil privacy policy. How we handle your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: February 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          AgenticPencil (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates
          the agenticpencil.com website and API. This Privacy Policy explains how
          we collect, use, and protect your information when you use our
          services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>
          <strong>Account information:</strong> When you create an account, we
          collect your email address and payment information (processed securely
          via Stripe).
        </p>
        <p>
          <strong>Usage data:</strong> We collect information about how you use
          our API, including domains analyzed, API call volume, and feature
          usage. This helps us improve the service.
        </p>
        <p>
          <strong>Domain data:</strong> When you submit a domain for analysis, we
          crawl publicly available information (sitemaps, published content) to
          generate your content map. We do not access private or
          password-protected pages.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and improve our content mapping and AI visibility services</li>
          <li>Process payments and manage your subscription</li>
          <li>Send service-related communications (no marketing spam)</li>
          <li>Monitor and prevent abuse of our API</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>
          We do not sell your personal information. We share data only with:
        </p>
        <ul>
          <li>Payment processors (Stripe) for billing</li>
          <li>Infrastructure providers necessary to operate the service</li>
          <li>Law enforcement when required by law</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active.
          Analysis results are stored for the duration of your subscription. You
          can request deletion of your data at any time by contacting us.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We use industry-standard encryption and security practices to protect
          your data. API keys are hashed and stored securely. All connections use
          HTTPS/TLS.
        </p>
      </section>

      <section>
        <h2>7. Cookies</h2>
        <p>
          We use essential cookies only for session management. We do not use
          tracking cookies or third-party advertising cookies.
        </p>
      </section>

      <section>
        <h2>8. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data.
          For GDPR and CCPA requests, contact us at privacy@agenticpencil.com.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update this policy from time to time. We will notify you of
          significant changes via email or a notice on our website.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions about this policy? Email us at privacy@agenticpencil.com.
        </p>
      </section>
    </main>
  );
}
