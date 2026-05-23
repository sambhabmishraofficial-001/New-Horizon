"use client";

import { PulsatingDots } from "@/components/ui/pulsating-dots";
import { cn } from "@/lib/cn";
import { useEffect, useRef, useState } from "react";

export const ALETHEIA_REASONING = `First I need to anchor this alert to the right invariant. I-03 governs replicate variance across ribozyme catalysis arms in Program K11. Run-71a arm 4 reported σ = 0.19, which exceeds the approved band of 0.12. That alone blocks promotion.

Pulling run-71a-traces.parquet: the variance clusters in the final twenty minutes of each replicate window. A pure Mg²⁺ concentration effect would diverge earlier. The timing argues against Halo-A's loop-3 secondary-site model as the primary driver for arm 4 specifically - arms 2 and 3 remain within band.

Checking Quorum's registry v412: I-01 (Mg²⁺ trace integrity) and I-04 (temperature stability) both held in run-71a. Only I-03 broke. That narrows the cone to process variables rather than protocol design.

Cofactor depletion ranks first. EDTA carryover or buffer age could accelerate Mg²⁺ sequestration late in the run, matching the tail-end variance pattern. Arm-specific pipetting variance is second - possible, but less consistent across replicates. Instrument drift on Bench A1 is third; fingerprint hash still matches the approved environment profile.

Dovetail proposed E-8: EDTA titration at 5 mM Mg²⁺, seven arms × N=5. Before recommending it I need decision value. If cofactor depletion is correct, E-8 should restore σ below 0.12 in arms mirroring arm 4's buffer conditions. Estimated bench time ~42 min on A1.

Ranking the explanation cone:
1. Cofactor depletion / buffer age - posterior 0.58
2. Arm-specific pipetting variance - 0.24
3. Instrument drift on Bench A1 - 0.18

Manuscript §2 cites Zhang '25 on low-salt behaviour; arm 2 trace contradicts that claim at our Mg²⁺ window. I'll attach a side-by-side invariant diff so the researcher sees the conflict before any promotion.

Kepler flagged ECE drift on K07 separately. Different program, different failure mode - I won't conflate it with this triage.

Decision value of acting today: high. I-03 breach blocks promotion of run-71a results. Delaying E-8 risks a false promotion chain even if the underlying biology is sound.

Draft reply for the researcher: invariant I-03 broke in arm 4 (σ = 0.19 > 0.12). Cofactor depletion is most likely. Recommend E-8 as rebuttal; Quorum pre-checked I-01 and I-04. Attach cone ranking and Zhang '25 contradiction diff.`;

interface AletheiaThinkingBlockProps {
  className?: string;
  active?: boolean;
  variant?: "light" | "dark";
  reasoning?: string;
  statusLabel?: string;
}

export function AletheiaThinkingBlock({
  className,
  active = true,
  variant = "light",
  reasoning = ALETHEIA_REASONING,
  statusLabel = "Aletheia is working",
}: AletheiaThinkingBlockProps) {
  const isDark = variant === "dark";
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active || !contentRef.current) return;

    const scrollHeight = contentRef.current.scrollHeight;
    const clientHeight = contentRef.current.clientHeight;
    const maxScroll = scrollHeight - clientHeight;

    scrollIntervalRef.current = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        if (newPosition >= maxScroll) return 0;
        return newPosition;
      });
    }, 5);

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "relative h-[148px] overflow-hidden rounded-xl border p-2",
          isDark
            ? "border-[var(--ire-border)] bg-[var(--ire-surface-elevated)]"
            : "border-[var(--ire-border)] bg-[var(--ire-surface-muted)]"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-10 h-[72px] bg-gradient-to-b from-30% to-transparent",
            isDark ? "from-[var(--ire-surface-muted)]" : "from-[var(--ire-surface-muted)]"
          )}
          aria-hidden
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[72px] bg-gradient-to-t from-30% to-transparent",
            isDark ? "from-[var(--ire-surface-muted)]" : "from-[var(--ire-surface-muted)]"
          )}
          aria-hidden
        />
        <div
          ref={contentRef}
          className={cn(
            "h-full overflow-hidden px-3 py-2",
            isDark ? "text-[var(--ire-text-muted)]" : "text-ink-700"
          )}
        >
          <p className="whitespace-pre-wrap text-[11.5px] leading-relaxed">
            {reasoning}
          </p>
        </div>
      </div>

      {active ? (
        <div
          className={cn(
            "mt-2.5 flex items-center justify-center gap-2 py-1",
            isDark ? "text-[var(--ire-text-muted)]" : "text-ink-400"
          )}
        >
          <PulsatingDots
            dotClassName={isDark ? "bg-signal-rose/90" : "bg-signal-rose"}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
            {statusLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
