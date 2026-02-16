import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "AgenticPencil — AI SEO Tool for Content Strategy & Visibility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              background: "#1A1A1A",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FAFAF8",
              fontSize: "20px",
            }}
          >
            ✏
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#1A1A1A",
              fontFamily: "Georgia, serif",
            }}
          >
            AgenticPencil
          </span>
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 400,
            color: "#1A1A1A",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: "32px",
            fontFamily: "Georgia, serif",
          }}
        >
          Stop guessing
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 400,
            color: "#555",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            fontStyle: "italic",
            marginBottom: "48px",
            fontFamily: "Georgia, serif",
          }}
        >
          what to publish
        </div>
        <div
          style={{
            fontSize: "22px",
            color: "#888",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.6,
            fontFamily: "sans-serif",
            fontWeight: 300,
          }}
        >
          AI visibility intelligence, content gap analysis, and competitor
          research — turned into a prioritized content map. One API call.
        </div>
      </div>
    ),
    { ...size }
  );
}
