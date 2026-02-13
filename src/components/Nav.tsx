"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <nav
      className="nav"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.6s ease 0.2s",
      }}
    >
      <div className="nav-logo">
        <div className="pencil-icon">&#9999;</div>
        AgenticPencil
      </div>
      <div className="nav-links">
        <a>Product</a>
        <a>API Docs</a>
        <a>Pricing</a>
        <a>Blog</a>
      </div>
      <button className="nav-cta">Get API Key &rarr;</button>
    </nav>
  );
}
