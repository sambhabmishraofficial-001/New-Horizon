"use client";

import * as React from "react";
import {
  Activity,
  FlaskConical,
  Play,
  RefreshCw,
  Send,
  Server,
} from "lucide-react";

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

type PlannerMessage = {
  role: "user" | "assistant";
  content: string;
};

type ProposedLab = {
  name: string;
  kind: string;
  workstream: "computational" | "experimental" | "hybrid" | "review" | "data";
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

const apiBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8000";

export default function BackendTestPage() {
  const [health, setHealth] = React.useState<Health | null>(null);
  const [labPrompts, setLabPrompts] = React.useState<LabPrompt[]>([]);
  const [selectedLabId, setSelectedLabId] = React.useState("ribozyme-wet");
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

  const selectedLab = React.useMemo(
    () => labPrompts.find((lab) => lab.id === selectedLabId) ?? null,
    [labPrompts, selectedLabId]
  );

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
  }, [request]);

  React.useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  React.useEffect(() => {
    if (!selectedLab || investigation) return;
    setObjective(selectedLab.default_objective);
    setContext(selectedLab.default_context);
  }, [selectedLab, investigation]);

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
        }),
      });
      setPlannerReply(reply);
      setPlannerMessages([
        ...nextMessages,
        { role: "assistant", content: reply.answer },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "VRI chat request failed.");
      setPlannerInput(clean);
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

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-5 py-6 text-[#141413] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-3 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-normal text-black/50">
              VRI integration check
            </p>
            <h1 className="mt-2 text-3xl font-medium tracking-normal md:text-5xl">
              Frontend + backend
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <StatusPill label="Frontend" value="localhost:4000" tone="ok" />
            <StatusPill
              label="Backend"
              value={health?.status === "ok" ? "reachable" : "checking"}
              tone={health?.status === "ok" ? "ok" : "pending"}
            />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
          <Panel title="Plan With VRI" icon={<Send size={18} />}>
            <div className="mb-4 max-h-[460px] space-y-3 overflow-auto rounded-md border border-black/10 bg-[#fafaf7] p-3">
              {plannerMessages.length === 0 ? (
                <div className="text-sm text-black/55">
                  Describe what you want to do. The VRI will ask clarifying questions,
                  then propose the labs to create.
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
              Your goal or answer
            </label>
            <textarea
              id="planner-message"
              className="mt-2 min-h-28 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/45"
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
              <span className="text-sm text-black/50">
                Uses OpenAI through the backend to decide which labs are needed.
              </span>
            </div>
          </Panel>

          <Panel title="VRI Planner Output" icon={<Activity size={18} />}>
            {loading === "chat" ? (
              <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/60">
                Waiting for the model response...
              </div>
            ) : plannerReply ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <StatusPill label="Stage" value={plannerReply.stage} tone="ok" />
                  <StatusPill
                    label="Questions"
                    value={String(plannerReply.clarification_questions.length)}
                    tone="pending"
                  />
                  <StatusPill
                    label="Labs"
                    value={String(plannerReply.proposed_labs.length)}
                    tone="pending"
                  />
                </div>
                <div className="rounded-md border border-black/10 bg-white p-4">
                  <div className="font-mono text-xs uppercase tracking-normal text-black/45">
                    Planner response
                  </div>
                  <p className="mt-2 text-sm leading-6 text-black/80">
                    {plannerReply.answer}
                  </p>
                </div>
                <ReplyList
                  title="Clarifying questions"
                  items={plannerReply.clarification_questions}
                  variant="numbered"
                />
                <WorkstreamList
                  title="Computational work you can run here"
                  items={plannerReply.computational_work}
                  tone="blue"
                />
                <WorkstreamList
                  title="Wet-lab / experimental work to track on top"
                  items={plannerReply.experimental_work}
                  tone="green"
                />
                <LabProposalList labs={plannerReply.proposed_labs} />
                <ReplyList title="Next actions" items={plannerReply.next_actions} />
              </div>
            ) : (
              <div className="rounded-md border border-black/10 bg-[#fafaf7] p-4 text-sm text-black/60">
                Start by describing the research goal.
              </div>
            )}
          </Panel>
        </section>

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
          <Panel title="Latest Investigation" icon={<Activity size={18} />}>
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

function ReplyList({
  title,
  items,
  variant = "plain",
}: {
  title: string;
  items: string[];
  variant?: "plain" | "numbered";
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
            className="flex gap-3 rounded-md border border-black/10 bg-[#fafaf7] px-3 py-2"
          >
            {variant === "numbered" ? (
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white font-mono text-xs text-black/55">
                {index + 1}
              </span>
            ) : null}
            <span>{stripLeadingNumber(item)}</span>
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
}: {
  title: string;
  items: string[];
  tone: "blue" | "green";
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
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className={`rounded-md border p-3 text-sm leading-6 ${classes}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function LabProposalList({ labs }: { labs: ProposedLab[] }) {
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
            <ReplyList title="First tasks" items={lab.first_tasks} />
          </article>
        ))}
      </div>
    </div>
  );
}

function labTone(workstream: ProposedLab["workstream"]) {
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
    <section className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
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
    <pre className="max-h-[460px] overflow-auto rounded-md bg-[#171715] p-4 font-mono text-xs leading-relaxed text-[#f4f2ea]">
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
