"use client";

import * as React from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  Button,
  Kbd,
  Dot,
  Divider,
} from "@/components/ui/Primitives";
import {
  Sparkles,
  FlaskConical,
  Database,
  Cpu,
  ShieldCheck,
  Telescope,
  Hash,
  GitBranch,
  Play,
  ChevronRight,
  Minus,
  Shapes,
  Flag,
  Square,
  MousePointer2,
  Hand,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Code2,
  Link2,
  Lock,
} from "lucide-react";
import { CanvasBoard } from "./CanvasBoard";
import {
  canvasUi,
  nodeKindStyle,
  darkenHex,
  type NodeKindKey,
} from "@/lib/canvasPalette";

/* Map research primitives → institute palette (muted) */
const PALETTE: { label: string; icon: React.ElementType; kind: NodeKindKey }[] = [
  { label: "Hypothesis", icon: Sparkles,     kind: "hypothesis" },
  { label: "Experiment", icon: FlaskConical, kind: "experiment" },
  { label: "Dataset",    icon: Database,     kind: "dataset" },
  { label: "Model",      icon: Cpu,          kind: "model" },
  { label: "Invariant",  icon: ShieldCheck,  kind: "invariant" },
  { label: "Anomaly",    icon: Telescope,    kind: "anomaly" },
  { label: "Claim",      icon: Shapes,       kind: "hypothesis" },
];

const OPERATORS = [
  { label: "Argue ⟶",      icon: ChevronRight },
  { label: "Falsify ⊥",    icon: Minus },
  { label: "Cite 💬",       icon: Hash },
  { label: "Route to twin", icon: Sparkles },
];

/* ═══════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════ */
export default function CanvasPage() {
  const [full, setFull] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && full) setFull(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  return (
    <div className={full ? "fixed inset-0 z-50 flex flex-col bg-white" : ""}>
      {!full && (
        <>
          <PageHeader
            eyebrow="Canvas · branch mg-sweep"
            title="The research graph"
            lede="Nodes are hypotheses, experiments, datasets, models, and invariants. Edges are arguments. Run a node, and the institute answers - with citations."
            right={
              <div className="flex items-center gap-2">
                <Button variant="outline">Share read-only</Button>
                <Button>
                  <Play className="h-3.5 w-3.5" /> Run subgraph
                </Button>
              </div>
            }
          >
            <div className="flex items-center gap-6 text-[12.5px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" /> mg-sweep
              </span>
              <span className="inline-flex items-center gap-1.5 text-beacon-700">
                <Dot tone="beacon" /> 3 twins co-authoring
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Invariants audited
              </span>
              <span>18 nodes · 24 edges</span>
            </div>
          </PageHeader>

          {/* Tab bar - ink (not Scratch purple) */}
          <div className="flex items-end px-6" style={{ background: canvasUi.tabBar }}>
            <ScratchTab label="Nodes" icon={Code2} active />
            <ScratchTab label="Edges" icon={Link2} />
            <ScratchTab label="Constraints" icon={Lock} />
          </div>
        </>
      )}

      {/* ── Three-panel layout ── */}
      <div className={full ? "flex flex-1 min-h-0" : "flex"} style={full ? undefined : { height: "calc(100vh - 260px)", minHeight: 520 }}>
        {/* ▌ Left: categories + block palette (Scratch style) */}
        {!full && (
        <aside className="flex shrink-0 border-r border-ink-900/10">
          {/* Thin category strip */}
          <div
            className="w-[62px] border-r border-ink-900/10 py-2 flex flex-col items-center gap-1 overflow-y-auto"
            style={{ background: canvasUi.categoryStrip }}
          >
            {PALETTE.map((p) => {
              const s = nodeKindStyle[p.kind];
              return (
                <button
                  key={p.label}
                  className="flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-md hover:bg-white/70 transition-colors w-full group"
                >
                  <span
                    className="h-[22px] w-[22px] rounded-md grid place-items-center ring-1 ring-black/[0.06] group-hover:ring-black/10 transition-all"
                    style={{ background: s.letterBg }}
                  >
                    <p.icon className="h-3 w-3 text-white opacity-95" />
                  </span>
                  <span className="text-[9px] font-semibold leading-tight" style={{ color: canvasUi.textMuted }}>
                    {p.label.slice(0, 6)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-[200px] overflow-y-auto py-3 px-2.5 space-y-1.5" style={{ background: canvasUi.paletteBg }}>
            {PALETTE.map((p) => (
              <PaletteBlock
                key={p.label}
                kind={p.kind}
                icon={p.icon}
                label={`add ${p.label.toLowerCase()}`}
              />
            ))}
            <div className="h-px bg-ink-900/8 my-3" />
            <div
              className="px-1 text-[9px] uppercase tracking-[0.2em] font-bold mb-2"
              style={{ color: canvasUi.textMuted }}
            >
              Operators
            </div>
            {OPERATORS.map((o) => (
              <PaletteBlock key={o.label} neutral icon={o.icon} label={o.label} />
            ))}
            <div className="h-px bg-ink-900/8 my-3" />
            <div
              className="rounded-lg border border-dashed border-ink-900/12 bg-parchment-50/80 p-2.5 text-[11px] leading-snug text-ink-600"
            >
              Drag a block onto the canvas.
              <br />
              Connect edges with <Kbd>⇧</Kbd> <Kbd>drag</Kbd>.
            </div>
          </div>
        </aside>
        )}

        {/* ▌ Centre: canvas */}
        <section className="flex-1 min-w-0 relative">
          <CanvasToolbar full={full} onToggleFull={() => setFull((v) => !v)} />
          <CanvasBoard />
          <CanvasLegend />
        </section>

        {/* ▌ Right: inspector (sprite pane) */}
        {!full && (
        <aside className="w-[290px] shrink-0 border-l border-ink-900/10 flex flex-col bg-white overflow-hidden">
          {/* Selected-node header - ink, not day-glo blue */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-ink-900/8 bg-ink-800">
            <div className="h-10 w-10 rounded-xl bg-ink-950/30 ring-1 ring-white/10 grid place-items-center">
              <Sparkles className="h-4.5 w-4.5 text-parchment-100" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9px] uppercase tracking-[0.2em] text-ink-300 font-bold">Selected · Hypothesis</div>
              <div className="text-[14px] text-parchment-50 font-display font-semibold truncate leading-tight mt-0.5">
                H-214 · Mg²⁺ bends k_obs
              </div>
            </div>
          </div>

          {/* Sprite-pane style property row */}
          <div className="grid grid-cols-3 gap-px bg-ink-900/8 border-b border-ink-900/8">
            <PropCell label="Info gain" value="0.42 bits" />
            <PropCell label="Edges" value="4 in / 2 out" />
            <PropCell label="Status" value="pre-reg ✓" />
          </div>

          {/* Fields */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            <Field label="Claim">
              Mg²⁺ concentration bends cleavage rate non-linearly via a secondary binding site near loop-3.
            </Field>
            <Field label="Falsifier">
              A 7-arm Mg²⁺ sweep on WT + loop-3 K7A that does <em>not</em> separate in log-log space.
            </Field>
            <Field label="Twins arguing">
              <div className="flex items-center gap-1.5 mt-1.5">
                <TwinDot mono="HA" kind="hypothesis" />
                <TwinDot mono="K" kind="model" />
                <TwinDot mono="D" kind="experiment" />
                <TwinDot mono="Q" kind="invariant" />
              </div>
            </Field>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <InfoPill kind="hypothesis">expected info gain · 0.42 bits</InfoPill>
              <InfoPill kind="dataset">pre-registered</InfoPill>
            </div>
          </div>

          {/* Action buttons */}
          <div
            className="border-t border-ink-900/8 px-3 py-2.5 flex items-center justify-between"
            style={{ background: canvasUi.inspectorActions }}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-[7px] rounded-full border border-ink-900/12 bg-white text-[11px] font-semibold text-ink-600 hover:bg-ink-50 transition-colors"
            >
              <Telescope className="h-3.5 w-3.5" /> Trace invariants
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-[7px] rounded-full text-[11px] font-semibold text-white bg-beacon-600 shadow-pane hover:bg-beacon-600/95 transition-colors"
            >
              Run this node <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <Divider />

          {/* Symbolic layer */}
          <div className="px-4 py-3" style={{ background: canvasUi.symbolBg }}>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold mb-1.5 text-ink-500">Symbolic layer</div>
            <div className="text-[11.5px] text-ink-700 mb-2.5">Constraints bound to this subgraph</div>
            <div className="space-y-2 font-mono text-[10.5px]">
              <SymLine kw="invariant" code="I-01 : ∀t. E(t+1) ≤ E(t) + ε" tone="invariant" />
              <SymLine kw="anomaly_if" code="σ(replicates) > 0.12" tone="anomaly" />
              <SymLine kw="require" code="rationale ≥ 1 ∀ step" tone="hypothesis" />
            </div>
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════ */

const LEGEND_KINDS: { kind: NodeKindKey; label: string }[] = [
  { kind: "hypothesis", label: "Hypothesis" },
  { kind: "experiment", label: "Experiment" },
  { kind: "dataset", label: "Dataset" },
  { kind: "model", label: "Model" },
  { kind: "invariant", label: "Invariant" },
  { kind: "anomaly", label: "Anomaly" },
];

/* ── Tab ── */
function ScratchTab({ label, icon: Icon, active }: { label: string; icon: React.ElementType; active?: boolean }) {
  return (
    <button
      type="button"
      className={`relative flex items-center gap-1.5 px-5 py-2 text-[12.5px] font-semibold transition-colors ${
        active
          ? "text-ink-800 rounded-t-lg -mb-px z-10"
          : "text-white/65 hover:text-white/90"
      }`}
      style={active ? { background: canvasUi.tabActive } : { background: "transparent" }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ── Canvas toolbar - monochrome tools, soft run/stop tints */
function CanvasToolbar({ full, onToggleFull }: { full: boolean; onToggleFull: () => void }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 h-11"
      style={{ background: canvasUi.toolbar, borderBottom: "1px solid rgba(17,17,16,0.08)" }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-8 w-8 rounded-lg bg-white border border-ink-900/10 grid place-items-center hover:bg-ink-50 transition-colors"
          title="Run"
        >
          <Flag className="h-4 w-4 text-emerald-700" />
        </button>
        <button
          type="button"
          className="h-8 w-8 rounded-lg bg-white border border-ink-900/10 grid place-items-center hover:bg-ink-50 transition-colors"
          title="Stop"
        >
          <Square className="h-3.5 w-3.5 fill-rose-700" style={{ color: "#9A2850" }} />
        </button>
        <div className="w-px h-6 bg-ink-900/10 mx-1.5" />
        <ToolBtn active>
          <MousePointer2 className="h-3.5 w-3.5" />
        </ToolBtn>
        <ToolBtn>
          <Hand className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>
      <div className="flex items-center gap-1.5">
        <ToolBtn>
          <ZoomOut className="h-3.5 w-3.5" />
        </ToolBtn>
        <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-white border border-ink-900/10 text-ink-600">
          100 %
        </span>
        <ToolBtn>
          <ZoomIn className="h-3.5 w-3.5" />
        </ToolBtn>
        <div className="w-px h-6 bg-ink-900/10 mx-1" />
        <ToolBtn onClick={onToggleFull}>
          {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </ToolBtn>
        <ToolBtn>
          <RotateCcw className="h-3.5 w-3.5" />
        </ToolBtn>
      </div>
    </div>
  );
}

const BEACON = "#2A58BE";

function ToolBtn({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 w-8 rounded-lg grid place-items-center transition-all ${
        active
          ? "text-white shadow-sm"
          : "bg-white text-ink-600 border border-ink-900/10 hover:bg-ink-50"
      }`}
      style={active ? { background: BEACON, boxShadow: `0 1px 0 ${darkenHex(BEACON, 0.2)}` } : undefined}
    >
      {children}
    </button>
  );
}

/* ── Legend ── */
function CanvasLegend() {
  return (
    <div className="absolute bottom-3 left-3 z-10 rounded-full bg-parchment-50/95 backdrop-blur-sm shadow-lift border border-ink-900/8 px-3 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-semibold text-ink-600 max-w-[min(100%,42rem)]">
      {LEGEND_KINDS.map(({ kind, label }) => (
        <span key={kind} className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm ring-1 ring-black/[0.08]"
            style={{ background: nodeKindStyle[kind].accent }}
          />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ── Palette block: light card, ink text (not bright Scratch blocks) ── */
function PaletteBlock({
  kind,
  neutral,
  icon: Icon,
  label,
}: {
  kind?: NodeKindKey;
  neutral?: boolean;
  icon: React.ElementType;
  label: string;
}) {
  if (neutral) {
    return (
      <button
        type="button"
        className="w-full flex items-center gap-2 rounded-lg pl-3 pr-2 py-2 text-[11.5px] font-semibold text-left border border-ink-900/10 bg-ink-50/80 text-ink-700 shadow-pane hover:bg-ink-100/80 transition-colors"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" />
        {label}
      </button>
    );
  }
  const s = nodeKindStyle[kind!];
  return (
    <button
      type="button"
      className="w-full flex items-center gap-2 rounded-lg pl-2.5 pr-2 py-2 text-[11.5px] font-semibold text-left border border-black/[0.08] transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
      style={{
        background: s.fill,
        color: s.ink,
        boxShadow: `0 1px 0 ${darkenHex(s.shadow, 0.08)}`,
        borderColor: `${s.accent}35`,
      }}
    >
      <span
        className="h-7 w-7 rounded-md grid place-items-center shrink-0"
        style={{ background: s.letterBg, color: "#fff" }}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      {label}
    </button>
  );
}

/* ── Inspector helpers ── */
function PropCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-3 py-2 text-center">
      <div className="text-[9px] uppercase tracking-[0.15em] font-semibold text-ink-500">{label}</div>
      <div className="text-[12px] font-bold text-ink-900 mt-0.5 truncate">{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-[0.18em] font-bold mb-0.5 text-ink-500">{label}</div>
      <div className="text-[12.5px] text-ink-800 leading-relaxed">{children}</div>
    </div>
  );
}

function TwinDot({ mono, kind }: { mono: string; kind: NodeKindKey }) {
  const s = nodeKindStyle[kind];
  return (
    <div
      className="h-7 w-7 rounded-lg text-white grid place-items-center text-[10px] font-bold ring-1 ring-white/80"
      style={{ background: s.letterBg, boxShadow: `0 1px 0 ${darkenHex(s.letterBg, 0.15)}` }}
    >
      {mono}
    </div>
  );
}

function InfoPill({ kind, children }: { kind: NodeKindKey; children: React.ReactNode }) {
  const s = nodeKindStyle[kind];
  return (
    <span
      className="inline-flex items-center text-[10.5px] font-semibold px-2.5 py-1 rounded-full border"
      style={{
        background: s.fill,
        color: s.ink,
        borderColor: `${s.accent}40`,
      }}
    >
      {children}
    </span>
  );
}

function SymLine({ kw, code, tone }: { kw: string; code: string; tone: NodeKindKey }) {
  const s = nodeKindStyle[tone];
  return (
    <div className="flex items-start gap-2 leading-relaxed">
      <Hash className="h-3 w-3 mt-0.5 shrink-0 text-ink-400" />
      <div>
        <span className="font-semibold" style={{ color: s.accent }}>
          {kw}
        </span>{" "}
        <span className="text-ink-800">{code}</span>
      </div>
    </div>
  );
}
