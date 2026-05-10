"use client";

import * as React from "react";
import {
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  LayoutGrid,
  CalendarDays,
  Cpu,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DocShell } from "./DocChrome";
import type { ExperimentRecord } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

export function PlannerDoc() {
  const [view, setView] = React.useState<"kanban" | "timeline" | "resources">("kanban");
  const { chrome } = useWorkspaceBundle();
  const rootLabel =
    chrome.projectDropdownTitle.length > 28
      ? `${chrome.projectDropdownTitle.slice(0, 25)}…`
      : chrome.projectDropdownTitle;

  return (
    <DocShell
      crumbs={[rootLabel, "experiments", "experiment-board.plan"]}
      right={
        <div className="flex items-center gap-1 rounded border border-ink-900/10 bg-white">
          {(
            [
              ["kanban", LayoutGrid, "Kanban"],
              ["timeline", CalendarDays, "Timeline"],
              ["resources", Cpu, "Resources"],
            ] as const
          ).map(([k, Icon, l]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={cn(
                "h-5 px-1.5 inline-flex items-center gap-1 text-[10.5px] font-mono",
                view === k ? "bg-ink-900 text-parchment-50" : "text-ink-600"
              )}
            >
              <Icon className="h-2.5 w-2.5" /> {l}
            </button>
          ))}
        </div>
      }
    >
      <div className="px-8 py-8">
        {view === "kanban" && <Kanban />}
        {view === "timeline" && <Timeline />}
        {view === "resources" && <Resources />}
      </div>
    </DocShell>
  );
}

function Kanban() {
  const { experiments } = useWorkspaceBundle();
  const cols: {
    key: ExperimentRecord["status"];
    label: string;
    tone: "ink" | "amber" | "beacon" | "emerald" | "rose";
  }[] = [
    { key: "backlog", label: "Backlog", tone: "ink" },
    { key: "designed", label: "Designed", tone: "amber" },
    { key: "running", label: "Running", tone: "beacon" },
    { key: "completed", label: "Completed", tone: "emerald" },
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {cols.map((c) => {
        const items = experiments.filter((e) => e.status === c.key);
        return (
          <div key={c.key} className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 h-7 px-1 border-b border-ink-900/8 mb-3">
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                c.tone === "beacon" && "bg-beacon-500",
                c.tone === "amber" && "bg-amber-500",
                c.tone === "emerald" && "bg-emerald-500",
                c.tone === "ink" && "bg-ink-500",
              )} />
              <span className="text-[11px] uppercase tracking-[0.16em] text-ink-600 font-medium">
                {c.label}
              </span>
              <span className="ml-auto text-[11px] text-ink-400 font-mono tabular-nums">
                {items.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {items.map((e) => (
                <KanbanCard key={e.id} e={e} />
              ))}
              <button className="w-full h-8 rounded-md border border-dashed border-ink-900/15 text-ink-500 hover:text-ink-700 hover:border-ink-900/25 text-[11px] font-mono inline-flex items-center justify-center gap-1.5">
                <Plus className="h-3 w-3" /> add
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({ e }: { e: ExperimentRecord }) {
  const statusIcon =
    e.status === "running" ? (
      <Play className="h-3 w-3 text-beacon-700" />
    ) : e.status === "completed" ? (
      <CheckCircle2 className="h-3 w-3 text-emerald-700" />
    ) : e.status === "failed" ? (
      <AlertTriangle className="h-3 w-3 text-rose-700" />
    ) : (
      <Clock className="h-3 w-3 text-ink-500" />
    );
  return (
    <div className="rounded-md border border-ink-900/8 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-ink-900 font-medium">{e.id}</span>
        <span className="text-[10px] text-ink-400 font-mono">· {e.hypothesis}</span>
        <span className="ml-auto">{statusIcon}</span>
      </div>
      <div className="text-[12px] text-ink-700 leading-snug mt-1 line-clamp-2">
        {e.title}
      </div>
      {e.progress && (
        <div className="mt-2 flex items-center gap-2 font-mono text-[10.5px] text-ink-500">
          <div className="flex-1 h-1 rounded-full bg-ink-900/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-beacon-500"
              style={{ width: `${(e.progress.step / e.progress.total) * 100}%` }}
            />
          </div>
          <span className="tabular-nums">
            {e.progress.step}/{e.progress.total}
          </span>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between text-[10.5px] text-ink-500 font-mono">
        <span className="truncate">
          {e.instrument ?? e.protocol}
        </span>
        <span className="text-ink-400">{e.owner}</span>
      </div>
    </div>
  );
}

function Timeline() {
  const { experiments } = useWorkspaceBundle();
  const days = 28;
  const items = experiments.filter((e) => e.status !== "backlog").map((e, i) => ({
    id: e.id,
    title: e.title,
    start: [0, 4, 6, 9, 14, 17][i % 6],
    length: e.status === "completed" ? 5 : e.progress ? Math.ceil((e.progress.step / e.progress.total) * 8) : 6,
    tone:
      e.status === "running"
        ? "bg-beacon-500"
        : e.status === "completed"
        ? "bg-emerald-500"
        : "bg-amber-500",
    status: e.status,
  }));
  return (
    <div>
      <div className="grid grid-cols-[160px_1fr] gap-4">
        <div />
        <div className="grid" style={{ gridTemplateColumns: `repeat(${days}, 1fr)` }}>
          {Array.from({ length: days }, (_, i) => (
            <div key={i} className="text-[9px] text-ink-400 font-mono text-center">
              {i % 7 === 0 ? `W${Math.floor(i / 7) + 1}` : ""}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-[160px_1fr] gap-4 items-center">
            <div className="font-mono text-[11.5px] text-ink-700 truncate">
              <span className="text-ink-900">{it.id}</span>
              <span className="text-ink-400"> · {it.status}</span>
            </div>
            <div className="h-6 relative rounded bg-ink-900/5">
              <div
                className={cn("absolute h-full rounded", it.tone)}
                style={{
                  left: `${(it.start / days) * 100}%`,
                  width: `${(it.length / days) * 100}%`,
                }}
              >
                <span className="absolute inset-0 px-2 text-[10px] text-white truncate font-mono flex items-center">
                  {it.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Resources() {
  const { experiments } = useWorkspaceBundle();
  const bookedExps = experiments.map((e) => e.id).join(" · ") || "(none)";
  const rows = [
    { r: "Instruments · configure", used: 0, booked: "(connect)" },
    { r: "Automation / robotics", used: 0, booked: "(optional)" },
    { r: "HPC / cloud quota", used: 0, booked: bookedExps },
    { r: "Storage · cold tier", used: 0, booked: "(datasets)" },
  ];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[220px_1fr_200px] gap-4 px-1 text-[10.5px] uppercase tracking-[0.16em] text-ink-400 font-medium">
        <div>resource</div>
        <div>utilisation</div>
        <div>booked by</div>
      </div>
      {rows.map((r) => (
        <div key={r.r} className="grid grid-cols-[220px_1fr_200px] gap-4 items-center text-[12px]">
          <div className="font-mono text-ink-800">{r.r}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-ink-900/8 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  r.used > 0.8 ? "bg-rose-500" : r.used > 0.5 ? "bg-beacon-500" : "bg-emerald-500"
                )}
                style={{ width: `${r.used * 100}%` }}
              />
            </div>
            <span className="font-mono text-[10.5px] text-ink-500 tabular-nums w-10 text-right">
              {Math.round(r.used * 100)}%
            </span>
          </div>
          <div className="font-mono text-[11px] text-ink-500 truncate">{r.booked}</div>
        </div>
      ))}
    </div>
  );
}
