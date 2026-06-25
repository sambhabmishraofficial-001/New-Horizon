"use client";

import * as React from "react";
import { ActivityRail } from "./components/activity-sidebar";
import { LeftWorkbench } from "./components/left-workbench";
import { CodeOutputPane, ExpandedFileViewer, RightViewerPane } from "./components/right-viewer";
import { CONVERSATIONS_KEY, WORK_RUNS_KEY, apiBase } from "./constants";
import type {
  Health,
  InspectorPanel,
  LabPrompt,
  PlannerMessage,
  SavedConversation,
  ViewFile,
  ViewerMode,
  VriPlannerReply,
  WorkRun,
  WorkstreamPreference,
  WorkspaceArtifacts,
} from "./types";
import {
  cx,
  filePreviewHtml,
  formatBytes,
  makeId,
  parseSseEvent,
  readStorage,
  truncate,
  wireMessages,
  writeStorage,
} from "./utils";

type WorkspaceView = "chat" | "results" | "files";

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
  const [lastPlanReply, setLastPlanReply] = React.useState<VriPlannerReply | null>(null);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = React.useState<string | null>(null);
  const [selectedRunLabName, setSelectedRunLabName] = React.useState<string | null>(null);
  const [viewerModePreference, setViewerModePreference] = React.useState<ViewerMode>("idle");
  const [openInspectorPanels, setOpenInspectorPanels] =
    React.useState<InspectorPanel[]>(["progress", "files"]);
  const [expandedFileViewer, setExpandedFileViewer] = React.useState(false);
  const [visibleReplyText, setVisibleReplyText] = React.useState("");
  const [workspaceView, setWorkspaceView] = React.useState<WorkspaceView>("chat");
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);
  const startedRunIdRef = React.useRef<string | null>(null);
  const [readyNoticeRunId, setReadyNoticeRunId] = React.useState<string | null>(null);
  const [dismissedNoticeRunId, setDismissedNoticeRunId] = React.useState<string | null>(null);

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
    () => viewFiles.find((file) => file.id === selectedFileId) ?? null,
    [selectedFileId, viewFiles]
  );

  const activePlanReply = React.useMemo(
    () => (plannerReply?.planning_allowed ? plannerReply : lastPlanReply),
    [lastPlanReply, plannerReply]
  );

  const visibleLabs = React.useMemo(
    () => activeWorkRun?.labs_created?.length
      ? activeWorkRun.labs_created
      : activePlanReply?.proposed_labs ?? [],
    [activePlanReply, activeWorkRun]
  );

  const selectedRunLab = React.useMemo(() => {
    if (!selectedRunLabName) return null;
    return visibleLabs.find((lab) => lab.name === selectedRunLabName) ?? null;
  }, [selectedRunLabName, visibleLabs]);

  const nextStep = React.useMemo(() => {
    const statusReply = plannerReply ?? activePlanReply;
    if (loading === "work") return "Starting workspace: creating manifests, lab cards, run files, and artifact index.";
    if (!health || labPrompts.length === 0) return "Wait for backend health and lab prompts.";
    if (!statusReply) return "Choose labs in the chat, then ask VRI your research question.";
    if (statusReply.stage === "direct_answer") return "Direct answer shown in chat. Ask for a plan only when you want workspace files and lab execution.";
    if (statusReply.stage === "clarify") return "Answer the clarification questions directly in chat.";
    if (!activeWorkRun) return "Review the proposed labs, then approve the workspace.";
    return "Review workspace files, tool calls, literature, and run output.";
  }, [activePlanReply, activeWorkRun, health, labPrompts.length, loading, plannerReply]);

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
    setWorkspaceArtifacts(null);
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
    if (selectedFileId && !viewFiles.some((file) => file.id === selectedFileId)) {
      setSelectedFileId(null);
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

  React.useEffect(() => {
    if (!activeWorkRun || loading === "work" || artifactLoading) return;
    if (startedRunIdRef.current !== activeWorkRun.run_id) return;
    if (workspaceArtifacts?.run_id !== activeWorkRun.run_id && !artifactError) return;
    setReadyNoticeRunId(activeWorkRun.run_id);
  }, [activeWorkRun, artifactError, artifactLoading, loading, workspaceArtifacts]);

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
      if (reply.planning_allowed) {
        setLastPlanReply(reply);
      }
      setPlannerMessages(updatedMessages);
      setVisibleReplyText((current) => current || reply.answer);
      setViewerModePreference(reply.planning_allowed ? "plan" : "idle");
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
    const planReply = latestPlanReply(conversation.messages, conversation.reply);
    setActiveConversationId(conversation.id);
    setPlannerMessages(conversation.messages);
    setPlannerReply(conversation.reply);
    setLastPlanReply(planReply);
    setWorkstreamPreference(conversation.workstream_preference);
    setAllowedLabIds(conversation.allowed_lab_ids);
    setPlannerInput("");
    setError(null);
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference(planReply?.planning_allowed ? "plan" : "idle");
  }

  function newConversation() {
    setActiveConversationId(null);
    setPlannerMessages([]);
    setPlannerReply(null);
    setLastPlanReply(null);
    setPlannerInput("");
    setError(null);
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("idle");
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
    if (!activePlanReply || !activePlanReply.planning_allowed || plannerMessages.length === 0) return;
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("execution");
    setLoading("work");
    setError(null);
    startedRunIdRef.current = null;
    setReadyNoticeRunId(null);
    setDismissedNoticeRunId(null);
    try {
      const run = await request<WorkRun>("/v1/start-work", {
        method: "POST",
        body: JSON.stringify({
          messages: wireMessages(plannerMessages),
          planner_reply: activePlanReply,
          workstream_preference: workstreamPreference,
        }),
      });
      startedRunIdRef.current = run.run_id;
      setActiveWorkRun(run);
      setSelectedFileId(null);
      setSelectedRunLabName(null);
      setViewerModePreference("execution");
      setWorkRuns((prev) => [run, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start VRI work.");
    } finally {
      setLoading(null);
    }
  }

  function toggleInspectorPanel(panel: InspectorPanel) {
    setOpenInspectorPanels((prev) =>
      prev.includes(panel) ? prev.filter((item) => item !== panel) : [...prev, panel]
    );
  }

  function selectFile(fileId: string) {
    setSelectedFileId(fileId);
    setSelectedRunLabName(null);
    setViewerModePreference("file");
    setWorkspaceView("files");
  }

  function showPlan() {
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("plan");
    setWorkspaceView("results");
  }

  function selectRunLab(labName: string) {
    setSelectedRunLabName(labName);
    setSelectedFileId(null);
    setViewerModePreference("lab");
    setWorkspaceView("results");
  }

  function showExecution() {
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("execution");
    setWorkspaceView("results");
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
  const viewerMode: ViewerMode = selectedFile
    ? "file"
    : selectedRunLab
      ? "lab"
      : loading === "work"
        ? "execution"
        : viewerModePreference === "plan" && activePlanReply?.planning_allowed
          ? "plan"
          : viewerModePreference === "execution" && activeWorkRun
            ? "execution"
            : activePlanReply?.planning_allowed
              ? "plan"
              : activeWorkRun
                ? "execution"
                : "idle";
  const workspaceStatus = getWorkspaceStatus({
    activeRun: activeWorkRun,
    artifactError,
    artifactLoading,
    files: viewFiles,
    health,
    labPromptCount: labPrompts.length,
    loading,
    plannerReply: activePlanReply,
  });
  const showReadyNotice =
    Boolean(readyNoticeRunId) && readyNoticeRunId !== dismissedNoticeRunId && loading !== "work";

  return (
    <main className="min-h-screen overflow-x-hidden bg-ink-50 text-ink-900 font-marketing lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen grid-cols-1 lg:h-screen lg:min-h-0 lg:grid-cols-[64px_minmax(0,1fr)] lg:overflow-hidden">
        <ActivityRail onRefresh={() => void checkHealth()} />
        <section className="flex min-h-screen min-w-0 flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden">
          <header className="shrink-0 border-b border-ink-900/8 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Backend test workspace views">
                <WorkspaceViewButton active={workspaceView === "chat"} onClick={() => setWorkspaceView("chat")}>
                  Chat
                </WorkspaceViewButton>
                <WorkspaceViewButton active={workspaceView === "results"} onClick={() => setWorkspaceView("results")}>
                  Results
                </WorkspaceViewButton>
                <WorkspaceViewButton active={workspaceView === "files"} onClick={() => setWorkspaceView("files")}>
                  Files
                </WorkspaceViewButton>
              </div>
              <p className="text-sm font-medium text-ink-600">
                Active: <span className="text-ink-900">{workspaceViewLabel(workspaceView)}</span>
              </p>
            </div>
            <div className="mt-3 rounded-lg border border-ink-900/8 bg-parchment-50 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span className={cx("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", workspaceStatus.toneClass)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900">{workspaceStatus.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-ink-500">
                      Chat asks questions. Results shows plan, run, and labs. Files shows generated outputs and logs.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {activePlanReply?.planning_allowed ? (
                    <button
                      className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-900/[0.03]"
                      onClick={showPlan}
                      type="button"
                    >
                      View plan
                    </button>
                  ) : null}
                  {activeWorkRun ? (
                    <button
                      className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-900/[0.03]"
                      onClick={showExecution}
                      type="button"
                    >
                      View run
                    </button>
                  ) : null}
                  {viewFiles.length ? (
                    <button
                      className="rounded-full border border-ink-900/10 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-900/[0.03]"
                      onClick={() => {
                        setSelectedFileId((current) => current ?? viewFiles[0]?.id ?? null);
                        setSelectedRunLabName(null);
                        setViewerModePreference("file");
                        setWorkspaceView("files");
                      }}
                      type="button"
                    >
                      View files
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          {showReadyNotice ? (
            <section className="shrink-0 border-b border-beacon-900/15 bg-beacon-50 px-4 py-3 text-beacon-950" role="status">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Workspace results are ready.</p>
                  <p className="mt-1 text-xs leading-5 text-ink-600">
                    {viewFiles.length} file{viewFiles.length === 1 ? "" : "s"}, {activeWorkRun?.tool_calls.length ?? 0} tool record{activeWorkRun?.tool_calls.length === 1 ? "" : "s"}, and {activeWorkRun?.literature_results.length ?? 0} literature result{activeWorkRun?.literature_results.length === 1 ? "" : "s"} are available.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-full border border-beacon-700 bg-beacon-600 px-3 py-1.5 text-xs font-semibold text-white shadow-glow"
                    onClick={showExecution}
                    type="button"
                  >
                    Results
                  </button>
                  <button
                    className="rounded-full border border-beacon-700/25 bg-white px-3 py-1.5 text-xs font-semibold text-beacon-900"
                    onClick={() => {
                      setSelectedFileId((current) => current ?? viewFiles[0]?.id ?? null);
                      setSelectedRunLabName(null);
                      setViewerModePreference("file");
                      setWorkspaceView("files");
                    }}
                    type="button"
                  >
                    Files
                  </button>
                  <button
                    className="rounded-full border border-beacon-700/15 px-3 py-1.5 text-xs font-medium text-beacon-900 hover:bg-white/60"
                    onClick={() => setDismissedNoticeRunId(readyNoticeRunId)}
                    type="button"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          <div className="min-h-0 flex-1 overflow-hidden">
            {workspaceView === "chat" ? (
              <LeftWorkbench
                activeRun={activeWorkRun}
                allowedLabIds={allowedLabIds}
                artifactError={artifactError}
                artifactLoading={artifactLoading}
                chatEndRef={chatEndRef}
                conversations={savedConversations}
                error={error}
                files={viewFiles}
                labPrompts={labPrompts}
                health={health}
                loading={loading}
                nextStep={nextStep}
                onAsk={(message?: string) => void askVri(message)}
                onLoadConversation={loadConversation}
                onNewConversation={newConversation}
                onOpenFileInNewTab={openFileInNewTab}
                onRefresh={() => void checkHealth()}
                onSelectFile={selectFile}
                onSelectRunLab={selectRunLab}
                onShowPlan={showPlan}
                onUseAllLabs={() => setAllowedLabIds([])}
                onToggleLab={toggleLab}
                onTogglePanel={toggleInspectorPanel}
                openPanels={openInspectorPanels}
                plannerInput={plannerInput}
                plannerMessages={renderedMessages}
                plannerReply={plannerReply}
                selectedFile={selectedFile}
                selectedFileId={selectedFileId}
                selectedLab={selectedLab}
                setPlannerInput={setPlannerInput}
                setWorkstreamPreference={setWorkstreamPreference}
                visibleReplyText={visibleReplyText}
                workstreamPreference={workstreamPreference}
                hasWorkspace={Boolean(activeWorkRun)}
                isReplyRevealing={isReplyRevealing}
              />
            ) : null}

            {workspaceView === "results" ? (
              <RightViewerPane
                activeRun={activeWorkRun}
                artifactLoading={artifactLoading}
                files={viewFiles}
                loading={loading}
                mode={viewerMode}
                onApprove={() => void approveAndStartWork()}
                onOpenFileInNewTab={openFileInNewTab}
                onSelectFile={selectFile}
                onSelectLab={selectRunLab}
                onShowExecution={showExecution}
                onShowPlan={showPlan}
                onRevise={(message?: string) => void askVri(message)}
                plannerReply={activePlanReply}
                selectedFile={selectedFile}
                selectedRunLab={selectedRunLab}
                selectedRunLabName={selectedRunLabName}
                hasWorkspace={Boolean(activeWorkRun)}
              />
            ) : null}

            {workspaceView === "files" ? (
              <CodeOutputPane
                activeRun={activeWorkRun}
                files={viewFiles}
                loading={loading}
                onOpenFileInNewTab={openFileInNewTab}
                onSelectFile={selectFile}
                plannerReply={activePlanReply}
                selectedFile={selectedFile}
              />
            ) : null}
          </div>
        </section>
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

function latestPlanReply(messages: PlannerMessage[], reply: VriPlannerReply | null) {
  if (reply?.planning_allowed) {
    return reply;
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const candidate = messages[index]?.reply;
    if (candidate?.planning_allowed) {
      return candidate;
    }
  }

  return null;
}

function WorkspaceViewButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      role="tab"
      aria-selected={active}
      className={cx(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-500/35",
        active
          ? "border-beacon-700 bg-beacon-600 text-white shadow-glow"
          : "border-ink-900/10 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function workspaceViewLabel(view: WorkspaceView) {
  if (view === "results") return "Results";
  if (view === "files") return "Files";
  return "Chat";
}

function getWorkspaceStatus({
  activeRun,
  artifactError,
  artifactLoading,
  files,
  health,
  labPromptCount,
  loading,
  plannerReply,
}: {
  activeRun: WorkRun | null;
  artifactError: string | null;
  artifactLoading: boolean;
  files: ViewFile[];
  health: Health | null;
  labPromptCount: number;
  loading: string | null;
  plannerReply: VriPlannerReply | null;
}) {
  if (loading === "health") {
    return { label: "Checking backend health and lab prompts.", toneClass: "animate-pulse bg-beacon-500" };
  }
  if (loading === "chat") {
    return { label: "VRI is responding in Chat.", toneClass: "animate-pulse bg-beacon-500" };
  }
  if (loading === "work") {
    return { label: "Workspace is generating. You can stay here; this bar will update when results are ready.", toneClass: "animate-pulse bg-beacon-500" };
  }
  if (artifactLoading) {
    return { label: "Workspace generated. Loading file previews now.", toneClass: "animate-pulse bg-beacon-500" };
  }
  if (artifactError) {
    return { label: "Workspace generated, but file previews need attention.", toneClass: "bg-amber-500" };
  }
  if (activeRun) {
    return { label: `Workspace ready: ${files.length} file${files.length === 1 ? "" : "s"} available.`, toneClass: "bg-green-500" };
  }
  if (plannerReply?.planning_allowed) {
    return { label: "Plan ready. Open Results to approve or inspect it.", toneClass: "bg-green-500" };
  }
  if (plannerReply) {
    return { label: "Reply ready in Chat.", toneClass: "bg-green-500" };
  }
  if (!health || labPromptCount === 0) {
    return { label: "Connecting to backend and loading lab prompts.", toneClass: "animate-pulse bg-amber-500" };
  }
  return { label: "Start in Chat: choose scope, ask a question, then approve a workspace plan.", toneClass: "bg-green-500" };
}
