"use client";

import * as React from "react";
import { Network, Sparkles, Filter } from "lucide-react";
import { DocShell, SectionLabel } from "./DocChrome";

type KGNode = { id: string; label: string; type: "gene" | "drug" | "disease" | "pathway" | "paper" | "hyp"; x: number; y: number; size?: number };
type KGEdge = { a: string; b: string; label?: string };

const COLORS = {
  gene: "#12785A",
  drug: "#B9740C",
  disease: "#B4315F",
  pathway: "#5B3FB0",
  paper: "#34342E",
  hyp: "#2A58BE",
};

const K_NODES: KGNode[] = [
  { id: "egfr", label: "EGFR", type: "gene", x: 480, y: 300, size: 22 },
  { id: "t790m", label: "T790M", type: "gene", x: 290, y: 240, size: 14 },
  { id: "c797s", label: "C797S", type: "gene", x: 220, y: 360, size: 12 },
  { id: "osi", label: "Osimertinib", type: "drug", x: 320, y: 140, size: 16 },
  { id: "gef", label: "Gefitinib", type: "drug", x: 180, y: 120, size: 10 },
  { id: "tram", label: "Trametinib", type: "drug", x: 660, y: 140, size: 12 },
  { id: "mek", label: "MEK", type: "gene", x: 680, y: 280, size: 14 },
  { id: "mapk", label: "MAPK pathway", type: "pathway", x: 620, y: 420, size: 14 },
  { id: "pi3k", label: "PI3K", type: "gene", x: 820, y: 340, size: 12 },
  { id: "her3", label: "HER3", type: "gene", x: 780, y: 460, size: 10 },
  { id: "met", label: "MET", type: "gene", x: 140, y: 440, size: 12 },
  { id: "nsclc", label: "NSCLC", type: "disease", x: 440, y: 480, size: 16 },
  { id: "flaura2", label: "FLAURA2 trial", type: "paper", x: 560, y: 60, size: 10 },
  { id: "smith", label: "Smith '24", type: "paper", x: 200, y: 60, size: 10 },
  { id: "janne", label: "Jänne '26", type: "paper", x: 60, y: 260, size: 10 },
  { id: "h001", label: "H-001", type: "hyp", x: 360, y: 440, size: 12 },
  { id: "h002", label: "H-002", type: "hyp", x: 560, y: 380, size: 12 },
];

const K_EDGES: KGEdge[] = [
  { a: "egfr", b: "t790m" }, { a: "egfr", b: "c797s" }, { a: "egfr", b: "osi", label: "inhibits" },
  { a: "egfr", b: "gef", label: "inhibits" }, { a: "t790m", b: "osi", label: "resistance" },
  { a: "egfr", b: "mek" }, { a: "mek", b: "tram", label: "inhibits" }, { a: "mek", b: "mapk" },
  { a: "egfr", b: "mapk" }, { a: "egfr", b: "pi3k" }, { a: "pi3k", b: "her3" },
  { a: "egfr", b: "nsclc", label: "driver" }, { a: "met", b: "egfr", label: "bypass" },
  { a: "osi", b: "flaura2" }, { a: "smith", b: "t790m" }, { a: "janne", b: "c797s" },
  { a: "h001", b: "t790m" }, { a: "h001", b: "osi" }, { a: "h002", b: "tram" }, { a: "h002", b: "mek" },
];

const KW = 960;
const KH = 600;

export function KnowledgeGraphDoc() {
  const [view, setView] = React.useState<"2d" | "list">("2d");
  const [selected, setSelected] = React.useState<string | null>("egfr");
  const byId = React.useMemo(() => Object.fromEntries(K_NODES.map((n) => [n.id, n])), []);
  const node = selected ? byId[selected] : null;

  return (
    <DocShell
      crumbs={["egfr", "knowledge-graph", "egfr-pathway.graph"]}
      right={
        <div className="flex items-center gap-1">
          <div className="inline-flex items-center rounded border border-ink-900/10 overflow-hidden">
            {(["2d", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={
                  view === v
                    ? "h-5 px-2 text-[10.5px] font-mono bg-ink-900 text-parchment-50"
                    : "h-5 px-2 text-[10.5px] font-mono text-ink-600 bg-white"
                }
              >
                {v}
              </button>
            ))}
          </div>
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 inline-flex items-center gap-1">
            <Filter className="h-2.5 w-2.5" /> filters
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] min-h-full">
        <div className="bg-parchment-50 p-6 min-w-0">
          {view === "2d" ? (
            <svg
              viewBox={`0 0 ${KW} ${KH}`}
              className="w-full h-auto rounded-md border border-ink-900/8 bg-white"
            >
              <defs>
                <pattern id="kg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(17,17,16,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={KW} height={KH} fill="url(#kg-grid)" />

              {K_EDGES.map((e, i) => {
                const a = byId[e.a];
                const b = byId[e.b];
                if (!a || !b) return null;
                const hl = selected && (selected === e.a || selected === e.b);
                return (
                  <g key={i}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={hl ? "#2A58BE" : "#D9D9D1"}
                      strokeWidth={hl ? 1.5 : 1}
                      opacity={hl ? 0.9 : 0.6}
                    />
                  </g>
                );
              })}

              {K_NODES.map((n) => {
                const c = COLORS[n.type];
                const r = n.size ?? 10;
                const hl = selected === n.id;
                return (
                  <g
                    key={n.id}
                    onClick={() => setSelected(n.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={r + (hl ? 4 : 0)}
                      fill={c}
                      fillOpacity={0.14}
                      stroke={c}
                      strokeWidth={hl ? 2 : 1.25}
                    />
                    <text
                      x={n.x}
                      y={n.y + r + 14}
                      fontSize={10.5}
                      fill="#1F1F1B"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            <div className="rounded-md border border-ink-900/8 bg-white font-mono text-[12px] divide-y divide-ink-900/6">
              {K_NODES.map((n) => (
                <div key={n.id} className="px-3 h-8 flex items-center gap-3">
                  <span className="w-20 text-ink-500">{n.type}</span>
                  <span className="w-28 text-ink-900">{n.id}</span>
                  <span className="flex-1 text-ink-700">{n.label}</span>
                  <span className="text-ink-400">
                    {K_EDGES.filter((e) => e.a === n.id || e.b === n.id).length} edges
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-[10.5px] font-mono text-ink-500">
            {Object.entries(COLORS).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: v }} /> {k}
              </span>
            ))}
            <span className="ml-auto">847 nodes · 2 341 edges · 12 clusters</span>
          </div>
        </div>

        <aside className="border-l border-ink-900/8 bg-parchment-50 p-5 space-y-5">
          <div>
            <SectionLabel>Node</SectionLabel>
            <div className="mt-2 rounded-md border border-ink-900/10 bg-white px-3 py-2">
              <div className="font-mono text-[13px] text-ink-900">
                {node?.label ?? "—"}
              </div>
              <div className="text-[11px] text-ink-500 mt-0.5 font-mono">
                {node?.type ?? "—"} · {selected}
              </div>
            </div>
          </div>
          <div>
            <SectionLabel>Neighbors</SectionLabel>
            <ul className="mt-2 space-y-1 text-[11.5px] font-mono text-ink-700">
              {selected &&
                K_EDGES.filter((e) => e.a === selected || e.b === selected)
                  .slice(0, 12)
                  .map((e, i) => {
                    const other = e.a === selected ? e.b : e.a;
                    const n = byId[other];
                    return (
                      <li key={i} className="flex items-baseline gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ background: COLORS[n?.type as keyof typeof COLORS] }}
                        />
                        <span className="text-ink-900 w-28 truncate">{other}</span>
                        <span className="text-ink-500 truncate">{n?.label}</span>
                      </li>
                    );
                  })}
            </ul>
          </div>
          <div>
            <SectionLabel>Cypher-like query</SectionLabel>
            <div className="mt-2 rounded border border-ink-900/10 bg-white px-2 py-1.5 text-[11px] font-mono text-ink-800">
              MATCH (p:Protein)-[*1..2]-(:{"{"}id:'{selected}'{"}"})
            </div>
          </div>
          <div>
            <SectionLabel>Agent · gap detection</SectionLabel>
            <div className="mt-2 rounded-md border border-violet-500/15 bg-violet-50 px-3 py-2.5 text-[11.5px] text-violet-900 leading-relaxed">
              <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
              HER3 has no edges to your hypotheses. 6 candidate papers found.
              Propose new hypothesis or import papers.
            </div>
          </div>
        </aside>
      </div>
    </DocShell>
  );
}
