import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1A1A1A",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 100,
        }}
      >
        <span style={{ color: "#FAFAF8" }}>&#9999;</span>
      </div>
    ),
    { ...size }
  );
}
