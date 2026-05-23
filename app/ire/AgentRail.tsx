"use client";

import * as React from "react";
import {
  TrendingUp,
  BookOpen,
  FlaskConical,
  Network,
  ScrollText,
  ChevronDown,
  Brain,
  Compass,
  Radar,
  GitBranch,
  SigmaSquare,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { AgentRecord, InsightRecord } from "./data";
import { useWorkspaceBundle, useIreNavigation } from "./workspace-context";

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

export function AgentRail({ embedded }: { embedded?: boolean } = {}) {
  const { agents, insights } = useWorkspaceBundle();

  return (
    <div
      className={cn(
        "h-full flex flex-col min-h-0",
        embedded ? "bg-[var(--ire-surface)]" : "w-[340px] shrink-0 bg-parchment-100 border-l border-ink-900/8"
      )}
    >
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Section title="Active agents">
          <div className="px-3 pb-2 space-y-1.5">
            {agents.map((a) => (
              <AgentRow key={a.id} a={a} />
            ))}
          </div>
        </Section>

        <Section title="Recent insights">
          <div className="divide-y divide-ink-900/6">
            {insights.map((i) => (
              <InsightCard key={i.id} insight={i} />
            ))}
          </div>
        </Section>

        {!embedded && (
          <Section title="Research loop" defaultOpen={false}>
            <div className="px-3 pb-3">
              <div className="rounded-lg border border-[var(--ire-border)] bg-[var(--ire-surface-muted)] p-3">
                <LoopDiagram />
                <p className="mt-2 text-[10.5px] text-ink-500">
                  Closed loop - you approve at marked steps.
                </p>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
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
        className="w-full flex items-center h-8 px-3 ire-label hover:bg-ink-900/[0.04] gap-1.5"
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
    <div className="rounded-lg border border-[var(--ire-border)] bg-white px-2.5 py-2 hover:border-[var(--ire-border-strong)] cursor-default">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-parchment-50 border border-ink-900/8 grid place-items-center text-ink-700">
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-medium text-ink-900 truncate">
            {a.name}
          </div>
          <div className="text-[10.5px] text-ink-500 truncate">
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

function InsightCard({ insight }: { insight: InsightRecord }) {
  const { followInsight } = useIreNavigation();
  const Icon = SOURCE_ICONS[insight.source];
  const tone =
    insight.tone === "warn"
      ? "text-amber-700"
      : insight.tone === "success"
      ? "text-emerald-700"
      : insight.tone === "breaking"
      ? "text-rose-700"
      : "text-beacon-700";
  return (
    <button
      type="button"
      onClick={() => followInsight(insight)}
      className="w-full text-left px-3 py-2.5 hover:bg-ink-900/[0.04]"
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("h-3 w-3", tone)} strokeWidth={1.75} />
        <span
          className={cn(
            "font-marketing text-[10px] uppercase not-italic tracking-[0.14em]",
            tone
          )}
        >
          {insight.source}
        </span>
        <span className="ml-auto font-marketing text-[10px] not-italic text-ink-400">
          {insight.ts}
        </span>
      </div>
      <div className="mt-1 font-marketing text-[12px] font-medium leading-snug not-italic text-ink-900">
        {insight.title}
      </div>
      <div className="mt-0.5 font-marketing text-[11.5px] leading-snug not-italic text-ink-600">
        {insight.body}
      </div>
      {insight.action && (
        <div className="mt-1.5 font-marketing text-[11px] not-italic text-beacon-700">
          {insight.action} →
        </div>
      )}
    </button>
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

