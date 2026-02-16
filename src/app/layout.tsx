import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import WaitlistProvider from "@/components/WaitlistProvider";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "AgenticPencil — AI SEO Tool for Content Strategy & Visibility",
  description:
    "AI SEO tool for content strategy. AI visibility tracking, content gap analysis & competitor research — as a prioritized content map. One API call.",
  keywords: [
    "AI SEO tool",
    "SEO API",
    "content strategy API",
    "AI visibility tracking",
    "answer engine optimization",
    "AEO optimization",
    "content gap analysis",
    "content mapping",
    "AI content strategy",
    "SEO content audit",
    "content intelligence platform",
    "sitemap cannibalization",
    "AI search optimization",
    "MCP server SEO",
    "agentic SEO",
    "seo data api",
  ],
  metadataBase: new URL("https://agenticpencil.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AgenticPencil — AI Content Strategy & SEO Intelligence Tool",
    description:
      "AI visibility tracking, content gap analysis, and competitor research — turned into a prioritized content map. One API call. Know what to write.",
    url: "https://agenticpencil.com",
    siteName: "AgenticPencil",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgenticPencil — AI SEO Tool for Content Strategy",
    description:
      "Your agentic content strategist. AI visibility tracking, content gap analysis, and competitor intelligence — one API call.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          background: "#FAFAF8",
          color: "#1A1A1A",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <WaitlistProvider>{children}</WaitlistProvider>
      </body>
    </html>
  );
}
