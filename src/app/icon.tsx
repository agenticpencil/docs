import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1A1A1A",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        <span style={{ color: "#FAFAF8" }}>&#9999;</span>
      </div>
    ),
    { ...size }
  );
}
