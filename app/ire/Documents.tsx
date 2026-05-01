"use client";

import * as React from "react";
import {
  Play,
  GitBranch,
  FileCode2,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Check,
  Quote,
  CornerDownLeft,
  Paperclip,
  BookOpen,
  FlaskConical,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/cn";

/* =====================================================================
   Syntax-highlighted source viewer — fake-YAML feel, hand-tokenised.
   ===================================================================== */

export function Source({ lines, className }: { lines: SourceLine[]; className?: string }) {
  return (
    <pre
      className={cn(
        "font-mono text-[12.5px] leading-[1.8] text-ink-800 overflow-x-auto",
        className
      )}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start hover:bg-ink-900/[0.02] group",
            line.highlight && "bg-amber-50/60"
          )}
        >
          <span className="shrink-0 w-10 pr-3 text-right text-[11px] text-ink-300 select-none tabular-nums">
            {i + 1}
          </span>
          <span className="flex-1 pr-6 whitespace-pre">{line.content}</span>
        </div>
      ))}
    </pre>
  );
}

export type SourceLine = { content: React.ReactNode; highlight?: boolean };

export const tok = {
  key: (s: string) => <span className="text-beacon-700">{s}</span>,
  str: (s: string) => <span className="text-amber-800">{s}</span>,
  num: (s: string) => <span className="text-violet-700">{s}</span>,
  cmt: (s: string) => <span className="text-ink-400">{s}</span>,
  ref: (s: string) => <span className="text-emerald-700">{s}</span>,
  op: (s: string) => <span className="text-ink-500">{s}</span>,
  strong: (s: string) => <span className="text-ink-900 font-medium">{s}</span>,
  hl: (s: string) => (
    <span className="bg-beacon-50 border-b border-beacon-500 text-beacon-900">{s}</span>
  ),
};

/* =====================================================================
   Tab bar common chrome
   ===================================================================== */

export function EditorBreadcrumbs({
  crumbs,
  right,
}: {
  crumbs: string[];
  right?: React.ReactNode;
}) {
  return (
    <div className="h-7 shrink-0 px-4 flex items-center justify-between border-b border-ink-900/8 bg-white text-[11.5px] text-ink-500 font-mono">
      <div className="flex items-center gap-1.5 truncate">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-ink-300">▸</span>}
            <span className={i === crumbs.length - 1 ? "text-ink-800" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div>{right}</div>
    </div>
  );
}

/* =====================================================================
   Hypothesis document
   ===================================================================== */

export function HypothesisDoc() {
  const [view, setView] = React.useState<"rendered" | "source">("source");
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs
        crumbs={["k11", "hypotheses", "H-214.1.hyp"]}
        right={
          <div className="flex items-center gap-1">
            <ViewToggle view={view} set={setView} />
          </div>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        {view === "source" ? <HypothesisSource /> : <HypothesisRendered />}
      </div>
    </div>
  );
}

function HypothesisSource() {
  const lines: SourceLine[] = [
    { content: <>{tok.cmt("# H-214.1 · refines H-214")}</> },
    { content: <>{tok.cmt("# Authored by Halo-A · argued with Kepler · audited by Quorum")}</> },
    { content: "" },
    {
      content: (
        <>
          {tok.key("hypothesis")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"  "}
          {tok.key("id")}
          {tok.op(":")} {tok.str("H-214.1")}
        </>
      ),
    },
    {
      content: (
        <>
          {"  "}
          {tok.key("parent")}
          {tok.op(":")} {tok.ref("H-214")}
        </>
      ),
    },
    {
      content: (
        <>
          {"  "}
          {tok.key("status")}
          {tok.op(":")} {tok.str("refining")}
          {"   "}
          {tok.cmt("# running · E-7 arm 4/7")}
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("claim")}
          {tok.op(": |")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}Mg²⁺ concentration bends {tok.strong("k_obs")} non-linearly via a
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}secondary binding site near {tok.strong("loop-3")} of the wild-type
        </>
      ),
    },
    {
      content: <>{"    "}ribozyme.</>,
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("falsifier")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}
          {tok.key("description")}
          {tok.op(": |")}
        </>
      ),
    },
    {
      content: (
        <>
          {"      "}A 7-arm Mg²⁺ sweep on {tok.strong("WT")} +{" "}
          {tok.strong("loop-3 K7A")} that does
        </>
      ),
    },
    {
      content: (
        <>
          {"      "}not separate in log-log space at {tok.hl("[Mg²⁺] > 6 mM")}.
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}
          {tok.key("expected_info_gain_bits")}
          {tok.op(":")} {tok.num("0.42")}
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("arguments")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}
          {tok.key("for")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"      - "}
          {tok.key("cite")}
          {tok.op(":")} {tok.ref("okonkwo-2024")}
        </>
      ),
    },
    {
      content: (
        <>
          {"        "}
          {tok.key("note")}
          {tok.op(":")} {tok.str("Mg²⁺ saturation admits residual curvature")}
        </>
      ),
    },
    {
      content: (
        <>
          {"      - "}
          {tok.key("tool")}
          {tok.op(":")} {tok.ref("kepler-e12")}
        </>
      ),
    },
    {
      content: (
        <>
          {"        "}
          {tok.key("note")}
          {tok.op(":")}{" "}
          {tok.str("16 loop-3 mutants · 11 abolish non-linearity in silico")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    "}
          {tok.key("against")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"      - "}
          {tok.key("cite")}
          {tok.op(":")} {tok.ref("zhang-2025")}
        </>
      ),
    },
    {
      content: (
        <>
          {"        "}
          {tok.key("note")}
          {tok.op(":")} {tok.str("Non-linearity explained by cofactor alone")}
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("experiments")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    - "}
          {tok.ref("E-7")} {tok.cmt("# 7-arm Mg²⁺ sweep · Dovetail · pre-registered")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    - "}
          {tok.ref("E-8")} {tok.cmt("# EDTA titration at 5 mM · running")}
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("invariants")}
          {tok.op(":")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    - "}
          {tok.ref("I-01")} {tok.cmt("# energy monotonic · holding")}
        </>
      ),
    },
    {
      content: (
        <>
          {"    - "}
          {tok.ref("I-03")} {tok.cmt("# σ(replicates) < 0.12 · breaking (arm 4)")}
        </>
      ),
      highlight: true,
    },
    {
      content: (
        <>
          {"    - "}
          {tok.ref("I-04")} {tok.cmt("# kepler ECE ≤ 0.03 · holding")}
        </>
      ),
    },
    { content: "" },
    {
      content: (
        <>
          {"  "}
          {tok.key("twins")}
          {tok.op(":")} {tok.op("[")}
          {tok.ref("halo-a")}
          {tok.op(",")} {tok.ref("kepler")}
          {tok.op(",")} {tok.ref("dovetail")}
          {tok.op(",")} {tok.ref("quorum")}
          {tok.op("]")}
        </>
      ),
    },
  ];
  return <Source lines={lines} className="px-2 py-4" />;
}

function HypothesisRendered() {
  return (
    <article className="px-10 py-10 max-w-[72ch]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-medium">
        H-214.1 · refines H-214 · K11 mg-sweep
      </div>
      <h1 className="font-display text-[34px] leading-[1.1] text-ink-900 mt-3">
        Mg²⁺ bends k_obs non-linearly via a secondary site near loop-3.
      </h1>

      <DocSection label="Falsifier">
        A 7-arm Mg²⁺ sweep on WT + loop-3 K7A that does <em>not</em> separate in
        log-log space at <code className="font-mono text-[0.9em]">[Mg²⁺] &gt; 6 mM</code>.
        Expected information gain: <b>0.42 bits</b>.
      </DocSection>

      <DocSection label="Arguments for">
        <ul className="space-y-2">
          <li className="flex gap-3"><Check className="h-4 w-4 text-emerald-600 mt-1 shrink-0" /><span><b>Okonkwo '24</b> — Mg²⁺ saturation admits residual curvature.</span></li>
          <li className="flex gap-3"><Check className="h-4 w-4 text-emerald-600 mt-1 shrink-0" /><span><b>Kepler ε-12</b> — 16 loop-3 mutants; 11 abolish the non-linearity in silico.</span></li>
        </ul>
      </DocSection>

      <DocSection label="Arguments against">
        <ul className="space-y-2">
          <li className="flex gap-3"><AlertTriangle className="h-4 w-4 text-rose-600 mt-1 shrink-0" /><span><b>Zhang '25</b> — Non-linearity explained by cofactor alone.</span></li>
          <li className="flex gap-3"><AlertTriangle className="h-4 w-4 text-rose-600 mt-1 shrink-0" /><span><b>Tran '24</b> — No structural evidence for loop-3 pocket.</span></li>
        </ul>
      </DocSection>
    </article>
  );
}

function DocSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-400 font-medium mb-2">
        {label}
      </div>
      <div className="text-[14.5px] text-ink-800 leading-relaxed">{children}</div>
    </section>
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
        <Eye className="h-2.5 w-2.5" /> preview
      </button>
    </div>
  );
}

/* =====================================================================
   Invariant document
   ===================================================================== */

export function InvariantDoc() {
  const lines: SourceLine[] = [
    { content: <>{tok.cmt("# I-03 · Replicate variance band")}</> },
    { content: <>{tok.cmt("# Authored by Quorum · audited across 23 runs")}</> },
    { content: "" },
    { content: <>{tok.key("invariant")}{tok.op(":")}</> },
    { content: <>{"  "}{tok.key("id")}{tok.op(":")} {tok.str("I-03")}</> },
    { content: <>{"  "}{tok.key("status")}{tok.op(":")} {tok.str("breaking")}  {tok.cmt("# 21 / 23 runs hold")}</> },
    { content: <>{"  "}{tok.key("scope")}{tok.op(":")} {tok.op("[")}{tok.ref("k11")}{tok.op(",")} {tok.ref("k07")}{tok.op("]")}</> },
    { content: "" },
    { content: <>{"  "}{tok.key("check")}{tok.op(": |")}</> },
    { content: <>{"    "}{tok.strong("∀")} run {tok.strong("∈")} runs.</> },
    { content: <>{"      "}{tok.strong("σ")}(replicates(run)) {tok.strong("<")} {tok.num("0.12")}</> },
    { content: "" },
    { content: <>{"  "}{tok.key("violations")}{tok.op(":")}</> },
    { content: <>{"    - "}{tok.key("run")}{tok.op(":")} {tok.ref("run-71a")}  {tok.cmt("# arm 4 · σ = 0.19")}</>, highlight: true },
    { content: "" },
    { content: <>{tok.cmt("# TRIGGERS")}</> },
    { content: <>{tok.cmt("#   on_break: notify(aletheia) && pause(promotions)")}</> },
  ];
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs crumbs={["k11", "invariants", "I-03.inv"]} />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Source lines={lines} className="px-2 py-4" />
      </div>
    </div>
  );
}

/* =====================================================================
   Run document
   ===================================================================== */

export function RunDoc() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs
        crumbs={["k11", "runs", "run-71a.run"]}
        right={
          <div className="inline-flex items-center gap-1 text-amber-700">
            <AlertTriangle className="h-3 w-3" /> 1 anomaly
          </div>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="font-mono text-[12.5px] leading-relaxed">
          <div className="flex items-center gap-2 text-ink-500">
            <span>run-71a</span>
            <span className="text-ink-300">·</span>
            <span>Dovetail 7-arm Mg²⁺ sweep</span>
            <span className="text-ink-300">·</span>
            <span>N=5 per arm</span>
          </div>
          <div className="mt-1 text-[11.5px] text-ink-400">
            started 2h 14m ago · seed 7c3 · lot 71a
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const anomaly = n === 4;
            return (
              <div
                key={n}
                className={cn(
                  "rounded-md border p-3 font-mono",
                  anomaly
                    ? "border-rose-200 bg-rose-50/60"
                    : "border-ink-900/10 bg-parchment-50"
                )}
              >
                <div className="text-[10.5px] text-ink-500">arm {n}</div>
                <div className="text-[13px] text-ink-900 mt-0.5">
                  {[0.5, 1, 2, 4, 8, 12, 16][n - 1]} mM
                </div>
                <div className="mt-2 text-[10.5px] text-ink-500">σ</div>
                <div className={cn("text-[12px] tabular-nums", anomaly ? "text-rose-700" : "text-ink-800")}>
                  {["0.08", "0.09", "0.10", "0.19", "0.11", "0.10", "0.09"][n - 1]}
                </div>
                <div className="mt-2 text-[10.5px] text-ink-500">k_obs</div>
                <div className="text-[12px] tabular-nums text-ink-800">
                  {["0.41", "0.54", "0.68", "0.72", "0.81", "0.86", "0.88"][n - 1]}
                </div>
                {anomaly && (
                  <div className="mt-2 text-[10px] text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="h-2.5 w-2.5" /> I-03 broken
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <h3 className="mt-8 font-display text-[17px] text-ink-900">
          Anomaly · arm 4 · 8 mM
        </h3>
        <div className="mt-2 font-mono text-[12px] text-ink-700 bg-parchment-50 border border-ink-900/8 rounded-md p-3 leading-relaxed">
          <div><span className="text-ink-400">[aletheia]</span> σ(replicates) = 0.19 &gt; band 0.12</div>
          <div><span className="text-ink-400">[aletheia]</span> cone of explanations:</div>
          <div className="pl-4">
            <div>• latent cofactor at 8 mM <span className="text-violet-700">(p=0.46)</span></div>
            <div>• pipetting artifact on lot 71a <span className="text-violet-700">(p=0.19)</span></div>
            <div>• buffer age <span className="text-violet-700">(p=0.28)</span>  ↳ supports <span className="text-emerald-700">I-07 (candidate)</span></div>
          </div>
          <div><span className="text-ink-400">[dovetail]</span> rebuttal drafted: arm 8 · EDTA titration at 5 mM</div>
          <div><span className="text-ink-400">[quorum]</span> pre-registered. invariants I-01…I-04 audited per arm.</div>
          <div className="caret"><span className="text-ink-400">[you]</span> </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Twin chat document
   ===================================================================== */

export function TwinDoc() {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs
        crumbs={["twins", "halo-a.twin"]}
        right={
          <span className="inline-flex items-center gap-1 text-beacon-700">
            <span className="h-1.5 w-1.5 rounded-full bg-beacon-500" /> reasoning
          </span>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
        <Turn
          who="halo-a"
          kind="claim"
          text="Mg²⁺ bends k_obs non-linearly. Two candidate mechanisms: saturation of the primary site, and recruitment of a secondary binding site near loop-3."
          cites={["Zhang '25", "Okonkwo '24"]}
        />
        <Turn
          who="kepler"
          kind="counter"
          text="Structural contrast: I generated 16 loop-3 mutants. 11 abolish the non-linearity if (and only if) the second site is causal."
          tool="diffusion · ProtFold-δ"
        />
        <Turn
          who="dovetail"
          kind="propose"
          text="Falsification plan: 7-arm Mg²⁺ sweep × WT + loop-3 K7A. Expected info gain: 0.42 bits. Replicates N=5."
          tool="active-DOE"
        />
        <Turn
          who="quorum"
          kind="audit"
          text="Pre-registered. I-01…I-04 will be audited on each arm. No silent drift permitted."
        />
        <Turn
          who="you"
          kind="note"
          text="Tighten the DOE — give me an arm that would separate a cofactor artifact from a true site."
        />
        <Turn
          who="dovetail"
          kind="propose"
          text="Added arm 8: EDTA titration at fixed Mg²⁺ (5 mM). Resolves cofactor vs. site in the regime where the two coincide."
          tool="active-DOE"
        />
      </div>
      <div className="shrink-0 p-3 border-t border-ink-900/8 bg-parchment-50">
        <div className="rounded-md border border-ink-900/10 bg-white">
          <div className="px-3 py-1.5 flex items-center gap-2 text-[11px] text-ink-500 font-mono">
            <span>scope: k11</span>
            <span className="text-ink-300">·</span>
            <span>budget: 120k tok</span>
            <span className="text-ink-300">·</span>
            <span>mode: neurosymbolic</span>
          </div>
          <textarea
            rows={2}
            className="w-full px-3 py-2 bg-transparent outline-none text-[13.5px] placeholder:text-ink-400 resize-none"
            placeholder="Ask, challenge, or propose. Twins cite, argue, and falsify."
          />
          <div className="px-2 pb-2 flex items-center justify-between text-[11px] text-ink-500">
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 h-6 px-2 rounded hover:bg-ink-900/5">
                <Paperclip className="h-3 w-3" /> attach
              </button>
              <button className="inline-flex items-center gap-1 h-6 px-2 rounded hover:bg-ink-900/5">
                <BookOpen className="h-3 w-3" /> cite
              </button>
              <button className="inline-flex items-center gap-1 h-6 px-2 rounded hover:bg-ink-900/5">
                <FlaskConical className="h-3 w-3" /> propose
              </button>
            </div>
            <div className="inline-flex items-center gap-1">
              <span>⌘↵</span>
              <CornerDownLeft className="h-3 w-3" /> send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Turn({
  who,
  kind,
  text,
  cites,
  tool,
}: {
  who: "halo-a" | "kepler" | "dovetail" | "quorum" | "aletheia" | "you";
  kind: "claim" | "counter" | "propose" | "audit" | "note";
  text: string;
  cites?: string[];
  tool?: string;
}) {
  const authors: Record<string, { name: string; mono: string; color: string }> = {
    "halo-a": { name: "halo-a", mono: "HA", color: "#1F1F1B" },
    kepler: { name: "kepler", mono: "K", color: "#2A58BE" },
    dovetail: { name: "dovetail", mono: "D", color: "#B9740C" },
    quorum: { name: "quorum", mono: "Q", color: "#12785A" },
    aletheia: { name: "aletheia", mono: "A", color: "#B4315F" },
    you: { name: "you", mono: "JR", color: "#111110" },
  };
  const a = authors[who];
  const kindTone: Record<string, string> = {
    claim: "text-beacon-700",
    counter: "text-violet-700",
    propose: "text-amber-700",
    audit: "text-emerald-700",
    note: "text-ink-500",
  };
  return (
    <div className="flex gap-3">
      <div
        className="h-7 w-7 shrink-0 rounded-md grid place-items-center text-white text-[11px] font-medium"
        style={{ background: a.color }}
      >
        {a.mono}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11.5px] font-mono text-ink-500">
          <span className="text-ink-900 font-medium">{a.name}</span>
          <span className={kindTone[kind]}>·{" "}{kind}</span>
          {tool && <span>· {tool}</span>}
        </div>
        <div className="mt-1 text-[13.5px] text-ink-800 leading-relaxed">{text}</div>
        {cites && (
          <div className="mt-1.5 flex gap-2 text-[11.5px] text-beacon-700">
            {cites.map((c) => (
              <span key={c} className="inline-flex items-center gap-1">
                <Quote className="h-3 w-3" /> {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================================
   Dataset document
   ===================================================================== */

export function DatasetDoc() {
  const cols = ["arm", "[Mg²⁺] mM", "replicate", "k_obs (s⁻¹)", "σ", "signed", "I-03"];
  const rows = [
    ["1", "0.5", "5", "0.41", "0.08", "✓", "hold"],
    ["2", "1.0", "5", "0.54", "0.09", "✓", "hold"],
    ["3", "2.0", "5", "0.68", "0.10", "✓", "hold"],
    ["4", "4.0", "5", "0.72", "0.11", "✓", "hold"],
    ["4", "8.0", "5", "0.76", "0.19", "✓", "break"],
    ["6", "12.0", "5", "0.86", "0.10", "✓", "hold"],
    ["7", "16.0", "5", "0.88", "0.09", "✓", "hold"],
  ];
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs
        crumbs={["k11", "datasets", "kinetics-lot-71a.ds"]}
        right={
          <span className="inline-flex items-center gap-3">
            <span>2 430 rows · 7 cols</span>
            <span className="text-emerald-700 inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> signed
            </span>
          </span>
        }
      />
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full font-mono text-[12.5px] border-collapse">
          <thead>
            <tr className="bg-parchment-100 text-ink-500">
              {cols.map((c) => (
                <th
                  key={c}
                  className="text-left px-3 h-7 font-medium border-b border-ink-900/10 sticky top-0 bg-parchment-100"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-ink-900/6 hover:bg-ink-900/[0.02]",
                  r[6] === "break" && "bg-rose-50/40"
                )}
              >
                {r.map((v, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-3 h-7 tabular-nums",
                      j === 6 && v === "break" && "text-rose-700",
                      j === 6 && v === "hold" && "text-emerald-700",
                      j === 5 && "text-emerald-700"
                    )}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="text-ink-400">
              <td className="px-3 h-7" colSpan={7}>
                … 2 423 more rows
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =====================================================================
   Environment document
   ===================================================================== */

export function EnvDoc() {
  const lines: SourceLine[] = [
    { content: <>{tok.cmt("# folding-rl.env — policy environment for K11")}</> },
    { content: "" },
    { content: <>{tok.key("environment")}{tok.op(":")}</> },
    { content: <>{"  "}{tok.key("id")}{tok.op(":")} {tok.str("folding-rl")}</> },
    { content: <>{"  "}{tok.key("deterministic")}{tok.op(":")} {tok.num("true")}</> },
    { content: <>{"  "}{tok.key("seed")}{tok.op(":")} {tok.num("7c3")}</> },
    { content: "" },
    { content: <>{"  "}{tok.key("observation")}{tok.op(":")} {tok.op("{ dim: ")}{tok.num("1024")}{tok.op(", mode: ")}{tok.str("dense")}{tok.op(" }")}</> },
    { content: <>{"  "}{tok.key("action")}{tok.op(":")}        {tok.op("{ type: ")}{tok.str("cont")}{tok.op(", dim: ")}{tok.num("64")}{tok.op(" }")}</> },
    { content: <>{"  "}{tok.key("horizon")}{tok.op(":")} {tok.num("256")}</> },
    { content: "" },
    { content: <>{"  "}{tok.key("reward")}{tok.op(": |")}</> },
    { content: <>{"    "}{tok.strong("native_fold")}(s) {tok.op("-")} {tok.num("0.04")}{tok.op("·")}{tok.strong("energy")}(s)</> },
    { content: "" },
    { content: <>{"  "}{tok.key("invariant_guards")}{tok.op(":")}</> },
    { content: <>{"    - "}{tok.ref("I-01")} {tok.cmt("# abort episode on violation")}</> },
    { content: <>{"    - "}{tok.ref("I-04")} {tok.cmt("# calibration")}</> },
    { content: "" },
    { content: <>{"  "}{tok.key("rollout")}{tok.op(":")}</> },
    { content: <>{"    "}{tok.key("step")}{tok.op(":")} {tok.num("88420")}{tok.op(" / ")}{tok.num("120000")}  {tok.cmt("# 73.7%")}</> },
    { content: <>{"    "}{tok.key("reward_ema")}{tok.op(":")} {tok.num("0.871")}</> },
    { content: <>{"    "}{tok.key("kl_to_prior")}{tok.op(":")} {tok.num("0.042")}</> },
  ];
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white">
      <EditorBreadcrumbs
        crumbs={["k11", "environments", "folding-rl.env"]}
        right={
          <span className="inline-flex items-center gap-1 text-beacon-700">
            <span className="h-1.5 w-1.5 rounded-full bg-beacon-500" /> rollout running
          </span>
        }
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Source lines={lines} className="px-2 py-4" />
      </div>
    </div>
  );
}

/* =====================================================================
   Fallback
   ===================================================================== */

export function EmptyDoc({ name }: { name: string }) {
  return (
    <div className="flex-1 grid place-items-center text-ink-400">
      <div className="text-center">
        <div className="font-mono text-[13px]">{name}</div>
        <div className="text-[11.5px] mt-1">Viewer not yet wired</div>
      </div>
    </div>
  );
}
