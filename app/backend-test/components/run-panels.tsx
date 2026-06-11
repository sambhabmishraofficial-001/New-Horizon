import * as React from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  FileText,
  Loader2,
  MessageSquareText,
  Wrench,
} from "lucide-react";
import type { Health, LabPrompt, LiteratureResult, ToolCallRecord, ViewFile, WorkRun } from "../types";
import { cx, fileIdForPath, fileOwnerLabel, formatJsonValue, shortFilePath, toolDurationLabel, truncate } from "../utils";

export function LabProvenancePanel({
  activeRun,
  files,
  onOpenFile,
  onSelectLab,
}: {
  activeRun: WorkRun;
  files: ViewFile[];
  onOpenFile: (id: string) => void;
  onSelectLab?: (labName: string) => void;
}) {
  const events = activeRun.lab_events ?? [];
  if (events.length === 0) return null;

  return (
    <div className="mt-4 border-t border-ink-900/8 pt-3">
      <p className="mb-2 text-xs uppercase tracking-[0.14em] text-ink-500">Lab provenance</p>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div key={`${event.lab_name}-${event.action}-${index}`} className="rounded-md border border-ink-900/8 bg-white p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{event.lab_name}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.1em] text-ink-500">{event.action}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {onSelectLab ? (
                  <button
                    className="rounded-full border border-beacon-500/25 bg-beacon-50 px-2 py-0.5 text-[11px] text-beacon-900 hover:bg-beacon-100"
                    onClick={() => onSelectLab(event.lab_name)}
                    type="button"
                  >
                    Open lab
                  </button>
                ) : null}
                <span className="rounded-full border border-ink-900/10 px-2 py-0.5 text-[11px] text-ink-500">
                  {event.workstream}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-ink-600">{event.summary}</p>
            {event.handoff_to ? (
              <p className="mt-2 text-xs text-ink-500">Handoff to {event.handoff_to}</p>
            ) : null}
            {event.files.length > 0 ? (
              <div className="mt-2 space-y-1">
                {event.files.slice(0, 4).map((path) => {
                  const fileId = fileIdForPath(path, files);
                  return (
                    <button
                      key={path}
                      className="flex w-full items-center gap-2 rounded border border-ink-900/8 px-2 py-1.5 text-left text-xs text-ink-600 hover:bg-ink-900/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!fileId}
                      onClick={() => fileId && onOpenFile(fileId)}
                      type="button"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                      <span className="min-w-0 flex-1 truncate">{shortFilePath(path)}</span>
                    </button>
                  );
                })}
                {event.files.length > 4 ? (
                  <p className="px-2 text-xs text-ink-400">+{event.files.length - 4} more files</p>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RunTraceCard({
  activeRun,
  loading,
}: {
  activeRun: WorkRun | null;
  loading: string | null;
}) {
  if (!activeRun && loading !== "work") return null;

  return (
    <section className="rounded-xl border border-ink-900/8 bg-parchment-50/70 p-4 shadow-pane">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">Workspace execution</p>
          <p className="mt-2 text-base leading-7">
            {activeRun
              ? `Workspace ${activeRun.status}. Review the tool calls, literature, and generated files below.`
              : "Starting the workspace after your approval."}
          </p>
        </div>
        {loading === "work" ? <Loader2 className="mt-1 h-4 w-4 animate-spin text-beacon-700" /> : null}
      </div>

      {activeRun ? (
        <div className="mt-4">
          <ExecutionTraceList activeRun={activeRun} />
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-500">
          Preparing labs, workspace folders, and artifact indexing.
        </div>
      )}
    </section>
  );
}

export function ToolAndLiteraturePanel({ activeRun }: { activeRun: WorkRun | null }) {
  if (!activeRun) {
    return <p className="py-8 text-center text-sm text-ink-500">Tool calls and literature appear after a workspace run.</p>;
  }

  return <ExecutionTraceList activeRun={activeRun} compact />;
}

function ExecutionTraceList({
  activeRun,
  compact,
}: {
  activeRun: WorkRun;
  compact?: boolean;
}) {
  const hasTools = activeRun.tool_calls.length > 0;
  const hasLiterature = activeRun.literature_results.length > 0;

  return (
    <div className="space-y-2">
      <TraceMessageRow
        compact={compact}
        text={`Run ${activeRun.status}. ${activeRun.tasks_created.length} tasks, ${activeRun.labs_created.length} labs, ${activeRun.generated_files.length + activeRun.data_files.length + activeRun.processed_files.length} files tracked.`}
      />
      {hasTools ? (
        activeRun.tool_calls.map((tool, index) => (
          <ToolTraceRow key={`${tool.name}-${index}`} compact={compact} index={index} tool={tool} />
        ))
      ) : (
        <TraceEmptyRow text="No backend tool calls were returned for this run." />
      )}
      {hasLiterature ? (
        activeRun.literature_results.map((item, index) => (
          <LiteratureTraceRow compact={compact} item={item} key={`${item.title}-${index}`} />
        ))
      ) : (
        <TraceEmptyRow text="No literature records were returned for this run." />
      )}
      {activeRun.errors.length > 0 ? (
        <TraceMessageRow
          compact={compact}
          tone="error"
          text={activeRun.errors.join("\n")}
        />
      ) : null}
    </div>
  );
}

function TraceMessageRow({
  compact,
  text,
  tone = "neutral",
}: {
  compact?: boolean;
  text: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div className={cx(
      "flex items-start gap-3 rounded-lg border px-3 py-2 text-sm leading-6",
      compact ? "text-xs leading-5" : "",
      tone === "error" ? "border-red-300 bg-red-50 text-red-800" : "border-ink-900/12 bg-white text-ink-700"
    )}>
      <MessageSquareText className="mt-1 h-4 w-4 shrink-0 text-ink-500" />
      <p className="whitespace-pre-wrap">{text}</p>
    </div>
  );
}

function ToolTraceRow({
  compact,
  index,
  tool,
}: {
  compact?: boolean;
  index: number;
  tool: ToolCallRecord;
}) {
  const [open, setOpen] = React.useState(false);
  const duration = toolDurationLabel(tool);
  const hasDetails = tool.input !== undefined || tool.output !== undefined;

  return (
    <div className="rounded-lg border border-ink-900/12 bg-white">
      <button
        className={cx(
          "flex w-full items-center gap-3 px-3 py-2 text-left text-sm",
          !hasDetails ? "cursor-default" : "hover:bg-ink-900/[0.02]",
          compact ? "text-xs" : ""
        )}
        disabled={!hasDetails}
        onClick={() => hasDetails && setOpen((current) => !current)}
        type="button"
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center text-ink-500">
          {tool.name.toLowerCase().includes("code") || tool.name.toLowerCase().includes("query") ? (
            <Code2 className="h-4 w-4" />
          ) : (
            <Wrench className="h-4 w-4" />
          )}
        </span>
        <span className="min-w-0 flex-1 truncate">{tool.name || `Tool call ${index + 1}`}</span>
        <span className="hidden shrink-0 items-center gap-1 text-xs text-ink-500 sm:inline-flex">
          <Clock3 className="h-3.5 w-3.5" />
          {duration}
        </span>
        <span className={cx(
          "shrink-0 rounded-full border px-2 py-0.5 text-[11px]",
          tool.status === "success" || tool.status === "completed"
            ? "border-green-700/20 text-green-700"
            : tool.status === "error" || tool.status === "failed"
              ? "border-red-700/20 text-red-700"
              : "border-ink-900/10 text-ink-500"
        )}>
          {tool.status || "recorded"}
        </span>
        {hasDetails ? (
          open ? <ChevronDown className="h-4 w-4 shrink-0 text-ink-500" /> : <ChevronRight className="h-4 w-4 shrink-0 text-ink-500" />
        ) : null}
      </button>
      {open ? (
        <div className="border-t border-ink-900/8 bg-parchment-50/55 p-3">
          {tool.input !== undefined ? <TraceJsonBlock label="Input" value={tool.input} /> : null}
          {tool.output !== undefined ? <TraceJsonBlock label="Output" value={tool.output} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function LiteratureTraceRow({
  compact,
  item,
}: {
  compact?: boolean;
  item: LiteratureResult;
}) {
  const [open, setOpen] = React.useState(false);
  const meta = [item.journal, item.year, item.pmid ? `PMID ${item.pmid}` : null]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="rounded-lg border border-ink-900/12 bg-white">
      <button
        className={cx(
          "flex w-full items-center gap-3 px-3 py-2 text-left text-sm",
          compact ? "text-xs" : ""
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <BookOpen className="h-4 w-4 shrink-0 text-ink-500" />
        <span className="min-w-0 flex-1 truncate">{item.title}</span>
        <span className="hidden shrink-0 text-xs text-ink-500 md:inline">{meta || "Literature"}</span>
        {open ? <ChevronDown className="h-4 w-4 shrink-0 text-ink-500" /> : <ChevronRight className="h-4 w-4 shrink-0 text-ink-500" />}
      </button>
      {open ? (
        <div className="space-y-2 border-t border-ink-900/8 bg-parchment-50/55 p-3 text-xs leading-5 text-ink-600">
          {meta ? <p>{meta}</p> : null}
          {item.authors ? <p>{item.authors}</p> : null}
          {item.abstract ? <p className="whitespace-pre-wrap">{item.abstract}</p> : null}
          {item.url ? <p className="break-all">{item.url}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function TraceJsonBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1 text-xs uppercase tracking-[0.12em] text-ink-500">{label}</p>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/10 bg-white p-3 text-xs leading-5 text-ink-800 shadow-pane">
        {formatJsonValue(value)}
      </pre>
    </div>
  );
}

function TraceEmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink-900/12 bg-white px-3 py-2 text-sm text-ink-500">
      {text}
    </div>
  );
}

export function ProgressSteps({
  activeRun,
  health,
  nextStep,
  selectedLab,
}: {
  activeRun: WorkRun | null;
  health: Health | null;
  nextStep: string;
  selectedLab: LabPrompt | null;
}) {
  const steps = [
    { label: "Backend", done: health?.status === "ok", detail: health?.model_name ?? "Connecting" },
    { label: "Lab", done: Boolean(selectedLab), detail: selectedLab?.name ?? "Loading labs" },
    { label: "Workspace", done: Boolean(activeRun), detail: activeRun?.status ?? "Not started" },
    { label: "Files", done: Boolean(activeRun?.generated_files.length || activeRun?.data_files.length || activeRun?.processed_files.length), detail: activeRun ? "Artifacts indexed" : "Waiting for workspace" },
    { label: "Review", done: Boolean(activeRun), detail: activeRun ? "Inspect results and files" : "Not ready" },
  ];

  return (
    <div>
      <p className="mb-4 rounded-md border border-ink-900/8 bg-white p-3 text-sm leading-6 text-ink-500">
        {nextStep}
      </p>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="flex gap-3">
            {step.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium">{step.label}</p>
              <p className="truncate text-xs text-ink-500">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-900/8 py-2 text-sm last:border-b-0">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
