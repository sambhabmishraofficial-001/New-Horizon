"use client";

import * as React from "react";
import {
  ArrowRight,
  Sparkles,
  FlaskConical,
  Network,
  ListChecks,
  Compass,
  Plug,
  PenLine,
  Link2,
  Microscope,
  Lightbulb,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { DocShell } from "./DocChrome";
import { useWorkspaceBundle } from "../workspace-context";

export function ProjectHomeDoc() {
  const { hypotheses, experiments, datasets, papers, protocols } =
    useWorkspaceBundle();

  const counts = {
    hyp: hypotheses.length,
    exp: experiments.length,
    data: datasets.length,
    paper: papers.length,
    proto: protocols.length,
  };

  return (
    <DocShell crumbs={["scientific program", "project home"]} bg="parchment">
      <div className="max-w-[920px] mx-auto px-10 pt-10 pb-20">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium">
          <Compass className="h-3 w-3" />
          Project home
          <span className="text-ink-300">·</span>
          <span className="font-mono text-ink-400 normal-case tracking-normal">
            scaffold
          </span>
        </div>

        <h1 className="mt-3 font-editorial text-[44px] leading-[1.05] text-ink-900 tracking-tight">
          A blank scientific program, ready to specialise.
        </h1>
        <p className="mt-3 max-w-[640px] text-[14.5px] leading-relaxed text-ink-600">
          The IRE doesn&rsquo;t pick a domain for you. State a question, attach
          measurements, declare invariants — the agents bind to whatever you
          actually study. The five blocks below are the only structure that
          matters.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <PillarCard
            icon={Lightbulb}
            label="Question"
            count={counts.hyp}
            unit="hypotheses"
            hint="Write the principal claim plus an explicit competitor. Vague claims stay un-runnable."
          />
          <PillarCard
            icon={FlaskConical}
            label="Method"
            count={counts.exp + counts.proto}
            unit="experiments + protocols"
            hint="Designs that can falsify the claim. Versioned protocols, declared variables."
          />
          <PillarCard
            icon={Microscope}
            label="Evidence"
            count={counts.data}
            unit="datasets"
            hint="Raw and derived. Pinned schemas, content hashes, environment fingerprints."
          />
          <PillarCard
            icon={Quote}
            label="Context"
            count={counts.paper}
            unit="papers"
            hint="Prior art, contradictions, the part you have to read before claiming novelty."
          />
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3">
          <FirstStep
            number="01"
            title="Name the question"
            body="Open H-S001 from the hypothesis manager. Replace the placeholder with the real measurable claim."
            icon={Lightbulb}
          />
          <FirstStep
            number="02"
            title="Attach a measurement"
            body="Define the schema in observations_raw. Hash an existing CSV or wire an instrument connector."
            icon={Network}
          />
          <FirstStep
            number="03"
            title="Run the loop"
            body="Version a protocol, queue EXP-S001, let the analysis agent post the first verdict."
            icon={FlaskConical}
          />
        </div>

        <div className="mt-12 rounded-md border border-ink-900/10 bg-white">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-900/8">
            <Sparkles className="h-3.5 w-3.5 text-beacon-700" strokeWidth={1.75} />
            <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
              Field-agnostic by design
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 px-5 py-4 text-[12.5px] text-ink-700">
            <Capability icon={ListChecks} label="Hypothesis manager (claims, evidence, contradictions)" />
            <Capability icon={FlaskConical} label="Experiment planner with run lineage" />
            <Capability icon={Network} label="Knowledge graph linking entities you define" />
            <Capability icon={PenLine} label="Manuscript & figure surfaces" />
            <Capability icon={Plug} label="Open-in-tab tools (no redirects)" />
            <Capability icon={Link2} label="Reference manager + paper shelf" />
          </ul>
        </div>

        <div className="mt-10">
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium mb-2">
            Try a worked example instead
          </div>
          <p className="text-[12.5px] text-ink-600 leading-relaxed max-w-[640px]">
            The project switcher above the toolbar holds an oncology workspace
            with wet-lab data, agent traces, and a partly-drafted manuscript —
            useful for stress-testing the surface before you reshape it for your
            own program.
          </p>
        </div>
      </div>
    </DocShell>
  );
}

function PillarCard({
  icon: Icon,
  label,
  count,
  unit,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  unit: string;
  hint: string;
}) {
  return (
    <div className="rounded-md border border-ink-900/10 bg-white px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
          <Icon className="h-3 w-3" strokeWidth={1.75} />
          {label}
        </span>
        <span className="font-mono text-[10.5px] text-ink-400">{unit}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-editorial text-[36px] text-ink-900 leading-none">
          {count}
        </span>
        <span className="text-[11px] text-ink-400 font-mono">
          {count === 0 ? "none yet" : "active"}
        </span>
      </div>
      <p className="mt-3 text-[12px] text-ink-600 leading-relaxed">{hint}</p>
    </div>
  );
}

function FirstStep({
  number,
  title,
  body,
  icon: Icon,
}: {
  number: string;
  title: string;
  body: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-md border border-ink-900/8 bg-parchment-100 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10.5px] text-ink-400">{number}</span>
        <Icon className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.75} />
      </div>
      <div className="mt-2 text-[13px] font-medium text-ink-900">{title}</div>
      <p className="mt-1 text-[11.5px] text-ink-600 leading-relaxed">{body}</p>
      <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-beacon-700 font-mono">
        start <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

function Capability({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <Icon className="h-3 w-3 text-ink-400" strokeWidth={1.75} />
      <span>{label}</span>
    </li>
  );
}
