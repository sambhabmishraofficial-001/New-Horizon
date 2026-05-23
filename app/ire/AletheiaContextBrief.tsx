"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

export const ALETHEIA_CONTEXT = {
  system:
    "Lattice · Program K11 · Ribozyme catalysis. Twins on duty: Halo-A, Quorum, Dovetail.",
  reply:
    "Invariant I-03 broke in arm 4 of run-71a (σ = 0.19 > 0.12). I ranked three explanations - cofactor depletion is most likely. Want me to draft a rebuttal experiment?",
  timestamp: "09:14",
} as const;

export function AletheiaContextBrief({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "space-y-2.5 rounded-xl border p-3",
        isDark
          ? "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)]"
          : "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)]",
        className
      )}
    >
      <p
        className={cn(
          "text-center text-[10.5px] leading-relaxed",
          isDark ? "text-[var(--ire-text-muted)]" : "text-ink-500"
        )}
      >
        {ALETHEIA_CONTEXT.system}
      </p>

      <div className="flex gap-2">
        <div
          className={cn(
            "grid h-6 w-6 shrink-0 place-items-center rounded-md border",
            isDark
              ? "border-signal-rose/25 bg-signal-rose/10 text-signal-rose"
              : "border-beacon-500/20 bg-beacon-50 text-beacon-700"
          )}
        >
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "font-mono text-[9.5px] uppercase tracking-[0.1em]",
              isDark ? "text-signal-rose/90" : "text-beacon-700"
            )}
          >
            Aletheia
          </div>
          <p
            className={cn(
              "mt-0.5 text-[12px] leading-relaxed",
              isDark ? "text-[var(--ire-text)]" : "text-ink-900"
            )}
          >
            {ALETHEIA_CONTEXT.reply}
          </p>
          <div
            className={cn(
              "mt-1 font-mono text-[9.5px]",
              isDark ? "text-[var(--ire-text-muted)]" : "text-ink-400"
            )}
          >
            {ALETHEIA_CONTEXT.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
