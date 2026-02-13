import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
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
  title: "AgenticPencil — Stop guessing what to publish",
  description:
    "AI visibility intelligence, keyword research, and competitor analysis — turned into a prioritized content map. One API call.",
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
        {children}
      </body>
    </html>
  );
}
