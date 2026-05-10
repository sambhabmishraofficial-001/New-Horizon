"use client";

import * as React from "react";
import { Plus, LayoutGrid, Play, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, PanelGroup, IconBtn } from "./PanelChrome";
import type { ExperimentRecord, FileKind, TreeNode } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

function findPlannerNode(nodes: TreeNode[]): TreeNode | undefined {
  for (const n of nodes) {
    if (n.kind === "planner") return n;
    if (n.children) {
      const inner = findPlannerNode(n.children);
      if (inner) return inner;
    }
  }
}

export function ExperimentsPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");
  const { experiments, hypotheses, tree } = useWorkspaceBundle();
  const planner = React.useMemo(() => findPlannerNode(tree), [tree]);
  const groups = experiments.reduce<Record<string, ExperimentRecord[]>>((acc, e) => {
    if (!q || e.id.toLowerCase().includes(q.toLowerCase()) || e.title.toLowerCase().includes(q.toLowerCase())) {
      (acc[e.status] ||= []).push(e);
    }
    return acc;
  }, {});

  return (
    <PanelShell
      title="Experiments"
      search={q}
      onSearch={setQ}
      actions={
        <>
          <IconBtn title="New experiment"><Plus className="h-3 w-3" /></IconBtn>
          <IconBtn title="Open planner"
            onClick={() =>
              planner &&
              onOpen(planner.path, planner.name.replace(/\.[^.]+$/, ""), "planner")
            }
          >
            <LayoutGrid className="h-3 w-3" />
          </IconBtn>
        </>
      }
      footer={
        <>
          <span>
            {experiments.filter((e) => e.status === "running").length} running ·{" "}
            {experiments.filter((e) => e.status === "designed").length} designed ·{" "}
            {experiments.filter((e) => e.status === "backlog").length} backlog
          </span>
          <span>auto-power · pre-reg</span>
        </>
      }
    >
      {(["running", "designed", "backlog", "completed", "failed"] as const).map((s) =>
        groups[s] && groups[s].length ? (
          <PanelGroup key={s} title={s} count={groups[s].length} defaultOpen={s === "running" || s === "designed"}>
            {groups[s].map((e) => (
              <ExperimentRow key={e.id} e={e} onOpen={onOpen} />
            ))}
          </PanelGroup>
        ) : null
      )}
      <div className="p-3 border-t border-ink-900/8">
        <div className="text-[11px] text-ink-500 mb-2">Design assistant</div>
        <div className="rounded-md border border-beacon-500/20 bg-beacon-50 px-2.5 py-2 text-[11.5px] text-beacon-900 leading-relaxed">
          Link each experiment to a hypothesis, protocol version, and instrument profile before scaling
          replicate counts
          {hypotheses[0] ? (
            <>
              {" "}
              for <span className="font-mono">{hypotheses[0].id}</span>.
            </>
          ) : (
            "."
          )}
          <button type="button" className="mt-1.5 block text-beacon-700 hover:underline">
            Open planner →
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

function ExperimentRow({
  e,
  onOpen,
}: {
  e: ExperimentRecord;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <button
      onClick={() => onOpen(e.path, e.id, "exp")}
      className="w-full text-left px-3 py-2 hover:bg-ink-900/5 block border-b border-ink-900/6 last:border-b-0"
    >
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-ink-900 font-medium">{e.id}</span>
        <span className="text-[10px] text-ink-500">· {e.hypothesis}</span>
        <StatusChip status={e.status} />
      </div>
      <div className="text-[12px] text-ink-700 leading-snug mt-0.5 line-clamp-1">
        {e.title}
      </div>
      {e.progress && (
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] text-ink-500">
          <div className="flex-1 h-1 rounded-full bg-ink-900/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-beacon-500"
              style={{ width: `${(e.progress.step / e.progress.total) * 100}%` }}
            />
          </div>
          <span className="tabular-nums">{e.progress.step}/{e.progress.total}</span>
          {e.progress.label && <span className="text-ink-400">· {e.progress.label}</span>}
        </div>
      )}
      <div className="mt-1 flex items-center gap-3 text-[10.5px] text-ink-500 font-mono">
        {e.instrument && <span>{e.instrument}</span>}
        {e.eta && <span>eta {e.eta}</span>}
        <span className="ml-auto text-ink-400">{e.owner}</span>
      </div>
    </button>
  );
}

function StatusChip({ status }: { status: ExperimentRecord["status"] }) {
  const map = {
    running: { cls: "text-beacon-700", Icon: Play, label: "running" },
    designed: { cls: "text-amber-700", Icon: Clock, label: "designed" },
    backlog: { cls: "text-ink-500", Icon: Clock, label: "backlog" },
    completed: { cls: "text-emerald-700", Icon: CheckCircle2, label: "completed" },
    failed: { cls: "text-rose-700", Icon: AlertTriangle, label: "failed" },
  } as const;
  const { cls, Icon, label } = map[status];
  return (
    <span className={cn("ml-auto inline-flex items-center gap-1 text-[10px] font-mono", cls)}>
      <Icon className="h-2.5 w-2.5" /> {label}
    </span>
  );
}
