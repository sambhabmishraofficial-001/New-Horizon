"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  ExternalLink,
  Eye,
  FileText,
  FlaskConical,
  Folder,
  GripVertical,
  Loader2,
  MessageSquareText,
  Minimize2,
  PanelRight,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";

type Workstream = "computational" | "experimental" | "hybrid" | "review" | "data";
type WorkstreamPreference = "any" | Workstream;

type Health = {
  status: string;
  database: string;
  model_provider: string;
  model_name: string;
  model_configured: boolean;
  langsmith_tracing: boolean;
};

type LabPrompt = {
  id: string;
  name: string;
  domain: string;
  system_prompt: string;
  default_objective: string;
  default_context: string;
};

type LiteratureResult = {
  title: string;
  authors?: string | null;
  year?: string | null;
  journal?: string | null;
  doi?: string | null;
  pmid?: string | null;
  source?: string | null;
  url?: string | null;
  abstract?: string | null;
};

type ToolCallRecord = {
  name: string;
  status: string;
  input?: unknown;
  output?: unknown;
  started_at?: string | null;
  completed_at?: string | null;
};

type LabEvent = {
  lab_name: string;
  workstream: string;
  action: string;
  tool?: string | null;
  files: string[];
  handoff_to?: string | null;
  summary: string;
};

type ProposedLab = {
  name: string;
  kind: string;
  workstream: Workstream;
  can_run_here: boolean;
  rationale: string;
  first_tasks: string[];
};

type ClarificationOption = {
  label: string;
  detail?: string | null;
};

type ClarificationItem = {
  id: string;
  label: string;
  question: string;
  input_type: "single_choice" | "free_text";
  options: ClarificationOption[];
};

type WorkRun = {
  run_id: string;
  status: string;
  workspace_path: string;
  venv_path: string;
  literature_query: string;
  steps: { status: string; label: string }[];
  tool_calls: ToolCallRecord[];
  generated_files: string[];
  data_files: string[];
  processed_files: string[];
  labs_created: ProposedLab[];
  tasks_created: { title: string; workstream: Workstream; source: string }[];
  lab_events?: LabEvent[];
  literature_results: LiteratureResult[];
  errors: string[];
};

type WorkspaceArtifactFile = {
  path: string;
  relative_path: string;
  kind: string;
  size_bytes: number;
  preview: string;
  truncated: boolean;
};

type WorkspaceArtifacts = {
  run_id: string;
  workspace_path: string;
  files: WorkspaceArtifactFile[];
};

type PlannerMessage = {
  role: "user" | "assistant";
  content: string;
  reply?: VriPlannerReply;
};

type VriPlannerReply = {
  stage: "direct_answer" | "clarify" | "proposal" | "confirmed";
  intent?: "direct_answer" | "clarify" | "proposal";
  answer: string;
  clarification_round?: number;
  planning_allowed?: boolean;
  objective_clear?: boolean;
  answer_quality?: "unknown" | "clear" | "incomplete" | "invalid";
  missing_information?: string[];
  repair_reasons?: string[];
  clarification_questions: string[];
  clarification_items?: ClarificationItem[];
  proposed_labs: ProposedLab[];
  computational_work: string[];
  experimental_work: string[];
  next_actions: string[];
  plan_markdown?: string;
};

type SavedConversation = {
  id: string;
  title: string;
  updated_at: string;
  messages: PlannerMessage[];
  reply: VriPlannerReply | null;
  workstream_preference: WorkstreamPreference;
  allowed_lab_ids: string[];
};

type ViewFile = {
  id: string;
  name: string;
  path: string;
  kind: string;
  sizeLabel: string;
  preview: string | null;
  truncated?: boolean;
};

type InspectorPanel = "progress" | "results" | "files" | "tools";

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

const CONVERSATIONS_KEY = "vri.planner.conversations";
const WORK_RUNS_KEY = "vri.workspace.runs";

const workstreams: { value: WorkstreamPreference; label: string }[] = [
  { value: "any", label: "Any work" },
  { value: "computational", label: "Computational" },
  { value: "experimental", label: "Experimental" },
  { value: "hybrid", label: "Hybrid" },
  { value: "review", label: "Review" },
  { value: "data", label: "Data" },
];

export default function BackendTestPage() {
  const [health, setHealth] = React.useState<Health | null>(null);
  const [labPrompts, setLabPrompts] = React.useState<LabPrompt[]>([]);
  const [selectedLabId, setSelectedLabId] = React.useState("");
  const [allowedLabIds, setAllowedLabIds] = React.useState<string[]>([]);
  const [workstreamPreference, setWorkstreamPreference] =
    React.useState<WorkstreamPreference>("any");
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [savedConversations, setSavedConversations] = React.useState<SavedConversation[]>([]);
  const [workRuns, setWorkRuns] = React.useState<WorkRun[]>([]);
  const [activeWorkRun, setActiveWorkRun] = React.useState<WorkRun | null>(null);
  const [workspaceArtifacts, setWorkspaceArtifacts] =
    React.useState<WorkspaceArtifacts | null>(null);
  const [artifactLoading, setArtifactLoading] = React.useState(false);
  const [artifactError, setArtifactError] = React.useState<string | null>(null);
  const [plannerInput, setPlannerInput] = React.useState("");
  const [plannerMessages, setPlannerMessages] = React.useState<PlannerMessage[]>([]);
  const [plannerReply, setPlannerReply] = React.useState<VriPlannerReply | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = React.useState<string | null>(null);
  const [openInspectorPanels, setOpenInspectorPanels] =
    React.useState<InspectorPanel[]>(["progress", "files"]);
  const [expandedFileViewer, setExpandedFileViewer] = React.useState(false);
  const [inspectorWidth, setInspectorWidth] = React.useState(430);
  const [visibleReplyText, setVisibleReplyText] = React.useState("");
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  const selectedLab = React.useMemo(
    () => labPrompts.find((lab) => lab.id === selectedLabId) ?? null,
    [labPrompts, selectedLabId]
  );

  const viewFiles = React.useMemo(() => {
    const artifactFiles = workspaceArtifacts?.files ?? [];
    const seen = new Set<string>();
    const files: ViewFile[] = artifactFiles.map((file) => {
      seen.add(file.relative_path);
      seen.add(file.path);
      return {
        id: `artifact:${file.path}`,
        name: file.relative_path,
        path: file.path,
        kind: file.kind,
        sizeLabel: formatBytes(file.size_bytes),
        preview: file.preview,
        truncated: file.truncated,
      };
    });

    const runPaths = activeWorkRun
      ? [
          ...activeWorkRun.generated_files,
          ...activeWorkRun.data_files,
          ...activeWorkRun.processed_files,
        ]
      : [];

    for (const path of runPaths) {
      if (seen.has(path)) continue;
      files.push({
        id: `path:${path}`,
        name: path,
        path,
        kind: "file",
        sizeLabel: "Preview pending",
        preview: null,
      });
    }

    return files;
  }, [activeWorkRun, workspaceArtifacts]);

  const selectedFile = React.useMemo(
    () => viewFiles.find((file) => file.id === selectedFileId) ?? viewFiles[0] ?? null,
    [selectedFileId, viewFiles]
  );

  const nextStep = React.useMemo(() => {
    if (!health || labPrompts.length === 0) return "Wait for backend health and lab prompts.";
    if (!plannerReply) return "Choose labs in the chat, then ask VRI your research question.";
    if (plannerReply.stage === "clarify") return "Answer the clarification questions directly in chat.";
    if (!activeWorkRun) return "Review the proposed labs, then approve the workspace.";
    return "Review workspace files, tool calls, literature, and run output.";
  }, [activeWorkRun, health, labPrompts.length, plannerReply]);

  React.useEffect(() => {
    setSavedConversations(readStorage<SavedConversation[]>(CONVERSATIONS_KEY, []));
    const runs = readStorage<WorkRun[]>(WORK_RUNS_KEY, []);
    setWorkRuns(runs);
    setActiveWorkRun(runs[0] ?? null);
  }, []);

  React.useEffect(() => {
    writeStorage(CONVERSATIONS_KEY, savedConversations);
  }, [savedConversations]);

  React.useEffect(() => {
    writeStorage(WORK_RUNS_KEY, workRuns);
  }, [workRuns]);

  React.useEffect(() => {
    void checkHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!activeWorkRun) {
      setWorkspaceArtifacts(null);
      setArtifactError(null);
      return;
    }

    let cancelled = false;
    setArtifactLoading(true);
    setArtifactError(null);
    request<WorkspaceArtifacts>(`/v1/workspaces/${activeWorkRun.run_id}/artifacts`)
      .then((payload) => {
        if (!cancelled) setWorkspaceArtifacts(payload);
      })
      .catch((err) => {
        if (!cancelled) {
          setWorkspaceArtifacts(null);
          setArtifactError(err instanceof Error ? err.message : "Artifact load failed.");
        }
      })
      .finally(() => {
        if (!cancelled) setArtifactLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeWorkRun]);

  React.useEffect(() => {
    if (viewFiles.length > 0 && !viewFiles.some((file) => file.id === selectedFileId)) {
      setSelectedFileId(viewFiles[0].id);
    }
  }, [selectedFileId, viewFiles]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [plannerMessages, plannerReply, visibleReplyText]);

  React.useEffect(() => {
    if (viewFiles.length > 0 && !openInspectorPanels.includes("files")) {
      setOpenInspectorPanels((prev) => [...prev, "files"]);
    }
  }, [openInspectorPanels, viewFiles.length]);

  async function request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    const payload = (await response.json()) as T;
    if (!response.ok) throw new Error(JSON.stringify(payload, null, 2));
    return payload;
  }

  async function checkHealth() {
    setLoading("health");
    setError(null);
    try {
      const nextHealth = await request<Health>("/health");
      const prompts = await request<LabPrompt[]>("/v1/lab-prompts");
      setHealth(nextHealth);
      setLabPrompts(prompts);
      setSelectedLabId((current) =>
        prompts.length > 0 && (!current || !prompts.some((lab) => lab.id === current))
          ? prompts[0].id
          : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backend health check failed.");
    } finally {
      setLoading(null);
    }
  }

  async function askVri(message = plannerInput) {
    const clean = message.trim();
    if (!clean) return;

    const nextMessages: PlannerMessage[] = [
      ...plannerMessages,
      { role: "user", content: clean },
    ];
    setPlannerInput("");
    setPlannerMessages(nextMessages);
    setPlannerReply(null);
    setVisibleReplyText("");
    setLoading("chat");
    setError(null);

    try {
      let reply: VriPlannerReply;
      try {
        reply = await streamVriReply(nextMessages);
      } catch {
        setVisibleReplyText("");
        reply = await request<VriPlannerReply>("/v1/vri-chat", {
          method: "POST",
          body: JSON.stringify({
            messages: wireMessages(nextMessages),
            allowed_lab_ids: allowedLabIds,
            workstream_preference: workstreamPreference,
          }),
        });
        setVisibleReplyText(reply.answer);
      }

      const updatedMessages: PlannerMessage[] = [
        ...nextMessages,
        { role: "assistant", content: reply.answer, reply },
      ];
      const conversationId = activeConversationId ?? makeId();
      setActiveConversationId(conversationId);
      setPlannerReply(reply);
      setPlannerMessages(updatedMessages);
      setVisibleReplyText((current) => current || reply.answer);
      saveConversation(conversationId, updatedMessages, reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "VRI planner request failed.");
      setPlannerMessages(plannerMessages);
      setPlannerInput(clean);
    } finally {
      setLoading(null);
    }
  }

  async function streamVriReply(messages: PlannerMessage[]) {
    const response = await fetch(`${apiBase}/v1/vri-chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: wireMessages(messages),
        allowed_lab_ids: allowedLabIds,
        workstream_preference: workstreamPreference,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Streaming VRI planner request failed.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalReply: VriPlannerReply | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const eventBlock of events) {
        const event = parseSseEvent(eventBlock);
        if (!event) continue;
        if (event.type === "answer_delta" && typeof event.data.delta === "string") {
          setVisibleReplyText((current) => current + event.data.delta);
        }
        if (event.type === "final") {
          finalReply = event.data as VriPlannerReply;
        }
        if (event.type === "error") {
          throw new Error(String(event.data.message ?? "Streaming VRI planner request failed."));
        }
      }
    }

    if (buffer.trim()) {
      const event = parseSseEvent(buffer);
      if (event?.type === "final") finalReply = event.data as VriPlannerReply;
      if (event?.type === "error") {
        throw new Error(String(event.data.message ?? "Streaming VRI planner request failed."));
      }
    }

    if (!finalReply) throw new Error("Streaming VRI planner did not return a final plan.");
    return finalReply;
  }

  function saveConversation(
    conversationId: string,
    messages: PlannerMessage[],
    reply: VriPlannerReply | null
  ) {
    const firstUser = messages.find((message) => message.role === "user")?.content;
    const saved: SavedConversation = {
      id: conversationId,
      title: firstUser ? truncate(firstUser, 68) : "Untitled VRI thread",
      updated_at: new Date().toISOString(),
      messages,
      reply,
      workstream_preference: workstreamPreference,
      allowed_lab_ids: allowedLabIds,
    };

    setSavedConversations((prev) => [
      saved,
      ...prev.filter((conversation) => conversation.id !== conversationId),
    ].slice(0, 20));
  }

  function loadConversation(conversation: SavedConversation) {
    setActiveConversationId(conversation.id);
    setPlannerMessages(conversation.messages);
    setPlannerReply(conversation.reply);
    setWorkstreamPreference(conversation.workstream_preference);
    setAllowedLabIds(conversation.allowed_lab_ids);
    setPlannerInput("");
    setError(null);
  }

  function newConversation() {
    setActiveConversationId(null);
    setPlannerMessages([]);
    setPlannerReply(null);
    setPlannerInput("");
    setError(null);
  }

  function selectLab(labId: string) {
    setSelectedLabId(labId);
  }

  function toggleLab(labId: string) {
    setAllowedLabIds((prev) =>
      prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]
    );
    selectLab(labId);
  }

  async function approveAndStartWork() {
    if (!plannerReply || !plannerReply.planning_allowed || plannerMessages.length === 0) return;
    setLoading("work");
    setError(null);
    try {
      const run = await request<WorkRun>("/v1/start-work", {
        method: "POST",
        body: JSON.stringify({
          messages: wireMessages(plannerMessages),
          planner_reply: plannerReply,
          workstream_preference: workstreamPreference,
        }),
      });
      setActiveWorkRun(run);
      setWorkRuns((prev) => [run, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start VRI work.");
    } finally {
      setLoading(null);
    }
  }

  function startInspectorResize(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = inspectorWidth;

    function onPointerMove(moveEvent: PointerEvent) {
      const nextWidth = startWidth + startX - moveEvent.clientX;
      setInspectorWidth(Math.min(720, Math.max(360, nextWidth)));
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp, { once: true });
  }

  function toggleInspectorPanel(panel: InspectorPanel) {
    setOpenInspectorPanels((prev) =>
      prev.includes(panel) ? prev.filter((item) => item !== panel) : [...prev, panel]
    );
  }

  function selectFile(fileId: string) {
    setSelectedFileId(fileId);
    setExpandedFileViewer(true);
  }

  function openFileInNewTab(file: ViewFile | null) {
    if (!file || typeof window === "undefined") return;
    const html = filePreviewHtml(file);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  }

  const renderedMessages =
    plannerReply &&
    plannerMessages.at(-1)?.role === "assistant" &&
    plannerMessages.at(-1)?.content === plannerReply.answer
      ? plannerMessages.slice(0, -1)
      : plannerMessages;

  const isReplyRevealing = loading === "chat";

  return (
    <main className="min-h-screen overflow-x-hidden bg-ink-50 text-ink-900 font-marketing">
      <div
        className="grid min-h-screen grid-cols-1 lg:h-screen lg:grid-cols-[64px_320px_minmax(420px,1fr)_minmax(360px,var(--inspector-width))] lg:overflow-hidden"
        style={{ "--inspector-width": `${inspectorWidth}px` } as React.CSSProperties}
      >
        <ActivityRail onRefresh={() => void checkHealth()} />

        <ProjectSidebar
          activeConversationId={activeConversationId}
          artifactLoading={artifactLoading}
          conversations={savedConversations}
          files={viewFiles}
          health={health}
          onLoadConversation={loadConversation}
          onNewConversation={newConversation}
          onRefresh={() => void checkHealth()}
          onSelectFile={selectFile}
          selectedFileId={selectedFile?.id ?? null}
        />

        <ChatPane
          activeRun={activeWorkRun}
          allowedLabIds={allowedLabIds}
          chatEndRef={chatEndRef}
          error={error}
          labPrompts={labPrompts}
          loading={loading}
          nextStep={nextStep}
          onApprove={() => void approveAndStartWork()}
          onAsk={(message?: string) => void askVri(message)}
          onUseAllLabs={() => setAllowedLabIds([])}
          onToggleLab={toggleLab}
          plannerInput={plannerInput}
          plannerMessages={renderedMessages}
          plannerReply={plannerReply}
          setPlannerInput={setPlannerInput}
          setWorkstreamPreference={setWorkstreamPreference}
          visibleReplyText={visibleReplyText}
          workstreamPreference={workstreamPreference}
          hasWorkspace={Boolean(activeWorkRun)}
          isReplyRevealing={isReplyRevealing}
        />

        <SideInspector
          openPanels={openInspectorPanels}
          activeRun={activeWorkRun}
          artifactError={artifactError}
          artifactLoading={artifactLoading}
          files={viewFiles}
          health={health}
          nextStep={nextStep}
          onOpenFileInNewTab={openFileInNewTab}
          onTogglePanel={toggleInspectorPanel}
          onResizeStart={startInspectorResize}
          onSelectFile={selectFile}
          selectedFile={selectedFile}
          selectedLab={selectedLab}
        />
      </div>
      {expandedFileViewer ? (
        <ExpandedFileViewer
          file={selectedFile}
          onClose={() => setExpandedFileViewer(false)}
          onOpenInNewTab={() => openFileInNewTab(selectedFile)}
        />
      ) : null}
    </main>
  );
}

function ActivityRail({ onRefresh }: { onRefresh: () => void }) {
  return (
    <aside className="hidden border-r border-ink-900/8 bg-white lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-5">
      <div className="grid gap-5">
        <div className="grid h-9 w-9 place-items-center rounded-full border border-ink-900/10 bg-ink-900 text-parchment-50">
          <Sparkles className="h-4 w-4" />
        </div>
        <RailLink active href="#planner" icon={MessageSquareText} label="Planner" />
        <RailLink href="#tasks" icon={Folder} label="Threads" />
        <RailLink href="#drive" icon={FileText} label="Files" />
        <RailAction icon={RefreshCw} label="Sync" onClick={onRefresh} />
      </div>
      <div className="grid gap-3 text-center text-xs text-ink-500">
        <a className="grid justify-items-center gap-1 hover:text-ink-900" href="#progress">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-900/10">
            <PanelRight className="h-4 w-4" />
          </span>
          Run
        </a>
      </div>
    </aside>
  );
}

function RailLink({
  active,
  href,
  icon: Icon,
  label,
}: {
  active?: boolean;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      className="grid justify-items-center gap-1 text-[11px] text-ink-500 hover:text-ink-900"
      href={href}
    >
      <span
        className={cx(
          "grid h-9 w-9 place-items-center rounded-full border",
          active ? "border-beacon-500/40 bg-beacon-50 text-beacon-700" : "border-transparent"
        )}
      >
        <Icon className={cx("h-5 w-5", active ? "text-beacon-700" : "text-ink-500")} />
      </span>
      {label}
    </a>
  );
}

function RailAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="grid justify-items-center gap-1 text-[11px] text-ink-500 hover:text-ink-900"
      onClick={onClick}
      type="button"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full border border-transparent">
        <Icon className="h-5 w-5 text-ink-500" />
      </span>
      {label}
    </button>
  );
}

function ProjectSidebar({
  activeConversationId,
  artifactLoading,
  conversations,
  files,
  health,
  onLoadConversation,
  onNewConversation,
  onRefresh,
  onSelectFile,
  selectedFileId,
}: {
  activeConversationId: string | null;
  artifactLoading: boolean;
  conversations: SavedConversation[];
  files: ViewFile[];
  health: Health | null;
  onLoadConversation: (conversation: SavedConversation) => void;
  onNewConversation: () => void;
  onRefresh: () => void;
  onSelectFile: (id: string) => void;
  selectedFileId: string | null;
}) {
  return (
    <aside className="min-h-[520px] border-b border-ink-900/8 bg-parchment-50 lg:h-screen lg:border-b-0 lg:border-r lg:border-ink-900/8">
      <div className="border-b border-ink-900/8 px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Project</p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight">VRI Harness</h1>
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
        <div className="mt-4 flex items-center gap-2 text-sm">
          {health?.status === "ok" ? (
            <CheckCircle2 className="h-4 w-4 text-green-700" />
          ) : (
            <XCircle className="h-4 w-4 text-amber-700" />
          )}
          <span>{health ? `${health.model_name} / ${health.database}` : "Connecting backend"}</span>
        </div>
      </div>

      <SidebarSection
        action={<button aria-label="Start a new planner thread" className="rounded p-1 text-ink-500 hover:bg-ink-900/[0.04] hover:text-ink-900" onClick={onNewConversation} title="Start a new planner thread" type="button"><Plus className="h-4 w-4" /></button>}
        id="tasks"
        title="Tasks"
      >
        {conversations.length === 0 ? (
          <EmptySidebarText>Planner threads appear after VRI responds.</EmptySidebarText>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={cx(
                "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
                activeConversationId === conversation.id
                  ? "border-beacon-500/35 bg-beacon-50 text-beacon-900"
                  : "border-transparent text-ink-700 hover:bg-ink-900/[0.04]"
              )}
              onClick={() => onLoadConversation(conversation)}
              type="button"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-ink-300" />
              <span className="min-w-0 flex-1 truncate">{conversation.title}</span>
              <span className="shrink-0 text-xs text-ink-500">{relativeTime(conversation.updated_at)}</span>
            </button>
          ))
        )}
      </SidebarSection>

      <SidebarSection id="drive" title="Drive">
        {artifactLoading ? (
          <EmptySidebarText>Loading workspace files.</EmptySidebarText>
        ) : files.length === 0 ? (
          <EmptySidebarText>Files appear after a workspace run creates artifacts.</EmptySidebarText>
        ) : (
          files.map((file) => (
            <button
              key={file.id}
              className={cx(
                "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm",
                selectedFileId === file.id
                  ? "border-beacon-500/35 bg-beacon-50 text-beacon-900"
                  : "border-transparent text-ink-700 hover:bg-ink-900/[0.04]"
              )}
              onClick={() => onSelectFile(file.id)}
              type="button"
            >
              <FileText className="h-4 w-4 shrink-0 text-ink-400" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
            </button>
          ))
        )}
      </SidebarSection>
    </aside>
  );
}

function SidebarSection({
  action,
  children,
  id,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
  title: string;
}) {
  return (
    <section className="border-b border-ink-900/8" id={id}>
      <div className="flex items-center justify-between border-b border-ink-900/8 px-4 py-2">
        <div className="flex items-center gap-2">
          <ChevronDown className="h-4 w-4" />
          <h2 className="text-sm font-medium">{title}</h2>
        </div>
        {action}
      </div>
      <div className="max-h-[32vh] space-y-1 overflow-y-auto p-3">{children}</div>
    </section>
  );
}

function EmptySidebarText({ children }: { children: React.ReactNode }) {
  return <p className="px-3 py-4 text-center text-sm text-ink-500">{children}</p>;
}

function ChatPane({
  activeRun,
  allowedLabIds,
  chatEndRef,
  error,
  hasWorkspace,
  labPrompts,
  loading,
  nextStep,
  onApprove,
  onAsk,
  onToggleLab,
  onUseAllLabs,
  plannerInput,
  plannerMessages,
  plannerReply,
  setPlannerInput,
  setWorkstreamPreference,
  visibleReplyText,
  workstreamPreference,
  isReplyRevealing,
}: {
  activeRun: WorkRun | null;
  allowedLabIds: string[];
  chatEndRef: React.RefObject<HTMLDivElement>;
  error: string | null;
  hasWorkspace: boolean;
  labPrompts: LabPrompt[];
  loading: string | null;
  nextStep: string;
  onApprove: () => void;
  onAsk: (message?: string) => void;
  onToggleLab: (labId: string) => void;
  onUseAllLabs: () => void;
  plannerInput: string;
  plannerMessages: PlannerMessage[];
  plannerReply: VriPlannerReply | null;
  setPlannerInput: (value: string) => void;
  setWorkstreamPreference: (value: WorkstreamPreference) => void;
  visibleReplyText: string;
  workstreamPreference: WorkstreamPreference;
  isReplyRevealing: boolean;
}) {
  return (
    <section className="flex min-h-[760px] min-w-0 flex-col border-b border-ink-900/8 bg-white lg:h-screen lg:border-b-0 lg:border-r lg:border-ink-900/8" id="planner">
      <header className="flex min-h-14 items-center justify-between border-b border-ink-900/8 px-4">
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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-5">
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

          {plannerMessages.map((message, index) => (
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

          {plannerReply?.planning_allowed && plannerReply.stage !== "direct_answer" ? (
            <PlanCard
              hasWorkspace={hasWorkspace}
              loading={loading}
              onApprove={onApprove}
              onRevise={onAsk}
              reply={plannerReply}
            />
          ) : null}

          <RunTraceCard activeRun={activeRun} loading={loading} />

          {error ? <ErrorCard error={error} /> : null}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="border-t border-ink-900/8 bg-white px-4 py-4 lg:px-12">
        <form
          className="mx-auto max-w-4xl rounded-xl border border-ink-900/10 bg-white shadow-lift"
          onSubmit={(event) => {
            event.preventDefault();
            onAsk();
          }}
        >
          <textarea
            className="min-h-20 w-full resize-none rounded-t-lg bg-transparent px-5 py-4 text-base outline-none placeholder:text-ink-400"
            onChange={(event) => setPlannerInput(event.target.value)}
            placeholder="Ask VRI what to do with your project, dataset, biological question, or workflow..."
            value={plannerInput}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-900/8 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <MessageSquareText className="h-4 w-4" />
              <span>{allowedLabIds.length || "All"} labs in scope</span>
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
  return (
    <AssistantCard>
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4" />
        <h2 className="font-medium">Institute labs in scope</h2>
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
          All institute labs
        </button>
        <span className="text-xs text-ink-500">
          {allowedLabIds.length === 0 ? "VRI can route across every lab." : `${allowedLabIds.length} lab${allowedLabIds.length === 1 ? "" : "s"} selected.`}
        </span>
      </div>
      {labPrompts.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">Lab prompts are loading from /v1/lab-prompts.</p>
      ) : (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {labPrompts.map((lab) => {
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
                    {active ? "selected" : constrained ? "out" : "available"}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-500">{lab.domain}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink-500">{lab.default_objective}</p>
              </button>
            );
          })}
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

function ClarificationQuestions({
  onSubmit,
  reply,
}: {
  onSubmit: (message?: string) => void;
  reply: VriPlannerReply;
}) {
  const items = getClarificationItems(reply);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const answeredItems = items.filter((item) => answers[item.id]?.trim());
  const allAnswered = answeredItems.length === items.length;

  if (items.length === 0) return null;

  function submitAnswers() {
    if (!allAnswered) return;
    const message = [
      "Answers to clarification questions:",
      ...items.map((item, index) => `${index + 1}. ${item.label}: ${answers[item.id].trim()}`),
    ].join("\n");
    onSubmit(message);
  }

  return (
    <div className="mt-4 rounded-lg border border-ink-900/8 bg-parchment-50/65 p-3">
      <p className="border-b border-ink-900/8 px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink-500">
        {clarificationStatusLabel(reply)}
      </p>
      <div className="space-y-5 px-1 py-3">
        {items.map((item) => (
          <div key={item.id}>
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-sm text-ink-700">{item.question}</p>
            {item.input_type === "single_choice" && item.options.length >= 2 ? (
              <div className="mt-2 space-y-2">
                {item.options.map((option) => {
                  const selected = answers[item.id] === option.label;
                  return (
                    <button
                      key={option.label}
                      className={cx(
                        "flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left transition",
                        selected
                          ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                          : "border-ink-900/8 bg-white hover:bg-ink-900/[0.025]"
                      )}
                      onClick={() => setAnswers((current) => ({ ...current, [item.id]: option.label }))}
                      type="button"
                    >
                      <span className={cx(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                        selected ? "border-beacon-600 bg-beacon-100 text-beacon-700" : "border-ink-300"
                      )}>
                        {selected ? <CheckCircle2 className="h-3 w-3" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{option.label}</span>
                        {option.detail ? <span className="mt-1 block text-xs leading-5 text-ink-500">{option.detail}</span> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                className="mt-2 min-h-24 w-full resize-y rounded-md border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none placeholder:text-ink-400 focus:border-beacon-500/45"
                onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))}
                placeholder="Type your answer here..."
                value={answers[item.id] ?? ""}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-beacon-700 bg-beacon-600 px-4 py-2 text-sm font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!allAnswered}
        onClick={submitAnswers}
        type="button"
      >
        <Send className="h-4 w-4" />
        {allAnswered ? "Send answers" : `Answer ${items.length - answeredItems.length} more`}
      </button>
    </div>
  );
}

function AssistantCard({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-ink-900/8 bg-parchment-50/70 p-4 shadow-pane">{children}</section>;
}

function PlanCard({
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
    <aside className="relative min-h-[720px] border-t border-ink-900/8 bg-white lg:h-screen lg:border-t-0">
      <button
        aria-label="Resize inspector"
        className="absolute -left-3 top-1/2 z-10 hidden h-12 w-6 -translate-y-1/2 cursor-col-resize items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-400 shadow-pane hover:text-ink-900 lg:flex"
        onPointerDown={onResizeStart}
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="divide-y divide-ink-900/8">
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
        <pre className={cx("mt-3 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/10 bg-obsidian-300 p-3 text-xs leading-5 text-parchment-50", maxHeightClass)}>
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

function ExpandedFileViewer({
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

function LabProvenancePanel({
  activeRun,
  files,
  onOpenFile,
}: {
  activeRun: WorkRun;
  files: ViewFile[];
  onOpenFile: (id: string) => void;
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
              <span className="shrink-0 rounded-full border border-ink-900/10 px-2 py-0.5 text-[11px] text-ink-500">
                {event.workstream}
              </span>
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

function RunTraceCard({
  activeRun,
  loading,
}: {
  activeRun: WorkRun | null;
  loading: string | null;
}) {
  if (!activeRun && loading !== "work") return null;

  return (
    <AssistantCard>
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
    </AssistantCard>
  );
}

function ToolAndLiteraturePanel({ activeRun }: { activeRun: WorkRun | null }) {
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
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-ink-900/10 bg-obsidian-300 p-3 text-xs leading-5 text-parchment-50">
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

function ProgressSteps({
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

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-900/8 py-2 text-sm last:border-b-0">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function wireMessages(messages: PlannerMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

function hasClarifications(reply: VriPlannerReply) {
  return getClarificationItems(reply).length > 0;
}

function clarificationStatusLabel(reply: VriPlannerReply) {
  if (reply.answer_quality === "invalid") return "Repair needed";
  if (reply.missing_information?.length) return "Clarifying objective";
  const round = reply.clarification_round ?? 1;
  return `Clarification round ${round}`;
}

function getClarificationItems(reply: VriPlannerReply): ClarificationItem[] {
  if (reply.clarification_items?.length) return reply.clarification_items;
  return reply.clarification_questions.map((question, index) => ({
    id: `q${index + 1}`,
    label: `${index + 1}. Clarification`,
    question,
    input_type: "free_text",
    options: [],
  }));
}

function fallbackPlanMarkdown(reply: VriPlannerReply) {
  const labs = reply.proposed_labs.length
    ? reply.proposed_labs
        .map((lab) => `- **${lab.name}** (${lab.workstream}): ${lab.rationale}`)
        .join("\n")
    : "- No labs proposed.";

  const tasks = [
    ...reply.computational_work.map((task) => `**Computational** - ${task} _(estimate: 5-15 min)_`),
    ...reply.experimental_work.map((task) => `**Validation** - ${task} _(estimate: planning only)_`),
    ...reply.next_actions.map((task) => `**Next action** - ${task} _(estimate: 2-5 min)_`),
  ];

  const taskLines = tasks.length
    ? tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")
    : "1. **Review** - Confirm scope before workspace creation _(estimate: 2 min)_";

  return `## Proposed VRI Plan

### Labs
${labs}

### Step-by-step tasks
${taskLines}

### Expected files
- \`conversation.json\`, \`planner_reply.json\`, \`labs.json\`, and \`tasks.json\`
- \`literature.json\` and \`literature_queries.json\` when evidence search runs
- \`requirements.txt\`, generated scripts, data files, processed outputs, and reports when applicable

### Lab handoffs
- The coordinator creates the run manifests first.
- Evidence and data labs collect source material.
- Computational labs create scripts and processed outputs.
- Review or validation labs inspect the outputs before interpretation.`;
}

function fileOwnerLabel(activeRun: WorkRun | null, file: ViewFile) {
  const event = activeRun?.lab_events?.find((item) =>
    item.files.some((path) => path === file.path || path.endsWith(`/${file.name}`) || file.path.endsWith(path))
  );
  return event ? event.lab_name : "";
}

function fileIdForPath(path: string, files: ViewFile[]) {
  const file = files.find((item) => item.path === path || path.endsWith(`/${item.name}`) || item.path.endsWith(path));
  return file?.id ?? "";
}

function shortFilePath(path: string) {
  const normalized = path.replaceAll("\\", "/");
  const marker = "/.vri_workspaces/";
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex >= 0) {
    const parts = normalized.slice(markerIndex + marker.length).split("/");
    return parts.slice(1).join("/") || parts.join("/");
  }
  return normalized.split("/").slice(-3).join("/");
}

function parseSseEvent(block: string): { type: string; data: Record<string, unknown> } | null {
  const lines = block.split("\n");
  const eventLine = lines.find((line) => line.startsWith("event:"));
  const data = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  if (!eventLine || !data) return null;
  try {
    return { type: eventLine.slice(6).trim(), data: JSON.parse(data) as Record<string, unknown> };
  } catch {
    return null;
  }
}

function filePreviewHtml(file: ViewFile) {
  const content = file.preview || "No preview content returned for this file yet.";
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(file.name)}</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #15130f; background: #f8f5ee; }
      header { padding: 18px 22px; border-bottom: 1px solid rgba(21, 19, 15, 0.12); background: #fff; position: sticky; top: 0; }
      h1 { margin: 0; font-size: 18px; font-weight: 650; }
      p { margin: 6px 0 0; color: rgba(21, 19, 15, 0.62); font-size: 13px; }
      pre { margin: 22px; padding: 18px; min-height: calc(100vh - 130px); overflow: auto; white-space: pre-wrap; border: 1px solid rgba(21, 19, 15, 0.12); border-radius: 10px; background: #15130f; color: #f8f5ee; line-height: 1.55; font-size: 13px; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(file.name)}</h1>
      <p>${escapeHtml(file.kind)} / ${escapeHtml(file.sizeLabel)} / ${escapeHtml(file.path)}</p>
    </header>
    <pre>${escapeHtml(content)}${file.truncated ? "\n\n[Preview truncated by artifacts endpoint.]" : ""}</pre>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 3)}...`;
}

function relativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function toolDurationLabel(tool: ToolCallRecord) {
  const started = tool.started_at ? new Date(tool.started_at).getTime() : NaN;
  const completed = tool.completed_at ? new Date(tool.completed_at).getTime() : NaN;
  if (Number.isFinite(started) && Number.isFinite(completed) && completed >= started) {
    const seconds = (completed - started) / 1000;
    if (seconds < 1) return `${Math.max(1, Math.round(seconds * 1000))}ms`;
    if (seconds < 10) return `${seconds.toFixed(1)}s`;
    return `${Math.round(seconds)}s`;
  }
  if (tool.status === "running" || tool.status === "queued") return tool.status;
  return tool.completed_at ? "done" : "recorded";
}

function formatJsonValue(value: unknown) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
