"use client";

import type { ReactNode } from "react";
import { Sparkles, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { AgentChatPanel } from "./AgentChatPanel";
import { useIreNavigation } from "./workspace-context";

export function BottomPanel({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}) {
  const { activeDocName, pinnedContext } = useIreNavigation();
  const ctxLabel = pinnedContext?.label ?? activeDocName;
  return (
    <div
      className={cn(
        "shrink-0 border-t border-ink-900/8 bg-parchment-50 flex flex-col min-h-0 transition-[height]",
        collapsed ? "h-8" : "h-[360px]"
      )}
    >
      <header className="h-8 shrink-0 flex items-center justify-between border-b border-ink-900/8 bg-parchment-100 px-2">
        <span className="inline-flex items-center gap-1.5 h-8 px-2 font-marketing text-[10.5px] font-medium uppercase not-italic tracking-[0.16em] text-ink-500">
          <Sparkles className="h-3 w-3 text-beacon-600" />
          Research agent
        </span>
        <span className="flex items-center gap-1">
          <IconBtn title={collapsed ? "Expand" : "Collapse"} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </IconBtn>
          <IconBtn title="Close" onClick={() => setCollapsed(true)}>
            <X className="h-3 w-3" />
          </IconBtn>
        </span>
      </header>

      {!collapsed && (
        <AgentChatPanel className="flex-1 min-h-0" contextLabel={ctxLabel} />
      )}
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
}: {
  children: ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="h-5 w-5 grid place-items-center rounded hover:bg-ink-900/6 text-ink-500"
    >
      {children}
    </button>
  );
}
