"use client";

import * as React from "react";
import { Plus, Sparkles, ZoomIn, ZoomOut, Move } from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell, SectionLabel } from "./DocChrome";

type MapNode = {
  id: string;
  label: string;
  type: "obs" | "hyp" | "exp" | "conclusion";
  x: number;
  y: number;
  tone: "ink" | "beacon" | "amber" | "emerald" | "rose";
};
type MapEdge = { a: string; b: string; label?: string; kind?: "refines" | "competes" | "supports" | "refutes" };

const NODES: MapNode[] = [
  { id: "obs1", label: "EGFR T790M emerges in 50%+ resistant tumors", type: "obs", x: 380, y: 60, tone: "ink" },
  { id: "h001", label: "H-001 · competitive inhibition", type: "hyp", x: 200, y: 200, tone: "beacon" },
  { id: "h002", label: "H-002 · combo Rx rescues", type: "hyp", x: 560, y: 200, tone: "amber" },
  { id: "h003", label: "H-003 · allosteric bypass", type: "hyp", x: 780, y: 260, tone: "ink" },
  { id: "h004", label: "H-004 · C797S co-mutation", type: "hyp", x: 40, y: 300, tone: "rose" },
  { id: "e001", label: "EXP-001 IC50 ✓", type: "exp", x: 140, y: 350, tone: "emerald" },
  { id: "e002", label: "EXP-002 WB ⟳", type: "exp", x: 260, y: 370, tone: "beacon" },
  { id: "e003", label: "EXP-003 xenograft ⟳", type: "exp", x: 560, y: 360, tone: "beacon" },
  { id: "c1", label: "partial support", type: "conclusion", x: 200, y: 500, tone: "beacon" },
  { id: "c2", label: "pending", type: "conclusion", x: 560, y: 500, tone: "amber" },
];

const EDGES: MapEdge[] = [
  { a: "obs1", b: "h001", kind: "supports" },
  { a: "obs1", b: "h002", kind: "supports" },
  { a: "obs1", b: "h003", kind: "supports" },
  { a: "obs1", b: "h004", kind: "refutes" },
  { a: "h001", b: "h002", kind: "competes" },
  { a: "h001", b: "h003", kind: "competes" },
  { a: "h001", b: "h004", kind: "refines" },
  { a: "h001", b: "e001", kind: "supports" },
  { a: "h001", b: "e002", kind: "supports" },
  { a: "h002", b: "e003", kind: "supports" },
  { a: "e001", b: "c1" },
  { a: "e002", b: "c1" },
  { a: "e003", b: "c2" },
];

const W = 960;
const H = 620;

export function HypothesisMapDoc() {
  const byId = React.useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const [selected, setSelected] = React.useState<string | null>("h001");
  const selectedNode = selected ? byId[selected] : null;

  return (
    <DocShell
      crumbs={["egfr", "hypotheses", "egfr-hypothesis-map.hmap"]}
      right={
        <div className="flex items-center gap-1">
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5">
            <Plus className="h-2.5 w-2.5 inline" /> node
          </button>
          <button className="h-5 px-2 text-[10.5px] font-mono rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 inline-flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> fill gaps
          </button>
          <div className="inline-flex items-center gap-0.5 rounded border border-ink-900/10 bg-white">
            <button className="h-5 w-5 grid place-items-center text-ink-600">
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="text-[10.5px] font-mono text-ink-500 px-1">80%</span>
            <button className="h-5 w-5 grid place-items-center text-ink-600">
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] min-h-full">
        <div className="bg-parchment-50 p-6 min-w-0">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto rounded-md border border-ink-900/8 bg-white"
          >
            <defs>
              <pattern id="hm-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(17,17,16,0.04)" strokeWidth="1" />
              </pattern>
              <marker id="arrow-supports" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2A58BE" />
              </marker>
              <marker id="arrow-refutes" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#B4315F" />
              </marker>
              <marker id="arrow-refines" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#B9740C" />
              </marker>
              <marker id="arrow-competes" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#5B3FB0" />
              </marker>
            </defs>
            <rect width={W} height={H} fill="url(#hm-grid)" />

            {EDGES.map((e, i) => {
              const a = byId[e.a];
              const b = byId[e.b];
              if (!a || !b) return null;
              const stroke =
                e.kind === "refutes"
                  ? "#B4315F"
                  : e.kind === "refines"
                  ? "#B9740C"
                  : e.kind === "competes"
                  ? "#5B3FB0"
                  : "#2A58BE";
              const marker =
                e.kind === "refutes"
                  ? "url(#arrow-refutes)"
                  : e.kind === "refines"
                  ? "url(#arrow-refines)"
                  : e.kind === "competes"
                  ? "url(#arrow-competes)"
                  : "url(#arrow-supports)";
              const dasharray = e.kind === "competes" ? "4 4" : undefined;
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              return (
                <g key={i}>
                  <line
                    x1={a.x}
                    y1={a.y + 14}
                    x2={b.x}
                    y2={b.y - 14}
                    stroke={stroke}
                    strokeWidth={1.5}
                    strokeDasharray={dasharray}
                    markerEnd={marker}
                    opacity={0.75}
                  />
                  {e.kind && (
                    <text
                      x={mx}
                      y={my - 4}
                      fontSize={9.5}
                      fill={stroke}
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                      opacity={0.8}
                    >
                      {e.kind}
                    </text>
                  )}
                </g>
              );
            })}

            {NODES.map((n) => {
              const isSelected = selected === n.id;
              const shape =
                n.type === "obs"
                  ? "#F5F2EA"
                  : n.type === "hyp"
                  ? "#EEF5FF"
                  : n.type === "exp"
                  ? "#EAF7F1"
                  : "#F1EDFB";
              const border =
                n.tone === "beacon"
                  ? "#2A58BE"
                  : n.tone === "amber"
                  ? "#B9740C"
                  : n.tone === "rose"
                  ? "#B4315F"
                  : n.tone === "emerald"
                  ? "#12785A"
                  : "#34342E";
              const maxW = 200;
              return (
                <g
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={n.x - maxW / 2}
                    y={n.y - 16}
                    width={maxW}
                    height={32}
                    rx={6}
                    fill={shape}
                    stroke={border}
                    strokeWidth={isSelected ? 2 : 1.25}
                  />
                  <text
                    x={n.x}
                    y={n.y + 4}
                    fontSize={11}
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
          <div className="mt-3 flex items-center gap-4 text-[10.5px] font-mono text-ink-500">
            <Legend color="#2A58BE" label="supports" />
            <Legend color="#B4315F" label="refutes" />
            <Legend color="#B9740C" label="refines" />
            <Legend color="#5B3FB0" label="competes" dashed />
            <span className="ml-auto inline-flex items-center gap-1">
              <Move className="h-3 w-3" /> click to select · drag to reposition
            </span>
          </div>
        </div>

        <aside className="border-l border-ink-900/8 bg-parchment-50 p-5 space-y-6">
          <div>
            <SectionLabel>Selection</SectionLabel>
            <div className="mt-2 rounded-md border border-ink-900/10 bg-white px-3 py-2">
              <div className="font-mono text-[12.5px] text-ink-900">
                {selectedNode ? selectedNode.id : "none"}
              </div>
              <div className="text-[11.5px] text-ink-500 mt-0.5">
                {selectedNode ? selectedNode.label : "click a node"}
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Connections</SectionLabel>
            <ul className="mt-2 space-y-1.5 text-[11.5px] font-mono text-ink-700">
              {selected &&
                EDGES.filter((e) => e.a === selected || e.b === selected).map((e, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span className="text-ink-400 w-14">{e.kind ?? "link"}</span>
                    <span>
                      {e.a === selected ? e.b : e.a}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <SectionLabel>Agent · fill gaps</SectionLabel>
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50/50 px-3 py-2.5 text-[11.5px] text-ink-800 leading-relaxed">
              The map has no edges from HER3 signaling to your resistance
              hypotheses. Shall I propose <b>H-005</b> and draft a falsifier?
              <button className="mt-1 block text-amber-700 hover:underline">
                Propose H-005 →
              </button>
            </div>
          </div>
        </aside>
      </div>
    </DocShell>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg width={18} height={6}>
        <line
          x1={0}
          y1={3}
          x2={18}
          y2={3}
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashed ? "3 3" : undefined}
        />
      </svg>
      {label}
    </span>
  );
}
