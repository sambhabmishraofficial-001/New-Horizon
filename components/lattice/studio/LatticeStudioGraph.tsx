"use client";

import {
  LATTICE_GRAPH_EDGES,
  LATTICE_GRAPH_NODES,
  type GraphNode,
} from "@/lib/lattice-studio-model";

type GraphFilter = "all" | "repro" | "contradicted";

const EDGE_COLORS: Record<string, string> = {
  produces: "#64748b",
  replicates: "#059669",
  contradicts: "#dc2626",
  supersedes: "#2563eb",
};

export function LatticeStudioGraph({
  filter,
  onFilterChange,
  onSelectNode,
  selectedNodeId,
}: {
  filter: GraphFilter;
  onFilterChange: (f: GraphFilter) => void;
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId: string | null;
}) {
  const nodes = LATTICE_GRAPH_NODES.filter((n) => {
    if (filter === "repro") return (n.reproCount ?? 0) > 0;
    if (filter === "contradicted") return n.contradicted;
    return true;
  });

  const nodeIds = new Set(nodes.map((n) => n.id));
  const edges = LATTICE_GRAPH_EDGES.filter(
    (e) => nodeIds.has(e.from) && nodeIds.has(e.to)
  );

  const width = 720;
  const height = 420;

  return (
    <div className="lattice-studio__graph-wrap flex flex-col">
      <div className="lattice-studio__graph-toolbar">
        <span className="text-xs font-semibold text-[var(--ls-text)]">Project graph</span>
        {(["all", "repro", "contradicted"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className="lattice-studio__filter"
            data-active={filter === f}
            onClick={() => onFilterChange(f)}
          >
            {f === "all" ? "All nodes" : f === "repro" ? "REPRO'd" : "Contradicted"}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-[var(--ls-text-muted)]">
          Radial · Tree · Timeline · Phylogenetic
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto p-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto block w-full max-w-[820px]"
          role="img"
          aria-label="Experiment DAG"
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {edges.map((edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;
            const color = EDGE_COLORS[edge.kind] ?? "#64748b";
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <line
                  x1={from.x + 48}
                  y1={from.y + 24}
                  x2={to.x}
                  y2={to.y + 24}
                  stroke={color}
                  strokeWidth={1.5}
                  markerEnd="url(#arrow)"
                  opacity={0.7}
                />
                <text
                  x={(from.x + to.x) / 2 + 24}
                  y={(from.y + to.y) / 2 + 18}
                  fill={color}
                  fontSize="9"
                  fontFamily="var(--font-family-mono)"
                >
                  {edge.kind}
                </text>
              </g>
            );
          })}

          {nodes.map((node) => {
            const active = selectedNodeId === node.id;
            const fill =
              node.type === "claim"
                ? node.contradicted
                  ? "#fef2f2"
                  : "#eff6ff"
                : "#f8fafc";
            const stroke = node.contradicted
              ? "#dc2626"
              : active
                ? "#2563eb"
                : "#cbd5e1";

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => onSelectNode(node)}
              >
                <rect
                  width={96}
                  height={48}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={active ? 2 : 1}
                />
                <text
                  x={48}
                  y={20}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize="10"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                <text
                  x={48}
                  y={36}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="8"
                  fontFamily="var(--font-family-mono)"
                >
                  {node.hash}
                </text>
                {(node.reproCount ?? 0) > 0 && (
                  <text
                    x={88}
                    y={12}
                    fill="#059669"
                    fontSize="8"
                    fontWeight="600"
                  >
                    {node.reproCount}↻
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
