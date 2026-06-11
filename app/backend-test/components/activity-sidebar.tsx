import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  Folder,
  MessageSquareText,
  PanelRight,
  Plus,
  RefreshCw,
  Sparkles,
  XCircle,
} from "lucide-react";
import type { Health, LabPrompt, SavedConversation, ViewFile } from "../types";
import { cx, relativeTime } from "../utils";

export function ActivityRail({ onRefresh }: { onRefresh: () => void }) {
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
    <aside className="min-h-[520px] border-b border-ink-900/8 bg-parchment-50 lg:h-screen lg:min-h-0 lg:overflow-hidden lg:border-b-0 lg:border-r lg:border-ink-900/8">
      <div className="shrink-0 border-b border-ink-900/8 px-4 py-5">
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

      <div className="min-h-0 overflow-y-auto">
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
      </div>
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
