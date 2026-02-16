"use client";

import { useState, useEffect } from "react";
import { useWaitlist } from "./WaitlistProvider";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { openModal } = useWaitlist();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <section className="hero">
      <div
        className="hero-badge"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.4s",
        }}
      >
        <span className="dot" />
        Your agentic content strategist
      </div>
      <h1
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease 0.5s",
        }}
      >
        Stop guessing
        <br />
        <em>what to publish</em>
      </h1>
      <p
        className="hero-sub"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.7s ease 0.7s",
        }}
      >
        AI visibility intelligence, keyword research, and competitor analysis
        &mdash; turned into a prioritized content map. One API call.
      </p>
      <div
        className="hero-ctas"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 0.9s",
        }}
      >
        <button className="btn-primary" onClick={openModal}>
          Get Started Free &rarr;
        </button>
        <button className="btn-secondary" onClick={openModal}>
          View API Docs
        </button>
      </div>
      <p
        className="hero-note"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease 1.1s",
        }}
      >
        No credit card required &middot; 100 free API calls
      </p>
    </section>
  );
}
