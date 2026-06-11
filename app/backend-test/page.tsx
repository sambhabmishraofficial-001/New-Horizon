"use client";

import * as React from "react";
import { ActivityRail } from "./components/activity-sidebar";
import { LeftWorkbench } from "./components/left-workbench";
import { ExpandedFileViewer, RightViewerPane } from "./components/right-viewer";
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
  const [selectedRunLabName, setSelectedRunLabName] = React.useState<string | null>(null);
  const [viewerModePreference, setViewerModePreference] = React.useState<ViewerMode>("idle");
  const [openInspectorPanels, setOpenInspectorPanels] =
    React.useState<InspectorPanel[]>(["progress", "files"]);
  const [expandedFileViewer, setExpandedFileViewer] = React.useState(false);
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
    () => viewFiles.find((file) => file.id === selectedFileId) ?? null,
    [selectedFileId, viewFiles]
  );

  const visibleLabs = React.useMemo(
    () => activeWorkRun?.labs_created?.length
      ? activeWorkRun.labs_created
      : plannerReply?.proposed_labs ?? [],
    [activeWorkRun, plannerReply]
  );

  const selectedRunLab = React.useMemo(() => {
    if (!selectedRunLabName) return null;
    return visibleLabs.find((lab) => lab.name === selectedRunLabName) ?? null;
  }, [selectedRunLabName, visibleLabs]);

  const nextStep = React.useMemo(() => {
    if (loading === "work") return "Starting workspace: creating manifests, lab cards, run files, and artifact index.";
    if (!health || labPrompts.length === 0) return "Wait for backend health and lab prompts.";
    if (!plannerReply) return "Choose labs in the chat, then ask VRI your research question.";
    if (plannerReply.stage === "direct_answer") return "Direct answer shown in chat. Ask for a plan only when you want workspace files and lab execution.";
    if (plannerReply.stage === "clarify") return "Answer the clarification questions directly in chat.";
    if (!activeWorkRun) return "Review the proposed labs, then approve the workspace.";
    return "Review workspace files, tool calls, literature, and run output.";
  }, [activeWorkRun, health, labPrompts.length, loading, plannerReply]);

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
    setActiveConversationId(conversation.id);
    setPlannerMessages(conversation.messages);
    setPlannerReply(conversation.reply);
    setWorkstreamPreference(conversation.workstream_preference);
    setAllowedLabIds(conversation.allowed_lab_ids);
    setPlannerInput("");
    setError(null);
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference(conversation.reply?.planning_allowed ? "plan" : "idle");
  }

  function newConversation() {
    setActiveConversationId(null);
    setPlannerMessages([]);
    setPlannerReply(null);
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
    if (!plannerReply || !plannerReply.planning_allowed || plannerMessages.length === 0) return;
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("execution");
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
  }

  function showPlan() {
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("plan");
  }

  function selectRunLab(labName: string) {
    setSelectedRunLabName(labName);
    setSelectedFileId(null);
    setViewerModePreference("lab");
  }

  function showExecution() {
    setSelectedFileId(null);
    setSelectedRunLabName(null);
    setViewerModePreference("execution");
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
        : viewerModePreference === "plan" && plannerReply?.planning_allowed
          ? "plan"
          : viewerModePreference === "execution" && activeWorkRun
            ? "execution"
            : plannerReply?.planning_allowed
              ? "plan"
              : activeWorkRun
                ? "execution"
                : "idle";
  const viewerGridClass =
    viewerMode === "idle"
      ? "lg:grid-cols-[64px_minmax(560px,1fr)_minmax(320px,380px)]"
      : "lg:grid-cols-[64px_minmax(520px,1fr)_minmax(460px,0.85fr)]";

  return (
    <main className="min-h-screen overflow-x-hidden bg-ink-50 text-ink-900 font-marketing lg:h-screen lg:overflow-hidden">
      <div className={cx("grid min-h-screen grid-cols-1 lg:h-screen lg:min-h-0 lg:overflow-hidden", viewerGridClass)}>
        <ActivityRail onRefresh={() => void checkHealth()} />

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
          plannerReply={plannerReply}
          selectedFile={selectedFile}
          selectedRunLab={selectedRunLab}
          selectedRunLabName={selectedRunLabName}
          hasWorkspace={Boolean(activeWorkRun)}
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
