"use client";

import * as React from "react";
import {
  Check,
  AlertTriangle,
  GitBranch,
  Quote,
  TrendingUp,
  Sparkles,
  FileCode2,
  Eye,
  History,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell, SectionLabel } from "./DocChrome";
import type { HypothesisRecord } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

function crumbsForHypothesis(h: HypothesisRecord): string[] {
  const seg = h.path.split("/").filter(Boolean);
  const leaf = `${h.id}.hyp`;
  if (seg.length < 2) return [leaf];
  const parents = seg.slice(0, -1).slice(-2);
  return [...parents, leaf];
}

function buildPosteriorSeries(h: HypothesisRecord): { label: string; v: number }[] {
  const steps: { label: string; v: number }[] = [{ label: "prior", v: h.prior }];
  let v = h.prior;
  if (h.evidence.papers > 0) {
    v = clamp(v + 0.03 * Math.min(h.evidence.papers, 6));
    steps.push({ label: "+ literature", v });
  }
  if (h.evidence.experiments > 0) {
    v = clamp(v + 0.05 * Math.min(h.evidence.experiments, 5));
    steps.push({ label: "+ experiments", v });
  }
  if (h.evidence.datasets > 0) {
    v = clamp(v + 0.04 * Math.min(h.evidence.datasets, 5));
    steps.push({ label: "+ datasets", v });
  }
  steps.push({ label: "posterior", v: h.posterior });
  if (steps.length < 2) steps.push({ label: "posterior", v: h.posterior });
  return steps;
}

export function HypothesisDocV2({ path }: { path: string }) {
  const [view, setView] = React.useState<"rendered" | "source">("rendered");
  const { hypotheses } = useWorkspaceBundle();
  const h = hypotheses.find((x) => x.path === path) ?? hypotheses[0];
  const posteriorSeries = React.useMemo(() => buildPosteriorSeries(h), [h]);
  const isScaffold = h.path.startsWith("/sci/");

  return (
    <DocShell
      crumbs={crumbsForHypothesis(h)}
      right={
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10.5px] font-mono px-1.5 rounded-sm",
              h.status === "active" && "text-beacon-700",
              h.status === "testing" && "text-amber-700",
              h.status === "draft" && "text-ink-500",
              h.status === "refuted" && "text-rose-700"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                h.status === "active" && "bg-beacon-500",
                h.status === "testing" && "bg-amber-500",
                h.status === "draft" && "bg-ink-400",
                h.status === "refuted" && "bg-rose-500"
              )}
            />
            {h.status}
          </span>
          <ViewToggle view={view} set={setView} />
        </div>
      }
    >
      {view === "rendered" ? (
        <Rendered h={h} series={posteriorSeries} isScaffold={isScaffold} />
      ) : (
        <Source h={h} />
      )}
    </DocShell>
  );
}

function Rendered({
  h,
  series,
  isScaffold,
}: {
  h: HypothesisRecord;
  series: { label: string; v: number }[];
  isScaffold: boolean;
}) {
  return (
    <article className="px-10 py-10 max-w-[880px]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-medium">
        {h.id} · {h.project}
      </div>
      <h1 className="font-display text-[32px] leading-[1.15] text-ink-900 mt-3">
        {h.title}
      </h1>

      <div className="mt-7 grid grid-cols-3 gap-10">
        <ConfidenceBlock h={h} />
        <EvidenceBlock h={h} />
        <GenealogyBlock h={h} />
      </div>

      <section className="mt-10">
        <SectionLabel>Bayesian history</SectionLabel>
        <div className="mt-3 rounded-md border border-ink-900/8 bg-parchment-50 p-4">
          <PosteriorChart series={series} />
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Arguments for</SectionLabel>
        <ul className="mt-3 space-y-2.5">
          {isScaffold ? (
            <>
              <ArgFor>
                <b>Evidence ledger</b> - Citations, datasets, and experiment outcomes attached here become
                structured arguments instead of static prose.
              </ArgFor>
              <ArgFor>
                <b>Domain language</b> - State quantities, units, regimes, and populations using terminology native
                to your field so reviewers map claims to observations cleanly.
              </ArgFor>
              <ArgFor>
                <b>Positive controls</b> - Record which manipulations should increase signal if the mechanism class
                holds; pin instrument settings and batch IDs.
              </ArgFor>
            </>
          ) : (
            <>
              <ArgFor>
                <b>Smith &apos;24</b> - T790M induces a 2.1 Å conformational shift that
                favors ATP binding over osimertinib. [Cryo-EM, MD]
              </ArgFor>
              <ArgFor>
                <b>TCGA LUAD (DS-003)</b> - T790M enriched in post-osimertinib
                cohort (n = 567; p &lt; 10⁻⁶).
              </ArgFor>
              <ArgFor>
                <b>EXP-001 (IC50)</b> - 12.3-fold shift in IC50 across 4 cell lines
                (p &lt; 0.001).
              </ArgFor>
            </>
          )}
        </ul>
      </section>

      <section className="mt-10">
        <SectionLabel>Arguments against · contradictions flagged</SectionLabel>
        <ul className="mt-3 space-y-2.5">
          {isScaffold ? (
            <>
              <ArgAgainst>
                <b>No contradictions indexed yet</b> - Import conflicting findings or mark internal outliers so the
                ledger stays balanced.
              </ArgAgainst>
              <ArgAgainst>
                <b>Scope checks</b> - Document conditions where the claim should fail fast (wrong organism, regime,
                or measurement modality).
              </ArgAgainst>
            </>
          ) : (
            <>
              <ArgAgainst>
                <b>Tran &apos;24</b> - T790M frequency falls below 30% in ≥3rd-line
                samples; MET amplification rises. Challenges primacy in late-stage.
              </ArgAgainst>
              <ArgAgainst>
                <b>Internal lot 70c</b> - outlier assay behavior; under
                investigation by Aletheia.
              </ArgAgainst>
            </>
          )}
        </ul>
      </section>

      <section className="mt-10">
        <SectionLabel>Falsifier</SectionLabel>
        <div className="mt-2 rounded-md border border-ink-900/8 bg-parchment-50 p-4 text-[13.5px] text-ink-800 leading-relaxed">
          {isScaffold ? (
            <>
              Write one observable prediction that should move in a defined direction if the hypothesis class is
              correct, with explicit tolerances and negative controls. Tie it to an experiment ID and analysis
              registry entry before collecting data.
            </>
          ) : (
            <>
              Time-course western blot (0, 2, 6, 24 h) under osimertinib in WT vs
              T790M cell lines. If pEGFR dynamics do not diverge within 24 h at
              clinically achievable drug concentrations (100 nM), H-001 is
              refuted. Expected information gain:{" "}
              <b>0.38 bits</b>. (EXP-002, running.)
            </>
          )}
        </div>
      </section>

      {h.agentNote && (
        <section className="mt-10">
          <SectionLabel>Agent note · Hypothesis agent</SectionLabel>
          <div className="mt-2 rounded-md border border-beacon-500/20 bg-beacon-50 px-4 py-3 text-[13px] text-beacon-900 leading-relaxed">
            <Sparkles className="inline h-3.5 w-3.5 mr-1 -mt-0.5 text-beacon-600" />
            {h.agentNote}
          </div>
        </section>
      )}
    </article>
  );
}

function ConfidenceBlock({ h }: { h: HypothesisRecord }) {
  const deltaPct = Math.round((h.posterior - h.prior) * 100);
  return (
    <div>
      <SectionLabel>Confidence</SectionLabel>
      <div className="mt-2 flex items-baseline gap-2 font-mono">
        <span className="text-[28px] text-ink-900 font-medium tabular-nums">
          {Math.round(h.confidence * 100)}%
        </span>
        {deltaPct !== 0 ? (
          <span className="text-[11.5px] text-beacon-700 inline-flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            {deltaPct > 0 ? "+" : ""}
            {deltaPct}% vs prior
          </span>
        ) : (
          <span className="text-[11.5px] text-ink-400">aligned with prior</span>
        )}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-ink-900/8 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            h.status === "refuted" ? "bg-rose-500" : "bg-beacon-500"
          )}
          style={{ width: `${h.confidence * 100}%` }}
        />
      </div>
      <div className="mt-1 text-[10.5px] text-ink-400 font-mono">
        prior {Math.round(h.prior * 100)}% → posterior{" "}
        {Math.round(h.posterior * 100)}%
      </div>
    </div>
  );
}

function EvidenceBlock({ h }: { h: HypothesisRecord }) {
  return (
    <div>
      <SectionLabel>Evidence</SectionLabel>
      <dl className="mt-2 space-y-1 text-[13px] font-mono text-ink-700">
        <Row k="papers" v={h.evidence.papers} tone="emerald" />
        <Row k="experiments" v={h.evidence.experiments} tone="beacon" />
        <Row k="datasets" v={h.evidence.datasets} tone="beacon" />
        <Row k="contradictions" v={h.contradictions} tone={h.contradictions > 0 ? "rose" : "ink"} />
      </dl>
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: number; tone: "beacon" | "rose" | "emerald" | "ink" }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-ink-500">{k}</span>
      <span
        className={cn(
          "tabular-nums",
          tone === "rose" && v > 0 && "text-rose-700",
          tone === "beacon" && "text-beacon-700",
          tone === "emerald" && "text-emerald-700"
        )}
      >
        {v}
      </span>
    </div>
  );
}

function GenealogyBlock({ h }: { h: HypothesisRecord }) {
  return (
    <div>
      <SectionLabel>Genealogy</SectionLabel>
      <div className="mt-2 text-[12.5px] text-ink-700 font-mono leading-relaxed">
        {h.parent && (
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-ink-400" />
            parent · <span className="text-beacon-700">{h.parent}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <GitBranch className="h-3 w-3 text-ink-400" />
          {h.id}{" "}
          <span className="text-[10.5px] text-ink-400">this hypothesis</span>
        </div>
        {h.children?.map((c) => (
          <div key={c} className="flex items-center gap-1.5 pl-4">
            <GitBranch className="h-3 w-3 text-ink-400" /> child ·{" "}
            <span className="text-beacon-700">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArgFor({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[13.5px] text-ink-800 leading-relaxed">
      <Check className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
function ArgAgainst({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[13.5px] text-ink-800 leading-relaxed">
      <AlertTriangle className="h-4 w-4 text-rose-600 mt-1 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function PosteriorChart({
  series,
}: {
  series: { label: string; v: number }[];
}) {
  const W = 640;
  const H = 120;
  const pad = 24;
  const step = (W - pad * 2) / (series.length - 1);
  const pts = series.map((s, i) => [pad + i * step, H - pad - s.v * (H - pad * 2)] as const);
  const d = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line
          x1={pad}
          y1={H - pad}
          x2={W - pad}
          y2={H - pad}
          stroke="#E5E5DE"
          strokeWidth={1}
        />
        <path d={d} fill="none" stroke="#2A58BE" strokeWidth={1.75} />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={3} fill="#fff" stroke="#2A58BE" strokeWidth={1.5} />
          </g>
        ))}
      </svg>
      <div
        className="grid gap-2 mt-1 text-[10.5px] font-mono text-ink-500"
        style={{ gridTemplateColumns: `repeat(${series.length}, minmax(0, 1fr))` }}
      >
        {series.map((s) => (
          <div key={s.label} className="text-center truncate">
            {s.label}
            <div className="text-ink-800 tabular-nums">{Math.round(s.v * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  set,
}: {
  view: "rendered" | "source";
  set: (v: "rendered" | "source") => void;
}) {
  return (
    <div className="flex items-center rounded border border-ink-900/10 bg-white overflow-hidden">
      <button
        onClick={() => set("source")}
        className={cn(
          "h-5 px-2 text-[10.5px] inline-flex items-center gap-1 font-mono",
          view === "source" ? "bg-ink-900 text-parchment-50" : "text-ink-600"
        )}
      >
        <FileCode2 className="h-2.5 w-2.5" /> source
      </button>
      <button
        onClick={() => set("rendered")}
        className={cn(
          "h-5 px-2 text-[10.5px] inline-flex items-center gap-1 font-mono",
          view === "rendered" ? "bg-ink-900 text-parchment-50" : "text-ink-600"
        )}
      >
        <Eye className="h-2.5 w-2.5" /> document
      </button>
    </div>
  );
}

function Source({ h }: { h: HypothesisRecord }) {
  const lines: React.ReactNode[] = [
    <span key="c1" className="text-ink-400"># {h.id} · {h.project}</span>,
    <span key="c2" className="text-ink-400"># bayesian posterior updated automatically as evidence arrives</span>,
    "",
    <><span className="text-beacon-700">hypothesis</span><span>:</span></>,
    <>{"  "}<span className="text-beacon-700">id</span>: <span className="text-amber-800">"{h.id}"</span></>,
    <>{"  "}<span className="text-beacon-700">status</span>: <span className="text-amber-800">"{h.status}"</span></>,
    <>{"  "}<span className="text-beacon-700">confidence</span>: <span className="text-violet-700">{h.confidence.toFixed(2)}</span></>,
    <>{"  "}<span className="text-beacon-700">prior</span>: <span className="text-violet-700">{h.prior.toFixed(2)}</span></>,
    <>{"  "}<span className="text-beacon-700">posterior</span>: <span className="text-violet-700">{h.posterior.toFixed(2)}</span></>,
    "",
    <>{"  "}<span className="text-beacon-700">claim</span>: <span>|</span></>,
    <>{"    "}{h.title}</>,
    "",
    <>{"  "}<span className="text-beacon-700">evidence</span>:</>,
    <>{"    "}<span className="text-beacon-700">papers</span>: <span className="text-violet-700">{h.evidence.papers}</span></>,
    <>{"    "}<span className="text-beacon-700">experiments</span>: <span className="text-violet-700">{h.evidence.experiments}</span></>,
    <>{"    "}<span className="text-beacon-700">datasets</span>: <span className="text-violet-700">{h.evidence.datasets}</span></>,
    <>{"    "}<span className="text-beacon-700">contradictions</span>: <span className="text-violet-700">{h.contradictions}</span></>,
    "",
    <>{"  "}<span className="text-beacon-700">parent</span>: <span className="text-emerald-700">{h.parent ?? "null"}</span></>,
    <>{"  "}<span className="text-beacon-700">children</span>: [{(h.children ?? []).map((c, i) => <span key={i}>{i > 0 && ", "}<span className="text-emerald-700">{c}</span></span>)}]</>,
    "",
    <>{"  "}<span className="text-beacon-700">linked</span>: [{h.linked.map((c, i) => <span key={i}>{i > 0 && ", "}<span className="text-emerald-700">{c}</span></span>)}]</>,
  ];
  return (
    <pre className="font-mono text-[12.5px] leading-[1.8] text-ink-800 px-4 py-4">
      {lines.map((l, i) => (
        <div key={i} className="flex">
          <span className="w-10 pr-3 text-right text-[11px] text-ink-300 tabular-nums select-none">
            {i + 1}
          </span>
          <span className="flex-1">{l}</span>
        </div>
      ))}
    </pre>
  );
}
