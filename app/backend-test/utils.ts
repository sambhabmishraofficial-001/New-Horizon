import type { LabEvent, PlannerMessage, ToolCallRecord, ViewFile, VriPlannerReply, WorkRun } from "./types";

export function wireMessages(messages: PlannerMessage[]) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export function fallbackPlanMarkdown(reply: VriPlannerReply) {
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

export function fileOwnerLabel(activeRun: WorkRun | null, file: ViewFile) {
  const event = activeRun?.lab_events?.find((item) =>
    item.files.some((path) => path === file.path || path.endsWith(`/${file.name}`) || file.path.endsWith(path))
  );
  return event ? event.lab_name : "";
}

export function labEventsForName(activeRun: WorkRun | null, labName: string) {
  return (activeRun?.lab_events ?? []).filter((event) => event.lab_name === labName);
}

export function labFilesForEvents(events: LabEvent[], files: ViewFile[]) {
  const fileIds = new Set<string>();
  for (const event of events) {
    for (const path of event.files) {
      const file = files.find((item) => fileMatchesPath(item, path));
      if (file) fileIds.add(file.id);
    }
  }
  return files.filter((file) => fileIds.has(file.id));
}

export function fileIdForPath(path: string, files: ViewFile[]) {
  const file = files.find((item) => fileMatchesPath(item, path));
  return file?.id ?? "";
}

function fileMatchesPath(file: ViewFile, path: string) {
  return file.path === path || path.endsWith(`/${file.name}`) || file.path.endsWith(path);
}

export function shortFilePath(path: string) {
  const normalized = path.replaceAll("\\", "/");
  const marker = "/.vri_workspaces/";
  const markerIndex = normalized.indexOf(marker);
  if (markerIndex >= 0) {
    const parts = normalized.slice(markerIndex + marker.length).split("/");
    return parts.slice(1).join("/") || parts.join("/");
  }
  return normalized.split("/").slice(-3).join("/");
}

export function parseSseEvent(block: string): { type: string; data: Record<string, unknown> } | null {
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

export function filePreviewHtml(file: ViewFile) {
  const content = file.preview || "No preview content returned for this file yet.";
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(file.name)}</title>
    <style>
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #15130f; background: #faf8f4; }
      header { padding: 18px 22px; border-bottom: 1px solid rgba(21, 19, 15, 0.12); background: #fff; position: sticky; top: 0; }
      h1 { margin: 0; font-size: 18px; font-weight: 650; }
      p { margin: 6px 0 0; color: rgba(21, 19, 15, 0.62); font-size: 13px; }
      pre { margin: 22px; padding: 18px; min-height: calc(100vh - 130px); overflow: auto; white-space: pre-wrap; border: 1px solid rgba(21, 19, 15, 0.12); border-radius: 10px; background: #fff; color: #1f1f1b; line-height: 1.55; font-size: 13px; box-shadow: 0 1px 0 rgba(17,17,16,0.04), 0 0 0 1px rgba(17,17,16,0.04); }
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

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, max - 3)}...`;
}

export function relativeTime(value: string) {
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

export function toolDurationLabel(tool: ToolCallRecord) {
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

export function formatJsonValue(value: unknown) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
