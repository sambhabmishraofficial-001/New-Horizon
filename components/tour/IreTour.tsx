"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useClientQueryFlag } from "@/lib/hooks/useClientSearchParams";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "nh.tour.ire.seen";
const REPLAY_EVENT = "nh:ire-tour:replay";

type Step = {
  anchor: string;
  title: string;
  body: string;
  side: "right" | "left" | "top" | "bottom";
};

const STEPS: Step[] = [
  {
    anchor: "activity-bar",
    title: "Navigation",
    body:
      "Grouped views for your workspace and program - explorer, search, program map, hypotheses, runs, data, evidence, protocols, and provenance.",
    side: "right",
  },
  {
    anchor: "side-panel",
    title: "Context panel",
    body:
      "Lists and trees for the active view. Open any artifact into the center editor as a tab.",
    side: "right",
  },
  {
    anchor: "tab-bar",
    title: "Tabs",
    body:
      "Open multiple artifacts side-by-side. Each artifact has its own editor. Press ⌘P to jump to anything by name across the whole project.",
    side: "bottom",
  },
  {
    anchor: "editor",
    title: "Editor",
    body:
      "Hypotheses run experiments. Manuscripts cite figures. Notebooks pin to runs. Every artifact is structured so the agent can act on it.",
    side: "top",
  },
  {
    anchor: "agent-rail",
    title: "Co-science",
    body:
      "Chat with the institute or inspect the team tab - specialists, insights, and autonomy controls in one column.",
    side: "left",
  },
  {
    anchor: "bottom-panel",
    title: "Chat",
    body:
      "Pinned context, quick prompts, and the composer. Type / for actions or @ to reference an artifact.",
    side: "top",
  },
];

type Phase = "closed" | "welcome" | "step" | "done";

export function IreTour() {
  return (
    <React.Suspense fallback={null}>
      <IreTourInner />
    </React.Suspense>
  );
}

function IreTourInner() {
  const [phase, setPhase] = React.useState<Phase>("closed");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isDemo = useClientQueryFlag("demo");

  const start = React.useCallback(() => {
    setStepIndex(0);
    setPhase("welcome");
  }, []);

  const close = React.useCallback(() => {
    setPhase("closed");
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, []);

  // First-run gate + ?tour=1 autostart (never in marketing demo iframe)
  React.useEffect(() => {
    if (isDemo) return;

    let seen = "0";
    try {
      seen = localStorage.getItem(STORAGE_KEY) ?? "0";
    } catch {}
    const tourParam = params?.get("tour");
    if (tourParam === "1" || seen !== "1") {
      start();
    }
    if (tourParam === "1") {
      const next = new URLSearchParams(params?.toString() ?? "");
      next.delete("tour");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  }, [params, pathname, router, start, isDemo]);

  // Listen for replay event from anywhere
  React.useEffect(() => {
    if (isDemo) return;

    const onReplay = () => start();
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_EVENT, onReplay);
  }, [start, isDemo]);

  // Keyboard navigation
  React.useEffect(() => {
    if (phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (phase === "step") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
          else setPhase("done");
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (stepIndex > 0) setStepIndex((i) => i - 1);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, stepIndex, close]);

  // Track anchor element rect for the active step
  React.useEffect(() => {
    if (phase !== "step") {
      setRect(null);
      return;
    }
    const step = STEPS[stepIndex];
    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.anchor}"]`);
      if (!el) {
        setRect(null);
        return;
      }
      setRect(el.getBoundingClientRect());
    };
    measure();
    const ro = new ResizeObserver(measure);
    const el = document.querySelector(`[data-tour="${step.anchor}"]`);
    if (el) ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [phase, stepIndex]);

  if (isDemo) return null;

  if (phase === "closed") return null;

  if (phase === "welcome") {
    return (
      <Backdrop onDismiss={close}>
        <div
          role="dialog"
          aria-modal="true"
          className="w-[440px] rounded-xl bg-white shadow-lift border border-ink-900/10 overflow-hidden"
        >
          <div className="px-6 pt-6 pb-5">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-beacon-700">
              <Sparkles className="h-3 w-3" /> guided tour
            </div>
            <h2 className="mt-3 font-editorial text-[26px] leading-[1.15] text-ink-900">
              Welcome to your IRE.
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-600 font-marketing not-italic">
              The Integrated Research Environment is structured like an IDE, but every
              artifact is a typed scientific object - hypothesis, experiment, dataset,
              protocol, manuscript. We&rsquo;ll take eight short steps through every region.
              About a minute.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11.5px] text-ink-600 font-mono">
              <Hint label="←  →" hint="navigate" />
              <Hint label="Esc" hint="close" />
            </div>
          </div>
          <div className="border-t border-ink-900/8 bg-parchment-50 px-5 py-3 flex items-center justify-between">
            <button
              onClick={close}
              className="h-8 px-2.5 text-[12.5px] text-ink-500 hover:text-ink-900"
            >
              Skip for now
            </button>
            <button
              onClick={() => setPhase("step")}
              className="h-8 px-3.5 rounded-md bg-ink-900 text-parchment-50 text-[12.5px] font-medium hover:bg-ink-800 inline-flex items-center gap-1.5"
            >
              Start the tour <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Backdrop>
    );
  }

  if (phase === "done") {
    return (
      <Backdrop onDismiss={close}>
        <div
          role="dialog"
          aria-modal="true"
          className="w-[440px] rounded-xl bg-white shadow-lift border border-ink-900/10 overflow-hidden"
        >
          <div className="px-6 pt-6 pb-5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <h2 className="mt-3 font-editorial text-[24px] leading-[1.15] text-ink-900">
              You&rsquo;re ready.
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-600 font-marketing not-italic">
              Open an artifact from the explorer to start, or press{" "}
              <span className="font-mono border border-ink-900/15 rounded px-1.5 py-0.5 text-[11.5px]">
                ⌘P
              </span>{" "}
              to jump to anything. You can replay this tour anytime from your avatar menu.
            </p>
          </div>
          <div className="border-t border-ink-900/8 bg-parchment-50 px-5 py-3 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setStepIndex(0);
                setPhase("step");
              }}
              className="h-8 px-3 text-[12.5px] text-ink-700 hover:bg-ink-900/5 rounded-md"
            >
              Replay
            </button>
            <button
              onClick={close}
              className="h-8 px-3.5 rounded-md bg-ink-900 text-parchment-50 text-[12.5px] font-medium hover:bg-ink-800"
            >
              Done
            </button>
          </div>
        </div>
      </Backdrop>
    );
  }

  // phase === "step"
  const step = STEPS[stepIndex];
  return (
    <StepOverlay
      step={step}
      stepIndex={stepIndex}
      total={STEPS.length}
      rect={rect}
      onPrev={() => setStepIndex((i) => Math.max(0, i - 1))}
      onNext={() => {
        if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
        else setPhase("done");
      }}
      onSkip={close}
    />
  );
}

function Backdrop({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink-900/40 backdrop-blur-[2px]"
      onClick={onDismiss}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function Hint({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center rounded border border-ink-900/15 bg-parchment-50 px-1.5 py-0.5 text-[10.5px] text-ink-700">
        {label}
      </span>
      <span className="text-ink-500">{hint}</span>
    </div>
  );
}

const POPOVER_W = 320;
const POPOVER_GAP = 12;
const POPOVER_MARGIN = 16;

function StepOverlay({
  step,
  stepIndex,
  total,
  rect,
  onPrev,
  onNext,
  onSkip,
}: {
  step: Step;
  stepIndex: number;
  total: number;
  rect: DOMRect | null;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const popRef = React.useRef<HTMLDivElement>(null);
  const [popH, setPopH] = React.useState(0);

  React.useLayoutEffect(() => {
    if (popRef.current) setPopH(popRef.current.offsetHeight);
  }, [step]);

  const pos = computePopoverPosition(step.side, rect, popH);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dim everything via 4 rectangles around the highlight, leaving the anchor visible */}
      {rect ? <SpotlightDim rect={rect} /> : <FullDim />}

      {/* Highlight ring */}
      {rect && (
        <div
          className="absolute rounded-md ring-2 ring-beacon-500 ring-offset-2 ring-offset-parchment-50 pointer-events-none transition-all duration-200"
          style={{
            top: rect.top - 2,
            left: rect.left - 2,
            width: rect.width + 4,
            height: rect.height + 4,
          }}
        />
      )}

      {/* Popover */}
      <div
        ref={popRef}
        role="dialog"
        aria-modal="true"
        className="absolute pointer-events-auto rounded-xl bg-white shadow-lift border border-ink-900/10 overflow-hidden transition-all duration-200"
        style={{ top: pos.top, left: pos.left, width: POPOVER_W }}
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink-500 font-marketing not-italic">
              Step {stepIndex + 1} of {total}
            </div>
            <button
              onClick={onSkip}
              aria-label="Close tour"
              className="h-5 w-5 grid place-items-center rounded text-ink-400 hover:bg-ink-900/5 hover:text-ink-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <h3 className="mt-2 font-editorial text-[18px] leading-tight text-ink-900">
            {step.title}
          </h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600 font-marketing not-italic">
            {step.body}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-ink-900/8 bg-parchment-50 px-3 py-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === stepIndex ? "w-5 bg-ink-900" : "w-1.5 bg-ink-900/15"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={stepIndex === 0}
              className={cn(
                "h-7 px-2 rounded text-[12px] inline-flex items-center gap-1",
                stepIndex === 0
                  ? "text-ink-300 cursor-not-allowed"
                  : "text-ink-700 hover:bg-ink-900/5"
              )}
            >
              <ArrowLeft className="h-3 w-3" /> Previous
            </button>
            <button
              onClick={onNext}
              className="h-7 px-2.5 rounded bg-ink-900 text-parchment-50 text-[12px] hover:bg-ink-800 inline-flex items-center gap-1"
            >
              {stepIndex === total - 1 ? "Finish" : "Next"}
              {stepIndex === total - 1 ? (
                <Check className="h-3 w-3" />
              ) : (
                <ArrowRight className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FullDim() {
  return <div className="absolute inset-0 bg-ink-900/30" />;
}

function SpotlightDim({ rect }: { rect: DOMRect }) {
  // 4 rectangles: top, left, right, bottom of the highlight
  const top = Math.max(0, rect.top - 2);
  const left = Math.max(0, rect.left - 2);
  const right = rect.right + 2;
  const bottom = rect.bottom + 2;
  const dimCls = "absolute bg-ink-900/30 transition-all duration-200";
  return (
    <>
      <div className={dimCls} style={{ top: 0, left: 0, right: 0, height: top }} />
      <div
        className={dimCls}
        style={{ top, left: 0, width: left, height: bottom - top }}
      />
      <div
        className={dimCls}
        style={{ top, left: right, right: 0, height: bottom - top }}
      />
      <div
        className={dimCls}
        style={{ top: bottom, left: 0, right: 0, bottom: 0 }}
      />
    </>
  );
}

function computePopoverPosition(
  side: Step["side"],
  rect: DOMRect | null,
  popH: number
): { top: number; left: number } {
  if (typeof window === "undefined") return { top: 0, left: 0 };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const safeH = popH || 200;

  // No anchor - center
  if (!rect) {
    return {
      top: Math.max(POPOVER_MARGIN, (vh - safeH) / 2),
      left: Math.max(POPOVER_MARGIN, (vw - POPOVER_W) / 2),
    };
  }

  let top = 0;
  let left = 0;

  switch (side) {
    case "right":
      left = rect.right + POPOVER_GAP;
      top = rect.top + rect.height / 2 - safeH / 2;
      break;
    case "left":
      left = rect.left - POPOVER_W - POPOVER_GAP;
      top = rect.top + rect.height / 2 - safeH / 2;
      break;
    case "top":
      top = rect.top - safeH - POPOVER_GAP;
      left = rect.left + rect.width / 2 - POPOVER_W / 2;
      break;
    case "bottom":
      top = rect.bottom + POPOVER_GAP;
      left = rect.left + rect.width / 2 - POPOVER_W / 2;
      break;
  }

  // Clamp to viewport
  left = Math.max(POPOVER_MARGIN, Math.min(vw - POPOVER_W - POPOVER_MARGIN, left));
  top = Math.max(POPOVER_MARGIN, Math.min(vh - safeH - POPOVER_MARGIN, top));
  return { top, left };
}

export function replayIreTour() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new Event(REPLAY_EVENT));
}
