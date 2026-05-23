"use client";

import * as React from "react";
import Link from "next/link";
import { Network, Users, Sparkles, FolderOpen, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { AletheiaInsightSection } from "@/app/ire/AletheiaInsightSection";
import { LATTICE_FEED, LATTICE_TWINS } from "./lattice-data";

type InsightTab = "canvas" | "agents" | "feed" | "files";

export function LatticeInsightPanel() {
  const [tab, setTab] = React.useState<InsightTab>("canvas");

  return (
    <aside className="w-[min(380px,32vw)] shrink-0 flex flex-col min-h-0 border-l border-[var(--ire-border)] bg-[#0f0f0e] text-parchment-100 min-w-[300px]">
      <div
        className="flex border-b border-white/10"
        role="tablist"
      >
        {(
          [
            { id: "canvas" as const, label: "Canvas", icon: Network },
            { id: "agents" as const, label: "Agents", icon: Users },
            { id: "feed" as const, label: "Feed", icon: Sparkles },
            { id: "files" as const, label: "Files", icon: FolderOpen },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 h-9 text-[11px] font-medium uppercase tracking-[0.08em] inline-flex items-center justify-center gap-1 border-b-2 transition-colors",
              tab === t.id
                ? "border-parchment-100 text-parchment-50"
                : "border-transparent text-parchment-100/45 hover:text-parchment-100/70"
            )}
          >
            <t.icon className="h-3 w-3" strokeWidth={1.65} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "canvas" && <CanvasPane />}
      {tab === "agents" && <AgentsPane />}
      {tab === "feed" && <FeedPane />}
      {tab === "files" && <FilesPane />}
    </aside>
  );
}

function CanvasPane() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="h-9 shrink-0 px-3 flex items-center gap-2 border-b border-white/10 text-[11px] text-parchment-100/50 overflow-x-auto">
        <span className="text-parchment-100/80">graph</span>
        <span>·</span>
        <span className="truncate">K11 · ribozyme branch</span>
        <span className="ml-auto shrink-0 font-mono text-[10px]">mg-sweep</span>
      </div>
      <div className="flex-1 min-h-[280px] grid place-items-center p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, transparent 0%, transparent 42%, rgba(255,255,255,0.15) 43%, transparent 44%), repeating-radial-gradient(circle at center, transparent 0, transparent 24px, rgba(255,255,255,0.06) 25px)",
          }}
          aria-hidden
        />
        <div className="relative text-center max-w-[220px]">
          <div className="mx-auto h-14 w-14 rounded-full border border-white/15 grid place-items-center mb-4">
            <Network className="h-6 w-6 text-parchment-100/40" />
          </div>
          <p className="text-[13px] text-parchment-100/80">No nodes yet</p>
          <p className="mt-1 text-[11px] text-parchment-100/45 leading-relaxed">
            Use + to create a node or import a program graph
          </p>
          <Link
            href="/canvas"
            className="mt-4 inline-flex items-center gap-1 text-[11.5px] text-beacon-300 hover:underline"
          >
            Open full canvas
          </Link>
        </div>
        <button
          type="button"
          title="Add node"
          className="absolute bottom-4 right-4 h-8 w-8 rounded-md border border-white/15 bg-white/5 grid place-items-center text-parchment-100/70 hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AgentsPane() {
  const twins = LATTICE_TWINS.filter((t) => t.name !== "Aletheia");

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 overflow-hidden border-b border-white/10 bg-[#141413]">
        <AletheiaInsightSection className="border-b-0" variant="dark" />
      </div>
      <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/10 p-2">
        {twins.map((t) => (
        <li key={t.name}>
          <div className="flex items-start gap-2.5 px-2 py-2.5 rounded-lg hover:bg-white/5">
            <div
              className="h-8 w-8 rounded-md grid place-items-center text-[10px] font-medium text-white shrink-0"
              style={{ background: t.color }}
            >
              {t.mono}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12.5px] font-medium text-parchment-50">
                  {t.name}
                </span>
                <StatusDot status={t.status} />
              </div>
              <p className="text-[10.5px] text-parchment-100/45">{t.role}</p>
              <p className="mt-0.5 text-[11px] text-parchment-100/60 truncate">
                {t.now}
              </p>
            </div>
          </div>
        </li>
      ))}
      <li className="p-2">
        <Link
          href="/twins"
          className="block text-center text-[11.5px] text-beacon-300 hover:underline py-2"
        >
          Faculty directory →
        </Link>
      </li>
    </ul>
    </div>
  );
}

function FeedPane() {
  return (
    <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-white/10">
      {LATTICE_FEED.map((f, i) => (
        <li key={i}>
          <Link
            href={f.href}
            className="block px-3 py-3 hover:bg-white/5"
          >
            <div className="text-[10px] uppercase tracking-wide text-parchment-100/40">
              {f.who} · {f.when}
            </div>
            <p className="mt-1 text-[12.5px] leading-snug text-parchment-100/90">
              {f.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FilesPane() {
  const files = [
    { name: "run-71a-traces.parquet", size: "24 MB" },
    { name: "hypothesis-map.k11", size: "128 KB" },
    { name: "manuscript-draft-v3.tex", size: "412 KB" },
  ];
  return (
    <ul className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
      {files.map((f) => (
        <li key={f.name}>
          <button
            type="button"
            className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/5"
          >
            <div className="text-[12px] text-parchment-100/90 truncate">{f.name}</div>
            <div className="text-[10px] text-parchment-100/40 font-mono">{f.size}</div>
          </button>
        </li>
      ))}
      <li className="pt-2">
        <Link href="/library" className="block text-center text-[11.5px] text-beacon-300 py-2">
          Open library →
        </Link>
      </li>
    </ul>
  );
}

function StatusDot({ status }: { status: string }) {
  const tone =
    status === "running"
      ? "bg-beacon-400"
      : status === "flagged"
      ? "bg-rose-400"
      : "bg-amber-400";
  return (
    <span className="inline-flex items-center gap-1 text-[9px] uppercase text-parchment-100/45">
      <span className={cn("h-1.5 w-1.5 rounded-full", tone)} />
      {status}
    </span>
  );
}
