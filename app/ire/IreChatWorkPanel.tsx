"use client";

import { LoadingBreadcrumb } from "@/components/ui/loading-breadcrumb";
import { cn } from "@/lib/cn";
import { AletheiaInvestigationSteps } from "./AletheiaInvestigationSteps";
import { AletheiaThinkingBlock } from "./AletheiaThinkingBlock";
import type { ChatThinking, WorkPhase } from "./IreChatThread";

/** Progressive reveal over a 10s working window. */
const WORK_MS = 10000;

export function IreChatWorkPanel({
  thinking,
  author,
  phase,
  active,
  complete = false,
  variant = "light",
  className,
  workElapsedMs = 0,
}: {
  thinking: ChatThinking;
  author: string;
  phase?: WorkPhase;
  active: boolean;
  complete?: boolean;
  variant?: "light" | "dark";
  className?: string;
  /** Elapsed ms since this turn started — drives progressive loader UI. */
  workElapsedMs?: number;
}) {
  const isDark = variant === "dark";
  const useProgressive = active && !complete && workElapsedMs >= 0;

  const showBreadcrumb = complete || !useProgressive
    ? active && !complete
    : workElapsedMs >= 200;
  const showInvestigation = complete
    ? true
    : useProgressive
      ? workElapsedMs >= 1200
      : phase === "investigating" || phase === "reasoning";
  const showReasoning = complete
    ? true
    : useProgressive
      ? workElapsedMs >= 4500
      : phase === "reasoning";

  const investigationDuration = complete
    ? 0
    : useProgressive
      ? Math.max(1200, WORK_MS - 4500)
      : 9500;

  return (
    <div
      className={cn(
        "ire-chat-work-panel rounded-xl border p-3",
        isDark
          ? "border-white/10 bg-[var(--ire-surface-muted)]"
          : "border-[var(--ire-border)] bg-[var(--ire-surface-muted)]",
        className
      )}
    >
      {thinking.contextLine ? (
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal-rose">
              {author} · investigation
            </p>
            <p
              className={cn(
                "mt-0.5 truncate text-[12px]",
                isDark ? "text-parchment-100/75" : "text-[var(--ire-text-muted)]"
              )}
            >
              {thinking.contextLine}
            </p>
          </div>
          {active && !complete ? (
            <span className="ire-chat-work-panel__pulse shrink-0 rounded-full border border-[var(--ire-border)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-[var(--ire-text-muted)]">
              running
            </span>
          ) : null}
        </div>
      ) : null}

      {showBreadcrumb ? (
        <LoadingBreadcrumb
          className="mb-3"
          text={thinking.breadcrumb}
          variant={variant}
        />
      ) : null}

      {showInvestigation ? (
        <AletheiaInvestigationSteps
          className="mb-3"
          variant={variant}
          complete={complete}
          step1={thinking.investigation.step1}
          step2={thinking.investigation.step2}
          step3={thinking.investigation.step3}
          duration={investigationDuration}
        />
      ) : null}

      {showReasoning ? (
        <AletheiaThinkingBlock
          active={active && !complete}
          variant={variant}
          reasoning={thinking.reasoning}
          statusLabel={`${author} is working`}
        />
      ) : null}

      {complete && thinking.summary ? (
        <p className="mt-3 border-t border-[var(--ire-border)] pt-3 text-[11.5px] leading-relaxed text-[var(--ire-text-muted)]">
          {thinking.summary}
        </p>
      ) : null}
    </div>
  );
}
