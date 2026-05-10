"use client";

import * as React from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  FlaskConical,
  Network,
  ScrollText,
  ChevronDown,
  Send,
  Lightbulb,
  Brain,
  Compass,
  Radar,
  GitBranch,
  SigmaSquare,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { AgentRecord, InsightRecord } from "./data";
import { useWorkspaceBundle } from "./workspace-context";
import { EnhancedComposer } from "./composer/EnhancedComposer";

const AGENT_ICONS: Record<AgentRecord["icon"], any> = {
  orchestrator: Compass,
  hypothesis: Brain,
  experiment: FlaskConical,
  analysis: SigmaSquare,
  literature: BookOpen,
  protocol: GitBranch,
  knowledge: Network,
  writing: ScrollText,
};

const SOURCE_ICONS: Record<InsightRecord["source"], any> = {
  lit: BookOpen,
  analysis: SigmaSquare,
  hyp: TrendingUp,
  exp: Radar,
  kg: Network,
  protocol: GitBranch,
  writing: ScrollText,
};

export function AgentRail({
  activeContext,
}: {
  activeContext: string;
}) {
  const { agents, insights } = useWorkspaceBundle();
  return (
    <aside
      data-tour="agent-rail"
      className="h-full w-[340px] shrink-0 flex flex-col bg-parchment-100 border-l border-ink-900/8 font-marketing not-italic"
    >
      <div className="h-8 shrink-0 px-3 flex items-center justify-between border-b border-ink-900/8">
        <div className="inline-flex items-center gap-1.5 font-marketing text-[10.5px] font-medium uppercase not-italic tracking-[0.16em] text-ink-500">
          <Sparkles className="h-3 w-3 text-beacon-600" /> research agent
        </div>
        <div className="font-marketing text-[10px] not-italic text-ink-400">
          ctx · {activeContext}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <Section title="active agents">
          <div className="px-3 pb-2 space-y-1.5">
            {agents.map((a) => (
              <AgentRow key={a.id} a={a} />
            ))}
          </div>
        </Section>

        <Section title="autonomy level">
          <div className="px-3 pb-3">
            <div className="rounded-md border border-ink-900/10 bg-white p-2.5">
              <div className="flex items-center gap-1.5 font-marketing text-[10.5px] not-italic">
                {(["suggest", "semi-auto", "full-auto"] as const).map((l, i) => (
                  <button
                    key={l}
                    className={cn(
                      "flex-1 h-6 rounded font-marketing text-[10.5px] not-italic",
                      i === 1
                        ? "bg-ink-900 text-parchment-50"
                        : "text-ink-600 hover:bg-ink-900/5"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 font-marketing text-[10.5px] not-italic text-ink-500">
                semi-auto · human-in-loop on high-stakes decisions (instrument
                dispatch, publication, irreversible compute)
              </div>
            </div>
          </div>
        </Section>

        <Section title="recent insights">
          <div className="divide-y divide-ink-900/6">
            {insights.map((i) => (
              <InsightCard key={i.id} i={i} />
            ))}
          </div>
        </Section>

        <Section title="autonomous loop">
          <div className="px-3 pb-3">
            <div className="rounded-md border border-ink-900/10 bg-white p-3">
              <LoopDiagram />
              <div className="mt-2 font-marketing text-[10.5px] not-italic text-ink-500">
                closed-loop · you approve at ⬤ marks
              </div>
            </div>
          </div>
        </Section>
      </div>

      <div className="shrink-0 border-t border-ink-900/8 bg-parchment-50">
        <div className="px-3 py-2 space-y-1.5">
          <div className="flex flex-wrap gap-1">
            {[
              "Suggest next experiment",
              "Synthesize evidence",
              "Find contradictions",
              "Draft methods",
              "Predict outcome of EXP-003",
            ].map((q) => (
              <button
                key={q}
                className="h-5 px-1.5 rounded font-marketing text-[10.5px] not-italic text-ink-700 bg-white border border-ink-900/10 hover:border-ink-900/20"
              >
                {q}
              </button>
            ))}
          </div>
          <EnhancedComposer />
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-ink-900/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center h-7 px-3 font-marketing text-[10.5px] font-medium uppercase not-italic tracking-[0.16em] text-ink-500 hover:bg-ink-900/5 gap-1.5"
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 text-ink-400 transition-transform",
            !open && "-rotate-90"
          )}
        />
        <span>{title}</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function AgentRow({ a }: { a: AgentRecord }) {
  const Icon = AGENT_ICONS[a.icon];
  const statusTone =
    a.status === "running"
      ? "text-beacon-700 bg-beacon-500"
      : a.status === "standby"
      ? "text-amber-700 bg-amber-500"
      : a.status === "flagged"
      ? "text-rose-700 bg-rose-500"
      : "text-ink-500 bg-ink-400";
  return (
    <div className="rounded-md border border-ink-900/8 bg-white px-2.5 py-1.5 font-marketing not-italic hover:border-ink-900/20 cursor-default">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-parchment-50 border border-ink-900/8 grid place-items-center text-ink-700">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-marketing text-[12px] font-medium not-italic text-ink-900 truncate">
            {a.name}
          </div>
          <div className="font-marketing text-[10.5px] not-italic text-ink-500 truncate">
            {a.role}
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-marketing text-[10px] not-italic",
            statusTone.split(" ")[0]
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              statusTone.split(" ")[1],
              a.status === "running" && "animate-pulseSoft"
            )}
          />
          {a.status}
        </span>
      </div>
      {a.activity && (
        <div className="mt-1 pl-8 font-marketing text-[10.5px] not-italic text-ink-500 truncate">
          {a.activity}
        </div>
      )}
    </div>
  );
}

function InsightCard({ i }: { i: InsightRecord }) {
  const Icon = SOURCE_ICONS[i.source];
  const tone =
    i.tone === "warn"
      ? "text-amber-700"
      : i.tone === "success"
      ? "text-emerald-700"
      : i.tone === "breaking"
      ? "text-rose-700"
      : "text-beacon-700";
  return (
    <div className="px-3 py-2.5 font-marketing not-italic hover:bg-ink-900/5">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-3 w-3", tone)} strokeWidth={1.75} />
        <span className={cn("font-marketing text-[10px] uppercase not-italic tracking-[0.14em]", tone)}>
          {i.source}
        </span>
        <span className="ml-auto font-marketing text-[10px] not-italic text-ink-400">
          {i.ts}
        </span>
      </div>
      <div className="mt-1 font-marketing text-[12px] font-medium leading-snug not-italic text-ink-900">
        {i.title}
      </div>
      <div className="mt-0.5 font-marketing text-[11.5px] leading-snug not-italic text-ink-600">
        {i.body}
      </div>
      {i.action && (
        <div className="mt-1.5 font-marketing text-[11px] not-italic text-beacon-700 cursor-pointer hover:underline">
          {i.action} →
        </div>
      )}
    </div>
  );
}

function LoopDiagram() {
  const steps = [
    "goal",
    "hypothesis",
    "design",
    "approve ⬤",
    "execute",
    "analyze",
    "update",
    "decide",
    "draft",
  ];
  return (
    <div className="grid grid-cols-3 gap-1 font-marketing text-[10px] not-italic">
      {steps.map((s, i) => (
        <div
          key={i}
          className={cn(
            "rounded border px-1.5 py-1 text-center",
            s.includes("⬤")
              ? "border-amber-400 bg-amber-50 text-amber-800"
              : "border-ink-900/10 bg-parchment-50 text-ink-700"
          )}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

