"use client";

import { Network, Layers, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import type { FileKind } from "../data";

export function GraphPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <PanelShell
      title="Knowledge graph"
      actions={
        <>
          <IconBtn title="Layers"><Layers className="h-3 w-3" /></IconBtn>
        </>
      }
      footer={
        <>
          <span>847 nodes · 2 341 edges</span>
          <span>12 clusters</span>
        </>
      }
    >
      <div className="p-3 border-b border-ink-900/8">
        <button
          onClick={() => onOpen("/egfr/graph/pathway", "egfr-pathway", "canvas")}
          className="w-full text-left rounded-md border border-ink-900/10 bg-white hover:border-ink-900/20 px-3 py-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="font-mono text-[12.5px] text-ink-900">egfr-pathway.graph</div>
            <ArrowUpRight className="h-3.5 w-3.5 text-ink-400 group-hover:text-ink-700" />
          </div>
          <div className="text-[11px] text-ink-500 mt-1 leading-relaxed">
            Auto-built from your hypotheses, experiments, datasets, and 67
            papers. Click through to the 2D canvas.
          </div>
        </button>
      </div>

      <PanelGroup title="Stats" defaultOpen>
        <div className="px-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
          <Stat label="nodes" v="847" />
          <Stat label="edges" v="2 341" />
          <Stat label="clusters" v="12" />
          <Stat label="papers" v="67" />
          <Stat label="genes" v="214" />
          <Stat label="drugs" v="48" />
        </div>
      </PanelGroup>

      <PanelGroup title="Filters" defaultOpen>
        <ul className="px-3 space-y-1.5 text-[12px] text-ink-700 font-mono">
          {["hypotheses", "experiments", "papers", "datasets", "genes", "drugs", "diseases"].map(
            (f) => (
              <li key={f} className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-beacon-600" />
                <span>{f}</span>
              </li>
            )
          )}
        </ul>
      </PanelGroup>

      <PanelGroup title="Gaps · agent-detected" defaultOpen>
        <ul className="px-3 space-y-2 text-[11.5px] text-ink-700">
          <li className="flex gap-2">
            <Sparkles className="h-3 w-3 text-amber-600 mt-0.5" />
            <span>
              MEK → PI3K crosstalk is sparse (2 edges). <br />
              <span className="text-ink-400">11 candidate papers found</span>
            </span>
          </li>
          <li className="flex gap-2">
            <Sparkles className="h-3 w-3 text-amber-600 mt-0.5" />
            <span>
              No edges from HER3 to your resistance hypotheses. <br />
              <span className="text-ink-400">suggest H-005 proposal</span>
            </span>
          </li>
        </ul>
      </PanelGroup>

      <PanelGroup title="Query" defaultOpen>
        <div className="px-3">
          <div className="rounded border border-ink-900/10 bg-white px-2 py-1.5 text-[11px] font-mono text-ink-500">
            <div className="text-ink-400">cypher-like</div>
            <div className="mt-0.5 text-ink-800">
              MATCH (p:Protein)-[:CONNECTED_TO*1..2]-(:EGFR)
            </div>
          </div>
        </div>
      </PanelGroup>
    </PanelShell>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded border border-ink-900/8 bg-white px-2 py-1.5">
      <div className="text-[10px] text-ink-400">{label}</div>
      <div className="text-[12.5px] text-ink-900 tabular-nums">{v}</div>
    </div>
  );
}
