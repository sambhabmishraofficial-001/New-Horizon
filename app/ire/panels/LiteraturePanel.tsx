"use client";

import * as React from "react";
import { Plus, RefreshCcw, Pin, Flame, AlertTriangle, Link2, Lightbulb } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import type { PaperRecord, FileKind } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

export function LiteraturePanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");
  const { papers } = useWorkspaceBundle();
  const filtered = papers.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.authors.toLowerCase().includes(q.toLowerCase()) ||
      p.keyClaim.toLowerCase().includes(q.toLowerCase())
  );
  const byTag = (tag: PaperRecord["tag"]) => filtered.filter((p) => p.tag === tag);

  return (
    <PanelShell
      title="Literature hub"
      search={q}
      onSearch={setQ}
      actions={
        <>
          <IconBtn title="Import paper"><Plus className="h-3 w-3" /></IconBtn>
          <IconBtn title="Sync"><RefreshCcw className="h-3 w-3" /></IconBtn>
        </>
      }
      footer={
        <>
          <span>{filtered.length} / {papers.length} in workspace</span>
          <span>watcher · idle</span>
        </>
      }
    >
      <div className="px-3 py-3 border-b border-ink-900/8 text-[11.5px] text-ink-600">
        <div className="font-medium text-ink-700 mb-2 text-[10.5px] uppercase tracking-[0.16em]">
          Smart collections
        </div>
        <ul className="space-y-1.5 font-mono">
          <SmartRow icon={Pin} tone="ink">Directly cited · {byTag("directly-cited").length}</SmartRow>
          <SmartRow icon={Flame} tone="amber">Trending · {byTag("trending").length}</SmartRow>
          <SmartRow icon={AlertTriangle} tone="rose">Contradictions · {byTag("contradicts").length}</SmartRow>
          <SmartRow icon={Link2} tone="beacon">Competitor mentions · {byTag("competitor").length}</SmartRow>
          <SmartRow icon={Lightbulb} tone="violet">Agent suggested · {byTag("suggested").length}</SmartRow>
        </ul>
      </div>

      {(
        [
          ["trending", "Trending"],
          ["contradicts", "Contradicts your hypotheses"],
          ["directly-cited", "Directly cited"],
          ["competitor", "Competitor labs"],
          ["suggested", "Agent-suggested"],
        ] as const
      ).map(([tag, label]) =>
        byTag(tag).length ? (
          <PanelGroup
            key={tag}
            title={label}
            count={byTag(tag).length}
            defaultOpen={tag !== "competitor" && tag !== "directly-cited"}
          >
            {byTag(tag).map((p) => (
              <PaperCard key={p.id} p={p} onOpen={onOpen} />
            ))}
          </PanelGroup>
        ) : null
      )}
    </PanelShell>
  );
}

function SmartRow({
  icon: Icon,
  tone,
  children,
}: {
  icon: any;
  tone: "ink" | "amber" | "rose" | "beacon" | "violet";
  children: React.ReactNode;
}) {
  const toneCls = {
    ink: "text-ink-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
    beacon: "text-beacon-700",
    violet: "text-violet-700",
  }[tone];
  return (
    <li className={cn("flex items-center gap-2 cursor-pointer hover:underline", toneCls)}>
      <Icon className="h-3 w-3" strokeWidth={1.75} /> {children}
    </li>
  );
}

function PaperCard({
  p,
  onOpen,
}: {
  p: PaperRecord;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <button
      onClick={() => onOpen(p.path, p.id, "paper")}
      className="w-full text-left px-3 py-2 hover:bg-ink-900/5 block border-b border-ink-900/6 last:border-b-0"
    >
      <div className="text-[12px] text-ink-900 leading-snug line-clamp-2 font-display">
        {p.title}
      </div>
      <div className="text-[10.5px] text-ink-500 font-mono mt-0.5 truncate">
        {p.authors} · {p.venue} {p.year}
      </div>
      <div className="mt-1 text-[11px] text-ink-600 line-clamp-2">
        <span className="text-ink-400 font-mono">claim · </span>
        {p.keyClaim}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[10.5px] font-mono text-ink-500">
        <div className="flex-1 h-1 rounded-full bg-ink-900/8 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              p.tag === "contradicts" ? "bg-rose-500" : "bg-beacon-500"
            )}
            style={{ width: `${p.relevance * 100}%` }}
          />
        </div>
        <span className="tabular-nums">{Math.round(p.relevance * 100)}%</span>
        {p.linkedHypothesis && <span className="text-beacon-700">→ {p.linkedHypothesis}</span>}
      </div>
    </button>
  );
}
