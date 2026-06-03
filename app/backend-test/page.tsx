"use client";

import * as React from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  FlaskConical,
  History,
  ListChecks,
  Play,
  Plus,
  RefreshCw,
  Send,
  Server,
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

type Investigation = {
  id: string;
  title: string | null;
  objective: string;
  domain: string | null;
  context: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type LabPrompt = {
  id: string;
  name: string;
  domain: string;
  system_prompt: string;
  default_objective: string;
  default_context: string;
};

type RunResult = {
  id?: string;
  status?: string;
  result_json?: unknown;
  detail?: {
    run_id?: string;
    error?: string;
  };
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
};

type ProposedLab = {
  name: string;
  kind: string;
  workstream: Workstream;
  can_run_here: boolean;
  rationale: string;
  first_tasks: string[];
};

type VriPlannerReply = {
  stage: "clarify" | "proposal" | "confirmed";
  answer: string;
  clarification_questions: string[];
  proposed_labs: ProposedLab[];
  computational_work: string[];
  experimental_work: string[];
  next_actions: string[];
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

type WorkspaceLab = ProposedLab & {
  id: string;
  created_at: string;
};

type WorkspaceTask = {
  id: string;
  title: string;
  workstream: Workstream;
  source: string;
  created_at: string;
};

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

const CONVERSATIONS_KEY = "vri.planner.conversations";
const LABS_KEY = "vri.workspace.labs";
const TASKS_KEY = "vri.workspace.tasks";
const WORK_RUNS_KEY = "vri.workspace.runs";

export default function BackendTestPage() {
  const [health, setHealth] = React.useState<Health | null>(null);
  const [labPrompts, setLabPrompts] = React.useState<LabPrompt[]>([]);
  const [selectedLabId, setSelectedLabId] = React.useState("ribozyme-wet");
  const [allowedLabIds, setAllowedLabIds] = React.useState<string[]>([]);
  const [workstreamPreference, setWorkstreamPreference] =
    React.useState<WorkstreamPreference>("any");
  const [activeConversationId, setActiveConversationId] = React.useState<string | null>(null);
  const [savedConversations, setSavedConversations] = React.useState<SavedConversation[]>([]);
  const [workspaceLabs, setWorkspaceLabs] = React.useState<WorkspaceLab[]>([]);
  const [workspaceTasks, setWorkspaceTasks] = React.useState<WorkspaceTask[]>([]);
  const [workRuns, setWorkRuns] = React.useState<WorkRun[]>([]);
  const [activeWorkRun, setActiveWorkRun] = React.useState<WorkRun | null>(null);
  const [workspaceArtifacts, setWorkspaceArtifacts] =
    React.useState<WorkspaceArtifacts | null>(null);
  const [artifactLoading, setArtifactLoading] = React.useState(false);
  const [artifactError, setArtifactError] = React.useState<string | null>(null);
  const [investigation, setInvestigation] = React.useState<Investigation | null>(null);
  const [runResult, setRunResult] = React.useState<RunResult | null>(null);
  const [plannerInput, setPlannerInput] = React.useState(
    "I want to investigate drug resistance in a cancer cell line using transcriptomics and CRISPR screen data."
  );
  const [plannerMessages, setPlannerMessages] = React.useState<PlannerMessage[]>([]);
  const [plannerReply, setPlannerReply] = React.useState<VriPlannerReply | null>(null);
  const [objective, setObjective] = React.useState(
    "Find possible causes of drug resistance in a cancer cell line"
  );
  const [context, setContext] = React.useState(
    "We have transcriptomics and CRISPR screen results."
  );
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  const selectedLab = React.useMemo(
    () => labPrompts.find((lab) => lab.id === selectedLabId) ?? null,
    [labPrompts, selectedLabId]
  );

  React.useEffect(() => {
    setSavedConversations(readStorage<SavedConversation[]>(CONVERSATIONS_KEY, []));
    setWorkspaceLabs(readStorage<WorkspaceLab[]>(LABS_KEY, []));
    setWorkspaceTasks(readStorage<WorkspaceTask[]>(TASKS_KEY, []));
    const runs = readStorage<WorkRun[]>(WORK_RUNS_KEY, []);
    setWorkRuns(runs);
    setActiveWorkRun(runs[0] ?? null);
  }, []);

  React.useEffect(() => {
    writeStorage(CONVERSATIONS_KEY, savedConversations);
  }, [savedConversations]);

  React.useEffect(() => {
    writeStorage(LABS_KEY, workspaceLabs);
  }, [workspaceLabs]);

  React.useEffect(() => {
    writeStorage(TASKS_KEY, workspaceTasks);
  }, [workspaceTasks]);

  React.useEffect(() => {
    writeStorage(WORK_RUNS_KEY, workRuns);
  }, [workRuns]);

  const request = React.useCallback(async <T,>(path: string, init?: RequestInit) => {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    const payload = (await response.json()) as T;
    if (!response.ok) {
      throw new Error(JSON.stringify(payload, null, 2));
    }
    return payload;
  }, []);

  const checkHealth = React.useCallback(async () => {
    setLoading("health");
    setError(null);
    try {
      setHealth(await request<Health>("/health"));
      const prompts = await request<LabPrompt[]>("/v1/lab-prompts");
      setLabPrompts(prompts);
      if (prompts.length > 0 && !prompts.some((lab) => lab.id === selectedLabId)) {
        setSelectedLabId(prompts[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backend health check failed.");
    } finally {
      setLoading(null);
    }
  }, [request, selectedLabId]);

  React.useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

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
  }, [activeWorkRun, request]);

  React.useEffect(() => {
    if (!selectedLab || investigation) return;
    setObjective(selectedLab.default_objective);
    setContext(selectedLab.default_context);
  }, [selectedLab, investigation]);

  async function askVri(message = plannerInput) {
    const clean = message.trim();
    if (!clean) return;
    const nextMessages: PlannerMessage[] = [
      ...plannerMessages,
      { role: "user", content: clean },
    ];
    setLoading("chat");
    setError(null);
    setPlannerInput("");
    try {
      const reply = await request<VriPlannerReply>("/v1/vri-chat", {
        method: "POST",
        body: JSON.stringify({
          messages: nextMessages,
          allowed_lab_ids: allowedLabIds,
          workstream_preference: workstreamPreference,
        }),
      });
      const updatedMessages: PlannerMessage[] = [
        ...nextMessages,
        { role: "assistant", content: reply.answer },
      ];
      const conversationId = activeConversationId ?? makeId();
      setActiveConversationId(conversationId);
      setPlannerReply(reply);
      setPlannerMessages(updatedMessages);
      saveConversation(conversationId, updatedMessages, reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "VRI planner request failed.");
      setPlannerInput(clean);
    } finally {
      setLoading(null);
    }
  }

  function saveConversation(
    conversationId: string,
    messages: PlannerMessage[],
    reply: VriPlannerReply | null
  ) {
    const firstUser = messages.find((message) => message.role === "user")?.content;
    const saved: SavedConversation = {
      id: conversationId,
      title: firstUser ? truncate(firstUser, 70) : "Untitled VRI plan",
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
  }

  function newConversation() {
    setActiveConversationId(null);
    setPlannerMessages([]);
    setPlannerReply(null);
    setPlannerInput("");
    setError(null);
  }

  function addLab(lab: ProposedLab) {
    setWorkspaceLabs((prev) => [
      {
        ...lab,
        id: makeId(),
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    void askVri(
      `Revise the plan to include this lab and update all downstream tasks: ${lab.name}. Rationale: ${lab.rationale}`
    );
  }

  function addTask(title: string, workstream: Workstream, source: string) {
    setWorkspaceTasks((prev) => [
      {
        id: makeId(),
        title,
        workstream,
        source,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    void askVri(`Revise the plan to include this ${workstream} task from ${source}: ${title}`);
  }

  async function approveAndStartWork() {
    if (!plannerReply || plannerMessages.length === 0) return;
    setLoading("work");
    setError(null);
    try {
      const run = await request<WorkRun>("/v1/start-work", {
        method: "POST",
        body: JSON.stringify({
          messages: plannerMessages.filter((message) => message.role === "user" || message.role === "assistant"),
          planner_reply: plannerReply,
          workstream_preference: workstreamPreference,
        }),
      });
      setActiveWorkRun(run);
      setWorkRuns((prev) => [run, ...prev].slice(0, 10));
      const now = new Date().toISOString();
      setWorkspaceLabs((prev) => [
        ...run.labs_created.map((lab) => ({ ...lab, id: makeId(), created_at: now })),
        ...prev,
      ]);
      setWorkspaceTasks((prev) => [
        ...run.tasks_created.map((task) => ({ ...task, id: makeId(), created_at: now })),
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start VRI work.");
    } finally {
      setLoading(null);
    }
  }

  async function createInvestigation() {
    setLoading("create");
    setError(null);
    setRunResult(null);
    try {
      const created = await request<Investigation>("/v1/investigations", {
        method: "POST",
        body: JSON.stringify({
          objective,
          domain: selectedLabId,
          context,
        }),
      });
      setInvestigation(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Investigation creation failed.");
    } finally {
      setLoading(null);
    }
  }

  async function runInvestigation() {
    if (!investigation) return;
    setLoading("run");
    setError(null);
    try {
      const result = await request<RunResult>(`/v1/investigations/${investigation.id}/run`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      setRunResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Investigation run failed.";
      setRunResult(safeJson(message));
      setError(message);
    } finally {
      setLoading(null);
    }
  }

  function focusWithText(text: string) {
    setPlannerInput(text);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  const activeScopeLabel =
    workstreamPreference === "any" ? "All workstreams" : `${workstreamPreference} only`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f2] px-4 py-6 text-[#141413] sm:px-6">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
        <header className="flex flex-col gap-3 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-normal text-black/50">
              VRI planner console
            </p>
            <h1 className="mt-2 text-3xl font-medium tracking-normal md:text-5xl">
              Plan labs, tasks, and runs
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <StatusPill label="Frontend" value="localhost:4000" tone="ok" />
            <StatusPill
              label="Backend"
              value={health?.status === "ok" ? "reachable" : "checking"}
              tone={health?.status === "ok" ? "ok" : "pending"}
            />
            <StatusPill label="Scope" value={activeScopeLabel} tone="pending" />
          </div>
        </header>

        <section className="grid min-w-0 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-4">
            <Panel title="Conversations" icon={<History size={18} />}>
              <button
                className="mb-3 inline-flex h-9 items-center gap-2 rounded-md bg-[#171715] px-3 text-sm text-white"
                type="button"
                onClick={newConversation}
              >
                <Plus size={15} />
                New plan
              </button>
              <div className="max-h-64 space-y-2 overflow-auto">
                {savedConversations.length === 0 ? (
                  <div className="rounded-md border border-black/10 bg-[#fafaf7] p-3 text-sm text-black/55">
                    Old conversations will appear here after you send a goal.
                  </div>
                ) : (
                  savedConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full rounded-md border p-3 text-left text-sm ${
                        conversation.id === activeConversationId
                          ? "border-blue-600/30 bg-blue-50"
                          : "border-black/10 bg-white hover:bg-[#fafaf7]"
                      }`}
                      type="button"
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="font-medium text-black/80">{conversation.title}</div>
                      <div className="mt-1 font-mono text-[11px] text-black/40">
                        {new Date(conversation.updated_at).toLocaleString()}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Panel>

            <Panel title="Scope" icon={<Cpu size={18} />}>
              <label className="block text-sm text-black/60" htmlFor="workstream">
                Workstream preference
              </label>
              <select
                id="workstream"
                className="mt-2 h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/45"
                value={workstreamPreference}
                onChange={(event) =>
                  setWorkstreamPreference(event.target.value as WorkstreamPreference)
                }
              >
                <option value="any">Any workstream</option>
                <option value="computational">Computational only</option>
                <option value="data">Data / bioinformatics only</option>
                <option value="review">Literature / review only</option>
                <option value="experimental">Experimental only</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <div className="mt-4">
                <div className="text-sm text-black/60">Specific labs to use</div>
                <div className="mt-2 max-h-52 space-y-2 overflow-auto">
                  {labPrompts.map((lab) => (
                    <label
                      key={lab.id}
                      className="flex items-start gap-2 rounded-md border border-black/10 bg-[#fafaf7] p-2 text-sm"
                    >
                      <input
                        className="mt-1"
                        type="checkbox"
                        checked={allowedLabIds.includes(lab.id)}
                        onChange={() =>
                          setAllowedLabIds((prev) =>
                            prev.includes(lab.id)
                              ? prev.filter((id) => id !== lab.id)
                              : [...prev, lab.id]
                          )
                        }
                      />
                      <span>
                        <span className="block font-medium text-black/80">{lab.name}</span>
                        <span className="block text-xs text-black/45">{lab.domain}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {allowedLabIds.length > 0 ? (
                  <button
                    className="mt-3 text-sm text-blue-700"
                    type="button"
                    onClick={() => setAllowedLabIds([])}
                  >
                    Clear lab constraint
                  </button>
                ) : null}
              </div>
            </Panel>
          </div>

          <div className="min-w-0 space-y-4">
            <Panel title="Verbose Progress" icon={<Activity size={18} />}>
              <ProgressDeck
                loading={loading === "chat" || loading === "work"}
                messages={plannerMessages}
                reply={plannerReply}
                allowedCount={allowedLabIds.length}
                workstream={workstreamPreference}
                createdLabs={workspaceLabs.length}
                createdTasks={workspaceTasks.length}
                workRun={activeWorkRun}
                loadingMode={loading}
              />
            </Panel>

            <Panel title="Plan With VRI" icon={<Send size={18} />}>
              <div className="mb-4 max-h-[460px] space-y-3 overflow-auto rounded-md border border-black/10 bg-[#fafaf7] p-3">
                {plannerMessages.length === 0 ? (
                  <div className="text-sm text-black/55">
                    Describe the research goal. The VRI can ask many numbered clarifying
                    questions, propose labs, and split runnable computational work from wet-lab work.
                  </div>
                ) : (
                  plannerMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-md px-3 py-2 text-sm leading-6 ${
                        message.role === "user"
                          ? "ml-8 bg-[#2356b8] text-white"
                          : "mr-8 border border-black/10 bg-white text-black/75"
                      }`}
                    >
                      {message.content}
                    </div>
                  ))
                )}
              </div>
              <label className="block text-sm text-black/60" htmlFor="planner-message">
                Your goal, answer, or instruction
              </label>
              <textarea
                ref={inputRef}
                id="planner-message"
                className="mt-2 min-h-32 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/45"
                value={plannerInput}
                onChange={(event) => setPlannerInput(event.target.value)}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2356b8] px-4 text-sm text-white disabled:opacity-50"
                  type="button"
                  onClick={() => askVri()}
                  disabled={loading === "chat" || plannerInput.trim().length < 2}
                >
                  <Send size={16} />
                  {loading === "chat" ? "Asking..." : "Send"}
                </button>
                {plannerReply?.stage === "proposal" ? (
                  <button
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-black/15 bg-white px-4 text-sm disabled:opacity-50"
                    type="button"
                    onClick={() =>
                      askVri("Confirm this lab plan and give me the first execution steps.")
                    }
                    disabled={loading === "chat"}
                  >
                    <Play size={16} />
                    Confirm plan
                  </button>
                ) : null}
                {plannerReply?.proposed_labs.length ? (
                  <button
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm text-white disabled:opacity-50"
                    type="button"
                    onClick={approveAndStartWork}
                    disabled={loading === "work"}
                  >
                    <CheckCircle2 size={16} />
                    {loading === "work" ? "Starting work..." : "Approve & start work"}
                  </button>
                ) : null}
              </div>
            </Panel>
          </div>

          <div className="min-w-0 space-y-4">
            <Panel title="Planner Output" icon={<ListChecks size={18} />}>
              {loading === "chat" ? (
                <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/60">
                  Waiting for model response...
                </div>
              ) : plannerReply ? (
                <PlannerOutput
                  reply={plannerReply}
                  onUseText={focusWithText}
                  onAddLab={addLab}
                  onAddTask={addTask}
                />
              ) : (
                <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/60">
                  The detailed planner output appears here.
                </div>
              )}
            </Panel>

          </div>
        </section>

        <Panel title="Research Run Workspace" icon={<CheckCircle2 size={18} />}>
          <WorkspaceSummary
            labs={workspaceLabs}
            tasks={workspaceTasks}
            activeRun={activeWorkRun}
            workRuns={workRuns}
            artifacts={workspaceArtifacts}
            artifactLoading={artifactLoading}
            artifactError={artifactError}
            onSelectRun={setActiveWorkRun}
          />
        </Panel>

        <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <Panel title="Backend Health" icon={<Server size={18} />}>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#171715] px-4 text-sm text-white disabled:opacity-50"
                type="button"
                onClick={checkHealth}
                disabled={loading === "health"}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Metric label="API URL" value={apiBase} />
              <Metric label="Status" value={health?.status ?? "not checked"} />
              <Metric label="Database" value={health?.database ?? "not checked"} />
              <Metric label="Model" value={health?.model_name ?? "unknown"} />
              <Metric
                label="OpenAI configured"
                value={health?.model_configured ? "yes" : "no"}
              />
              <Metric
                label="LangSmith tracing"
                value={health?.langsmith_tracing ? "on" : "off"}
              />
            </dl>
          </Panel>

          <Panel title="Create Investigation" icon={<FlaskConical size={18} />}>
            <label className="block text-sm text-black/60" htmlFor="lab">
              Lab prompt
            </label>
            <select
              id="lab"
              className="mt-2 h-10 w-full rounded-md border border-black/15 bg-white px-3 text-sm outline-none focus:border-black/45"
              value={selectedLabId}
              onChange={(event) => {
                const lab = labPrompts.find((item) => item.id === event.target.value);
                setSelectedLabId(event.target.value);
                setInvestigation(null);
                setRunResult(null);
                if (lab) {
                  setObjective(lab.default_objective);
                  setContext(lab.default_context);
                }
              }}
            >
              {labPrompts.length === 0 ? (
                <option value={selectedLabId}>Loading labs</option>
              ) : (
                labPrompts.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))
              )}
            </select>
            {selectedLab ? (
              <div className="mt-3 rounded-md border border-black/10 bg-[#fafaf7] p-3">
                <div className="font-mono text-xs uppercase tracking-normal text-black/45">
                  Active system prompt
                </div>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {selectedLab.system_prompt}
                </p>
              </div>
            ) : null}

            <label className="block text-sm text-black/60" htmlFor="objective">
              Objective
            </label>
            <textarea
              id="objective"
              className="mt-2 min-h-24 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/45"
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
            />
            <label className="mt-4 block text-sm text-black/60" htmlFor="context">
              Context
            </label>
            <textarea
              id="context"
              className="mt-2 min-h-24 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/45"
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2356b8] px-4 text-sm text-white disabled:opacity-50"
                type="button"
                onClick={createInvestigation}
                disabled={loading === "create" || objective.trim().length < 3}
              >
                <Send size={16} />
                Create
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md border border-black/15 bg-white px-4 text-sm disabled:opacity-50"
                type="button"
                onClick={runInvestigation}
                disabled={!investigation || loading === "run"}
              >
                <Play size={16} />
                Run graph
              </button>
            </div>
          </Panel>
        </section>

        {error ? (
          <section className="rounded-md border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-950">
            <div className="font-medium">Backend returned an error</div>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap font-mono text-xs">
              {error}
            </pre>
          </section>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="Latest Investigation" icon={<Database size={18} />}>
            <JsonBlock value={investigation ?? { state: "No investigation created yet." }} />
          </Panel>
          <Panel title="Latest Run" icon={<Play size={18} />}>
            <JsonBlock value={runResult ?? { state: "No run started yet." }} />
          </Panel>
        </section>
      </div>
    </main>
  );
}

function PlannerOutput({
  reply,
  onUseText,
  onAddLab,
  onAddTask,
}: {
  reply: VriPlannerReply;
  onUseText: (text: string) => void;
  onAddLab: (lab: ProposedLab) => void;
  onAddTask: (title: string, workstream: Workstream, source: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <StatusPill label="Stage" value={reply.stage} tone="ok" />
        <StatusPill label="Questions" value={String(reply.clarification_questions.length)} tone="pending" />
        <StatusPill label="Labs" value={String(reply.proposed_labs.length)} tone="pending" />
      </div>
      <div className="rounded-md border border-black/10 bg-white p-4">
        <div className="font-mono text-xs uppercase tracking-normal text-black/45">
          Planner response
        </div>
        <p className="mt-2 text-sm leading-6 text-black/80">{reply.answer}</p>
      </div>
      <ActionList
        title="Clarifying questions"
        items={reply.clarification_questions}
        variant="numbered"
        actionLabel="Answer"
        onAction={(item) => onUseText(`${stripLeadingNumber(item)}\nAnswer: `)}
      />
      <WorkstreamList
        title="Computational work you can run here"
        items={reply.computational_work}
        tone="blue"
        onAddTask={(item) => onAddTask(item, "computational", "planner")}
      />
      <WorkstreamList
        title="Wet-lab / experimental work to track on top"
        items={reply.experimental_work}
        tone="green"
        onAddTask={(item) => onAddTask(item, "experimental", "planner")}
      />
      <LabProposalList
        labs={reply.proposed_labs}
        onAddLab={onAddLab}
        onAddTask={onAddTask}
      />
      <ActionList
        title="Next actions"
        items={reply.next_actions}
        actionLabel="Use in chat"
        onAction={onUseText}
        onAddTask={(item) => onAddTask(item, "hybrid", "next action")}
      />
    </div>
  );
}

function ProgressDeck({
  loading,
  loadingMode,
  messages,
  reply,
  allowedCount,
  workstream,
  createdLabs,
  createdTasks,
  workRun,
}: {
  loading: boolean;
  loadingMode: string | null;
  messages: PlannerMessage[];
  reply: VriPlannerReply | null;
  allowedCount: number;
  workstream: WorkstreamPreference;
  createdLabs: number;
  createdTasks: number;
  workRun: WorkRun | null;
}) {
  const steps = [
    {
      label: "Conversation context",
      detail: `${messages.length} message${messages.length === 1 ? "" : "s"} in the current planner thread.`,
      done: messages.length > 0,
    },
    {
      label: "Scope constraints",
      detail: `${workstream === "any" ? "No workstream restriction" : `${workstream} preference`} with ${
        allowedCount === 0 ? "all lab templates allowed" : `${allowedCount} selected lab template${allowedCount === 1 ? "" : "s"}`
      }.`,
      done: true,
    },
    {
      label: "Planner call",
      detail:
        loadingMode === "work"
          ? "The backend is creating a run workspace, venv, scripts, literature records, data files, and processed outputs."
          : loading
            ? "The backend is asking OpenAI for the next planning state."
            : "No request currently running.",
      done: !loading,
    },
    {
      label: "Latest response",
      detail: reply
        ? `${reply.stage} stage with ${reply.clarification_questions.length} questions, ${reply.proposed_labs.length} lab proposals, ${reply.next_actions.length} next actions.`
        : "No planner response yet.",
      done: Boolean(reply),
    },
    {
      label: "Workspace materialized",
      detail: `${createdLabs} lab${createdLabs === 1 ? "" : "s"} and ${createdTasks} task${createdTasks === 1 ? "" : "s"} created locally.`,
      done: createdLabs + createdTasks > 0,
    },
    {
      label: "Work execution",
      detail: workRun
        ? `${workRun.status}: ${(workRun.tool_calls ?? []).length} tool calls, ${(workRun.generated_files ?? []).length} generated files, ${(workRun.data_files ?? []).length} data files, ${(workRun.processed_files ?? []).length} processed files.`
        : "No approved work run yet.",
      done: Boolean(workRun),
    },
    {
      label: "Visible execution trace",
      detail: workRun
        ? (workRun.tool_calls ?? [])
            .slice(-3)
            .map((call) => `${call.name}: ${call.status}`)
            .join(" / ") || "No tool calls recorded."
        : "Tool calls will appear after you approve a plan.",
      done: Boolean((workRun?.tool_calls ?? []).length),
    },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.label} className="flex gap-3 rounded-md border border-black/10 bg-[#fafaf7] p-3">
          <span
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md font-mono text-xs ${
              step.done ? "bg-emerald-100 text-emerald-900" : "bg-white text-black/45"
            }`}
          >
            {index + 1}
          </span>
          <div>
            <div className="text-sm font-medium text-black/80">{step.label}</div>
            <div className="mt-1 text-sm leading-6 text-black/60">{step.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionList({
  title,
  items,
  variant = "plain",
  actionLabel,
  onAction,
  onAddTask,
}: {
  title: string;
  items: string[];
  variant?: "plain" | "numbered";
  actionLabel?: string;
  onAction?: (item: string) => void;
  onAddTask?: (item: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-normal text-black/45">
        {title}
      </div>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-black/75">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="rounded-md border border-black/10 bg-[#fafaf7] px-3 py-2"
          >
            <div className="flex gap-3">
              {variant === "numbered" ? (
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white font-mono text-xs text-black/55">
                  {index + 1}
                </span>
              ) : null}
              <span>{stripLeadingNumber(item)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {onAction ? (
                <button
                  className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-black/70"
                  type="button"
                  onClick={() => onAction(stripLeadingNumber(item))}
                >
                  {actionLabel ?? "Use"}
                </button>
              ) : null}
              {onAddTask ? (
                <button
                  className="rounded-md border border-blue-700/20 bg-blue-50 px-2 py-1 text-xs text-blue-900"
                  type="button"
                  onClick={() => onAddTask(stripLeadingNumber(item))}
                >
                  Add task
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WorkstreamList({
  title,
  items,
  tone,
  onAddTask,
}: {
  title: string;
  items: string[];
  tone: "blue" | "green";
  onAddTask?: (item: string) => void;
}) {
  if (items.length === 0) return null;
  const classes =
    tone === "blue"
      ? "border-blue-700/20 bg-blue-50 text-blue-950"
      : "border-emerald-700/20 bg-emerald-50 text-emerald-950";
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-normal text-black/45">
        {title}
      </div>
      <div className="mt-2 grid gap-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className={`rounded-md border p-3 text-sm leading-6 ${classes}`}>
            <div>{item}</div>
            {onAddTask ? (
              <button
                className="mt-2 rounded-md border border-black/10 bg-white/80 px-2 py-1 text-xs"
                type="button"
                onClick={() => onAddTask(item)}
              >
                Add task
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function LabProposalList({
  labs,
  onAddLab,
  onAddTask,
}: {
  labs: ProposedLab[];
  onAddLab: (lab: ProposedLab) => void;
  onAddTask: (title: string, workstream: Workstream, source: string) => void;
}) {
  if (labs.length === 0) return null;
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-normal text-black/45">
        Proposed labs
      </div>
      <div className="mt-2 space-y-3">
        {labs.map((lab) => (
          <article
            key={`${lab.name}-${lab.kind}`}
            className={`rounded-md border p-3 ${labTone(lab.workstream)}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium text-black/85">{lab.name}</h3>
              <span className="rounded-md border border-black/10 bg-white px-2 py-1 font-mono text-[11px] uppercase text-black/45">
                {lab.kind}
              </span>
              <span className="rounded-md border border-black/10 bg-white px-2 py-1 font-mono text-[11px] uppercase text-black/45">
                {lab.workstream}
              </span>
              {lab.can_run_here ? (
                <span className="rounded-md border border-blue-700/20 bg-blue-100 px-2 py-1 font-mono text-[11px] uppercase text-blue-900">
                  runnable here
                </span>
              ) : (
                <span className="rounded-md border border-emerald-700/20 bg-emerald-100 px-2 py-1 font-mono text-[11px] uppercase text-emerald-900">
                  track on top
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-black/70">{lab.rationale}</p>
            <ActionList
              title="First tasks"
              items={lab.first_tasks}
              onAddTask={(item) => onAddTask(item, lab.workstream, lab.name)}
            />
            <button
              className="mt-3 inline-flex h-8 items-center gap-2 rounded-md bg-[#171715] px-3 text-xs text-white"
              type="button"
              onClick={() => onAddLab(lab)}
            >
              <Plus size={14} />
              Add lab
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function WorkspaceSummary({
  labs,
  tasks,
  activeRun,
  workRuns,
  artifacts,
  artifactLoading,
  artifactError,
  onSelectRun,
}: {
  labs: WorkspaceLab[];
  tasks: WorkspaceTask[];
  activeRun: WorkRun | null;
  workRuns: WorkRun[];
  artifacts: WorkspaceArtifacts | null;
  artifactLoading: boolean;
  artifactError: string | null;
  onSelectRun: (run: WorkRun) => void;
}) {
  const [tab, setTab] = React.useState<"overview" | "trace" | "artifacts" | "literature">("overview");

  return (
    <div className="min-w-0 space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <Metric label="Created labs" value={String(labs.length)} />
        <Metric label="Created tasks" value={String(tasks.length)} />
        <Metric label="Tool calls" value={String(activeRun?.tool_calls?.length ?? 0)} />
        <Metric
          label="Run files"
          value={String(
            (activeRun?.generated_files?.length ?? 0) +
              (activeRun?.data_files?.length ?? 0) +
              (activeRun?.processed_files?.length ?? 0)
          )}
        />
        <Metric label="Literature" value={String(activeRun?.literature_results?.length ?? 0)} />
        <Metric label="Artifact previews" value={artifactLoading ? "loading" : String(artifacts?.files.length ?? 0)} />
      </div>

      {workRuns.length > 1 ? (
        <div>
          <div className="font-mono text-xs uppercase tracking-normal text-black/45">
            Work runs
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {workRuns.map((run) => (
              <button
                key={run.run_id}
                className="rounded-md border border-black/10 bg-white px-2 py-1 font-mono text-xs text-black/60"
                type="button"
                onClick={() => onSelectRun(run)}
              >
                {run.run_id.slice(0, 8)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 gap-2 overflow-x-auto border-b border-black/10 pb-2">
        {[
          ["overview", "Overview"],
          ["trace", "Tool calls"],
          ["artifacts", "Artifacts"],
          ["literature", "Literature"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`h-9 shrink-0 rounded-md px-3 text-sm ${
              tab === value
                ? "bg-[#171715] text-white"
                : "border border-black/10 bg-white text-black/65"
            }`}
            type="button"
            onClick={() => setTab(value as typeof tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {!activeRun ? (
        <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/55">
          Approve a plan to create a local workspace, venv, scripts, downloaded data, and processed outputs.
        </div>
      ) : null}

      {activeRun && tab === "overview" ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-md border border-emerald-700/20 bg-emerald-50 p-3">
              <div className="font-mono text-xs uppercase tracking-normal text-emerald-900/70">
                Active work run
              </div>
              <div className="mt-2 grid gap-2 text-sm leading-6 text-emerald-950 sm:grid-cols-2">
                <div><strong>Status:</strong> {activeRun.status}</div>
                <div><strong>Literature:</strong> {activeRun.literature_results.length} records</div>
                <div><strong>Generated:</strong> {activeRun.generated_files?.length ?? 0} files</div>
                <div><strong>Data:</strong> {activeRun.data_files?.length ?? 0} files</div>
                <div><strong>Processed:</strong> {activeRun.processed_files?.length ?? 0} files</div>
                <div><strong>Tool calls:</strong> {activeRun.tool_calls?.length ?? 0}</div>
              </div>
              <div className="mt-3 space-y-1 font-mono text-[11px] leading-5 text-emerald-950/75">
                <div className="break-all"><strong>Workspace:</strong> {activeRun.workspace_path}</div>
                <div className="break-all"><strong>Venv:</strong> {activeRun.venv_path}</div>
              </div>
            </div>
            <CompactCollection
              icon={<FlaskConical size={16} />}
              title="Labs"
              empty="Add proposed labs to make them appear here."
              items={labs.map((lab) => ({
                id: lab.id,
                title: lab.name,
                detail: `${lab.workstream} / ${lab.kind}`,
                tone: lab.workstream,
              }))}
            />
          </div>
          <div className="min-w-0">
            <CompactCollection
              icon={<ListChecks size={16} />}
              title="Tasks"
              empty="Click Add task on next actions or workstreams."
              items={tasks.map((task) => ({
                id: task.id,
                title: task.title,
                detail: `${task.workstream} / ${task.source}`,
                tone: task.workstream,
              }))}
            />
          </div>
        </div>
      ) : null}

      {activeRun && tab === "trace" ? (
        <div className="min-w-0">
          <ToolCallList calls={activeRun.tool_calls ?? []} />
        </div>
      ) : null}

      {activeRun && tab === "artifacts" ? (
        <div className="grid min-w-0 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="min-w-0 grid gap-2">
            <FileList title="Generated files" files={activeRun.generated_files ?? []} />
            <FileList title="Downloaded data" files={activeRun.data_files ?? []} tone="blue" />
            <FileList title="Processed outputs" files={activeRun.processed_files ?? []} tone="green" />
          </div>
          <ArtifactBrowser
            artifacts={artifacts}
            loading={artifactLoading}
            error={artifactError}
          />
        </div>
      ) : null}

      {activeRun && tab === "literature" ? (
        <div className="min-w-0">
          <div className="mt-2 rounded-md border border-black/10 bg-[#fafaf7] p-3">
            <div className="font-mono text-xs text-black/45">Query</div>
            <div className="mt-1 text-sm leading-6 text-black/70">
              {activeRun.literature_query}
            </div>
          </div>
          <div className="mt-2 max-h-[420px] space-y-2 overflow-auto">
            {activeRun.literature_results.length === 0 ? (
              <div className="rounded-md border border-black/10 bg-[#fafaf7] p-3 text-sm text-black/55">
                No literature records returned yet. Check the work run errors if present.
              </div>
            ) : (
              activeRun.literature_results.map((item, index) => (
                <article key={`${item.title}-${index}`} className="rounded-md border border-black/10 bg-white p-3">
                  <div className="text-sm font-medium leading-6 text-black/85">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-800 hover:underline">
                        {item.title}
                      </a>
                    ) : (
                      item.title
                    )}
                  </div>
                  <div className="mt-1 text-xs text-black/50">
                    {[item.authors, item.journal, item.year].filter(Boolean).join(" / ")}
                  </div>
                  {item.abstract ? (
                    <p className="mt-2 line-clamp-4 text-xs leading-5 text-black/60">
                      {item.abstract}
                    </p>
                  ) : null}
                </article>
              ))
            )}
          </div>
          {activeRun.errors.length > 0 ? (
            <div className="mt-2 rounded-md border border-amber-600/25 bg-amber-50 p-3 text-sm text-amber-950">
              {activeRun.errors.join("\n")}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CompactCollection({
  icon,
  title,
  empty,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  empty: string;
  items: { id: string; title: string; detail: string; tone: Workstream }[];
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {icon}
        <div className="font-mono text-xs uppercase tracking-normal text-black/45">
          {title}
        </div>
      </div>
      <div className="mt-2 max-h-80 space-y-2 overflow-auto pr-1">
        {items.length === 0 ? (
          <div className="rounded-md border border-black/10 bg-[#fafaf7] p-3 text-sm text-black/55">
            {empty}
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`min-w-0 rounded-md border p-3 text-sm ${labTone(item.tone)}`}>
              <div className="break-words font-medium">{item.title}</div>
              <div className="mt-1 break-words font-mono text-xs uppercase text-black/45">
                {item.detail}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ArtifactBrowser({
  artifacts,
  loading,
  error,
}: {
  artifacts: WorkspaceArtifacts | null;
  loading: boolean;
  error: string | null;
}) {
  const files = React.useMemo(() => artifacts?.files ?? [], [artifacts]);
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (files.length === 0) {
      setSelectedPath(null);
      return;
    }
    if (!selectedPath || !files.some((file) => file.relative_path === selectedPath)) {
      setSelectedPath(files[0].relative_path);
    }
  }, [files, selectedPath]);

  const selectedFile =
    files.find((file) => file.relative_path === selectedPath) ?? files[0] ?? null;
  const grouped = groupArtifacts(files);

  if (loading) {
    return (
      <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/55">
        Loading workspace artifact previews...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-amber-600/25 bg-amber-50 p-4 text-sm text-amber-950">
        {error}
      </div>
    );
  }

  if (!artifacts || files.length === 0) {
    return (
      <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/55">
        No artifact previews found for this run.
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="min-w-0 rounded-md border border-black/10 bg-[#fafaf7] p-3">
        <div className="font-mono text-xs uppercase tracking-normal text-black/45">
          Workspace files
        </div>
        <div className="mt-2 max-h-[520px] space-y-3 overflow-auto pr-1">
          {Object.entries(grouped).filter(([, groupFiles]) => groupFiles.length > 0).map(([kind, groupFiles]) => (
            <div key={kind}>
              <div className="mb-1 font-mono text-[11px] uppercase text-black/35">
                {kind}
              </div>
              <div className="space-y-1">
                {groupFiles.map((file) => (
                  <button
                    key={file.relative_path}
                    className={`w-full min-w-0 rounded-md border px-2 py-2 text-left text-xs ${
                      selectedFile?.relative_path === file.relative_path
                        ? "border-blue-700/30 bg-blue-50 text-blue-950"
                        : "border-black/10 bg-white text-black/65 hover:bg-white/70"
                    }`}
                    type="button"
                    onClick={() => setSelectedPath(file.relative_path)}
                  >
                    <span className="block break-all font-mono">{file.relative_path}</span>
                    <span className="mt-1 block text-[11px] text-black/40">
                      {formatBytes(file.size_bytes)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 rounded-md border border-black/10 bg-white p-3">
        {selectedFile ? (
          <>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="rounded-md border border-black/10 bg-[#fafaf7] px-2 py-1 font-mono text-[11px] uppercase text-black/45">
                {selectedFile.kind}
              </span>
              <span className="min-w-0 break-all font-mono text-xs text-black/65">
                {selectedFile.relative_path}
              </span>
              <span className="text-xs text-black/40">
                {formatBytes(selectedFile.size_bytes)}
              </span>
            </div>
            <pre className="mt-3 max-h-[620px] min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-md bg-[#171715] p-4 font-mono text-[11px] leading-relaxed text-[#f4f2ea]">
              {selectedFile.preview}
              {selectedFile.truncated ? "\n\n... preview truncated ..." : ""}
            </pre>
          </>
        ) : null}
      </div>
    </div>
  );
}

function ToolCallList({ calls }: { calls: ToolCallRecord[] }) {
  if (calls.length === 0) {
    return (
      <div className="mt-2 rounded-md border border-black/10 bg-[#fafaf7] p-3 text-sm text-black/55">
        No tool calls recorded for this run.
      </div>
    );
  }

  return (
    <div className="mt-2 max-h-[620px] min-w-0 space-y-2 overflow-auto pr-1">
      {calls.map((call, index) => (
        <details
          key={`${call.name}-${index}`}
          className={`min-w-0 rounded-md border bg-white p-3 text-sm ${
            call.status === "done"
              ? "border-emerald-700/20"
              : call.status === "error"
                ? "border-amber-700/25 bg-amber-50"
                : "border-blue-700/20 bg-blue-50"
          }`}
          open={index >= calls.length - 2 || call.status === "error"}
        >
          <summary className="cursor-pointer list-none">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-black/85">{call.name}</span>
              <span className="rounded-md border border-black/10 bg-white px-2 py-1 font-mono text-[11px] uppercase text-black/50">
                {call.status}
              </span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-black/40">
              {[call.started_at, call.completed_at].filter(Boolean).join(" -> ")}
            </div>
          </summary>
          <div className="mt-3 grid gap-2">
            <PayloadBlock label="Input" value={call.input ?? null} />
            <PayloadBlock label="Output" value={call.output ?? null} />
          </div>
        </details>
      ))}
    </div>
  );
}

function FileList({
  title,
  files,
  tone = "neutral",
}: {
  title: string;
  files: string[];
  tone?: "neutral" | "blue" | "green";
}) {
  const classes =
    tone === "blue"
      ? "border-blue-700/20 bg-blue-50"
      : tone === "green"
        ? "border-emerald-700/20 bg-emerald-50"
        : "border-black/10 bg-[#fafaf7]";

  return (
    <div className={`min-w-0 rounded-md border p-3 ${classes}`}>
      <div className="font-mono text-xs uppercase tracking-normal text-black/45">
        {title}
      </div>
      {files.length === 0 ? (
        <div className="mt-2 text-sm text-black/55">No files yet.</div>
      ) : (
        <ul className="mt-2 max-h-36 space-y-1 overflow-auto font-mono text-xs leading-5 text-black/65">
          {files.map((file) => (
            <li key={file} className="break-all">
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PayloadBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0">
      <div className="font-mono text-[11px] uppercase tracking-normal text-black/40">
        {label}
      </div>
      <pre className="mt-1 max-h-44 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-md bg-[#171715] p-3 font-mono text-[11px] leading-relaxed text-[#f4f2ea]">
        {formatPayload(value)}
      </pre>
    </div>
  );
}

function labTone(workstream: Workstream) {
  if (workstream === "computational" || workstream === "data") {
    return "border-blue-700/20 bg-blue-50";
  }
  if (workstream === "experimental") {
    return "border-emerald-700/20 bg-emerald-50";
  }
  if (workstream === "review") {
    return "border-violet-700/20 bg-violet-50";
  }
  return "border-slate-700/20 bg-slate-50";
}

function stripLeadingNumber(item: string) {
  return item.replace(/^\s*\d+[\).\s-]+/, "");
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-black/10 bg-[#fafaf7] p-3">
      <dt className="text-xs text-black/50">{label}</dt>
      <dd className="mt-1 break-words font-mono text-sm">{value}</dd>
    </div>
  );
}

function StatusPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "pending";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 ${
        tone === "ok"
          ? "border-emerald-700/20 bg-emerald-50 text-emerald-950"
          : "border-amber-700/20 bg-amber-50 text-amber-950"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </span>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="max-h-[460px] min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-md bg-[#171715] p-4 font-mono text-xs leading-relaxed text-[#f4f2ea]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function safeJson(value: string): RunResult {
  try {
    return JSON.parse(value) as RunResult;
  } catch {
    return { detail: { error: value } };
  }
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

function formatPayload(value: unknown) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function groupArtifacts(files: WorkspaceArtifactFile[]) {
  const order = ["script", "data", "processed", "report", "requirements", "readme", "manifest", "artifact"];
  return files.reduce<Record<string, WorkspaceArtifactFile[]>>((groups, file) => {
    const key = file.kind || "artifact";
    groups[key] = groups[key] ?? [];
    groups[key].push(file);
    return groups;
  }, Object.fromEntries(order.map((key) => [key, []])) as Record<string, WorkspaceArtifactFile[]>);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
