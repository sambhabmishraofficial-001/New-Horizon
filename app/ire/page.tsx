"use client";

import * as React from "react";
import {
  Files,
  Search,
  Sparkles,
  Network,
  FlaskConical,
  Database,
  BookOpen,
  ListChecks,
  GitBranch,
  Settings,
  User,
  X,
  Circle,
  GitCommit,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Cloud,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

import { ProjectBar } from "./ProjectBar";
import { AgentRail } from "./AgentRail";
import { BottomPanel } from "./BottomPanel";

import { ExplorerPanel } from "./panels/ExplorerPanel";
import { SearchPanel } from "./panels/SearchPanel";
import { HypothesisPanel } from "./panels/HypothesisPanel";
import { ExperimentsPanel } from "./panels/ExperimentsPanel";
import { DataPanel } from "./panels/DataPanel";
import { LiteraturePanel } from "./panels/LiteraturePanel";
import { ProtocolPanel } from "./panels/ProtocolPanel";
import { GraphPanel } from "./panels/GraphPanel";

import {
  InvariantDoc,
  RunDoc,
  TwinDoc,
  DatasetDoc,
  EnvDoc,
  EmptyDoc,
} from "./Documents";
import { HypothesisDocV2 } from "./docs/HypothesisDocV2";
import { NotebookDoc } from "./docs/NotebookDoc";
import { ManuscriptDoc } from "./docs/ManuscriptDoc";
import { PlannerDoc } from "./docs/PlannerDoc";
import { VizStudioDoc } from "./docs/VizStudioDoc";
import { HypothesisMapDoc } from "./docs/HypothesisMapDoc";
import { KnowledgeGraphDoc } from "./docs/KnowledgeGraphDoc";
import { PaperDoc } from "./docs/PaperDoc";
import { ProtocolDoc } from "./docs/ProtocolDoc";

import {
  FILE_META,
  INITIAL_OPEN,
  INITIAL_ACTIVE,
  type FileKind,
  type OpenDoc,
} from "./data";

type ActivityItem =
  | "explorer"
  | "search"
  | "hypotheses"
  | "experiments"
  | "data"
  | "literature"
  | "protocols"
  | "graph"
  | "lineage";

export default function IREPage() {
  const [open, setOpen] = React.useState<OpenDoc[]>(INITIAL_OPEN);
  const [active, setActive] = React.useState<string>(INITIAL_ACTIVE);
  const [activity, setActivity] = React.useState<ActivityItem>("explorer");
  const [panelCollapsed, setPanelCollapsed] = React.useState(false);
  const [agentCollapsed, setAgentCollapsed] = React.useState(false);
  const [full, setFull] = React.useState(true);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && full) setFull(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const openDoc = (path: string, name: string, kind: FileKind) => {
    setOpen((prev) =>
      prev.find((d) => d.path === path) ? prev : [...prev, { path, name, kind }]
    );
    setActive(path);
  };
  const closeDoc = (path: string) => {
    setOpen((prev) => {
      const next = prev.filter((d) => d.path !== path);
      if (active === path && next.length) setActive(next[next.length - 1].path);
      return next;
    });
  };

  const activeDoc = open.find((d) => d.path === active);

  return (
    <div className={full ? "fixed inset-0 z-50 w-full flex flex-col overflow-hidden bg-parchment-50" : "h-[calc(100vh-57px)] w-full flex flex-col overflow-hidden bg-parchment-50"}>
      <ProjectBar full={full} onToggleFull={() => setFull((v) => !v)} />

      <div className="flex-1 min-h-0 flex">
        <ActivityBar
          active={activity}
          setActive={setActivity}
          agentCollapsed={agentCollapsed}
          toggleAgent={() => setAgentCollapsed((s) => !s)}
        />

        <div className="w-[288px] shrink-0 min-w-0">
          <SidePanel activity={activity} activePath={active} onOpen={openDoc} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <TabBar
            open={open}
            active={active}
            onSelect={setActive}
            onClose={closeDoc}
          />
          <div className="flex-1 min-h-0 flex flex-col">
            {activeDoc ? renderDoc(activeDoc) : <EmptyState />}
            <BottomPanel
              collapsed={panelCollapsed}
              setCollapsed={setPanelCollapsed}
            />
          </div>
        </div>

        {!agentCollapsed && <AgentRail activeContext={activeDoc?.name ?? "—"} />}
      </div>

      <StatusBar activeDoc={activeDoc} />
    </div>
  );
}

function SidePanel({
  activity,
  activePath,
  onOpen,
}: {
  activity: ActivityItem;
  activePath: string;
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  switch (activity) {
    case "explorer":
      return <ExplorerPanel activePath={activePath} onOpen={onOpen} />;
    case "search":
      return <SearchPanel onOpen={onOpen} />;
    case "hypotheses":
      return <HypothesisPanel onOpen={onOpen} />;
    case "experiments":
      return <ExperimentsPanel onOpen={onOpen} />;
    case "data":
      return <DataPanel onOpen={onOpen} />;
    case "literature":
      return <LiteraturePanel onOpen={onOpen} />;
    case "protocols":
      return <ProtocolPanel onOpen={onOpen} />;
    case "graph":
      return <GraphPanel onOpen={onOpen} />;
    case "lineage":
      return <LineagePanel onOpen={onOpen} />;
    default:
      return <ExplorerPanel activePath={activePath} onOpen={onOpen} />;
  }
}

function renderDoc(d: OpenDoc) {
  switch (d.kind) {
    case "hyp":
      return <HypothesisDocV2 path={d.path} />;
    case "invariant":
      return <InvariantDoc />;
    case "run":
      return <RunDoc />;
    case "twin":
      return <TwinDoc />;
    case "dataset":
      return <DatasetDoc />;
    case "env":
      return <EnvDoc />;
    case "notebook":
      return <NotebookDoc />;
    case "manuscript":
      return <ManuscriptDoc />;
    case "planner":
      return <PlannerDoc />;
    case "viz":
      return <VizStudioDoc />;
    case "map":
      return <HypothesisMapDoc />;
    case "canvas":
      return <KnowledgeGraphDoc />;
    case "paper":
      return <PaperDoc path={d.path} />;
    case "protocol":
      return <ProtocolDoc />;
    default:
      return <EmptyDoc name={d.name} />;
  }
}

/* =====================================================================
   Activity bar
   ===================================================================== */

function ActivityBar({
  active,
  setActive,
  agentCollapsed,
  toggleAgent,
}: {
  active: ActivityItem;
  setActive: (a: ActivityItem) => void;
  agentCollapsed: boolean;
  toggleAgent: () => void;
}) {
  const top: { id: ActivityItem; icon: any; label: string; badge?: number }[] = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "hypotheses", icon: Sparkles, label: "Hypothesis manager" },
    { id: "experiments", icon: FlaskConical, label: "Experiments", badge: 2 },
    { id: "data", icon: Database, label: "Data explorer" },
    { id: "literature", icon: BookOpen, label: "Literature hub", badge: 2 },
    { id: "protocols", icon: ListChecks, label: "Protocol library" },
    { id: "graph", icon: Network, label: "Knowledge graph" },
    { id: "lineage", icon: GitBranch, label: "Lineage" },
  ];
  return (
    <div className="w-12 shrink-0 bg-ink-900 flex flex-col items-center py-1 border-r border-black/30">
      {top.map((t) => (
        <button
          key={t.id}
          title={t.label}
          onClick={() => setActive(t.id)}
          className={cn(
            "relative h-11 w-full grid place-items-center text-ink-400 hover:text-parchment-50",
            active === t.id && "text-parchment-50"
          )}
        >
          {active === t.id && (
            <span className="absolute left-0 top-2 bottom-2 w-[2px] bg-parchment-50" />
          )}
          <t.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {t.badge ? (
            <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 rounded-full bg-rose-500 text-white text-[9px] grid place-items-center font-mono">
              {t.badge}
            </span>
          ) : null}
        </button>
      ))}

      <div className="mt-auto flex flex-col w-full">
        <button
          onClick={toggleAgent}
          className={cn(
            "h-11 w-full grid place-items-center text-ink-400 hover:text-parchment-50 relative",
            !agentCollapsed && "text-parchment-50"
          )}
          title="Toggle research agent"
        >
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {!agentCollapsed && (
            <span className="absolute right-0 top-2 bottom-2 w-[2px] bg-beacon-500" />
          )}
        </button>
        <button
          className="h-11 w-full grid place-items-center text-ink-400 hover:text-parchment-50"
          title="Profile"
        >
          <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
        <button
          className="h-11 w-full grid place-items-center text-ink-400 hover:text-parchment-50"
          title="Settings"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/* =====================================================================
   Tab bar
   ===================================================================== */

function TabBar({
  open,
  active,
  onSelect,
  onClose,
}: {
  open: OpenDoc[];
  active: string;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}) {
  return (
    <div className="h-9 shrink-0 flex items-end bg-parchment-100 border-b border-ink-900/8 overflow-x-auto">
      {open.map((d) => {
        const meta = FILE_META[d.kind];
        const isActive = d.path === active;
        return (
          <div
            key={d.path}
            onClick={() => onSelect(d.path)}
            className={cn(
              "group relative h-9 pl-3 pr-2 inline-flex items-center gap-2 cursor-pointer border-r border-ink-900/8 min-w-0 select-none",
              isActive
                ? "bg-white text-ink-900"
                : "bg-parchment-100 text-ink-600 hover:text-ink-900 hover:bg-parchment-50"
            )}
          >
            {isActive && (
              <span className="absolute top-0 left-0 right-0 h-[1.5px] bg-beacon-500" />
            )}
            <meta.icon
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={1.75}
              style={{ color: meta.color }}
            />
            <span className="font-mono text-[12.5px] truncate max-w-[160px]">
              {d.name}
              <span className="text-ink-400">{meta.ext}</span>
            </span>
            {d.dirty ? (
              <Circle
                className="h-2 w-2 fill-current text-ink-500 group-hover:hidden shrink-0"
                strokeWidth={0}
              />
            ) : null}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(d.path);
              }}
              className={cn(
                "h-4 w-4 grid place-items-center rounded-sm hover:bg-ink-900/10 text-ink-500 shrink-0",
                d.dirty ? "hidden group-hover:grid" : ""
              )}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* =====================================================================
   Status bar — context-aware
   ===================================================================== */

function StatusBar({ activeDoc }: { activeDoc?: OpenDoc }) {
  return (
    <div className="h-6 shrink-0 bg-ink-900 text-parchment-50 flex items-center px-2 text-[11px] font-mono gap-3">
      <StatusItem icon={GitBranch} label="hypothesis/H-001" tone="default" />
      <StatusItem icon={GitCommit} label="v12 · signed" tone="default" />
      <StatusItem icon={AlertTriangle} label="2 anomalies" tone="rose" />
      <StatusItem icon={CheckCircle2} label="FAIR avg 94" tone="emerald" />
      <StatusItem icon={Activity} label="EXP-002 step 4/8" tone="beacon" />
      <StatusItem icon={ShieldCheck} label="provenance ✓" tone="emerald" />
      <StatusItem icon={Sparkles} label="4 agents · 1 digest" tone="beacon" />
      <StatusItem icon={Cpu} label="2 jobs · HPC" tone="default" />

      <div className="ml-auto flex items-center gap-3">
        {activeDoc && (
          <span className="opacity-70">
            {activeDoc.name}
            {FILE_META[activeDoc.kind].ext}
          </span>
        )}
        <span className="opacity-70">Ln 34, Col 18</span>
        <span className="opacity-70">UTF-8</span>
        <span className="opacity-70 inline-flex items-center gap-1">
          <Cloud className="h-3 w-3" /> synced
        </span>
        <span className="opacity-70 inline-flex items-center gap-1">
          <Zap className="h-3 w-3" /> horizon v0.1
        </span>
      </div>
    </div>
  );
}

function StatusItem({
  icon: Icon,
  label,
  tone,
}: {
  icon: any;
  label: string;
  tone: "default" | "rose" | "emerald" | "beacon" | "amber";
}) {
  const toneCls = {
    default: "text-parchment-50",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    beacon: "text-beacon-300",
    amber: "text-amber-300",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1", toneCls)}>
      <Icon className="h-3 w-3" strokeWidth={1.75} />
      {label}
    </span>
  );
}

/* =====================================================================
   Lineage panel (provenance tree) — smaller panel kept inline
   ===================================================================== */

function LineagePanel({
  onOpen,
}: {
  onOpen: (path: string, name: string, kind: FileKind) => void;
}) {
  return (
    <div className="h-full flex flex-col bg-parchment-100 border-r border-ink-900/8">
      <div className="h-8 px-3 flex items-center border-b border-ink-900/8 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
        Provenance lineage
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 font-mono text-[11.5px] text-ink-700 space-y-1.5">
        {[
          ["figures/fig2A.svg", "#a3f7b2 ✓"],
          ["└── ic50_normalized.parquet", "#9c4d1e ✓"],
          ["    └── analysis/ic50_calc.py v2.1", "#5b0cd2 ✓"],
          ["    └── cell_viability_20260410.csv", "#f1ea44 ✓"],
          ["        └── Tecan i-D3 · TI-2847", "instrument"],
          ["            └── IC50_assay_v3.protocol", "#a3f7b2 ✓"],
          ["environment · Python 3.11 · scipy 1.12", "frozen"],
          ["author · Anu SK · 2026-04-18 14:32 UTC", ""],
        ].map(([l, h], i) => (
          <div key={i} className="flex items-baseline gap-2 whitespace-pre">
            <span className="text-ink-800">{l}</span>
            <span className="ml-auto text-ink-400">{h}</span>
          </div>
        ))}
        <div className="mt-4 pt-3 border-t border-ink-900/8 text-[11px] text-emerald-700">
          reproducibility · VERIFIED · hash matches stored result
        </div>
        <button className="mt-3 h-7 w-full rounded border border-ink-900/10 bg-white text-ink-700 text-[11.5px] hover:border-ink-900/20">
          export .irerpkg
        </button>
      </div>
    </div>
  );
}

/* =====================================================================
   Empty
   ===================================================================== */
function EmptyState() {
  return (
    <div className="flex-1 grid place-items-center bg-white">
      <div className="text-center text-ink-400">
        <div className="font-display text-[28px] text-ink-500">
          Integrated Research Environment
        </div>
        <div className="mt-2 text-[13px]">
          Open a hypothesis, notebook, or manuscript from the tree — or press{" "}
          <span className="font-mono border border-ink-900/15 rounded px-1.5 py-0.5">⌘P</span>{" "}
          to jump.
        </div>
      </div>
    </div>
  );
}
