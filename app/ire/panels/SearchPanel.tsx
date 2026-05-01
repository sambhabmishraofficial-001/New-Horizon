"use client";

import * as React from "react";
import { PanelShell } from "./PanelChrome";
import { cn } from "@/lib/cn";
import {
  RESEARCH_TREE,
  HYPOTHESES,
  EXPERIMENTS,
  DATASETS,
  PAPERS,
  PROTOCOLS,
  FILE_META,
  type FileKind,
} from "../data";

type Hit = {
  path: string;
  name: string;
  kind: FileKind;
  preview: string;
  group: string;
};

export function SearchPanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const [q, setQ] = React.useState("");

  const index = React.useMemo<Hit[]>(() => {
    const hits: Hit[] = [];
    // walk tree
    const walk = (ns: any[]) => {
      ns.forEach((n) => {
        if (n.kind) hits.push({ path: n.path, name: n.name, kind: n.kind, preview: n.meta ?? "", group: "Files" });
        n.children && walk(n.children);
      });
    };
    walk(RESEARCH_TREE);
    HYPOTHESES.forEach((h) => hits.push({ path: h.path, name: h.id, kind: "hyp", preview: h.title, group: "Hypotheses" }));
    EXPERIMENTS.forEach((e) => hits.push({ path: e.path, name: e.id, kind: "exp", preview: e.title, group: "Experiments" }));
    DATASETS.forEach((d) => hits.push({ path: d.path, name: d.name, kind: "dataset", preview: `${d.rows} × ${d.cols}`, group: "Datasets" }));
    PAPERS.forEach((p) => hits.push({ path: p.path, name: p.id, kind: "paper", preview: p.title, group: "Literature" }));
    PROTOCOLS.forEach((p) => hits.push({ path: p.path, name: p.name, kind: "protocol", preview: `v${p.version} · ${p.steps} steps`, group: "Protocols" }));
    return hits;
  }, []);

  const filtered = q
    ? index.filter(
        (h) =>
          h.name.toLowerCase().includes(q.toLowerCase()) ||
          h.preview.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const groups = filtered.reduce<Record<string, Hit[]>>((acc, h) => {
    (acc[h.group] ||= []).push(h);
    return acc;
  }, {});

  return (
    <PanelShell
      title="Search · research-wide"
      search={q}
      onSearch={setQ}
      footer={
        <>
          <span>{q ? `${filtered.length} hits` : "type to search"}</span>
          <span>papers · data · hyp · proto</span>
        </>
      }
    >
      {!q ? (
        <div className="px-3 py-4 text-[12px] text-ink-500">
          <div className="font-medium text-ink-700 mb-2">Queries you might try</div>
          <ul className="space-y-1.5 font-mono text-[11.5px]">
            {[
              "T790M",
              "contradicts H-001",
              "FAIR < 80",
              "running experiments",
              "osimertinib resistance",
              "IC50 nM",
              "BSA blocking buffer",
              "failed lot",
            ].map((e) => (
              <li
                key={e}
                onClick={() => setQ(e)}
                className="cursor-pointer text-beacon-700 hover:underline"
              >
                &gt; {e}
              </li>
            ))}
          </ul>
          <div className="mt-5 text-[11px] text-ink-400 leading-relaxed">
            Full-text across hypotheses, experiments, datasets, literature,
            protocols, notebooks, and agent messages. Also exposed via ⌘P.
          </div>
        </div>
      ) : (
        <div>
          {Object.entries(groups).map(([grp, hits]) => (
            <div key={grp} className="border-b border-ink-900/8">
              <div className="px-3 h-6 flex items-center text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
                {grp} · {hits.length}
              </div>
              {hits.slice(0, 12).map((h) => {
                const meta = FILE_META[h.kind];
                return (
                  <button
                    key={h.path + h.name}
                    onClick={() => onOpen(h.path, h.name, h.kind)}
                    className="w-full text-left px-3 py-1.5 hover:bg-ink-900/5 flex items-start gap-2 min-w-0"
                  >
                    <meta.icon
                      className="h-3.5 w-3.5 mt-[3px] shrink-0"
                      strokeWidth={1.75}
                      style={{ color: meta.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-[12px] font-mono text-ink-900 truncate">
                        {h.name}
                        <span className="text-ink-400">{meta.ext}</span>
                      </div>
                      <div className="text-[11px] text-ink-500 truncate">{h.preview}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  );
}
