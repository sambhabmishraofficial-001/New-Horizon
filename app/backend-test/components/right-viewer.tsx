import * as React from "react";
import {
  Boxes,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ExternalLink,
  Eye,
  FileText,
  GripVertical,
  Loader2,
  Minimize2,
} from "lucide-react";
import type { Health, InspectorPanel, LabPrompt, ProposedLab, ViewFile, ViewerMode, VriPlannerReply, WorkRun } from "../types";
import { PlanCard } from "./left-workbench";
import { LabProvenancePanel, MetricRow, ProgressSteps, RunTraceCard, ToolAndLiteraturePanel } from "./run-panels";
import { cx, fileOwnerLabel, labEventsForName, labFilesForEvents, truncate } from "../utils";

export function RightViewerPane({
  activeRun,
  artifactLoading,
  files,
  hasWorkspace,
  loading,
  mode,
  onApprove,
  onOpenFileInNewTab,
  onRevise,
  onSelectFile,
  onSelectLab,
  onShowExecution,
  onShowPlan,
  plannerReply,
  selectedFile,
  selectedRunLab,
  selectedRunLabName,
}: {
  activeRun: WorkRun | null;
  artifactLoading: boolean;
  files: ViewFile[];
  hasWorkspace: boolean;
  loading: string | null;
  mode: ViewerMode;
  onApprove: () => void;
  onOpenFileInNewTab: (file: ViewFile | null) => void;
  onRevise: (message?: string) => void;
  onSelectFile: (id: string) => void;
  onSelectLab: (labName: string) => void;
  onShowExecution: () => void;
  onShowPlan: () => void;
  plannerReply: VriPlannerReply | null;
  selectedFile: ViewFile | null;
  selectedRunLab: ProposedLab | null;
  selectedRunLabName: string | null;
}) {
  const labs = activeRun?.labs_created?.length
    ? activeRun.labs_created
    : plannerReply?.proposed_labs ?? [];
  const isWorking = loading === "work" || artifactLoading;
  const labDeck = (
    <LabIdentityDeck
      activeRun={activeRun}
      labs={labs}
      onSelectLab={onSelectLab}
      selectedLabName={selectedRunLabName}
    />
  );

  return (
    <section className="min-h-[720px] border-t border-ink-900/8 bg-parchment-50 p-3 text-ink-900 lg:h-full lg:min-h-0 lg:overflow-hidden lg:border-l lg:border-t-0">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-lift">
        <header className="shrink-0 border-b border-ink-900/8 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-ink-900/10 bg-ink-900 font-mono text-lg text-white shadow-pane">
                  V
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">VRI side viewer</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-ink-500">
                    <span className={cx("h-2.5 w-2.5 rounded-full", isWorking ? "animate-pulse bg-beacon-500" : "bg-green-500")} />
                    <span>{isWorking ? "Executing task..." : viewerModeLabel(mode)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-full border border-ink-900/10 bg-parchment-50 px-3 py-1 text-xs text-ink-500">
              {files.length} files
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ViewerNavButton active={mode === "plan"} disabled={!plannerReply?.planning_allowed} onClick={onShowPlan}>
              Plan
            </ViewerNavButton>
            <ViewerNavButton active={mode === "execution"} disabled={!activeRun && loading !== "work"} onClick={onShowExecution}>
              Run
            </ViewerNavButton>
            <ViewerNavButton active={mode === "lab"} disabled={labs.length === 0} onClick={() => labs[0] ? onSelectLab(labs[0].name) : undefined}>
              Labs
            </ViewerNavButton>
            <ViewerNavButton active={mode === "file"} disabled={files.length === 0} onClick={() => files[0] ? onSelectFile(files[0].id) : undefined}>
              Files
            </ViewerNavButton>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {mode === "plan" ? null : labDeck}

          <div
            className={cx(
              "min-h-0 rounded-xl border border-ink-900/8 bg-parchment-50/75 p-4",
              mode === "plan" ? "" : "mt-5",
              mode === "idle" ? "min-h-[300px]" : "min-h-[520px]"
            )}
          >
            {mode === "file" ? (
              <RightFileSurface file={selectedFile} onOpenInNewTab={() => onOpenFileInNewTab(selectedFile)} />
            ) : mode === "lab" && selectedRunLab ? (
              <LabDetailSurface
                activeRun={activeRun}
                files={files}
                lab={selectedRunLab}
                onSelectFile={onSelectFile}
              />
            ) : mode === "plan" && plannerReply ? (
              <PlanCard
                hasWorkspace={hasWorkspace}
                loading={loading}
                onApprove={onApprove}
                onRevise={onRevise}
                reply={plannerReply}
              />
            ) : mode === "execution" && activeRun ? (
              <div className="min-h-0 space-y-4">
                <RunTraceCard activeRun={activeRun} loading={loading} />
                {activeRun.lab_events?.length ? (
                  <div className="max-h-[46vh] overflow-y-auto rounded-xl border border-ink-900/8 bg-white p-4 text-ink-900">
                    <LabProvenancePanel activeRun={activeRun} files={files} onOpenFile={onSelectFile} />
                  </div>
                ) : null}
              </div>
            ) : mode === "execution" && loading === "work" ? (
              <WorkspaceStartingSurface />
            ) : (
              <RightIdleSurface />
            )}
          </div>

          {mode === "plan" ? <div className="mt-5">{labDeck}</div> : null}
        </div>
      </div>
    </section>
  );
}

function ViewerNavButton({
  active,
  children,
  disabled,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "border-beacon-500/45 bg-beacon-50 text-beacon-900"
          : "border-ink-900/10 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function LabIdentityDeck({
  activeRun,
  labs,
  onSelectLab,
  selectedLabName,
}: {
  activeRun: WorkRun | null;
  labs: ProposedLab[];
  onSelectLab: (labName: string) => void;
  selectedLabName: string | null;
}) {
  const visibleLabs = labs.slice(0, 6);
  if (visibleLabs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-900/12 bg-parchment-50 p-4 text-sm text-ink-500">
        Lab identity cards will appear here when VRI proposes or creates labs.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-900/8 bg-parchment-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-500">Institute labs</p>
          <h2 className="mt-1 text-lg font-medium text-ink-900">Identity cards</h2>
        </div>
        <Boxes className="h-5 w-5 text-ink-400" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleLabs.map((lab, index) => (
          <LabIdentityCard
            index={index}
            key={`${lab.name}-${index}`}
            lab={lab}
            live={Boolean(activeRun)}
            onSelect={() => onSelectLab(lab.name)}
            selected={selectedLabName === lab.name}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes vri-card-float {
          0%, 100% { transform: translateY(0) rotate(var(--tilt)); box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22); }
          50% { transform: translateY(-8px) rotate(var(--tilt)); box-shadow: 0 26px 52px rgba(126, 211, 255, 0.20); }
        }
        @keyframes vri-scan {
          0% { transform: translateX(-120%); opacity: 0; }
          20% { opacity: 0.85; }
          100% { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function LabIdentityCard({
  index,
  lab,
  live,
  onSelect,
  selected,
}: {
  index: number;
  lab: ProposedLab;
  live: boolean;
  onSelect: () => void;
  selected: boolean;
}) {
  const initials = lab.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const tilt = `${(index % 3) - 1.1}deg`;

  return (
    <button
      className={cx(
        "relative min-h-56 overflow-hidden rounded-xl border p-4 text-left text-ink-900 shadow-lift transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-500/35",
        selected ? "border-beacon-500/45 bg-beacon-50" : "border-black/15 bg-parchment-50"
      )}
      onClick={onSelect}
      style={{
        "--tilt": tilt,
        animation: `vri-card-float ${5 + index * 0.35}s ease-in-out ${index * 120}ms infinite`,
      } as React.CSSProperties}
      type="button"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-8 -left-10 w-24 rotate-12 bg-white/50 blur-xl" style={{ animation: `vri-scan ${4.8 + index * 0.3}s ease-in-out ${index * 220}ms infinite` }} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-ink-900/10 bg-white font-mono text-lg font-semibold shadow-pane">
            {initials || "VR"}
          </div>
          <span className={cx(
            "rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-[0.12em]",
            live ? "border-green-700/25 bg-green-50 text-green-800" : "border-beacon-700/25 bg-beacon-50 text-beacon-900"
          )}>
            {live ? "created" : "proposed"}
          </span>
        </div>
        <div className="mt-5">
          <p className="text-xl font-semibold leading-6">{lab.name}</p>
          <p className="mt-2 text-sm italic text-ink-500">{lab.kind} / {lab.workstream}</p>
        </div>
        <div className="mt-auto border-t border-dashed border-ink-900/20 pt-4">
          <p className="line-clamp-3 text-sm leading-5 text-ink-600">{lab.rationale || "Lab identity is ready for this workspace."}</p>
        </div>
      </div>
    </button>
  );
}

function LabDetailSurface({
  activeRun,
  files,
  lab,
  onSelectFile,
}: {
  activeRun: WorkRun | null;
  files: ViewFile[];
  lab: ProposedLab;
  onSelectFile: (id: string) => void;
}) {
  const events = labEventsForName(activeRun, lab.name);
  const labFiles = labFilesForEvents(events, files);

  return (
    <div className="min-h-0 rounded-xl bg-white p-4 text-ink-900">
      <div className="rounded-lg border border-ink-900/8 bg-parchment-50 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-500">Lab dossier</p>
        <h2 className="mt-2 text-2xl font-medium leading-7">{lab.name}</h2>
        <p className="mt-2 text-sm italic text-ink-500">{lab.kind} / {lab.workstream}</p>
        <p className="mt-4 text-sm leading-6 text-ink-700">{lab.rationale || "This lab is part of the current VRI plan."}</p>
      </div>

      {lab.first_tasks.length ? (
        <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Objective and assigned tasks</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-700">
            {lab.first_tasks.map((task, index) => (
              <li className="flex gap-2" key={`${task}-${index}`}>
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-green-700" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {events.length ? (
        <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Completed work</p>
          <div className="mt-3 space-y-3">
            {events.map((event, index) => (
              <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-3 text-sm" key={`${event.lab_name}-${event.action}-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{event.action}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.1em] text-ink-500">{event.workstream}</p>
                  </div>
                  {event.handoff_to ? (
                    <span className="shrink-0 rounded-full border border-ink-900/10 bg-white px-2 py-0.5 text-[11px] text-ink-500">
                      to {event.handoff_to}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs leading-5 text-ink-600">{event.summary}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Files from this lab</p>
        {labFiles.length ? (
          <div className="mt-3 grid gap-2">
            {labFiles.map((file) => (
              <button
                className="flex w-full items-center gap-2 rounded-md border border-ink-900/8 bg-parchment-50 px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/[0.03]"
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                type="button"
              >
                <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="shrink-0 text-xs text-ink-400">{file.sizeLabel}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-500">This lab has no attached files in the current run trace.</p>
        )}
      </div>
    </div>
  );
}

function RightFileSurface({
  file,
  onOpenInNewTab,
}: {
  file: ViewFile | null;
  onOpenInNewTab: () => void;
}) {
  return (
    <div className="min-h-0 rounded-xl bg-parchment-50 p-4 text-ink-900">
      <FilePreview file={file} maxHeightClass="max-h-[58vh] min-h-[360px]" onOpenInNewTab={onOpenInNewTab} />
    </div>
  );
}

function RightIdleSurface() {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-ink-900/12 bg-white text-center text-ink-500">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-lg border border-ink-900/10 bg-parchment-50 font-mono text-2xl text-ink-700">
          V
        </div>
        <p className="text-sm">Ask VRI a question or select a file.</p>
        <p className="mt-2 text-xs text-ink-400">Plans, lab cards, execution traces, and file pages render here.</p>
      </div>
    </div>
  );
}

function WorkspaceStartingSurface() {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-xl border border-beacon-500/20 bg-beacon-50/70 text-center text-beacon-950">
      <div>
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-4 text-sm font-medium">Starting workspace</p>
        <p className="mt-2 max-w-sm text-xs leading-5 text-ink-600">
          Creating manifests, indexing lab artifacts, writing scripts, and loading literature records.
        </p>
      </div>
    </div>
  );
}

function viewerModeLabel(mode: ViewerMode) {
  if (mode === "file") return "Viewing file";
  if (mode === "lab") return "Viewing lab";
  if (mode === "plan") return "Plan ready";
  if (mode === "execution") return "Workspace trace";
  return "Waiting for task";
}

function SideInspector({
  activeRun,
  artifactError,
  artifactLoading,
  files,
  health,
  nextStep,
  onOpenFileInNewTab,
  onResizeStart,
  onSelectFile,
  onTogglePanel,
  openPanels,
  selectedFile,
  selectedLab,
}: {
  activeRun: WorkRun | null;
  artifactError: string | null;
  artifactLoading: boolean;
  files: ViewFile[];
  health: Health | null;
  nextStep: string;
  onOpenFileInNewTab: (file: ViewFile | null) => void;
  onResizeStart: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onSelectFile: (id: string) => void;
  onTogglePanel: (panel: InspectorPanel) => void;
  openPanels: InspectorPanel[];
  selectedFile: ViewFile | null;
  selectedLab: LabPrompt | null;
}) {
  const toolCount = activeRun?.tool_calls.length ?? 0;
  const literatureCount = activeRun?.literature_results.length ?? 0;

  return (
    <aside className="relative min-h-[720px] border-t border-ink-900/8 bg-white lg:h-screen lg:min-h-0 lg:overflow-hidden lg:border-t-0">
      <button
        aria-label="Resize inspector"
        className="absolute -left-3 top-1/2 z-10 hidden h-12 w-6 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-400 shadow-pane hover:text-ink-900 lg:flex"
        onPointerDown={onResizeStart}
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="h-full min-h-0 divide-y divide-ink-900/8 overflow-y-auto">
        <InspectorAccordionSection
          active={openPanels.includes("progress")}
          id="progress"
          maxHeightClass="max-h-[36vh]"
          onOpen={() => onTogglePanel("progress")}
          summary={health?.status === "ok" ? "backend ready" : "connecting"}
          title="Progress"
        >
          <ProgressSteps
            activeRun={activeRun}
            health={health}
            nextStep={nextStep}
            selectedLab={selectedLab}
          />
        </InspectorAccordionSection>

        <InspectorAccordionSection
          active={openPanels.includes("results")}
          id="results"
          maxHeightClass="max-h-[34vh]"
          onOpen={() => onTogglePanel("results")}
          summary={`${toolCount} tools / ${literatureCount} papers`}
          title="Results"
        >
          <MetricRow label="Workspace run" value={activeRun?.status ?? "Not started"} />
          <MetricRow label="Tool calls" value={String(toolCount)} />
          <MetricRow label="Literature" value={String(literatureCount)} />
          <MetricRow label="Files" value={artifactLoading ? "Loading" : String(files.length)} />
          {activeRun?.run_id ? <MetricRow label="Run id" value={truncate(activeRun.run_id, 18)} /> : null}
          {artifactError ? <p className="mt-3 text-sm text-red-700">{artifactError}</p> : null}
        </InspectorAccordionSection>

        <InspectorAccordionSection
          active={openPanels.includes("files")}
          id="files"
          maxHeightClass="max-h-[54vh]"
          onOpen={() => onTogglePanel("files")}
          summary={artifactLoading ? "loading" : `${files.length} files`}
          title="Files"
        >
          {files.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-500">Workspace files will appear here after approval starts a run.</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cx(
                    "rounded-md border bg-white p-2 text-sm",
                    selectedFile?.id === file.id ? "border-beacon-500/35 bg-beacon-50" : "border-ink-900/8 bg-white hover:bg-ink-900/[0.02]"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {[file.kind, file.sizeLabel, fileOwnerLabel(activeRun, file)].filter(Boolean).join(" / ")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-ink-900/10 bg-white px-2 py-1.5 text-xs text-ink-600 hover:bg-ink-900/[0.03]"
                      onClick={() => onSelectFile(file.id)}
                      type="button"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button
                      aria-label={`Open ${file.name} in a new tab`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-ink-900/10 bg-white text-ink-500 hover:bg-ink-900/[0.03] hover:text-ink-900"
                      onClick={() => onOpenFileInNewTab(file)}
                      title="Open in new tab"
                      type="button"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {activeRun?.lab_events?.length ? (
                <LabProvenancePanel activeRun={activeRun} files={files} onOpenFile={onSelectFile} />
              ) : null}
            </div>
          )}
        </InspectorAccordionSection>

        <InspectorAccordionSection
          active={openPanels.includes("tools")}
          maxHeightClass="max-h-[44vh]"
          onOpen={() => onTogglePanel("tools")}
          summary={`${toolCount + literatureCount} records`}
          title="Tool calls & literature"
        >
          <ToolAndLiteraturePanel activeRun={activeRun} />
        </InspectorAccordionSection>
      </div>
    </aside>
  );
}
function InspectorAccordionSection({
  active,
  children,
  id,
  maxHeightClass,
  onOpen,
  summary,
  title,
}: {
  active: boolean;
  children: React.ReactNode;
  id?: string;
  maxHeightClass: string;
  onOpen: () => void;
  summary: string;
  title: string;
}) {
  return (
    <section id={id}>
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink-900/[0.025]"
        onClick={onOpen}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          {active ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
          <span className="truncate text-sm font-medium">{title}</span>
        </span>
        <span className="shrink-0 truncate text-xs text-ink-500">{summary}</span>
      </button>
      {active ? (
        <div className={cx("overflow-y-auto border-t border-beacon-500/30 bg-parchment-50/45 p-4", maxHeightClass)}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

function FilePreview({
  file,
  maxHeightClass,
  onOpenInNewTab,
}: {
  file: ViewFile | null;
  maxHeightClass: string;
  onOpenInNewTab?: () => void;
}) {
  if (!file) {
    return <p className="py-8 text-center text-sm text-ink-500">Select a file after a workspace run.</p>;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 rounded-md border border-ink-900/8 bg-white p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <p className="mt-1 text-xs text-ink-500">{file.kind} / {file.sizeLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onOpenInNewTab ? (
            <button
              aria-label="Open file preview in a new tab"
              className="grid h-8 w-8 place-items-center rounded-md border border-ink-900/10 text-ink-500 hover:bg-ink-900/[0.03] hover:text-ink-900"
              onClick={onOpenInNewTab}
              title="Open file preview in a new tab"
              type="button"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      {file.preview ? (
        <pre className={cx("mt-3 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/10 bg-white p-3 text-xs leading-5 text-ink-800 shadow-pane", maxHeightClass)}>
          {file.preview}
          {file.truncated ? "\n\n[Preview truncated by artifacts endpoint.]" : ""}
        </pre>
      ) : (
        <p className="mt-3 rounded-md border border-ink-900/8 bg-white p-3 text-sm leading-6 text-ink-500">
          This file path came from the run summary. A preview will appear here when the artifacts endpoint returns file content for it.
        </p>
      )}
    </div>
  );
}

export function CodeOutputPane({
  activeRun,
  files,
  loading,
  onOpenFileInNewTab,
  onSelectFile,
  plannerReply,
  selectedFile,
}: {
  activeRun: WorkRun | null;
  files: ViewFile[];
  loading: string | null;
  onOpenFileInNewTab: (file: ViewFile | null) => void;
  onSelectFile: (id: string) => void;
  plannerReply: VriPlannerReply | null;
  selectedFile: ViewFile | null;
}) {
  const toolCalls = activeRun?.tool_calls ?? [];

  return (
    <section className="min-h-screen border-t border-ink-900/8 bg-parchment-50 p-3 text-ink-900 lg:h-full lg:min-h-0 lg:overflow-hidden lg:border-t-0">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-lift">
        <header className="shrink-0 border-b border-ink-900/8 px-5 py-4">
          <h2 className="text-lg font-medium">Code and textual outputs</h2>
          <p className="mt-1 text-sm text-ink-500">
            Inspect generated files, tool outputs, and planner text in one place.
          </p>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-h-0 overflow-y-auto rounded-xl border border-ink-900/8 bg-parchment-50/70 p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Files</p>
            {files.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">Files appear after workspace execution starts.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {files.map((file) => (
                  <button
                    className={cx(
                      "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
                      selectedFile?.id === file.id
                        ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                        : "border-ink-900/8 bg-white text-ink-700 hover:bg-ink-900/[0.03]"
                    )}
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    type="button"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <div className="min-h-0 overflow-y-auto rounded-xl border border-ink-900/8 bg-parchment-50/70 p-4">
            <div className="rounded-lg border border-ink-900/8 bg-white p-3">
              <FilePreview
                file={selectedFile}
                maxHeightClass="max-h-[42vh] min-h-[240px]"
                onOpenInNewTab={() => onOpenFileInNewTab(selectedFile)}
              />
            </div>

            <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Tool outputs</p>
              {toolCalls.length === 0 ? (
                <p className="mt-2 text-sm text-ink-500">
                  {loading === "work"
                    ? "Tool outputs will appear as execution progresses."
                    : "No tool output yet. Approve a plan to start a workspace run."}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {toolCalls.map((call, index) => (
                    <div className="rounded-md border border-ink-900/8 bg-parchment-50 p-3" key={`${call.name}-${index}`}>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                        <span className="font-medium uppercase tracking-[0.12em] text-ink-700">{call.name}</span>
                        <span>/</span>
                        <span>{call.status}</span>
                      </div>
                      <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/8 bg-white p-2 text-xs leading-5 text-ink-700">
                        {stringifyUnknown(call.output ?? call.input ?? "No output payload")}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Planner text output</p>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/8 bg-parchment-50 p-3 text-xs leading-5 text-ink-700">
                {plannerReply?.answer ?? "Ask VRI in Chat view to populate textual output."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function stringifyUnknown(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function ExpandedFileViewer({
  file,
  onClose,
  onOpenInNewTab,
}: {
  file: ViewFile | null;
  onClose: () => void;
  onOpenInNewTab: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/35 p-4 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl flex-col rounded-xl border border-ink-900/10 bg-white shadow-lift">
        <div className="flex items-center justify-between gap-3 border-b border-ink-900/8 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-ink-500">File reader</p>
            <h2 className="truncate text-lg font-medium">{file?.name ?? "No file selected"}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-3 py-2 text-sm text-ink-600 hover:bg-ink-900/[0.03] hover:text-ink-900"
              onClick={onOpenInNewTab}
              type="button"
            >
              <ExternalLink className="h-4 w-4" />
              New tab
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-3 py-2 text-sm text-ink-600 hover:bg-ink-900/[0.03] hover:text-ink-900"
              onClick={onClose}
              type="button"
            >
              <Minimize2 className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          <FilePreview file={file} maxHeightClass="max-h-none min-h-[65vh]" />
        </div>
      </div>
    </div>
  );
}
