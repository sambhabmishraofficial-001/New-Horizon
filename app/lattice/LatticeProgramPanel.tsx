"use client";

import * as React from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  LATTICE_PROGRAMS,
  LATTICE_TASKS,
  type LatticeProgram,
  type LatticeTask,
} from "./lattice-data";

export function LatticeProgramPanel({
  navView,
  onNavViewChange,
  selectedTaskId,
  onSelectTask,
  programFilter,
  onProgramFilter,
}: {
  navView: "playground" | "tasks";
  onNavViewChange: (v: "playground" | "tasks") => void;
  selectedTaskId: string | null;
  onSelectTask: (task: LatticeTask) => void;
  programFilter: string | "all";
  onProgramFilter: (id: string | "all") => void;
}) {
  const [query, setQuery] = React.useState("");

  const filtered = LATTICE_TASKS.filter((t) => {
    if (programFilter !== "all" && t.programId !== programFilter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q)
    );
  });

  return (
    <aside className="w-[300px] shrink-0 flex flex-col border-r border-[var(--ire-border)] bg-[var(--ire-surface)] min-w-[260px]">
      <div className="shrink-0 border-b border-[var(--ire-border)] px-2 py-2">
        <div className="ire-segment w-full">
          <button
            type="button"
            data-active={navView === "playground"}
            onClick={() => onNavViewChange("playground")}
            className="ire-segment-btn flex-1"
          >
            Co-science
          </button>
          <button
            type="button"
            data-active={navView === "tasks"}
            onClick={() => onNavViewChange("tasks")}
            className="ire-segment-btn flex-1"
          >
            Programs
          </button>
        </div>
      </div>
      <div className="h-11 shrink-0 px-3 flex items-center justify-between border-b border-[var(--ire-border)]">
        <span className="text-[13px] font-medium text-ink-900">
          Programs{" "}
          <span className="text-ink-400 font-normal">({filtered.length})</span>
        </span>
        <button
          type="button"
          title="Filter"
          className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-900/[0.05] text-ink-500"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-3 py-2.5 space-y-2 border-b border-[var(--ire-border)]">
        <div className="h-8 px-2.5 rounded-lg border border-[var(--ire-border)] bg-[var(--ire-surface-muted)] flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-ink-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs & tasks"
            className="flex-1 bg-transparent outline-none text-[12px] placeholder:text-ink-400"
          />
        </div>
        <select
          value={programFilter}
          onChange={(e) => onProgramFilter(e.target.value as string | "all")}
          className="w-full h-8 rounded-lg border border-[var(--ire-border)] bg-white px-2 text-[12px] text-ink-800 outline-none"
        >
          <option value="all">All programs</option>
          {LATTICE_PROGRAMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.code} · {p.title.slice(0, 40)}
            </option>
          ))}
        </select>
      </div>

      <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-[var(--ire-border)]">
        {filtered.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            program={LATTICE_PROGRAMS.find((p) => p.id === task.programId)}
            active={selectedTaskId === task.id}
            onSelect={() => onSelectTask(task)}
          />
        ))}
      </ul>

      <div className="shrink-0 p-3 border-t border-[var(--ire-border)]">
        <button
          type="button"
          className="w-full h-9 rounded-full bg-ink-900 text-white text-[12.5px] font-medium inline-flex items-center justify-center gap-1.5 hover:bg-ink-800 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Create new program
        </button>
      </div>
    </aside>
  );
}

function TaskRow({
  task,
  program,
  active,
  onSelect,
}: {
  task: LatticeTask;
  program?: LatticeProgram;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full text-left px-3 py-3 hover:bg-[var(--ire-surface-muted)] transition-colors",
          active && "bg-beacon-50/50"
        )}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 h-6 w-6 rounded-md bg-ink-900/[0.06] grid place-items-center text-[10px] font-mono text-ink-600 shrink-0">
            {program?.code?.slice(0, 2) ?? "-"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] text-ink-500">{task.code}</span>
              {task.progress != null && (
                <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-900">
                  Progress: {task.progress}%
                </span>
              )}
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-ink-900 line-clamp-3">
              {task.title}
            </p>
            <p className="mt-1 text-[10.5px] text-ink-400">{task.updatedAt}</p>
          </div>
        </div>
      </button>
    </li>
  );
}
