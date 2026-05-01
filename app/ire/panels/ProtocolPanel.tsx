"use client";

import * as React from "react";
import { Plus, Share2, Play, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import { PROTOCOLS, type ProtocolRecord, type FileKind } from "../data";

export function ProtocolPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState<"mine" | "community">("mine");
  const filtered = PROTOCOLS.filter(
    (p) => p.owner === tab && (!q || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <PanelShell
      title="Protocols"
      search={q}
      onSearch={setQ}
      actions={
        <>
          <IconBtn title="New protocol"><Plus className="h-3 w-3" /></IconBtn>
          <IconBtn title="Share"><Share2 className="h-3 w-3" /></IconBtn>
        </>
      }
      footer={
        <>
          <span>{filtered.length} protocols · {tab}</span>
          <span>community · 4 200+</span>
        </>
      }
    >
      <div className="px-3 py-2 flex gap-1 border-b border-ink-900/8">
        {(["mine", "community"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-2 h-6 text-[11px] font-mono rounded",
              tab === t ? "bg-ink-900 text-parchment-50" : "text-ink-600 hover:bg-ink-900/5"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <PanelGroup title="Protocols" count={filtered.length}>
        {filtered.map((p) => (
          <ProtocolCard key={p.id} p={p} onOpen={onOpen} />
        ))}
      </PanelGroup>

      <div className="p-3">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium mb-1.5">
          Protocol intelligence
        </div>
        <div className="rounded-md border border-violet-500/15 bg-violet-50 px-2.5 py-2 text-[11.5px] text-violet-900 leading-relaxed">
          Step 6 of <span className="font-mono">Western_blot_EGFR</span> has 3
          variants across 41 community runs. BSA shows <b>12% better S/N</b> for
          pEGFR.
          <button className="mt-1 block text-violet-700 hover:underline">
            Fork and apply →
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

function ProtocolCard({
  p,
  onOpen,
}: {
  p: ProtocolRecord;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <div className="px-3 py-2 hover:bg-ink-900/5 block border-b border-ink-900/6 last:border-b-0">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-ink-900 truncate">{p.name}</span>
        <span className="text-[10px] text-ink-400 font-mono">v{p.version}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-3 text-[10.5px] font-mono text-ink-500">
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" /> {Math.round(p.success * 100)}%
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" /> {p.duration}
        </span>
        <span>{p.runs} runs</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          onClick={() => onOpen(p.path, p.name, "protocol")}
          className="h-6 px-2 rounded text-[10.5px] border border-ink-900/10 hover:bg-ink-900/5 text-ink-700"
        >
          open
        </button>
        <button className="h-6 px-2 rounded text-[10.5px] text-parchment-50 bg-ink-900 hover:bg-ink-800 inline-flex items-center gap-1">
          <Play className="h-2.5 w-2.5" /> run
        </button>
        <span className="ml-auto text-[10px] text-ink-400">
          used {p.lastUsed}
        </span>
      </div>
    </div>
  );
}
