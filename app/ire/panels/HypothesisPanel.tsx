"use client";

import * as React from "react";
import { Plus, GitBranch, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import { HYPOTHESES, type HypothesisRecord, type FileKind } from "../data";

export function HypothesisPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");
  const groups = HYPOTHESES.reduce<Record<string, HypothesisRecord[]>>((acc, h) => {
    if (!q || h.id.toLowerCase().includes(q.toLowerCase()) || h.title.toLowerCase().includes(q.toLowerCase())) {
      (acc[h.status] ||= []).push(h);
    }
    return acc;
  }, {});

  return (
    <PanelShell
      title="Hypothesis manager"
      search={q}
      onSearch={setQ}
      actions={
        <>
          <IconBtn title="New hypothesis"><Plus className="h-3 w-3" /></IconBtn>
          <IconBtn title="Generate competing"><GitBranch className="h-3 w-3" /></IconBtn>
        </>
      }
      footer={
        <>
          <span>{HYPOTHESES.length} hypotheses · 2 refuted</span>
          <span>bayesian · live</span>
        </>
      }
    >
      <div className="px-3 py-3 border-b border-ink-900/8">
        <BeliefSummary />
      </div>
      {(["active", "testing", "draft", "refuted", "validated"] as const).map((s) =>
        groups[s] && groups[s].length ? (
          <PanelGroup key={s} title={s} count={groups[s].length} defaultOpen={s !== "refuted"}>
            {groups[s].map((h) => (
              <HypothesisCard key={h.id} h={h} onOpen={onOpen} />
            ))}
          </PanelGroup>
        ) : null
      )}
      <div className="p-3">
        <button
          onClick={() => onOpen("/egfr/hyp/map", "egfr-hypothesis-map", "map")}
          className="w-full text-left rounded-md border border-ink-900/10 bg-white hover:border-ink-900/20 px-3 py-2.5 text-[12px] text-ink-700"
        >
          <div className="font-medium text-ink-900">Open hypothesis map</div>
          <div className="text-[11px] text-ink-500 mt-0.5">
            Spatial view · genealogy · competing mechanisms
          </div>
        </button>
      </div>
    </PanelShell>
  );
}

function BeliefSummary() {
  return (
    <div className="font-mono text-[11px] text-ink-600 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-ink-500">prior mass</span>
        <Bar v={0.52} tone="ink" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-ink-500">posterior mass</span>
        <Bar v={0.63} tone="beacon" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-ink-500">info gained</span>
        <span className="text-ink-900">0.31 bits</span>
      </div>
    </div>
  );
}

function HypothesisCard({
  h,
  onOpen,
}: {
  h: HypothesisRecord;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <button
      onClick={() => onOpen(h.path, h.id, "hyp")}
      className="w-full text-left px-3 py-2.5 hover:bg-ink-900/5 block border-b border-ink-900/6 last:border-b-0"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-ink-900 font-medium">{h.id}</span>
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.14em]",
            h.status === "active" && "text-beacon-700",
            h.status === "testing" && "text-amber-700",
            h.status === "draft" && "text-ink-500",
            h.status === "refuted" && "text-rose-700",
            h.status === "validated" && "text-emerald-700"
          )}
        >
          {h.status}
        </span>
      </div>
      <div className="text-[12px] text-ink-700 leading-snug mt-0.5 line-clamp-2">
        {h.title}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Bar v={h.confidence} tone={h.status === "refuted" ? "rose" : "beacon"} />
        <span className="font-mono text-[10.5px] text-ink-500 tabular-nums">
          {Math.round(h.confidence * 100)}%
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-ink-500 font-mono">
        <span>{h.evidence.papers} papers</span>
        <span>{h.evidence.experiments} exps</span>
        <span>{h.evidence.datasets} data</span>
        {h.contradictions > 0 && (
          <span className="text-rose-700 inline-flex items-center gap-0.5 ml-auto">
            <AlertTriangle className="h-2.5 w-2.5" /> {h.contradictions}
          </span>
        )}
      </div>
    </button>
  );
}

function Bar({ v, tone }: { v: number; tone: "beacon" | "rose" | "emerald" | "ink" }) {
  const toneCls = {
    beacon: "bg-beacon-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    ink: "bg-ink-600",
  }[tone];
  return (
    <div className="flex-1 h-1 rounded-full bg-ink-900/8 overflow-hidden">
      <div
        className={cn("h-full rounded-full", toneCls)}
        style={{ width: `${Math.max(3, v * 100)}%` }}
      />
    </div>
  );
}
