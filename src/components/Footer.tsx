import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">&copy; 2026 AgenticPencil</div>
      <div className="footer-links">
        <a>API Docs</a>
        <a>Pricing</a>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <a>GitHub</a>
        <a>Twitter</a>
      </div>
    </footer>
  );
}
