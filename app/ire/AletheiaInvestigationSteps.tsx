"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AletheiaInvestigationStepsProps {
  duration?: number;
  step1?: string;
  step2?: string;
  step3?: string;
  className?: string;
  variant?: "light" | "dark";
  complete?: boolean;
}

export function AletheiaInvestigationSteps({
  duration = 4200,
  step1 = "Invariant I-03 flagged",
  step2 = "Building explanation cone",
  step3 = "Ranking decision value",
  className,
  variant = "light",
  complete = false,
}: AletheiaInvestigationStepsProps) {
  const [progress, setProgress] = useState(complete ? 100 : 0);
  const [animateKey, setAnimateKey] = useState(0);

  const isDark = variant === "dark";

  useEffect(() => {
    if (complete) {
      setProgress(100);
      return;
    }

    const forward = setTimeout(() => setProgress(100), 100);
    const reset = setTimeout(() => {
      setProgress(0);
      setAnimateKey((k) => k + 1);
    }, duration + 2000);

    return () => {
      clearTimeout(forward);
      clearTimeout(reset);
    };
  }, [animateKey, duration, complete]);

  if (complete) {
    return (
      <div className={cn("flex flex-col items-stretch justify-center gap-1.5 py-1", className)}>
        <StepRow label={step3} state="done" variant={variant} />
        <StepRow label={step2} state="done" variant={variant} />
        <StepRow label={step1} state="done" variant={variant} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-stretch justify-center gap-1.5 py-1",
        className
      )}
    >
      <StepRow label={step3} state="upcoming" variant={variant} />
      <StepRow
        label={step2}
        state="active"
        progress={progress}
        animateKey={animateKey}
        duration={duration}
        variant={variant}
      />
      <StepRow label={step1} state="done" variant={variant} />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b to-transparent",
          isDark ? "from-[var(--ire-surface-muted)]" : "from-[var(--ire-surface)]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t to-transparent",
          isDark ? "from-[var(--ire-surface-muted)]" : "from-[var(--ire-surface)]"
        )}
      />
    </div>
  );
}

function StepRow({
  label,
  state,
  progress,
  animateKey,
  duration,
  variant = "light",
}: {
  label: string;
  state: "done" | "active" | "upcoming";
  progress?: number;
  animateKey?: number;
  duration?: number;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  const isDone = state === "done";
  const isActive = state === "active";
  const isUpcoming = state === "upcoming";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-center gap-1.5 rounded-lg border py-2 pl-2.5 pr-3",
        isDark
          ? "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)]"
          : "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)]",
        isUpcoming && "scale-[0.97] opacity-70",
        isDone && "scale-[0.97] opacity-80"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-start gap-2 text-[11px]",
          isDark ? "text-[var(--ire-text)]" : "text-ink-800"
        )}
      >
        {isDone ? (
          <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-signal-emerald/15" />
            <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-signal-emerald text-white">
              <Check className="h-2 w-2" strokeWidth={3} />
            </span>
          </span>
        ) : (
          <span className={cn(isActive && "animate-spin text-beacon-600")}>
            <Loader2 className="h-3.5 w-3.5" strokeWidth={2.25} />
          </span>
        )}
        <span className="truncate font-medium">{label}</span>
      </div>
      <div
        className={cn(
          "ml-7 h-1.5 overflow-hidden rounded-full",
          isDone ? "bg-signal-emerald" : isDark ? "bg-[var(--ire-border)]" : "bg-ink-900/8"
        )}
      >
        {isActive && progress !== undefined && animateKey !== undefined && duration !== undefined ? (
          <motion.div
            key={animateKey}
            className="h-full bg-signal-emerald"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
          />
        ) : null}
      </div>
    </div>
  );
}
