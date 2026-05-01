"use client";

import * as React from "react";
import { Play, Clock, GitBranch, Video, CheckCircle2, Beaker, Scissors, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell, SectionLabel } from "./DocChrome";

const STEPS = [
  { n: 1, title: "Sample prep", duration: "30 min", done: true, note: "Lyse cells in RIPA buffer. Quantify by BCA." },
  { n: 2, title: "SDS-PAGE", duration: "90 min", done: true, note: "4-12% bis-tris gel, 120 V · 1h 15m." },
  { n: 3, title: "Transfer", duration: "80 min", done: true, note: "PVDF, 100 V · 75 min in transfer buffer with 20% MeOH." },
  { n: 4, title: "Blocking", duration: "60 min", done: false, running: true, note: "5% BSA in TBST at RT with gentle agitation.", alts: ["5% non-fat milk (community variant)"], recommended: "BSA — 12% better S/N (community · 41 runs)" },
  { n: 5, title: "Primary antibody", duration: "overnight", done: false, note: "Anti-pEGFR (Y1068) 1:1000 in 5% BSA-TBST at 4 °C." },
  { n: 6, title: "Wash", duration: "30 min", done: false, note: "3 × 10 min TBST." },
  { n: 7, title: "Secondary + ECL", duration: "90 min", done: false, note: "HRP-conjugated secondary 1:5000 · ECL substrate." },
  { n: 8, title: "Imaging + quantification", duration: "60 min", done: false, note: "ChemiDoc MP · integrate band intensities in ImageLab." },
];

export function ProtocolDoc() {
  return (
    <DocShell
      crumbs={["egfr", "protocols", "Western_blot_EGFR.proto"]}
      right={
        <div className="flex items-center gap-1 text-[10.5px] font-mono">
          <span className="text-ink-500">v3.2 · 94% success · 18 runs</span>
          <button className="h-5 px-2 rounded border border-ink-900/10 text-ink-700 hover:bg-ink-900/5 inline-flex items-center gap-1">
            <GitBranch className="h-2.5 w-2.5" /> fork
          </button>
          <button className="h-5 px-2 rounded bg-ink-900 text-parchment-50 inline-flex items-center gap-1">
            <Play className="h-2.5 w-2.5" /> run
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] min-h-full">
        <article className="px-10 py-8 min-w-0 max-w-[760px]">
          <div className="text-[11px] uppercase tracking-[0.16em] text-ink-400 font-medium">
            Western blot · EGFR phosphorylation
          </div>
          <h1 className="font-display text-[28px] leading-[1.15] text-ink-900 mt-2">
            Western_blot_EGFR
            <span className="text-ink-400 text-[16px] font-mono ml-2">v3.2</span>
          </h1>
          <div className="mt-1 text-[13px] text-ink-600 leading-relaxed">
            Quantitative western for phosphorylated EGFR (Y1068) and total EGFR
            in adherent cell lysates. Supports single-timepoint and
            time-course designs (0–24 h).
          </div>

          <div className="mt-6 grid grid-cols-4 gap-6 text-[12px] font-mono">
            <Stat label="total duration" v="6.2 h" />
            <Stat label="steps" v="8" />
            <Stat label="success" v="94%" />
            <Stat label="last used" v="2026-04-18" />
          </div>

          <section className="mt-8 space-y-4">
            {STEPS.map((s) => (
              <StepCard key={s.n} step={s} />
            ))}
          </section>
        </article>

        <aside className="border-l border-ink-900/8 bg-parchment-50 p-5 space-y-5">
          <div>
            <SectionLabel>Reagents · checked</SectionLabel>
            <ul className="mt-2 space-y-1 text-[11.5px] font-mono">
              <R name="anti-pEGFR (Y1068)" ok />
              <R name="anti-EGFR total" ok />
              <R name="RIPA buffer" ok />
              <R name="5% BSA" ok />
              <R name="ECL substrate" short="2 blots left" />
              <R name="PVDF membrane" ok />
            </ul>
          </div>

          <div>
            <SectionLabel>Deviations · run 17</SectionLabel>
            <div className="mt-2 rounded-md border border-ink-900/10 bg-white px-3 py-2 text-[11.5px] text-ink-700 font-mono">
              <div className="flex items-baseline justify-between">
                <span>step 4</span>
                <span className="text-amber-700">+15 min</span>
              </div>
              <div className="text-ink-500 mt-0.5">
                extended blocking — logged by Marcus
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Linked experiments</SectionLabel>
            <ul className="mt-2 space-y-1.5 text-[11.5px] font-mono text-beacon-700">
              <li className="hover:underline cursor-pointer">EXP-002 · running</li>
              <li className="hover:underline cursor-pointer">EXP-005 · designed</li>
            </ul>
          </div>

          <div>
            <SectionLabel>Community variant</SectionLabel>
            <div className="mt-2 rounded-md border border-violet-500/15 bg-violet-50 px-3 py-2.5 text-[11.5px] text-violet-900 leading-relaxed">
              <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
              4 200 community runs · BSA blocking outperforms milk by 12% S/N
              for pEGFR (Y1068).
            </div>
          </div>
        </aside>
      </div>
    </DocShell>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] text-ink-400 uppercase tracking-[0.14em]">
        {label}
      </div>
      <div className="text-[13.5px] text-ink-900">{v}</div>
    </div>
  );
}

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white overflow-hidden",
        step.running ? "border-beacon-500/40 shadow-sm" : "border-ink-900/8"
      )}
    >
      <div className="px-4 py-2.5 flex items-center gap-3 border-b border-ink-900/6">
        <div
          className={cn(
            "h-6 w-6 rounded-full grid place-items-center text-[11px] font-mono",
            step.done
              ? "bg-emerald-500 text-white"
              : step.running
              ? "bg-beacon-500 text-white animate-pulseSoft"
              : "bg-ink-900/5 text-ink-500 border border-ink-900/10"
          )}
        >
          {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.n}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] text-ink-900 font-medium truncate">
            {step.title}
          </div>
        </div>
        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-500">
          <Clock className="h-3 w-3" /> {step.duration}
        </div>
      </div>
      <div className="px-4 py-3 text-[13px] text-ink-700 leading-relaxed">
        {step.note}
        {step.alts && (
          <div className="mt-2 text-[11.5px] text-ink-500">
            alternatives: {step.alts.join(" · ")}
          </div>
        )}
        {step.recommended && (
          <div className="mt-2 rounded border border-violet-500/15 bg-violet-50 px-2.5 py-1.5 text-[11.5px] text-violet-900">
            <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
            {step.recommended}
          </div>
        )}
      </div>
    </div>
  );
}

function R({ name, ok, short }: { name: string; ok?: boolean; short?: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink-800">{name}</span>
      {ok ? (
        <span className="text-emerald-700 inline-flex items-center gap-0.5">
          <CheckCircle2 className="h-2.5 w-2.5" /> ok
        </span>
      ) : (
        <span className="text-amber-700">{short}</span>
      )}
    </li>
  );
}
