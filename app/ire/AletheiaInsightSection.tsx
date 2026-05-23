"use client";

import { LoadingBreadcrumb } from "@/components/ui/loading-breadcrumb";
import { cn } from "@/lib/cn";
import { AletheiaContextBrief } from "./AletheiaContextBrief";
import { AletheiaInvestigationSteps } from "./AletheiaInvestigationSteps";
import { AletheiaThinkingBlock, ALETHEIA_REASONING } from "./AletheiaThinkingBlock";
import type { WorkPhase } from "./IreChatThread";

export function AletheiaInsightSection({
  className,
  active = true,
  variant = "light",
  showContextBrief = true,
  contextLine = "Program K11 · run-71a · invariant I-03",
  breadcrumb = "Building explanation cone",
  step1 = "Invariant I-03 flagged",
  step2 = "Building explanation cone",
  step3 = "Ranking decision value",
  reasoning = ALETHEIA_REASONING,
  statusLabel = "Aletheia is working",
  investigationComplete = false,
  phase,
}: {
  className?: string;
  active?: boolean;
  variant?: "light" | "dark";
  showContextBrief?: boolean;
  contextLine?: string;
  breadcrumb?: string;
  step1?: string;
  step2?: string;
  step3?: string;
  reasoning?: string;
  statusLabel?: string;
  investigationComplete?: boolean;
  phase?: WorkPhase;
}) {
  const isDark = variant === "dark";
  const showBreadcrumb = !phase || phase === "scanning" || phase === "investigating" || phase === "reasoning";
  const showInvestigation =
    investigationComplete || !phase || phase === "investigating" || phase === "reasoning";
  const showReasoning = !phase || phase === "reasoning";

  return (
    <section
      className={cn(
        "ire-chat-insight shrink-0 border-b px-3 py-3",
        isDark
          ? "border-[var(--ire-border)] bg-[var(--ire-surface-muted)]"
          : "border-[var(--ire-border)] bg-[var(--ire-surface-muted)]",
        className
      )}
      aria-label="Aletheia live investigation"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="ire-chat-insight__eyebrow font-mono text-[10px] uppercase tracking-[0.12em]">
            Aletheia · anomaly triage
          </p>
          <p className="ire-chat-insight__context mt-0.5 truncate text-[12px]">
            {contextLine}
          </p>
        </div>
        <span className="ire-chat-insight__live shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide">
          live
        </span>
      </div>

      {showContextBrief ? (
        <AletheiaContextBrief className="mb-3" variant={variant} />
      ) : null}

      {showBreadcrumb ? (
        <LoadingBreadcrumb className="mb-3" text={breadcrumb} variant={variant} />
      ) : null}

      {showInvestigation ? (
        <AletheiaInvestigationSteps
          className="mb-3"
          variant={variant}
          complete={investigationComplete}
          step1={step1}
          step2={step2}
          step3={step3}
        />
      ) : null}

      {showReasoning ? (
        <AletheiaThinkingBlock
          active={active}
          variant={variant}
          reasoning={reasoning}
          statusLabel={statusLabel}
        />
      ) : null}
    </section>
  );
}
