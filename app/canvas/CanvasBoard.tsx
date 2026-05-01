"use client";

import * as React from "react";
import {
  nodeKindStyle,
  statusStyle,
  edgeStroke,
  type NodeKindKey,
  type StatusKind,
} from "@/lib/canvasPalette";

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */
type GNode = {
  id: string;
  kind: NodeKindKey;
  title: string;
  sub?: string;
  x: number;
  y: number;
  status?: StatusKind;
};

type GEdge = {
  from: string;
  to: string;
  label?: string;
  kind?: "argue" | "falsify" | "feed" | "audit";
};

/* ═══════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════ */
const NODES: GNode[] = [
  { id: "H214",  kind: "hypothesis", title: "H-214",         sub: "Mg²⁺ bends k_obs non-linearly",   x: 60,  y: 80,  status: "passing"  },
  { id: "H214a", kind: "hypothesis", title: "H-214.1",       sub: "Secondary site near loop-3",       x: 310, y: 50,  status: "passing"  },
  { id: "H214b", kind: "hypothesis", title: "H-214.2",       sub: "Cofactor artifact at 8 mM",        x: 310, y: 200, status: "pending"  },
  { id: "E7",    kind: "experiment", title: "7-arm sweep",    sub: "Mg²⁺ 0.5–16 mM · N=5",            x: 560, y: 50,  status: "running"  },
  { id: "E8",    kind: "experiment", title: "EDTA titration", sub: "at Mg²⁺ = 5 mM",                  x: 560, y: 200, status: "pending"  },
  { id: "D1",    kind: "dataset",    title: "Kinetics-71a",   sub: "raw · 2.4 k traces",               x: 560, y: 350, status: "passing"  },
  { id: "M1",    kind: "model",      title: "ProtFold-δ",     sub: "finetune k11 · ε-12",              x: 810, y: 120, status: "running"  },
  { id: "I1",    kind: "invariant",  title: "I-01",           sub: "Energy monotonic",                 x: 60,  y: 300, status: "passing"  },
  { id: "I3",    kind: "invariant",  title: "I-03",           sub: "σ(replicates) < 0.12",             x: 310, y: 370, status: "failing"  },
  { id: "A1",    kind: "anomaly",    title: "Anomaly 71a",    sub: "σ = 0.19 in arm 4",                x: 810, y: 300, status: "awaiting" },
];

const EDGES: GEdge[] = [
  { from: "H214",  to: "H214a", label: "refines",     kind: "argue"   },
  { from: "H214",  to: "H214b", label: "alternative",  kind: "argue"   },
  { from: "H214a", to: "E7",    label: "tests",        kind: "argue"   },
  { from: "H214b", to: "E8",    label: "tests",        kind: "argue"   },
  { from: "E7",    to: "D1",    label: "emits",        kind: "feed"    },
  { from: "E8",    to: "D1",    label: "emits",        kind: "feed"    },
  { from: "D1",    to: "M1",    label: "trains",       kind: "feed"    },
  { from: "I1",    to: "H214",  label: "audits",       kind: "audit"   },
  { from: "I3",    to: "E7",    label: "audits",       kind: "audit"   },
  { from: "D1",    to: "A1",    label: "triggers",     kind: "falsify" },
  { from: "M1",    to: "H214a", label: "supports",     kind: "argue"   },
];

const KIND_LETTER: Record<NodeKindKey, string> = {
  hypothesis: "H",
  experiment: "E",
  dataset: "D",
  model: "M",
  invariant: "I",
  anomaly: "A",
};

const NODE_W = 195;
const NOTCH_LEFT = 14;
const NOTCH_W = 16;
const NOTCH_H = 4;

/* ═══════════════════════════════════════════════════════
   SVG block-path (Scratch shape)
   ═══════════════════════════════════════════════════════ */
function blockPath(w: number, h: number): string {
  const r = 5;
  const nL = NOTCH_LEFT;
  const nR = nL + NOTCH_W;
  const nD = NOTCH_H;
  return [
    `M ${r},0`,
    `H ${nL}`, `v ${nD}`, `h ${NOTCH_W}`, `v ${-nD}`,
    `H ${w - r}`,
    `a ${r},${r} 0 0 1 ${r},${r}`,
    `V ${h - r}`,
    `a ${r},${r} 0 0 1 ${-r},${r}`,
    `H ${nR}`, `v ${nD}`, `h ${-NOTCH_W}`, `v ${-nD}`,
    `H ${r}`,
    `a ${r},${r} 0 0 1 ${-r},${-r}`,
    `V ${r}`,
    `a ${r},${r} 0 0 1 ${r},${-r}`,
    `Z`,
  ].join(" ");
}

/* ═══════════════════════════════════════════════════════
   Board
   ═══════════════════════════════════════════════════════ */
export function CanvasBoard() {
  const [nodes, setNodes] = React.useState<GNode[]>(NODES);
  const [selected, setSelected] = React.useState<string | null>("H214");
  const [drag, setDrag] = React.useState<{ id: string; dx: number; dy: number } | null>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const onDown = (e: React.MouseEvent, id: string) => {
    const t = nodes.find((n) => n.id === id)!;
    const rc = ref.current!.getBoundingClientRect();
    setDrag({ id, dx: e.clientX - rc.left - t.x, dy: e.clientY - rc.top - t.y });
    setSelected(id);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!drag) return;
    const rc = ref.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(rc.width - NODE_W, e.clientX - rc.left - drag.dx));
    const y = Math.max(44, Math.min(rc.height - 90, e.clientY - rc.top - drag.dy));
    setNodes((p) => p.map((n) => (n.id === drag.id ? { ...n, x, y } : n)));
  };

  const onUp = () => setDrag(null);

  const mkColors = [edgeStroke.default, edgeStroke.falsify, edgeStroke.audit] as const;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      className="absolute inset-0 overflow-hidden select-none"
      style={{
        background: "#FBFAF6",
        backgroundImage:
          "linear-gradient(to right, rgba(17,17,16,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,16,0.06) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          {mkColors.map((c, i) => (
            <marker key={i} id={`a-${i}`} viewBox="0 -5 10 10" refX="9" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,-4.5L10,0L0,4.5" fill={c} />
            </marker>
          ))}
        </defs>
        {EDGES.map((e, i) => {
          const a = nodes.find((n) => n.id === e.from)!;
          const b = nodes.find((n) => n.id === e.to)!;
          if (!a || !b) return null;

          const blockH = 76;
          const ax = a.x + NODE_W;
          const ay = a.y + blockH / 2;
          const bx = b.x;
          const by = b.y + blockH / 2;
          const mx = (ax + bx) / 2;

          const stroke =
            e.kind === "falsify" ? edgeStroke.falsify : e.kind === "audit" ? edgeStroke.audit : edgeStroke.default;
          const marker = e.kind === "falsify" ? "url(#a-1)" : e.kind === "audit" ? "url(#a-2)" : "url(#a-0)";
          const dash = e.kind === "audit" ? "6 4" : e.kind === "falsify" ? "4 4" : "0";

          return (
            <g key={i}>
              <path
                d={`M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`}
                fill="none"
                stroke={stroke}
                strokeWidth={2}
                strokeDasharray={dash}
                markerEnd={marker}
                opacity={0.65}
              />
              {e.label && (
                <text
                  x={(ax + bx) / 2}
                  y={(ay + by) / 2 - 9}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#6B6B5E"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((n) => {
        const k = nodeKindStyle[n.kind];
        const sel = selected === n.id;
        const svgH = 76;
        const innerH = svgH - NOTCH_H;
        const path = blockPath(NODE_W, innerH);

        return (
          <div
            key={n.id}
            onMouseDown={(ev) => onDown(ev, n.id)}
            className={`absolute ${drag?.id === n.id ? "cursor-grabbing" : "cursor-grab"}`}
            style={{
              left: n.x,
              top: n.y,
              width: NODE_W,
              zIndex: sel ? 20 : 2,
              filter: sel ? `drop-shadow(0 0 0 1px ${k.accent}) drop-shadow(0 4px 12px rgba(17,17,16,0.12))` : undefined,
            }}
          >
            <svg width={NODE_W} height={svgH + NOTCH_H} viewBox={`0 0 ${NODE_W} ${svgH + NOTCH_H}`} className="block">
              <g transform={`translate(0, ${NOTCH_H + 2})`}>
                <path d={path} fill={k.shadow} opacity={0.85} />
              </g>
              <g transform={`translate(0, ${NOTCH_H})`}>
                <path
                  d={path}
                  fill={k.fill}
                  stroke={k.accent}
                  strokeWidth={1}
                  strokeOpacity={0.35}
                />
              </g>
              {sel && (
                <g transform={`translate(0, ${NOTCH_H})`}>
                  <path d={path} fill="none" stroke={k.accent} strokeWidth={2} opacity={0.55} />
                </g>
              )}
            </svg>

            <div
              className="absolute inset-0 flex flex-col justify-center"
              style={{ paddingTop: NOTCH_H + 4, paddingBottom: NOTCH_H + 6, paddingLeft: 10, paddingRight: 8 }}
            >
              <div className="flex items-center gap-[6px]">
                <span
                  className="h-[20px] w-[20px] rounded-[4px] grid place-items-center text-[10px] font-extrabold font-mono text-white shrink-0"
                  style={{ background: k.letterBg }}
                >
                  {KIND_LETTER[n.kind]}
                </span>
                <span className="text-[12px] font-bold truncate leading-none" style={{ color: k.ink }}>
                  {n.title}
                </span>
                {n.status && <StatusChip status={n.status} />}
              </div>
              {n.sub && (
                <div
                  className="mt-[5px] rounded-[5px] px-2 py-[3px] text-[10.5px] font-semibold leading-snug truncate"
                  style={{ background: "rgba(17,17,16,0.06)", color: k.ink, opacity: 0.92 }}
                >
                  {n.sub}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="absolute inset-0 pointer-events-none opacity-[0.12]" style={{ zIndex: 30 }}>
        <div
          className="absolute left-0 right-0 h-20 animate-scan"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(42, 88, 190, 0.07), transparent)",
          }}
        />
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: StatusKind }) {
  const s = statusStyle[status];
  return (
    <span
      className="ml-auto shrink-0 text-[8.5px] font-extrabold font-mono px-[6px] py-[2px] rounded-full leading-none border border-black/[0.06]"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
