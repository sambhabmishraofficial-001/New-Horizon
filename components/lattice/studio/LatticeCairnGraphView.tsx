"use client";

import * as React from "react";
import { LATTICE_CAIRN_DATA, type LatticeGraphNode } from "@/lib/lattice-cairn-data";

const EDGE_STROKE: Record<string, string> = {
  produces: "#cbd5e1",
  repro: "#2563eb",
  contradicts: "#dc2626",
  forks: "#7c3aed",
  supersedes: "#2563eb",
  cites: "#9ca3af",
};

const EDGE_MARKER: Record<string, string> = {
  repro: "url(#arr-repro)",
  contradicts: "url(#arr-contradict)",
  forks: "url(#arr-fork)",
};

export function LatticeCairnGraphView({
  onOpenStudio,
}: {
  onOpenStudio: () => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>("c-001");
  const { nodes, edges } = LATTICE_CAIRN_DATA.graph;
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const selected = nodes.find((n) => n.id === selectedId);

  return (
    <div className="graph-shell">
      <aside className="col-pane">
        <div className="col-head">
          <h3>Filters</h3>
          <button type="button" className="btn ghost sm" title="Save view">
            ★
          </button>
        </div>
        <div className="col-body" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Scope
          </div>
          <input
            readOnly
            value="vision-scaling/*"
            style={{
              width: "100%",
              background: "var(--bg-2)",
              border: "1px solid var(--bd-2)",
              padding: "7px 10px",
              borderRadius: 6,
              color: "var(--tx-0)",
              fontFamily: "var(--f-mono)",
              fontSize: 12.5,
            }}
          />
          <div className="eyebrow" style={{ margin: "18px 0 8px" }}>
            REPRO threshold
          </div>
          <div className="dim" style={{ fontSize: 13 }}>
            Show claims with ≥ 3 independent REPROs
          </div>
        </div>
      </aside>

      <div className="graph-canvas">
        <div className="graph-toolbar">
          <button type="button" className="active">
            Canvas
          </button>
          <button type="button">Radial</button>
          <button type="button">Timeline</button>
          <button type="button">Phylogenetic</button>
        </div>
        <svg viewBox="0 0 1240 820" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
            </marker>
            <marker id="arr-repro" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
            </marker>
            <marker id="arr-contradict" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
            <marker id="arr-fork" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c3aed" />
            </marker>
          </defs>
          {edges.map((e) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            const stroke = EDGE_STROKE[e.type] ?? "#3a3a48";
            const dash = e.type === "cites" || e.type === "supersedes" ? "4 5" : undefined;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const ctrl = `${mx - dy * 0.12} ${my + dx * 0.12}`;
            return (
              <path
                key={`${e.from}-${e.to}`}
                d={`M ${a.x} ${a.y} Q ${ctrl} ${b.x} ${b.y}`}
                stroke={stroke}
                strokeWidth={e.type === "produces" ? 1 : 1.5}
                fill="none"
                strokeDasharray={dash}
                opacity={0.7}
                markerEnd={EDGE_MARKER[e.type] ?? "url(#arr)"}
              />
            );
          })}
          {nodes.map((n) => (
            <GraphNodeShape key={n.id} node={n} onSelect={() => setSelectedId(n.id)} />
          ))}
        </svg>
        <div className="graph-legend">
          <div className="l-row">
            <span className="l-shape" style={{ background: "#2563eb", transform: "rotate(45deg)" }} />
            CLAIM
          </div>
          <div className="l-row">
            <span className="l-shape" style={{ background: "#7aa9f5", borderRadius: 2 }} />
            RUN
          </div>
          <div className="l-row">
            <span className="l-shape" style={{ background: "#2563eb", borderRadius: "50%" }} />
            REPRO
          </div>
        </div>
      </div>

      <aside className="node-detail-pane">
        {selected ? (
          <>
            <div className="ndp-head">
              <div className="eyebrow">{selected.type.toUpperCase()}</div>
              <div className="ndp-title">{selected.label}</div>
              <div className="ndp-cid mono">cid: {selected.cid}</div>
            </div>
            <div className="ndp-body">
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Signatures
                </div>
                <div className="row wrap" style={{ gap: 6 }}>
                  <span className="agree-badge agree">3 REPRO</span>
                  <span className="agree-badge partial">1 partial</span>
                  <span className="agree-badge contradict">0 contradict</span>
                </div>
              </div>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  Lineage
                </div>
                <div className="dim" style={{ fontSize: 13 }}>
                  2 parents · 3 children · 4 forks · 12 cites
                </div>
              </div>
              <div className="divider" />
              <button type="button" className="btn primary sm" onClick={onOpenStudio}>
                Open in Studio
              </button>
              <button type="button" className="btn sm" style={{ marginTop: 8 }}>
                Re-run as REPRO →
              </button>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}

function GraphNodeShape({
  node,
  onSelect,
}: {
  node: LatticeGraphNode;
  onSelect: () => void;
}) {
  const { type, size, color, x, y, label, cid } = node;

  return (
    <g transform={`translate(${x} ${y})`} style={{ cursor: "pointer" }} onClick={onSelect}>
      {type === "claim" && (
        <path
          d={`M 0 ${-size} L ${size} 0 L 0 ${size} L ${-size} 0 z`}
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
      )}
      {type === "run" && (
        <rect
          x={-size}
          y={-size}
          width={size * 2}
          height={size * 2}
          rx={4}
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
      )}
      {type === "repro" && (
        <>
          <circle r={size} fill={color} stroke="#ffffff" strokeWidth="2" />
          <path
            d="M -4 0 L -1 3 L 4 -2"
            stroke="#ffffff"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "fork" && (
        <path
          d={`M 0 ${-size} L ${size} ${size * 0.7} L ${-size} ${size * 0.7} z`}
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
      )}
      {type !== "repro" ? (
        <>
          <text y={size + 18} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fill="#374151">
            {label}
          </text>
          <text y={size + 32} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#9ca3af">
            {cid}
          </text>
        </>
      ) : (
        <text y={size + 14} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fill="#6b7280">
          {label}
        </text>
      )}
    </g>
  );
}
