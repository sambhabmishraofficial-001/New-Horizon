"use client";

import * as React from "react";
import { Database, Upload, ShieldCheck, GitCommit } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import type { DatasetRecord, FileKind } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

export function DataPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");
  const { datasets } = useWorkspaceBundle();
  const fairVals = datasets.map((d) => d.fair).filter((f) => f > 0);
  const fairAvg =
    fairVals.length > 0 ? Math.round(fairVals.reduce((a, b) => a + b, 0) / fairVals.length) : null;
  const groups = datasets.reduce<Record<string, DatasetRecord[]>>((acc, d) => {
    if (!q || d.name.toLowerCase().includes(q.toLowerCase())) {
      (acc[d.kind] ||= []).push(d);
    }
    return acc;
  }, {});

  return (
    <PanelShell
      title="Data explorer"
      search={q}
      onSearch={setQ}
      actions={
        <>
          <IconBtn title="Import dataset"><Upload className="h-3 w-3" /></IconBtn>
        </>
      }
      footer={
        <>
          <span>
            {datasets.length} datasets
            {fairAvg != null ? ` · avg FAIR ${fairAvg}` : " · FAIR not rated"}
          </span>
          <span>signed · lineage ✓</span>
        </>
      }
    >
      {(["raw", "processed", "external"] as const).map((k) =>
        groups[k] && groups[k].length ? (
          <PanelGroup
            key={k}
            title={k === "raw" ? "Raw data" : k === "processed" ? "Processed" : "External"}
            count={groups[k].length}
          >
            {groups[k].map((d) => (
              <DatasetRow key={d.id} d={d} onOpen={onOpen} />
            ))}
          </PanelGroup>
        ) : null
      )}
    </PanelShell>
  );
}

function DatasetRow({
  d,
  onOpen,
}: {
  d: DatasetRecord;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <button
      onClick={() => onOpen(d.path, d.name, "dataset")}
      className="w-full text-left px-3 py-2 hover:bg-ink-900/5 block border-b border-ink-900/6 last:border-b-0"
    >
      <div className="flex items-baseline gap-2 min-w-0">
        <Database className="h-3.5 w-3.5 text-emerald-700 shrink-0" strokeWidth={1.75} />
        <span className="font-mono text-[12px] text-ink-900 truncate">{d.name}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-ink-500 font-mono">
        {d.rows.toLocaleString()} rows × {d.cols} cols
      </div>
      <div className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] text-ink-500">
        <span className="inline-flex items-center gap-1">
          <ShieldCheck
            className={cn(
              "h-2.5 w-2.5",
              d.fair >= 90 ? "text-emerald-600" : d.fair >= 80 ? "text-amber-600" : "text-rose-600"
            )}
          />
          FAIR {d.fair}
        </span>
        <span className="truncate">· {d.source}</span>
      </div>
      {d.provenance && (
        <div className="mt-0.5 text-[10px] text-ink-400 font-mono inline-flex items-center gap-1">
          <GitCommit className="h-2.5 w-2.5" /> {d.provenance}
        </div>
      )}
      {d.issues && d.issues.length > 0 && (
        <div className="mt-0.5 text-[10px] text-amber-700 font-mono">
          {d.issues[0]}
        </div>
      )}
    </button>
  );
}
