"use client";

import { useCurrentFrame, useVideoConfig } from "remotion";

export interface InfiniteBentoPanProps {
  panSpeed?: number;
  accentColor?: string;
  speed?: number;
  className?: string;
  light?: boolean;
  /** 0–1 starting position in the pan cycle (avoids beginning at top-left). */
  startProgress?: number;
}

const FONT_FAMILY =
  '"Space Grotesk", "DM Sans", system-ui, -apple-system, sans-serif';

const SUPER_W = 3500;
const SUPER_H = 2500;

type CardKind =
  | "chart"
  | "counter"
  | "gradient"
  | "code"
  | "logo"
  | "stat"
  | "bars";

interface CardDef {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: CardKind;
  hue: number;
  label?: string;
}

const CARDS: CardDef[] = [
  { x: 80, y: 80, w: 480, h: 280, kind: "chart", hue: 220, label: "Programs" },
  { x: 600, y: 80, w: 280, h: 280, kind: "counter", hue: 280, label: "Twins" },
  { x: 920, y: 80, w: 360, h: 180, kind: "gradient", hue: 200 },
  { x: 1320, y: 80, w: 480, h: 280, kind: "code", hue: 0, label: "hypothesis.ts" },
  { x: 1840, y: 80, w: 280, h: 280, kind: "logo", hue: 320 },
  { x: 2160, y: 80, w: 380, h: 180, kind: "stat", hue: 160, label: "Invariants" },
  { x: 2580, y: 80, w: 360, h: 280, kind: "bars", hue: 40, label: "Experiments" },
  { x: 920, y: 300, w: 360, h: 200, kind: "counter", hue: 180, label: "Papers" },
  { x: 2160, y: 300, w: 380, h: 200, kind: "chart", hue: 100, label: "Canvas" },
  { x: 80, y: 400, w: 280, h: 280, kind: "gradient", hue: 340 },
  { x: 400, y: 400, w: 480, h: 280, kind: "code", hue: 0, label: "protocol.ts" },
  { x: 1320, y: 420, w: 280, h: 280, kind: "stat", hue: 60, label: "Audit" },
  { x: 1640, y: 420, w: 380, h: 280, kind: "bars", hue: 260, label: "Runs" },
  { x: 2580, y: 420, w: 360, h: 280, kind: "logo", hue: 200 },
  { x: 80, y: 720, w: 480, h: 240, kind: "chart", hue: 290, label: "Anomalies" },
  { x: 600, y: 720, w: 280, h: 240, kind: "stat", hue: 20, label: "Throughput" },
  { x: 920, y: 740, w: 380, h: 220, kind: "gradient", hue: 240 },
  { x: 1320, y: 740, w: 360, h: 220, kind: "counter", hue: 140, label: "Live twins" },
  { x: 1720, y: 740, w: 480, h: 240, kind: "code", hue: 0, label: "pipeline.ts" },
  { x: 2240, y: 740, w: 360, h: 240, kind: "bars", hue: 320, label: "Critical path" },
  { x: 80, y: 1000, w: 360, h: 220, kind: "logo", hue: 180 },
  { x: 460, y: 1000, w: 380, h: 220, kind: "stat", hue: 80, label: "Library" },
  { x: 880, y: 1000, w: 480, h: 220, kind: "chart", hue: 200, label: "Compute" },
  { x: 1400, y: 1000, w: 280, h: 220, kind: "counter", hue: 360, label: "Enrolments" },
  { x: 1720, y: 1020, w: 360, h: 220, kind: "gradient", hue: 120 },
  { x: 2120, y: 1020, w: 380, h: 220, kind: "code", hue: 0, label: "invariants.sql" },
  { x: 2540, y: 1020, w: 400, h: 220, kind: "bars", hue: 280, label: "Evidence" },
  { x: 80, y: 1280, w: 480, h: 260, kind: "code", hue: 0, label: "lattice.ts" },
  { x: 600, y: 1280, w: 360, h: 260, kind: "chart", hue: 240, label: "Latency" },
  { x: 1000, y: 1280, w: 280, h: 260, kind: "logo", hue: 60 },
  { x: 1320, y: 1280, w: 380, h: 260, kind: "stat", hue: 200, label: "Citations" },
  { x: 1740, y: 1280, w: 360, h: 260, kind: "counter", hue: 300, label: "Datasets" },
  { x: 2140, y: 1280, w: 380, h: 260, kind: "gradient", hue: 160 },
  { x: 2560, y: 1280, w: 380, h: 260, kind: "bars", hue: 0, label: "Violations" },
  { x: 80, y: 1600, w: 380, h: 220, kind: "stat", hue: 280, label: "Signed" },
  { x: 500, y: 1600, w: 480, h: 220, kind: "chart", hue: 40, label: "Exports" },
  { x: 1020, y: 1600, w: 360, h: 220, kind: "code", hue: 0, label: "charter.ts" },
  { x: 1420, y: 1600, w: 280, h: 220, kind: "logo", hue: 220 },
  { x: 1740, y: 1620, w: 380, h: 220, kind: "counter", hue: 100, label: "Integrations" },
  { x: 2160, y: 1620, w: 360, h: 220, kind: "bars", hue: 340, label: "Rollouts" },
  { x: 2560, y: 1620, w: 380, h: 220, kind: "gradient", hue: 200 },
  { x: 80, y: 1880, w: 480, h: 240, kind: "bars", hue: 180, label: "Graph" },
  { x: 600, y: 1880, w: 380, h: 240, kind: "gradient", hue: 320 },
  { x: 1020, y: 1880, w: 360, h: 240, kind: "logo", hue: 80 },
  { x: 1420, y: 1880, w: 480, h: 240, kind: "chart", hue: 260, label: "Claims" },
  { x: 1940, y: 1880, w: 280, h: 240, kind: "counter", hue: 20, label: "Reasoning" },
  { x: 2260, y: 1880, w: 380, h: 240, kind: "stat", hue: 140, label: "Survival" },
  { x: 2680, y: 1880, w: 260, h: 240, kind: "code", hue: 0, label: "ire.ts" },
];

function noise(i: number, frame: number) {
  return Math.sin(frame / 30 + i) * 0.5 + 0.5;
}

function hueToAccent(hue: number, light = true) {
  return light
    ? `hsl(${hue}, 58%, 46%)`
    : `hsl(${hue}, 72%, 58%)`;
}

function cardAccent(card: CardDef, index: number, light: boolean) {
  const hue =
    card.kind === "code" && card.hue === 0
      ? [220, 280, 160, 40, 320, 200][index % 6]
      : card.hue;
  return hueToAccent(hue, light);
}

function withAlpha(hslColor: string, alpha: number) {
  return hslColor.replace(/^hsl\(/, "hsla(").replace(/\)$/, `, ${alpha})`);
}

function ChartCard({ accent, t }: { accent: string; t: number }) {
  const points: string[] = [];
  for (let i = 0; i < 12; i++) {
    const x = (i / 11) * 100;
    const y =
      50 - (Math.sin(i * 0.7 + t) * 18 + Math.cos(i * 0.4 + t * 0.6) * 8);
    points.push(`${x},${y}`);
  }
  return (
    <svg
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%" }}
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={accent}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`${points.join(" ")} 100,60 0,60`}
        fill={withAlpha(accent, 0.13)}
        stroke="none"
      />
    </svg>
  );
}

function BarsCard({ accent, t }: { accent: string; t: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height: "100%",
        width: "100%",
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const h = 25 + (Math.sin(i * 0.8 + t) * 0.5 + 0.5) * 70;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              background: `linear-gradient(180deg, ${accent} 0%, ${withAlpha(accent, 0.35)} 100%)`,
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
}

function CodeCard({ accent }: { accent: string }) {
  const lines = [
    { indent: 0, w: 60, c: accent },
    { indent: 1, w: 80, c: "rgba(17,17,16,0.55)" },
    { indent: 1, w: 50, c: accent },
    { indent: 2, w: 70, c: "rgba(17,17,16,0.45)" },
    { indent: 2, w: 40, c: accent },
    { indent: 1, w: 30, c: "rgba(17,17,16,0.35)" },
    { indent: 0, w: 20, c: "rgba(17,17,16,0.3)" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            marginLeft: l.indent * 14,
            width: `${l.w}%`,
            height: 8,
            borderRadius: 3,
            background: l.c,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

function LogoCard({ accent, hue }: { accent: string; hue: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${accent} 0%, hsl(${hue},70%,55%) 100%)`,
          boxShadow: `0 10px 30px ${withAlpha(accent, 0.27)}`,
        }}
      />
    </div>
  );
}

function GradientCard({ hue, light }: { hue: number; light?: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: light
          ? `radial-gradient(circle at 30% 30%, hsl(${hue},55%,88%) 0%, hsl(${(hue + 40) % 360},45%,94%) 55%, #ffffff 100%)`
          : `radial-gradient(circle at 30% 30%, hsl(${hue},80%,60%) 0%, hsl(${(hue + 60) % 360},70%,40%) 50%, #0a0a0a 100%)`,
      }}
    />
  );
}

function Card({
  card,
  index,
  frame,
  light = true,
}: {
  card: CardDef;
  index: number;
  frame: number;
  light?: boolean;
}) {
  const t = noise(index, frame) * 6.28;
  const accent = cardAccent(card, index, light);
  const baseStyle: React.CSSProperties = light
    ? {
        position: "absolute",
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
        borderRadius: 18,
        background: "linear-gradient(180deg, #ffffff 0%, #f7f7f5 100%)",
        border: "1px solid rgba(17,17,16,0.08)",
        boxShadow:
          "0 1px 0 rgba(17,17,16,0.04), 0 10px 30px -12px rgba(17,17,16,0.12)",
        overflow: "hidden",
        padding: 18,
        color: "#111110",
        display: "flex",
        flexDirection: "column",
      }
    : {
        position: "absolute",
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
        borderRadius: 18,
        background: "linear-gradient(180deg, #131313 0%, #0a0a0a 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        padding: 18,
        color: "white",
        display: "flex",
        flexDirection: "column",
      };

  const labelEl = card.label ? (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: light ? "rgba(17,17,16,0.45)" : "rgba(255,255,255,0.55)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {card.label}
    </div>
  ) : null;

  if (card.kind === "chart") {
    return (
      <div style={baseStyle}>
        {labelEl}
        <div style={{ flex: 1 }}>
          <ChartCard accent={accent} t={t} />
        </div>
      </div>
    );
  }
  if (card.kind === "bars") {
    return (
      <div style={baseStyle}>
        {labelEl}
        <div style={{ flex: 1 }}>
          <BarsCard accent={accent} t={t} />
        </div>
      </div>
    );
  }
  if (card.kind === "counter") {
    const v = Math.floor(1200 + noise(index, frame) * 800);
    return (
      <div style={baseStyle}>
        {labelEl}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: light ? "#111110" : "white",
          }}
        >
          {v.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
          +{(noise(index + 1, frame) * 12).toFixed(1)}%
        </div>
      </div>
    );
  }
  if (card.kind === "stat") {
    const v = (95 + noise(index, frame) * 5).toFixed(2);
    return (
      <div style={baseStyle}>
        {labelEl}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {v}
          <span
            style={{
              fontSize: 20,
              color: light ? "rgba(17,17,16,0.45)" : "rgba(255,255,255,0.5)",
              marginLeft: 4,
            }}
          >
            %
          </span>
        </div>
      </div>
    );
  }
  if (card.kind === "code") {
    return (
      <div style={baseStyle}>
        {labelEl}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%" }}>
            <CodeCard accent={accent} />
          </div>
        </div>
      </div>
    );
  }
  if (card.kind === "logo") {
    return (
      <div style={{ ...baseStyle, padding: 0 }}>
        <LogoCard accent={accent} hue={card.hue} />
      </div>
    );
  }
  return (
    <div style={{ ...baseStyle, padding: 0 }}>
      <GradientCard hue={card.hue} light={light} />
    </div>
  );
}

export function InfiniteBentoPan({
  panSpeed = 1,
  accentColor = "#2563eb",
  speed = 1,
  className,
  light = true,
  startProgress = 0.38,
}: InfiniteBentoPanProps) {
  const frame = useCurrentFrame() * speed;
  const { durationInFrames } = useVideoConfig();

  const cycle = Math.max(1, Math.floor(durationInFrames / Math.max(0.25, panSpeed)));
  const progress =
    (frame + startProgress * cycle) % cycle / cycle;

  const px = progress * SUPER_W;
  const py = progress * SUPER_H;

  const tileOffsets = [
    { ox: 0, oy: 0 },
    { ox: SUPER_W, oy: 0 },
    { ox: 0, oy: SUPER_H },
    { ox: SUPER_W, oy: SUPER_H },
  ];

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background: light ? "#ffffff" : "#050505",
        overflow: "hidden",
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SUPER_W * 2,
          height: SUPER_H * 2,
          transform: `translate(${-px}px, ${-py}px)`,
          willChange: "transform",
        }}
      >
        {tileOffsets.flatMap(({ ox, oy }) =>
          CARDS.map((c, i) => (
            <Card
              key={`${ox}-${oy}-${i}`}
              card={{ ...c, x: c.x + ox, y: c.y + oy }}
              index={i}
              frame={frame}
              light={light}
            />
          ))
        )}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: light
            ? "radial-gradient(circle at center, transparent 24%, rgba(255,255,255,0.72) 72%, #ffffff 100%)"
            : "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 80%, #000 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default InfiniteBentoPan;
