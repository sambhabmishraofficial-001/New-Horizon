"use client";

import * as React from "react";
import { Sparkles, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { AgentRail } from "./AgentRail";
import { AgentChatPanel } from "./AgentChatPanel";
import { useIreNavigation } from "./workspace-context";

type CoTab = "chat" | "team";

export function CoScienceColumn() {
  const [tab, setTab] = React.useState<CoTab>("chat");
  const { activeDocName, pinnedContext } = useIreNavigation();
  const ctxLabel = pinnedContext?.label ?? activeDocName;

  return (
    <aside
      data-tour="agent-rail"
      className="w-[min(400px,34vw)] shrink-0 flex flex-col border-l border-[var(--ire-border)] bg-[var(--ire-surface)] min-w-[320px]"
    >
      <header className="shrink-0 border-b border-[var(--ire-border)]">
        <div className="h-10 px-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ire-accent, #2a58be)" }} />
            <span className="text-[13px] font-medium truncate" style={{ color: "var(--ire-text, #111110)" }}>
              Co-science · Aletheia
            </span>
          </div>
          <AutonomySegment />
        </div>

        <div
          data-tour="bottom-panel"
          className="flex border-t border-[var(--ire-border)]"
          role="tablist"
        >
          <CoTabButton
            active={tab === "chat"}
            onClick={() => setTab("chat")}
            icon={MessageSquare}
            label="Chat"
          />
          <CoTabButton
            active={tab === "team"}
            onClick={() => setTab("team")}
            icon={Users}
            label="Team"
          />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col">
        {tab === "chat" ? (
          <AgentChatPanel className="flex-1 min-h-0" contextLabel={ctxLabel} embedded />
        ) : (
          <div className="flex-1 min-h-0 overflow-hidden">
            <AgentRail embedded />
          </div>
        )}
      </div>
    </aside>
  );
}

function CoTabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof MessageSquare;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex-1 h-9 inline-flex items-center justify-center gap-1.5 text-[11.5px] font-medium border-b-2 transition-colors",
        active
          ? "border-[var(--ire-border-strong)] text-[var(--ire-text)] bg-[var(--ire-surface-elevated)]"
          : "border-transparent text-[var(--ire-text-muted)] hover:text-[var(--ire-text)] hover:bg-[var(--ire-hover)]"
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.65} />
      {label}
    </button>
  );
}

function AutonomySegment() {
  const levels = ["suggest", "semi-auto", "run"] as const;
  const [active, setActive] = React.useState(1);

  return (
    <div className="ire-segment shrink-0" role="group" aria-label="Autonomy level">
      {levels.map((l, i) => (
        <button
          key={l}
          type="button"
          data-active={active === i}
          onClick={() => setActive(i)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
