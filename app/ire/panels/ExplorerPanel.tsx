"use client";

import * as React from "react";
import { ChevronRight, Folder, FolderOpen, Plus, RefreshCcw, FolderTree } from "lucide-react";
import { cn } from "@/lib/cn";
import { PanelShell, IconBtn } from "./PanelChrome";
import { FILE_META, type TreeNode, type FileKind } from "../data";
import { useWorkspaceBundle } from "../workspace-context";

function expandDefaultsForTree(tree: TreeNode[]): Record<string, boolean> {
  const r: Record<string, boolean> = {};
  const walk = (nodes: TreeNode[], depth: number) => {
    for (const n of nodes) {
      r[n.id] = depth <= 1;
      if (n.children) walk(n.children, depth + 1);
    }
  };
  walk(tree, 0);
  return r;
}

function countArtifactNodes(nodes: TreeNode[]): number {
  let n = 0;
  const walk = (xs: TreeNode[]) => {
    xs.forEach((node) => {
      if (node.kind) n++;
      if (node.children) walk(node.children);
    });
  };
  walk(nodes);
  return n;
}

export function ExplorerPanel({
  activePath,
  onOpen,
}: {
  activePath: string;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const { tree, chrome } = useWorkspaceBundle();
  const [expanded, setExpanded] = React.useState(() => expandDefaultsForTree(tree));
  const [q, setQ] = React.useState("");

  const toggle = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const matches = (n: TreeNode): boolean => {
    if (!q) return true;
    if (n.name.toLowerCase().includes(q.toLowerCase())) return true;
    return !!n.children?.some(matches);
  };

  return (
    <PanelShell
      title="Explorer"
      actions={
        <>
          <IconBtn title="New file"><Plus className="h-3 w-3" /></IconBtn>
          <IconBtn title="Refresh"><RefreshCcw className="h-3 w-3" /></IconBtn>
          <IconBtn title="Collapse all"><FolderTree className="h-3 w-3" /></IconBtn>
        </>
      }
      search={q}
      onSearch={setQ}
      footer={
        <>
          <span>24 files · 9 open</span>
          <span>@egfr ▸ v3</span>
        </>
      }
    >
      <div className="py-1.5 font-mono">
        {tree.filter(matches).map((node) => (
          <TreeBranch
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            toggle={toggle}
            activePath={activePath}
            onOpen={onOpen}
          />
        ))}
      </div>
    </PanelShell>
  );
}

function TreeBranch({
  node,
  depth,
  expanded,
  toggle,
  activePath,
  onOpen,
}: {
  node: TreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  activePath: string;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded[node.id];
  const kindMeta = node.kind ? FILE_META[node.kind] : undefined;
  const Icon = kindMeta?.icon ?? (isOpen ? FolderOpen : Folder);
  const active = activePath === node.path && !!node.kind;

  const statusDot =
    node.status === "active"
      ? "bg-beacon-500"
      : node.status === "testing"
      ? "bg-amber-500"
      : node.status === "validated" || node.status === "completed"
      ? "bg-emerald-500"
      : node.status === "refuted" || node.status === "anomaly"
      ? "bg-rose-500"
      : node.status === "running"
      ? "bg-beacon-500 animate-pulseSoft"
      : null;

  return (
    <div className="min-w-0">
      <button
        onClick={() =>
          hasChildren
            ? toggle(node.id)
            : node.kind
            ? onOpen(node.path, node.name, node.kind)
            : null
        }
        className={cn(
          "w-full flex items-center h-[22px] px-1.5 text-[12px] gap-1 min-w-0 rounded-sm",
          active
            ? "bg-beacon-50 text-ink-900"
            : "hover:bg-ink-900/5 text-ink-700"
        )}
        style={{ paddingLeft: 6 + depth * 12 }}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              "h-3 w-3 shrink-0 text-ink-400 transition-transform",
              isOpen && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <Icon
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={1.75}
          style={{ color: kindMeta ? kindMeta.color : "#8E8E80" }}
        />
        <span className="truncate flex-1 text-left flex items-center gap-1.5">
          <span className="truncate">
            {node.name}
            {kindMeta && <span className="text-ink-400">{kindMeta.ext}</span>}
          </span>
          {statusDot && (
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDot)} />
          )}
        </span>
        {node.badge && (
          <span
            className={cn(
              "text-[9.5px] font-medium px-1 rounded tabular-nums",
              node.badge === "M" && "text-beacon-700",
              node.badge === "U" && "text-amber-700",
              node.badge === "!" && "text-rose-700"
            )}
          >
            {node.badge}
          </span>
        )}
        {!node.badge && node.meta && !hasChildren && (
          <span className="text-[10px] text-ink-400 truncate max-w-[72px]">
            {node.meta}
          </span>
        )}
      </button>

      {hasChildren && isOpen && (
        <div>
          {node.children!.map((c) => (
            <TreeBranch
              key={c.id}
              node={c}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              activePath={activePath}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
