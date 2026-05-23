"use client";

import { ArrowUpRight, GitBranch, Network, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWorkspaceBundle, useIreNavigation } from "../workspace-context";
import { buildProgramLinks } from "../ire-navigation";
import { PanelShell, PanelGroup } from "./PanelChrome";
import type { FileKind } from "../data";

export function ProgramPanel() {
  const bundle = useWorkspaceBundle();
  const { openDoc, followInsight, activePath } = useIreNavigation();
  const links = buildProgramLinks(bundle);

  const mapNode = bundle.tree
    .flatMap(function flatten(n): { path: string; name: string; kind: FileKind }[] {
      const row = n.kind
        ? [{ path: n.path, name: n.name, kind: n.kind as FileKind }]
        : [];
      return [...row, ...(n.children?.flatMap(flatten) ?? [])];
    })
    .find((n) => n.kind === "map" || n.kind === "canvas");

  return (
    <PanelShell
      title="Program map"
      actions={
        mapNode ? (
          <button
            type="button"
            title="Open spatial map"
            onClick={() => openDoc(mapNode.path, mapNode.name, mapNode.kind)}
            className="h-6 w-6 grid place-items-center rounded border border-ink-900/10 bg-white text-ink-600 hover:text-ink-900"
          >
            <Network className="h-3 w-3" />
          </button>
        ) : null
      }
      footer={
        <>
          <span>{links.length} hypothesis branches</span>
          <span>
            {bundle.experiments.filter((e) => e.status === "running").length}{" "}
            running
          </span>
        </>
      }
    >
      <div className="px-3 py-3 border-b border-ink-900/8">
        <p className="text-[12px] leading-relaxed text-ink-600">
          One continuous view of your program - hypotheses, linked runs, and
          open gaps. Branches stay in sync with the co-science team in the left
          rail.
        </p>
      </div>

      <PanelGroup title="Active program chain" defaultOpen>
        <ul className="px-2 pb-2 space-y-2">
          {links.map((row) => (
            <li
              key={row.hypothesisId}
              className={cn(
                "rounded-lg border bg-white overflow-hidden",
                activePath === row.hypothesisPath
                  ? "border-beacon-500/40 ring-1 ring-beacon-500/20"
                  : "border-ink-900/10"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  openDoc(row.hypothesisPath, row.hypothesisId, "hyp")
                }
                className="w-full text-left px-3 py-2.5 hover:bg-ink-900/[0.03] group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-3 w-3 shrink-0 text-beacon-600" />
                      <span className="font-mono text-[11px] text-ink-900">
                        {row.hypothesisId}
                      </span>
                      <span className="rounded-full bg-ink-100 px-1.5 py-0.5 font-mono text-[9px] uppercase text-ink-600">
                        {row.status}
                      </span>
                    </div>
                    <p className="mt-1 font-marketing text-[11.5px] leading-snug text-ink-700 line-clamp-2">
                      {row.hypothesisTitle}
                    </p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-400 group-hover:text-ink-700" />
                </div>
                <div className="mt-2 h-1 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-beacon-500/80"
                    style={{ width: `${Math.round(row.confidence * 100)}%` }}
                  />
                </div>
              </button>

              {row.experiments.length > 0 ? (
                <ul className="border-t border-ink-900/6 bg-parchment-50/80 divide-y divide-ink-900/6">
                  {row.experiments.map((exp) => (
                    <li key={exp.id}>
                      <button
                        type="button"
                        onClick={() => openDoc(exp.path, exp.id, "planner")}
                        className={cn(
                          "w-full text-left px-3 py-2 font-mono text-[10.5px] hover:bg-white flex items-center justify-between gap-2",
                          activePath === exp.path && "bg-white"
                        )}
                      >
                        <span className="text-ink-800">{exp.id}</span>
                        <span className="text-ink-500">{exp.status}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="border-t border-ink-900/6 px-3 py-2 font-marketing text-[10.5px] text-ink-500">
                  No runs linked yet
                </div>
              )}
            </li>
          ))}
        </ul>
      </PanelGroup>

      <PanelGroup title="Agent-suggested branches" defaultOpen>
        <ul className="px-3 space-y-2 text-[11.5px] text-ink-700">
          {bundle.insights
            .filter((i) => i.source === "kg" || i.source === "hyp")
            .slice(0, 3)
            .map((i) => (
              <li key={i.id} className="flex gap-2 rounded-md border border-dashed border-amber-300/60 bg-amber-50/50 px-2.5 py-2">
                <Sparkles className="h-3 w-3 shrink-0 text-amber-700 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium text-ink-900">{i.title}</div>
                  <button
                    type="button"
                    onClick={() => followInsight(i)}
                    className="mt-1 text-beacon-700 hover:underline"
                  >
                    Open related artifact →
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </PanelGroup>
    </PanelShell>
  );
}
