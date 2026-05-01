import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBFAF6",
          color: "#111110",
          padding: "72px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div>
          <div
            style={{
              color: "#8E8E80",
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            VRI · The Virtual Research Institute
          </div>
          <div
            style={{
              marginTop: 32,
              maxWidth: 930,
              fontSize: 82,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 600,
            }}
          >
            Every researcher deserves an institute.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ color: "#4C4C42", fontSize: 30 }}>
            New Horizon · newhorizon.dev
          </div>
          <div
            style={{
              border: "1px solid rgba(17,17,16,0.18)",
              padding: "12px 16px",
              fontSize: 28,
              letterSpacing: "-0.04em",
            }}
          >
            [NH]
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
