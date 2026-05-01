"use client";

import * as React from "react";
import { Sparkles, Download, LineChart, BarChart3, CircleDot, Layers, Table2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell, SectionLabel } from "./DocChrome";

type ChartKind = "4pl" | "box" | "heat" | "scatter";

export function VizStudioDoc() {
  const [kind, setKind] = React.useState<ChartKind>("4pl");
  return (
    <DocShell
      crumbs={["egfr", "figures", "fig2a-dose-response.viz"]}
      right={
        <div className="flex items-center gap-1">
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 inline-flex items-center gap-1 text-ink-700 hover:bg-ink-900/5">
            <Download className="h-2.5 w-2.5" /> SVG
          </button>
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5">
            R code
          </button>
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5">
            Python code
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] min-h-full">
        <div className="px-10 py-8 min-w-0">
          <AIRecommendation onApply={(k) => setKind(k)} kind={kind} />
          <div className="mt-6 rounded-md border border-ink-900/8 bg-white p-5">
            {kind === "4pl" && <FourPL />}
            {kind === "box" && <BoxPlot />}
            {kind === "heat" && <Heatmap />}
            {kind === "scatter" && <Scatter />}
          </div>
          <Stats />
        </div>
        <aside className="border-l border-ink-900/8 bg-parchment-50 p-5 space-y-6">
          <div>
            <SectionLabel>Data source</SectionLabel>
            <div className="mt-2 rounded border border-ink-900/10 bg-white px-2 py-1.5 font-mono text-[11.5px] text-ink-800">
              ic50_normalized.parquet
            </div>
            <div className="mt-1 text-[10.5px] text-ink-500 font-mono">
              4 160 rows · 8 cols · FAIR 92
            </div>
          </div>

          <div>
            <SectionLabel>Chart type</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {(
                [
                  ["4pl", LineChart, "4PL fit"],
                  ["box", BarChart3, "Box plot"],
                  ["heat", Layers, "Heatmap"],
                  ["scatter", CircleDot, "Scatter"],
                ] as const
              ).map(([k, Icon, l]) => (
                <button
                  key={k}
                  onClick={() => setKind(k as ChartKind)}
                  className={cn(
                    "h-8 rounded-md border text-[11px] inline-flex items-center justify-center gap-1.5 font-mono",
                    kind === k
                      ? "bg-ink-900 text-parchment-50 border-ink-900"
                      : "bg-white text-ink-700 border-ink-900/10 hover:border-ink-900/20"
                  )}
                >
                  <Icon className="h-3 w-3" /> {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Encodings</SectionLabel>
            <div className="mt-2 space-y-1.5 font-mono text-[11.5px] text-ink-700">
              <EncodingRow k="x" v="concentration_uM (log)" />
              <EncodingRow k="y" v="viability_pct" />
              <EncodingRow k="color" v="cell_line" />
              <EncodingRow k="facet" v="compound_id" />
            </div>
          </div>

          <div>
            <SectionLabel>Export targets</SectionLabel>
            <div className="mt-2 space-y-1 text-[11.5px] font-mono text-ink-600">
              <div>→ Manuscript · Fig. 2A</div>
              <div>→ Notebook · exp002-analysis [3]</div>
              <div>→ Presentation deck</div>
            </div>
          </div>
        </aside>
      </div>
    </DocShell>
  );
}

function AIRecommendation({
  kind,
  onApply,
}: {
  kind: ChartKind;
  onApply: (k: ChartKind) => void;
}) {
  return (
    <div className="rounded-md border border-beacon-500/20 bg-beacon-50/60 px-4 py-3 flex items-start gap-3">
      <Sparkles className="h-4 w-4 text-beacon-600 mt-0.5 shrink-0" />
      <div className="flex-1 text-[13px] text-beacon-900 leading-relaxed">
        For dose-response data with 4 cell lines, I recommend a{" "}
        <b>4-parameter logistic fit with 95% CI bands</b>. Two cell lines
        carrying T790M show a clear right-shift; separation is clean in
        log-log space.
        <div className="mt-2 text-[11.5px] text-beacon-700 font-mono">
          signal-to-noise score: 0.91 · confidence: high
        </div>
      </div>
      <button
        onClick={() => onApply("4pl")}
        className="h-7 px-3 rounded-md bg-ink-900 text-parchment-50 text-[11px] font-mono hover:bg-ink-800"
        disabled={kind === "4pl"}
      >
        apply
      </button>
    </div>
  );
}

function EncodingRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-ink-400 w-12">{k}</span>
      <span className="text-ink-800 truncate">{v}</span>
    </div>
  );
}

function Stats() {
  return (
    <div className="mt-6 rounded-md border border-ink-900/8 bg-parchment-50 p-4">
      <SectionLabel>Statistical analysis · auto</SectionLabel>
      <div className="mt-2 grid grid-cols-4 gap-6 text-[12px] font-mono">
        <S label="test" v="Two-way ANOVA" />
        <S label="F(3,44)" v="18.7" />
        <S label="p-value" v="< 0.0001" tone="emerald" />
        <S label="η²" v="0.56 (large)" />
      </div>
      <div className="mt-3 text-[11px] text-ink-500 font-mono">
        post-hoc: Tukey HSD · assumptions checked (normality ✓, homoscedasticity
        ✓)
      </div>
    </div>
  );
}

function S({ label, v, tone }: { label: string; v: string; tone?: "emerald" }) {
  return (
    <div>
      <div className="text-[10px] text-ink-400 uppercase tracking-[0.14em]">
        {label}
      </div>
      <div className={cn("text-[13px] tabular-nums", tone === "emerald" ? "text-emerald-700" : "text-ink-900")}>
        {v}
      </div>
    </div>
  );
}

/* ---------------- charts ---------------- */

function FourPL() {
  const W = 760;
  const H = 340;
  const pad = 50;
  const xs = Array.from({ length: 40 }, (_, i) => i / 39);

  const curves = [
    { c: "#2A58BE", label: "HCC827 (WT)", fn: (x: number) => 1 / (1 + Math.exp(10 * (x - 0.35))) },
    { c: "#5B3FB0", label: "PC-9 (WT)", fn: (x: number) => 1 / (1 + Math.exp(9 * (x - 0.38))) },
    { c: "#B4315F", label: "H1975 (T790M)", fn: (x: number) => 1 / (1 + Math.exp(6 * (x - 0.72))) },
    { c: "#B9740C", label: "H1975R (T790M/C797S)", fn: (x: number) => 1 / (1 + Math.exp(4 * (x - 0.82))) },
  ];

  const toX = (x: number) => pad + x * (W - pad * 2);
  const toY = (y: number) => H - pad - y * (H - pad * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} y1={toY(t)} x2={W - pad} y2={toY(t)} stroke="#EEEEE9" />
      ))}
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#B8B8AC" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#B8B8AC" />

      {curves.map((c) => {
        const pts = xs.map((x) => c.fn(x));
        const d = pts
          .map((y, i) => `${i === 0 ? "M" : "L"} ${toX(xs[i])} ${toY(y)}`)
          .join(" ");
        const hi = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${toX(xs[i])} ${toY(Math.min(1, y + 0.04))}`);
        const lo = xs.slice().reverse().map((x, i) => {
          const idx = xs.length - 1 - i;
          return `L ${toX(x)} ${toY(Math.max(0, pts[idx] - 0.04))}`;
        });
        return (
          <g key={c.label}>
            <path d={[...hi, ...lo, "Z"].join(" ")} fill={c.c} fillOpacity={0.08} />
            <path d={d} stroke={c.c} strokeWidth={2} fill="none" />
          </g>
        );
      })}

      {[0.001, 0.01, 0.1, 1, 10].map((t, i) => (
        <text
          key={i}
          x={toX(i / 4)}
          y={H - pad + 16}
          fontSize={10}
          fill="#8E8E80"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
        >
          {t}
        </text>
      ))}
      {[0, 0.5, 1].map((t) => (
        <text
          key={t}
          x={pad - 8}
          y={toY(t) + 3}
          fontSize={10}
          fill="#8E8E80"
          textAnchor="end"
          fontFamily="JetBrains Mono, monospace"
        >
          {t * 100}%
        </text>
      ))}
      {curves.map((c, i) => (
        <g key={c.label}>
          <rect x={W - pad - 180} y={pad + 6 + i * 16} width={10} height={10} fill={c.c} rx={2} />
          <text
            x={W - pad - 165}
            y={pad + 15 + i * 16}
            fontSize={10.5}
            fill="#34342E"
            fontFamily="JetBrains Mono, monospace"
          >
            {c.label}
          </text>
        </g>
      ))}

      <text
        x={W / 2}
        y={H - 8}
        fontSize={11}
        fill="#6B6B5E"
        textAnchor="middle"
        fontFamily="JetBrains Mono, monospace"
      >
        [osimertinib] (µM, log scale)
      </text>
      <text
        x={14}
        y={H / 2}
        fontSize={11}
        fill="#6B6B5E"
        textAnchor="middle"
        transform={`rotate(-90, 14, ${H / 2})`}
        fontFamily="JetBrains Mono, monospace"
      >
        Cell viability (fraction)
      </text>
    </svg>
  );
}

function BoxPlot() {
  const W = 760;
  const H = 300;
  const groups = ["WT", "T790M", "T790M+C797S"];
  const data = [
    { q1: 0.8, med: 0.9, q3: 0.95, min: 0.72, max: 0.98 },
    { q1: 0.35, med: 0.42, q3: 0.54, min: 0.22, max: 0.61 },
    { q1: 0.14, med: 0.22, q3: 0.3, min: 0.08, max: 0.36 },
  ];
  const pad = 50;
  const w = (W - pad * 2) / groups.length;
  const toY = (y: number) => H - pad - y * (H - pad * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#B8B8AC" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#B8B8AC" />
      {data.map((d, i) => {
        const cx = pad + w * (i + 0.5);
        const bw = w * 0.5;
        const color = ["#2A58BE", "#B4315F", "#B9740C"][i];
        return (
          <g key={i}>
            <line x1={cx} y1={toY(d.min)} x2={cx} y2={toY(d.max)} stroke="#6B6B5E" />
            <rect x={cx - bw / 2} y={toY(d.q3)} width={bw} height={toY(d.q1) - toY(d.q3)} fill={color} fillOpacity={0.14} stroke={color} />
            <line x1={cx - bw / 2} y1={toY(d.med)} x2={cx + bw / 2} y2={toY(d.med)} stroke={color} strokeWidth={2} />
            <text x={cx} y={H - pad + 18} fontSize={11} fill="#34342E" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {groups[i]}
            </text>
          </g>
        );
      })}
      {[0, 0.5, 1].map((t) => (
        <text key={t} x={pad - 8} y={toY(t) + 3} fontSize={10} fill="#8E8E80" textAnchor="end" fontFamily="JetBrains Mono, monospace">
          {(t * 100).toFixed(0)}%
        </text>
      ))}
    </svg>
  );
}

function Heatmap() {
  const rows = ["osi", "gef", "erl", "afatinib", "neratinib", "lap", "sel"];
  const cols = ["HCC827", "PC-9", "H1975", "H1975R", "H3255"];
  const W = 760;
  const H = 300;
  const pad = 80;
  const cw = (W - pad - 20) / cols.length;
  const rh = (H - pad - 20) / rows.length;
  const data = rows.map((_, r) =>
    cols.map((_, c) => {
      const v = (Math.sin(r * 1.3 + c * 0.8) + 1) / 2;
      return v;
    })
  );
  const color = (v: number) => `rgba(42, 88, 190, ${v.toFixed(2)})`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {rows.map((r, i) => (
        <text key={r} x={pad - 6} y={pad + rh * (i + 0.6)} fontSize={10.5} fill="#34342E" textAnchor="end" fontFamily="JetBrains Mono, monospace">
          {r}
        </text>
      ))}
      {cols.map((c, j) => (
        <text key={c} x={pad + cw * (j + 0.5)} y={pad - 6} fontSize={10.5} fill="#34342E" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
          {c}
        </text>
      ))}
      {data.map((row, r) =>
        row.map((v, c) => (
          <rect key={`${r}-${c}`} x={pad + cw * c} y={pad + rh * r} width={cw - 1} height={rh - 1} fill={color(v)} />
        ))
      )}
    </svg>
  );
}

function Scatter() {
  const W = 760;
  const H = 300;
  const pad = 50;
  const N = 60;
  const pts = Array.from({ length: N }, (_, i) => ({
    x: Math.random() * 0.8 + 0.1,
    y: Math.random() * 0.8 + 0.1,
    c: i % 3,
  }));
  const colors = ["#2A58BE", "#B4315F", "#12785A"];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#B8B8AC" />
      <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#B8B8AC" />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={pad + p.x * (W - pad * 2)}
          cy={H - pad - p.y * (H - pad * 2)}
          r={3.5}
          fill={colors[p.c]}
          fillOpacity={0.7}
        />
      ))}
    </svg>
  );
}
