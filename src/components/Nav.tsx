"use client";

import { useState, useEffect } from "react";
import { useWaitlist } from "./WaitlistProvider";

export default function Nav() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { openModal } = useWaitlist();

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
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
        <button className="nav-cta" onClick={openModal}>
          Get API Key &rarr;
        </button>
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-links">
            <a>Product</a>
            <a>API Docs</a>
            <a>Pricing</a>
            <a>Blog</a>
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                openModal();
              }}
            >
              Get API Key &rarr;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
