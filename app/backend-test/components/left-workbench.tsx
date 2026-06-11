import * as React from "react";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Eye,
  FileText,
  FlaskConical,
  Loader2,
  MessageSquareText,
  PanelRight,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  XCircle,
} from "lucide-react";
import { ClarificationQuestions, hasClarifications } from "./ClarificationQuestions";
import { defaultLabCreationDomains, workstreams } from "../constants";
import type {
  Health,
  InspectorPanel,
  LabPrompt,
  PlannerMessage,
  SavedConversation,
  ViewFile,
  VriPlannerReply,
  WorkRun,
  WorkstreamPreference,
} from "../types";
import { LabProvenancePanel, MetricRow, ProgressSteps, ToolAndLiteraturePanel } from "./run-panels";
import { cx, fallbackPlanMarkdown, relativeTime, truncate } from "../utils";

function LeftControlSections({
  activeRun,
  artifactError,
  artifactLoading,
  conversations,
  files,
  health,
  nextStep,
  onLoadConversation,
  onNewConversation,
  onOpenFileInNewTab,
  onRefresh,
  onSelectFile,
  onSelectRunLab,
  onShowPlan,
  onTogglePanel,
  openPanels,
  plannerReply,
  selectedFile,
  selectedFileId,
  selectedLab,
}: {
  activeRun: WorkRun | null;
  artifactError: string | null;
  artifactLoading: boolean;
  conversations: SavedConversation[];
  files: ViewFile[];
  health: Health | null;
  nextStep: string;
  onLoadConversation: (conversation: SavedConversation) => void;
  onNewConversation: () => void;
  onOpenFileInNewTab: (file: ViewFile | null) => void;
  onRefresh: () => void;
  onSelectFile: (id: string) => void;
  onSelectRunLab: (labName: string) => void;
  onShowPlan: () => void;
  onTogglePanel: (panel: InspectorPanel) => void;
  openPanels: InspectorPanel[];
  plannerReply: VriPlannerReply | null;
  selectedFile: ViewFile | null;
  selectedFileId: string | null;
  selectedLab: LabPrompt | null;
}) {
  const toolCount = activeRun?.tool_calls.length ?? 0;
  const literatureCount = activeRun?.literature_results.length ?? 0;
  const hasPlan = Boolean(plannerReply?.planning_allowed);

  return (
    <div className="overflow-hidden rounded-xl border border-ink-900/8 bg-parchment-50/70 shadow-pane">
      <div className="flex items-start justify-between gap-3 border-b border-ink-900/8 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Project</p>
          <h1 className="mt-1 truncate text-xl font-medium tracking-tight">VRI Harness</h1>
          <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-ink-500">
            {health?.status === "ok" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-700" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 text-amber-700" />
            )}
            <span className="truncate">{health ? `${health.model_name} / ${health.database}` : "Connecting backend"}</span>
          </div>
        </div>
        <button
          aria-label="Refresh backend status and lab prompts"
          className="rounded-md p-1.5 text-ink-500 hover:bg-ink-900/[0.04] hover:text-ink-900"
          onClick={onRefresh}
          title="Refresh backend status and lab prompts"
          type="button"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-[58vh] min-h-0 overflow-y-auto lg:max-h-[60vh]">
        <LeftSection
          action={<button aria-label="Start a new planner thread" className="rounded p-1 text-ink-500 hover:bg-ink-900/[0.04] hover:text-ink-900" onClick={onNewConversation} title="Start a new planner thread" type="button"><Plus className="h-4 w-4" /></button>}
          title="Threads"
        >
          {conversations.length === 0 ? (
            <EmptySidebarText>Planner threads appear after VRI responds.</EmptySidebarText>
          ) : (
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-900/[0.04]"
                  onClick={() => onLoadConversation(conversation)}
                  type="button"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-ink-300" />
                  <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
                  <span className="shrink-0 text-xs text-ink-500">{relativeTime(conversation.updated_at)}</span>
                </button>
              ))}
            </div>
          )}
        </LeftSection>

        <LeftSection
          maxHeightClass="max-h-[34rem]"
          summary={artifactLoading ? "loading" : hasPlan ? `plan + ${files.length}` : `${files.length}`}
          title="Plan & files"
        >
          {hasPlan ? (
            <button
              className={cx(
                "mb-2 flex w-full items-start gap-2 rounded-md border p-2 text-left text-sm",
                !selectedFileId ? "border-beacon-500/35 bg-beacon-50 text-beacon-900" : "border-ink-900/8 bg-white text-ink-700 hover:bg-ink-900/[0.03]"
              )}
              onClick={onShowPlan}
              type="button"
            >
              <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">Approved workspace plan</span>
                <span className="mt-0.5 block text-xs text-ink-500">Labs, steps, estimates, and expected files</span>
              </span>
            </button>
          ) : null}
          {artifactLoading ? (
            <EmptySidebarText>Loading workspace files.</EmptySidebarText>
          ) : files.length === 0 && !hasPlan ? (
            <EmptySidebarText>Files appear after a workspace run creates artifacts.</EmptySidebarText>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cx(
                    "rounded-md border bg-white p-2 text-sm",
                    selectedFileId === file.id ? "border-beacon-500/35 bg-beacon-50" : "border-ink-900/8"
                  )}
                >
                  <button
                    className="flex w-full items-center gap-2 text-left"
                    onClick={() => onSelectFile(file.id)}
                    type="button"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-ink-400" />
                    <span className="min-w-0 flex-1 truncate">{file.name}</span>
                    <span className="shrink-0 text-xs text-ink-400">{file.sizeLabel}</span>
                  </button>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-ink-900/10 bg-white px-2 py-1.5 text-xs text-ink-600 hover:bg-ink-900/[0.03]"
                      onClick={() => onSelectFile(file.id)}
                      type="button"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Show right
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
            </div>
          )}
        </LeftSection>

        <LeftSection maxHeightClass="max-h-64" title="Progress">
          <ProgressSteps
            activeRun={activeRun}
            health={health}
            nextStep={nextStep}
            selectedLab={selectedLab}
          />
        </LeftSection>

        <LeftSection maxHeightClass="max-h-52" summary={`${toolCount} tools / ${literatureCount} papers`} title="Results">
          <MetricRow label="Workspace run" value={activeRun?.status ?? "Not started"} />
          <MetricRow label="Tool calls" value={String(toolCount)} />
          <MetricRow label="Literature" value={String(literatureCount)} />
          <MetricRow label="Files" value={artifactLoading ? "Loading" : String(files.length)} />
          {activeRun?.run_id ? <MetricRow label="Run id" value={truncate(activeRun.run_id, 18)} /> : null}
          {artifactError ? <p className="mt-3 text-sm text-red-700">{artifactError}</p> : null}
        </LeftSection>

        <LeftSection
          action={
            <button
              className="text-xs text-ink-500 hover:text-ink-900"
              onClick={() => onTogglePanel("tools")}
              type="button"
            >
              {openPanels.includes("tools") ? "Hide" : "Show"}
            </button>
          }
          title="Tool calls & literature"
          maxHeightClass={openPanels.includes("tools") ? "max-h-80" : undefined}
        >
          <div className={cx(openPanels.includes("tools") ? "block" : "hidden")}>
            <ToolAndLiteraturePanel activeRun={activeRun} />
          </div>
          {!openPanels.includes("tools") ? (
            <p className="text-sm text-ink-500">Open this section to inspect execution records.</p>
          ) : null}
        </LeftSection>

        {activeRun?.lab_events?.length ? (
          <LeftSection maxHeightClass="max-h-96" title="Lab provenance">
            <LabProvenancePanel
              activeRun={activeRun}
              files={files}
              onOpenFile={onSelectFile}
              onSelectLab={onSelectRunLab}
            />
          </LeftSection>
        ) : null}
      </div>
    </div>
  );
}

function EmptySidebarText({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-4 text-center text-sm text-ink-500">{children}</p>;
}

function LeftSection({
  action,
  children,
  maxHeightClass,
  summary,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  maxHeightClass?: string;
  summary?: string;
  title: string;
}) {
  return (
    <section className="min-h-0 border-b border-ink-900/8 last:border-b-0">
      <div className="flex items-center justify-between gap-3 border-b border-ink-900/8 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <ChevronDown className="h-4 w-4 shrink-0" />
          <h2 className="truncate text-sm font-medium">{title}</h2>
        </div>
        {action ?? (summary ? <span className="shrink-0 text-xs text-ink-500">{summary}</span> : null)}
      </div>
      <div className={cx("min-h-0 p-3", maxHeightClass ? `overflow-y-auto ${maxHeightClass}` : "")}>{children}</div>
    </section>
  );
}

export function LeftWorkbench({
  activeRun,
  allowedLabIds,
  artifactError,
  artifactLoading,
  chatEndRef,
  conversations,
  error,
  files,
  hasWorkspace,
  health,
  labPrompts,
  loading,
  nextStep,
  onAsk,
  onLoadConversation,
  onNewConversation,
  onOpenFileInNewTab,
  onRefresh,
  onSelectFile,
  onSelectRunLab,
  onShowPlan,
  onToggleLab,
  onTogglePanel,
  onUseAllLabs,
  openPanels,
  plannerInput,
  plannerMessages,
  plannerReply,
  selectedFile,
  selectedFileId,
  selectedLab,
  setPlannerInput,
  setWorkstreamPreference,
  visibleReplyText,
  workstreamPreference,
  isReplyRevealing,
}: {
  activeRun: WorkRun | null;
  allowedLabIds: string[];
  artifactError: string | null;
  artifactLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
  conversations: SavedConversation[];
  error: string | null;
  files: ViewFile[];
  hasWorkspace: boolean;
  health: Health | null;
  labPrompts: LabPrompt[];
  loading: string | null;
  nextStep: string;
  onAsk: (message?: string) => void;
  onLoadConversation: (conversation: SavedConversation) => void;
  onNewConversation: () => void;
  onOpenFileInNewTab: (file: ViewFile | null) => void;
  onRefresh: () => void;
  onSelectFile: (id: string) => void;
  onSelectRunLab: (labName: string) => void;
  onShowPlan: () => void;
  onToggleLab: (labId: string) => void;
  onTogglePanel: (panel: InspectorPanel) => void;
  onUseAllLabs: () => void;
  openPanels: InspectorPanel[];
  plannerInput: string;
  plannerMessages: PlannerMessage[];
  plannerReply: VriPlannerReply | null;
  selectedFile: ViewFile | null;
  selectedFileId: string | null;
  selectedLab: LabPrompt | null;
  setPlannerInput: (value: string) => void;
  setWorkstreamPreference: (value: WorkstreamPreference) => void;
  visibleReplyText: string;
  workstreamPreference: WorkstreamPreference;
  isReplyRevealing: boolean;
}) {
  const [showFullHistory, setShowFullHistory] = React.useState(false);
  const hiddenMessageCount = Math.max(0, plannerMessages.length - 8);
  const visibleMessages = showFullHistory ? plannerMessages : plannerMessages.slice(-8);

  React.useEffect(() => {
    if (plannerMessages.length <= 8) {
      setShowFullHistory(false);
    }
  }, [plannerMessages.length]);

  return (
    <section className="flex min-h-screen min-w-0 flex-col border-b border-ink-900/8 bg-white lg:h-screen lg:min-h-0 lg:overflow-hidden lg:border-b-0 lg:border-r lg:border-ink-900/8" id="planner">
      <header className="flex min-h-14 shrink-0 items-center justify-between border-b border-ink-900/8 px-4">
        <div className="min-w-0 text-sm">
          <span className="text-ink-500">VRI Harness</span>
          <span className="px-2 text-ink-500">/</span>
          <span className="font-medium">Lab planner</span>
        </div>
        <div className="hidden items-center gap-3 text-sm text-ink-500 sm:flex">
          <span>Lab scope + run trace</span>
          <PanelRight className="h-4 w-4" />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <LeftControlSections
            activeRun={activeRun}
            artifactError={artifactError}
            artifactLoading={artifactLoading}
            conversations={conversations}
            files={files}
            health={health}
            nextStep={nextStep}
            onLoadConversation={onLoadConversation}
            onNewConversation={onNewConversation}
            onOpenFileInNewTab={onOpenFileInNewTab}
            onRefresh={onRefresh}
            onSelectFile={onSelectFile}
            onSelectRunLab={onSelectRunLab}
            onShowPlan={onShowPlan}
            onTogglePanel={onTogglePanel}
            openPanels={openPanels}
            plannerReply={plannerReply}
            selectedFile={selectedFile}
            selectedFileId={selectedFileId}
            selectedLab={selectedLab}
          />

          <AssistantCard>
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium">Ask in chat. Labs and constraints live here.</p>
                <p className="mt-2 text-sm leading-6 text-ink-500">{nextStep}</p>
              </div>
            </div>
          </AssistantCard>

          <LabPickerInChat
            allowedLabIds={allowedLabIds}
            labPrompts={labPrompts}
            onToggleLab={onToggleLab}
            onUseAllLabs={onUseAllLabs}
            setWorkstreamPreference={setWorkstreamPreference}
            workstreamPreference={workstreamPreference}
          />

          {loading === "work" ? <WorkspaceStartingCard /> : null}

          {hiddenMessageCount > 0 ? (
            <AssistantCard>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-600">
                  {showFullHistory
                    ? `Showing full history (${plannerMessages.length} messages)`
                    : `${hiddenMessageCount} earlier message${hiddenMessageCount === 1 ? "" : "s"} hidden for focus`}
                </p>
                <button
                  className="rounded-full border border-ink-900/10 bg-white px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-900/[0.03]"
                  onClick={() => setShowFullHistory((current) => !current)}
                  type="button"
                >
                  {showFullHistory ? "Show latest only" : "Show full thread"}
                </button>
              </div>
            </AssistantCard>
          ) : null}

          {visibleMessages.map((message, index) => (
            <ChatBubble key={`${message.role}-${index}`} message={message} onAnswer={onAsk} />
          ))}

          {loading === "chat" && !visibleReplyText ? <PendingAssistantCard /> : null}

          {loading === "chat" && visibleReplyText ? (
            <StreamingAssistantCard visibleText={visibleReplyText} />
          ) : null}

          {plannerReply ? (
            <AssistantReplyCard
              isRevealing={isReplyRevealing}
              onAnswer={onAsk}
              reply={plannerReply}
              visibleText={visibleReplyText}
            />
          ) : null}

          {error ? <ErrorCard error={error} /> : null}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-ink-900/8 bg-white px-4 py-4">
        <form
          className="mx-auto w-full max-w-4xl rounded-xl border border-ink-900/10 bg-white shadow-lift"
          onSubmit={(event) => {
            event.preventDefault();
            onAsk();
          }}
        >
          <textarea
            className="max-h-56 min-h-28 w-full resize-y overflow-y-auto rounded-t-lg bg-transparent px-5 py-4 text-base leading-6 outline-none placeholder:text-ink-400"
            onChange={(event) => setPlannerInput(event.target.value)}
            onWheel={(event) => {
              const textarea = event.currentTarget;
              if (textarea.scrollHeight > textarea.clientHeight) {
                event.stopPropagation();
              }
            }}
            placeholder="Ask VRI about any research problem: math, biology, chemistry, physics, engineering, clinical work, datasets, literature, or workflows..."
            value={plannerInput}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/8 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <MessageSquareText className="h-4 w-4" />
              <span>{allowedLabIds.length ? `${allowedLabIds.length} starter templates selected` : "VRI can create any needed labs"}</span>
            </div>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-full border border-beacon-700 bg-beacon-600 px-4 text-sm font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading === "chat" || plannerInput.trim().length === 0}
              type="submit"
            >
              {loading === "chat" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Ask
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function WorkspaceStartingCard() {
  return (
    <AssistantCard>
      <div className="flex items-start gap-3 text-beacon-950">
        <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" />
        <div>
          <p className="font-medium">Starting workspace</p>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            VRI is creating the run manifest, lab cards, scripts, literature files, and artifact index. The right viewer is on the Run tab.
          </p>
        </div>
      </div>
    </AssistantCard>
  );
}

function LabPickerInChat({
  allowedLabIds,
  labPrompts,
  onToggleLab,
  onUseAllLabs,
  setWorkstreamPreference,
  workstreamPreference,
}: {
  allowedLabIds: string[];
  labPrompts: LabPrompt[];
  onToggleLab: (labId: string) => void;
  onUseAllLabs: () => void;
  setWorkstreamPreference: (value: WorkstreamPreference) => void;
  workstreamPreference: WorkstreamPreference;
}) {
  const [domainFilter, setDomainFilter] = React.useState<string>("all");
  const visibleDomains = React.useMemo(() => {
    const apiDomains = Array.from(
      new Set(
        labPrompts
          .map((lab) => lab.domain?.trim())
          .filter((domain): domain is string => Boolean(domain))
      )
    );
    return apiDomains.length > 0 ? apiDomains : defaultLabCreationDomains;
  }, [labPrompts]);

  const visibleLabPrompts = React.useMemo(() => {
    if (domainFilter === "all") return labPrompts;
    const normalizedFilter = domainFilter.toLowerCase();
    return labPrompts.filter((lab) => {
      const normalizedDomain = lab.domain.toLowerCase();
      return (
        normalizedDomain === normalizedFilter ||
        normalizedDomain.includes(normalizedFilter) ||
        normalizedFilter.includes(normalizedDomain)
      );
    });
  }, [domainFilter, labPrompts]);

  React.useEffect(() => {
    if (domainFilter === "all") return;
    if (!visibleDomains.some((domain) => domain.toLowerCase() === domainFilter.toLowerCase())) {
      setDomainFilter("all");
    }
  }, [domainFilter, visibleDomains]);

  return (
    <AssistantCard>
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4" />
        <h2 className="font-medium">Lab creation scope</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink-500">
        VRI is not limited to the starter templates below. It can create whatever labs the work needs across quantitative, experimental, clinical, computational, and review domains.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          className={cx(
            "rounded-full border px-2.5 py-1 text-xs",
            domainFilter === "all"
              ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
              : "border-ink-900/8 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
          )}
          onClick={() => setDomainFilter("all")}
          type="button"
        >
          All domains
        </button>
        {visibleDomains.map((domain) => (
          <button
            className={cx(
              "rounded-full border px-2.5 py-1 text-xs",
              domainFilter === domain
                ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                : "border-ink-900/8 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
            )}
            key={domain}
            onClick={() => setDomainFilter(domain)}
            type="button"
          >
            {domain}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className={cx(
            "rounded-full border px-3 py-1 text-xs font-medium",
            allowedLabIds.length === 0
              ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
              : "border-ink-900/10 bg-white text-ink-700 hover:bg-ink-900/[0.03]"
          )}
          onClick={onUseAllLabs}
          type="button"
        >
          Let VRI create needed labs
        </button>
        <span className="text-xs text-ink-500">
          {allowedLabIds.length === 0 ? "No domain is constrained." : `${allowedLabIds.length} starter template${allowedLabIds.length === 1 ? "" : "s"} selected as anchors.`}
        </span>
      </div>
      {labPrompts.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">Lab prompts are loading from /v1/lab-prompts.</p>
      ) : (
        <div className="mt-4 rounded-lg border border-ink-900/8 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-ink-500">
            Optional starter templates / {domainFilter === "all" ? "All domains" : domainFilter}
          </p>
          {visibleLabPrompts.length === 0 ? (
            <p className="mt-3 text-sm text-ink-500">
              No starter templates match this domain yet.
            </p>
          ) : (
            <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
              {visibleLabPrompts.map((lab) => {
              const constrained = allowedLabIds.length > 0;
              const active = allowedLabIds.includes(lab.id);
              return (
                <button
                  key={lab.id}
                  className={cx(
                    "rounded-md border p-3 text-left transition",
                    active
                      ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                      : "border-ink-900/8 bg-white hover:border-ink-900/20 hover:bg-ink-900/[0.02]"
                  )}
                  onClick={() => onToggleLab(lab.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium">{lab.name}</p>
                    <span className={cx(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]",
                      active
                        ? "border-beacon-500/35 text-beacon-800"
                        : constrained
                          ? "border-ink-900/10 text-ink-400"
                          : "border-ink-900/10 text-ink-500"
                    )}>
                      {active ? "anchor" : constrained ? "out" : "starter"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-500">{lab.domain}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink-500">{lab.default_objective}</p>
                </button>
              );
              })}
            </div>
          )}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-500">Workstream</span>
        {workstreams.map((stream) => (
          <button
            key={stream.value}
            className={cx(
              "rounded-full border px-3 py-1 text-xs font-medium",
              workstreamPreference === stream.value
                ? "border-ink-900 bg-ink-900 text-white"
                : "border-ink-900/10 bg-white text-ink-700 hover:bg-ink-900/[0.03]"
            )}
            onClick={() => setWorkstreamPreference(stream.value)}
            type="button"
          >
            {stream.label}
          </button>
        ))}
      </div>
    </AssistantCard>
  );
}

function ChatBubble({
  message,
  onAnswer,
}: {
  message: PlannerMessage;
  onAnswer: (message?: string) => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cx(
          "max-w-[88%] rounded-lg border px-4 py-3 text-sm leading-6",
          isUser
            ? "border-ink-900/10 bg-ink-900 text-white"
            : "border-ink-900/8 bg-white text-ink-900"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.reply ? (
          <ClarificationQuestions onSubmit={onAnswer} reply={message.reply} />
        ) : null}
      </div>
    </div>
  );
}

function PendingAssistantCard() {
  return (
    <AssistantCard>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-parchment-50">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
        <div>
          <p className="text-sm font-medium">Aletheia is routing this through the institute labs.</p>
          <p className="mt-1 text-xs text-ink-500">Waiting for /v1/vri-chat to return a structured plan.</p>
        </div>
      </div>
    </AssistantCard>
  );
}

function StreamingAssistantCard({ visibleText }: { visibleText: string }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-xl border border-ink-900/8 bg-white px-4 py-3 text-sm leading-6 shadow-pane">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-500">
          <Bot className="h-3.5 w-3.5" />
          <span>Aletheia</span>
          <span className="normal-case tracking-normal text-beacon-700">streaming</span>
        </div>
        <p className="whitespace-pre-wrap">
          {visibleText}
          <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-beacon-600 align-[-2px]" />
        </p>
      </div>
    </div>
  );
}

function AssistantReplyCard({
  isRevealing,
  onAnswer,
  reply,
  visibleText,
}: {
  isRevealing: boolean;
  onAnswer: (message?: string) => void;
  reply: VriPlannerReply;
  visibleText: string;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-xl border border-ink-900/8 bg-white px-4 py-3 text-sm leading-6 shadow-pane">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-500">
          <Bot className="h-3.5 w-3.5" />
          <span>Aletheia / {reply.stage}</span>
          {isRevealing ? <span className="normal-case tracking-normal text-beacon-700">writing</span> : null}
        </div>
        <p className="whitespace-pre-wrap">
          {visibleText}
          {isRevealing ? <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-beacon-600 align-[-2px]" /> : null}
        </p>
        {hasClarifications(reply) ? (
          <ClarificationQuestions onSubmit={onAnswer} reply={reply} />
        ) : null}
      </div>
    </div>
  );
}

function AssistantCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-ink-900/8 bg-parchment-50/70 p-4 shadow-pane">{children}</section>;
}

export function PlanCard({
  hasWorkspace,
  loading,
  onApprove,
  onRevise,
  reply,
}: {
  hasWorkspace: boolean;
  loading: string | null;
  onApprove: () => void;
  onRevise: (message?: string) => void;
  reply: VriPlannerReply;
}) {
  const [revision, setRevision] = React.useState("");

  function submitRevision() {
    const clean = revision.trim();
    if (!clean) return;
    onRevise(`Please revise the plan:\n${clean}`);
    setRevision("");
  }

  return (
    <AssistantCard>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-ink-500">VRI plan / {reply.stage}</p>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          Review the proposed labs, tasks, estimates, files, and handoffs. Workspace files and analysis only start after you approve it.
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-ink-900/10 bg-white p-4">
        <MarkdownBlock
          markdown={reply.plan_markdown || fallbackPlanMarkdown(reply)}
        />
      </div>

      <div className="mt-4 rounded-lg border border-ink-900/10 bg-white p-4">
        <p className="text-sm font-medium">Does this plan look good to you?</p>
        <div className="mt-3 space-y-2">
          <button
            className="flex w-full items-center gap-3 rounded-md border border-beacon-500/40 bg-beacon-50 px-3 py-2 text-left text-sm text-beacon-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading === "work"}
            onClick={onApprove}
            type="button"
          >
            {loading === "work" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {hasWorkspace ? "Yes, start a new workspace from this plan" : "Yes, proceed with the plan"}
          </button>
          <div className="flex gap-2">
            <input
              className="min-w-0 flex-1 rounded-md border border-ink-900/10 px-3 py-2 text-sm outline-none placeholder:text-ink-400 focus:border-beacon-500/45"
              onChange={(event) => setRevision(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitRevision();
              }}
              placeholder="Tell VRI what you want to change in the plan..."
              value={revision}
            />
            <button
              aria-label="Send plan revision request"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-ink-900/10 text-ink-500 hover:bg-ink-900/[0.03] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!revision.trim() || loading === "chat"}
              onClick={submitRevision}
              title="Send plan revision request"
              type="button"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AssistantCard>
  );
}

function MarkdownBlock({ markdown }: { markdown: string }) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 text-sm leading-6 text-ink-700">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          return <h4 key={index} className="pt-1 text-base font-semibold text-ink-900">{renderInlineMarkdown(block.slice(4))}</h4>;
        }
        if (block.startsWith("## ")) {
          return <h3 key={index} className="text-lg font-semibold text-ink-900">{renderInlineMarkdown(block.slice(3))}</h3>;
        }
        if (block.startsWith("# ")) {
          return <h2 key={index} className="text-xl font-semibold text-ink-900">{renderInlineMarkdown(block.slice(2))}</h2>;
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="space-y-2 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-disc">{renderInlineMarkdown(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={index} className="space-y-2 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="list-decimal">{renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }

        return <p key={index} className="whitespace-pre-wrap">{renderInlineMarkdown(block)}</p>;
      })}
    </div>
  );
}

function renderInlineMarkdown(value: string) {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-ink-900/[0.06] px-1 py-0.5 text-[0.92em]">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-ink-900">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function ErrorCard({ error }: { error: string }) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-800">
      {error}
    </div>
  );
}
