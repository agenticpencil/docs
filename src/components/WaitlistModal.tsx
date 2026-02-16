"use client";

import { useState, useEffect, useRef } from "react";

export default function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus("idle");
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        {status === "success" ? (
          <div className="modal-success">
            <div className="modal-success-icon">&#10003;</div>
            <h3>You&apos;re in.</h3>
            <p>We&apos;ll send your API key when we launch.</p>
          </div>
        ) : (
          <>
            <h3>Get your API key</h3>
            <p>Enter your email and we&apos;ll send you access.</p>
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="modal-input"
              />
              <button
                type="submit"
                className="btn-primary modal-submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? "..." : "Get Early Access →"}
              </button>
            </form>
            {status === "error" && (
              <p className="modal-error">Something went wrong. Try again.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
