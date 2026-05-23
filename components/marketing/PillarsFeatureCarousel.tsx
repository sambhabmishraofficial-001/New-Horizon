"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldCheck, Route, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { MARKETING_GRADIENTS } from "@/lib/marketing-gradients";
import {
  GradientBackground,
  type GradientBackgroundProps,
} from "@/components/ui/noisy-gradient-backgrounds";

const PILLARS = [
  {
    id: "twins",
    label: "Twins",
    icon: Bot,
    description:
      "Six of fourteen Twins on duty. Each with a role: literature synthesist, invariant auditor, experiment designer, generative modeler, anomaly triage. Named, persistent, accountable.",
  },
  {
    id: "invariants",
    label: "Invariants",
    icon: ShieldCheck,
    description:
      "412 of 418 invariants holding. Every claim your institute makes is checked against the formal properties of your domain - energy monotonicity, kinetic saturation, calibration bounds. Wrong answers don't ship.",
  },
  {
    id: "critical-path",
    label: "Critical Path",
    icon: Route,
    description:
      "Hypothesis → Invariant → Environment → Evidence. Every program has one path that matters. Your institute keeps it visible, executable, and four moves from a testable claim.",
  },
] as const;

const PILLAR_GRADIENTS: Record<
  (typeof PILLARS)[number]["id"],
  GradientBackgroundProps
> = {
  twins: MARKETING_GRADIENTS.twins,
  invariants: MARKETING_GRADIENTS.invariants,
  "critical-path": MARKETING_GRADIENTS.criticalPath,
};

const AUTO_PLAY_INTERVAL = 4000;
const ITEM_HEIGHT = 68;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function PillarIcon({ icon: Icon, active }: { icon: LucideIcon; active: boolean }) {
  return (
    <Icon
      className={cn(
        "h-[18px] w-[18px] shrink-0 transition-colors duration-500",
        active ? "text-ink-900" : "text-ink-400"
      )}
      strokeWidth={1.75}
    />
  );
}

export function PillarsFeatureCarousel({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % PILLARS.length) + PILLARS.length) % PILLARS.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + PILLARS.length) % PILLARS.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = PILLARS.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)}>
      <div className="relative flex min-h-[520px] flex-col lg:min-h-0 lg:flex-row lg:aspect-[2.2/1]">
        <div className="relative z-30 flex w-full flex-col items-start justify-center overflow-hidden px-4 py-14 sm:px-6 md:px-8 lg:w-[38%] lg:min-h-full lg:py-16 lg:pl-4 lg:pr-8">
          <div className="relative z-20 flex h-[204px] w-full items-center justify-center lg:justify-start">
            {PILLARS.map((pillar, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(PILLARS.length / 2),
                PILLARS.length / 2,
                distance
              );

              return (
                <motion.div
                  key={pillar.id}
                  style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.3,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    type="button"
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-full border px-6 py-3.5 text-left transition-all duration-500 md:px-8 md:py-4",
                      isActive
                        ? "z-10 border-ink-900 bg-transparent text-ink-900"
                        : "border-ink-900/15 bg-transparent text-ink-500 hover:border-ink-900/30 hover:text-ink-700"
                    )}
                  >
                    <PillarIcon icon={pillar.icon} active={isActive} />
                    <span className="whitespace-nowrap font-marketing text-sm font-normal tracking-tight md:text-[15px]">
                      {pillar.label}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-14 md:px-10 lg:py-12">
          <div className="relative flex aspect-[4/5] w-full max-w-[400px] items-center justify-center">
            {PILLARS.map((pillar, index) => {
              const status = getCardStatus(index);
              const isActive = status === "active";
              const isPrev = status === "prev";
              const isNext = status === "next";

              return (
                <motion.div
                  key={pillar.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -80 : isNext ? 80 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.88 : 0.75,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.35 : 0,
                    rotate: isPrev ? -2 : isNext ? 2 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] border border-ink-900/12 bg-transparent"
                >
                  <GradientBackground {...PILLAR_GRADIENTS[pillar.id]} />
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={pillar.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.35 }}
                        className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10"
                      >
                        <div className="mb-4 w-fit rounded-full border border-white/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                          {String(index + 1).padStart(2, "0")} · {pillar.label}
                        </div>
                        <p className="font-marketing text-lg font-normal leading-snug tracking-tight text-white md:text-xl">
                          {pillar.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
