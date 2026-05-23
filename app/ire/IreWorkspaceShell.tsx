"use client";

import * as React from "react";
import { X, Circle } from "lucide-react";
import { cn } from "@/lib/cn";

import "./ire-workspace.css";
import { useIreNavigation, useWorkspaceBundle } from "./workspace-context";
import { InstituteNavProvider } from "@/components/institute/institute-nav-context";
import { InstituteSidebarProvider } from "@/components/institute/use-institute-sidebar-state";
import {
  useInstituteAppShell,
} from "@/components/institute/institute-app-shell";
import { InstituteNavSidebar } from "@/components/institute/InstituteNavSidebar";
import { ProjectBar } from "./ProjectBar";
import { IreNavBridge } from "./IreNavSidebar";
import { CoScienceColumn } from "./CoScienceColumn";
import { IntegrationsToolbar } from "./IntegrationsToolbar";
import { IreTour } from "@/components/tour/IreTour";
import { PixelPetDuck } from "@/components/ire/PixelPetDuck";

import { ExplorerPanel } from "./panels/ExplorerPanel";
import { SearchPanel } from "./panels/SearchPanel";
import { HypothesisPanel } from "./panels/HypothesisPanel";
import { ExperimentsPanel } from "./panels/ExperimentsPanel";
import { DataPanel } from "./panels/DataPanel";
import { LiteraturePanel } from "./panels/LiteraturePanel";
import { ProtocolPanel } from "./panels/ProtocolPanel";
import { ProgramPanel } from "./panels/ProgramPanel";
import { ProvenancePanel } from "./panels/ProvenancePanel";

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
import { ProjectHomeDoc } from "./docs/ProjectHomeDoc";
import { LatexDoc } from "./docs/LatexDoc";
import { WordDoc } from "./docs/WordDoc";
import { ToolDoc } from "./docs/ToolDoc";

import { FILE_META, type OpenDoc } from "./data";
import type { ActivityItem } from "./ire-navigation";

export function IreWorkspaceShell({
  previewTheme,
}: {
  previewTheme?: "dark";
} = {}) {
  const inAppShell = useInstituteAppShell();
  const inner = (
    <IreWorkspaceShellInner inAppShell={inAppShell} previewTheme={previewTheme} />
  );

  if (inAppShell) return inner;

  return (
    <InstituteSidebarProvider>
      <InstituteNavProvider>{inner}</InstituteNavProvider>
    </InstituteSidebarProvider>
  );
}

function IreWorkspaceShellInner({
  inAppShell,
  previewTheme,
}: {
  inAppShell: boolean;
  previewTheme?: "dark";
}) {
  const navigation = useIreNavigation();
  const activeDoc = navigation.open.find((d) => d.path === navigation.activePath);

  React.useEffect(() => {
    if (previewTheme !== "dark") return;
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    document.body.style.backgroundColor = "#282824";
  }, [previewTheme]);

  return (
    <div
      data-ire-theme={previewTheme}
      className={cn(
        "ire-workspace flex flex-col overflow-hidden bg-[var(--ire-surface-muted)]",
        inAppShell ? "flex-1 min-h-0" : "fixed inset-0 z-40"
      )}
    >
      <IreNavBridge active={navigation.activity} onSelect={navigation.setActivity} />
      <ProjectBar />

      <div className="flex-1 min-h-0 flex">
        {!inAppShell ? <InstituteNavSidebar /> : null}

        <div
          data-tour="side-panel"
          className="w-[272px] shrink-0 min-w-0 border-r border-[var(--ire-border)] bg-[var(--ire-surface)]"
        >
          <ContextPanel
            activity={navigation.activity}
            activePath={navigation.activePath}
            onOpen={navigation.openDoc}
          />
        </div>

        <main className="flex-1 min-w-0 flex flex-col bg-[var(--ire-surface)]">
          <div data-tour="tab-bar">
            <TabBar
              open={navigation.open}
              active={navigation.activePath}
              onSelect={navigation.setActive}
              onClose={navigation.closeDoc}
            />
          </div>
          <IntegrationsToolbar onOpenTool={navigation.openTool} />
          <div data-tour="editor" className="relative flex-1 min-h-0 flex flex-col">
            {activeDoc ? renderDoc(activeDoc) : <WorkspaceHome />}
            <PixelPetDuck />
          </div>
        </main>

        <CoScienceColumn />
      </div>

      <IreTour />
    </div>
  );
}

function ContextPanel({
  activity,
  activePath,
  onOpen,
}: {
  activity: ActivityItem;
  activePath: string;
  onOpen: (path: string, name: string, kind: import("./data").FileKind) => void;
}) {
  switch (activity) {
    case "explorer":
      return <ExplorerPanel activePath={activePath} onOpen={onOpen} />;
    case "search":
      return <SearchPanel onOpen={onOpen} />;
    case "program":
      return <ProgramPanel />;
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
    case "lineage":
      return <ProvenancePanel />;
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
    case "home":
      return <ProjectHomeDoc />;
    case "latex":
      return <LatexDoc name={d.name} />;
    case "word":
      return <WordDoc name={d.name} />;
    case "tool":
      return <ToolDoc id={d.toolId ?? ""} label={d.name} />;
    default:
      return <EmptyDoc name={d.name} />;
  }
}

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
  if (open.length === 0) return null;

  return (
    <div className="h-9 shrink-0 flex items-stretch border-b border-[var(--ire-border)] overflow-x-auto bg-[var(--ire-surface-muted)]">
      {open.map((d) => {
        const meta = FILE_META[d.kind];
        const isActive = d.path === active;
        return (
          <div
            key={d.path}
            onClick={() => onSelect(d.path)}
            className={cn(
              "group relative h-9 pl-3 pr-2 inline-flex items-center gap-2 cursor-pointer border-r border-[var(--ire-border)] min-w-0 select-none",
              isActive
                ? "bg-[var(--ire-surface)] text-ink-900"
                : "text-ink-600 hover:text-ink-900 hover:bg-[var(--ire-surface-elevated)]"
            )}
          >
            {isActive && (
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-beacon-600" />
            )}
            <meta.icon
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={1.65}
              style={{ color: meta.color }}
            />
            <span className="text-[12px] font-medium truncate max-w-[180px]">
              {d.name}
              <span className="text-ink-400 font-normal">{meta.ext}</span>
            </span>
            {d.dirty ? (
              <Circle
                className="h-2 w-2 fill-ink-500 group-hover:hidden shrink-0"
                strokeWidth={0}
              />
            ) : null}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(d.path);
              }}
              className={cn(
                "h-4 w-4 grid place-items-center rounded hover:bg-ink-900/8 text-ink-500 shrink-0",
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

function WorkspaceHome() {
  const navigation = useIreNavigation();
  const { insights, chrome } = useWorkspaceBundle();

  const prompts = [
    {
      label: "Open the program map for this project",
      action: () => navigation.setActivity("program"),
    },
    {
      label: "Show linked runs for the lead hypothesis",
      action: () => navigation.setActivity("hypotheses"),
    },
    {
      label: "Summarize what the co-science team flagged today",
      action: () => {
        const first = insights[0];
        if (first) navigation.followInsight(first);
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-[var(--ire-surface)]">
      <div className="w-full max-w-[560px]">
        <p className="ire-label mb-3">Virtual Research Institute</p>
        <h1 className="ire-ui-serif text-[26px] sm:text-[30px] text-ink-900 leading-[1.2] font-normal">
          Start from a program artifact or a prompt.
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink-600 max-w-[480px]">
          Pick an open file from the explorer, follow the program map, or ask the
          co-science team to set up the next step in{" "}
          <span className="text-ink-900">{chrome.projectDropdownTitle}</span>.
        </p>

        <ul className="mt-8 space-y-2">
          {prompts.map((p) => (
            <li key={p.label}>
              <button type="button" onClick={p.action} className="ire-prompt-chip">
                {p.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[12px] text-ink-500">
          Type in chat, attach a file, or press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--ire-border)] bg-[var(--ire-surface-muted)] font-mono text-[11px]">
            /
          </kbd>{" "}
          for commands and{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-[var(--ire-border)] bg-[var(--ire-surface-muted)] font-mono text-[11px]">
            @
          </kbd>{" "}
          to pin context.
        </p>
      </div>
    </div>
  );
}
