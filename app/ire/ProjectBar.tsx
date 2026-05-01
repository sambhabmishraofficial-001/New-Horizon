"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Cloud,
  CheckCircle2,
  Users,
  Sparkles,
  FlaskConical,
  AlertTriangle,
  GitBranch,
  Box,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { TEAM } from "./data";

export function ProjectBar({ full, onToggleFull }: { full: boolean; onToggleFull: () => void }) {
  return (
    <div className="h-9 shrink-0 flex items-center px-3 gap-3 border-b border-ink-900/8 bg-parchment-50 text-[11.5px]">
      <button className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md hover:bg-ink-900/5 text-ink-900 font-medium">
        <Box className="h-3.5 w-3.5 text-beacon-700" strokeWidth={1.75} />
        <span>EGFR Inhibitor Discovery</span>
        <span className="text-[10.5px] text-ink-400 font-mono">· v3</span>
        <ChevronDown className="h-3 w-3 text-ink-400" />
      </button>

      <div className="h-4 w-px bg-ink-900/10" />

      <span className="inline-flex items-center gap-1.5 text-ink-600">
        <GitBranch className="h-3 w-3" />
        <span className="font-mono text-[11px]">hypothesis/H-001</span>
      </span>

      <span className="inline-flex items-center gap-1.5 text-emerald-700">
        <Cloud className="h-3 w-3" />
        <CheckCircle2 className="h-3 w-3" />
        <span>synced</span>
      </span>

      <span className="inline-flex items-center gap-1 text-beacon-700">
        <FlaskConical className="h-3 w-3" />
        <span className="font-mono">2 running</span>
      </span>

      <span className="inline-flex items-center gap-1 text-violet-700">
        <Sparkles className="h-3 w-3" />
        <span className="font-mono">4 agents online</span>
      </span>

      <span className="inline-flex items-center gap-1 text-amber-700">
        <AlertTriangle className="h-3 w-3" />
        <span className="font-mono">1 anomaly</span>
      </span>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-6 items-center gap-1.5 rounded px-2 font-marketing text-[11.5px] font-medium not-italic text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Back home
        </Link>

        <div className="h-4 w-px bg-ink-900/10" />

        <div className="flex items-center gap-1 text-ink-600">
          <Users className="h-3 w-3" />
          <span className="text-[11px]">team online · {TEAM.filter((t) => t.online).length}</span>
        </div>
        <div className="flex items-center -space-x-1.5">
          {TEAM.filter((t) => t.online)
            .slice(0, 5)
            .map((m) => (
              <div
                key={m.id}
                title={`${m.name} · ${m.role}`}
                className={cn(
                  "h-6 w-6 rounded-full ring-2 ring-parchment-50 grid place-items-center text-[9.5px] font-medium text-white font-mono"
                )}
                style={{ background: m.color }}
              >
                {m.initials}
              </div>
            ))}
        </div>

        <div className="h-4 w-px bg-ink-900/10" />

        <button
          onClick={onToggleFull}
          title={full ? "Minimize workspace (Esc)" : "Maximize workspace"}
          className="h-6 w-6 grid place-items-center rounded hover:bg-ink-900/8 text-ink-500 hover:text-ink-900 transition-colors"
        >
          {full ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
