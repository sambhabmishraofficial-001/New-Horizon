"use client";

import * as React from "react";
import { Pin, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useClientQueryFlag } from "@/lib/hooks/useClientSearchParams";
import { useChatDemoLoop, CHAT_WORK_MS } from "@/components/ire/useChatDemoLoop";
import { EnhancedComposer } from "./composer/EnhancedComposer";
import { useIreNavigation } from "./workspace-context";
import {
  ChatThread,
  useIreChatVariant,
  type ChatMessage,
  type ChatThinking,
  type PendingTurn,
  type WorkPhase,
} from "./IreChatThread";

const PHASE_MS: Record<WorkPhase, number> = {
  scanning: 1500,
  investigating: 3500,
  reasoning: CHAT_WORK_MS - 1500 - 3500 + 400,
};

export function AgentChatPanel({
  className,
  contextLabel,
  embedded,
}: {
  className?: string;
  contextLabel?: string;
  embedded?: boolean;
}) {
  const isDemo = useClientQueryFlag("demo");
  const demoChat = useChatDemoLoop(isDemo);
  const variant = useIreChatVariant();
  const { pinnedContext, pinContext } = useIreNavigation();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [pendingTurn, setPendingTurn] = React.useState<PendingTurn | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const timersRef = React.useRef<number[]>([]);

  const displayMessages = isDemo ? demoChat.messages : messages;
  const displayPending = isDemo ? demoChat.pendingTurn : pendingTurn;
  const isBusy = displayPending !== null;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [displayMessages, displayPending]);

  React.useEffect(() => {
    return () => {
      for (const id of timersRef.current) window.clearTimeout(id);
    };
  }, []);

  function clearTimers() {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    clearTimers();

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: trimmed, ts: nowLabel() },
    ]);

    const reply = buildReply(trimmed);

    setPendingTurn({
      author: reply.author,
      thinking: reply.thinking,
      phase: "scanning",
    });

    schedule(() => {
      setPendingTurn((prev) =>
        prev ? { ...prev, phase: "investigating" } : null
      );
    }, PHASE_MS.scanning);

    schedule(() => {
      setPendingTurn((prev) =>
        prev ? { ...prev, phase: "reasoning" } : null
      );
    }, PHASE_MS.scanning + PHASE_MS.investigating);

    schedule(() => {
      setPendingTurn(null);
      setMessages((prev) => [...prev, reply.message]);
    }, CHAT_WORK_MS + 400);
  }

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden",
        embedded ? "bg-[var(--ire-surface)]" : "bg-[var(--ire-surface-muted)]",
        className
      )}
    >
      {(pinnedContext || (contextLabel && !embedded)) && (
        <div className="ire-chat-context-bar">
          {pinnedContext ? (
            <span className="ire-chat-context-pill">
              <Pin className="h-3 w-3 shrink-0" />
              <span className="truncate">{pinnedContext.label}</span>
              <button
                type="button"
                title="Clear pinned context"
                onClick={() => pinContext(null)}
                className="ire-chat-context-pill__clear"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <span className="ire-chat-context-label">Context · {contextLabel}</span>
          )}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        {!isDemo && displayMessages.length === 0 && !displayPending ? (
          <div className="ire-chat-empty px-4 py-8 text-center">
            <p className="text-[12px] text-[var(--ire-text-muted)]">
              Ask Aletheia about anomalies, evidence, or next experiments.
            </p>
          </div>
        ) : null}
        <ChatThread
          messages={displayMessages}
          pendingTurn={displayPending}
          variant={variant}
          sessionLabel={isDemo ? demoChat.sessionLabel : null}
          showUserTyping={isDemo && demoChat.showUserTyping}
          streamingReply={
            isDemo && demoChat.streamingReply
              ? {
                  author: "Aletheia",
                  content: demoChat.streamingReply,
                }
              : null
          }
        />
      </div>

      <div className="ire-chat-composer-shell">
        <EnhancedComposer
          onSubmit={send}
          disabled={isBusy || isDemo}
          placeholder={
            isDemo
              ? "Aletheia is responding in the demo loop…"
              : "Message Aletheia - / for actions, @ to reference artifacts"
          }
        />
      </div>
    </div>
  );
}

function nowLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function buildReply(input: string): {
  author: string;
  thinking: ChatThinking;
  message: ChatMessage;
} {
  const lower = input.toLowerCase();
  let author = "Aletheia";
  let content =
    "I can route that to the right twin. Specify literature synthesis, invariant audit, or an experiment plan - I'll attach reasoning chains to the open artifacts.";
  let thinking: ChatThinking = {
    durationSec: 8,
    breadcrumb: "Parsing intent against workspace",
    contextLine: "Open program · routing",
    investigation: {
      step1: "Workspace context loaded",
      step2: "Matching workflow to twins",
      step3: "Preparing routing summary",
    },
    steps: [
      "Parsed intent against open program artifacts",
      "Checked which twins own this workflow",
      "Prepared routing summary",
    ],
    reasoning: `The request doesn't pin a single artifact yet. I'll scan the open tab list and invariant registry to see which twin owns literature synthesis, invariant audit, or experiment planning.

Halo-A covers contradiction diffs and literature conflicts. Quorum owns methods drafts and registry gates. Dovetail queues bench runs when a breach needs a rebuttal experiment.

Without a scoped @mention I should not auto-promote anything - semi-auto mode means I route and wait for approval.`,
    summary:
      "No single artifact pinned - clarify scope or @mention a hypothesis, run, or dataset.",
  };

  if (lower.includes("suggest") && lower.includes("experiment")) {
    author = "Dovetail";
    content =
      "Next experiment: E-8 EDTA titration at 5 mM Mg²⁺ (7 arms × N=5). Targets invariant I-03 breach in run-71a. Quorum pre-checked I-01, I-04. ~42 min on Bench A1.";
    thinking = {
      durationSec: 11,
      breadcrumb: "Simulating rebuttal experiment arms",
      contextLine: "Program K11 · run-71a · I-03 breach",
      investigation: {
        step1: "Mapped arm 4 buffer conditions",
        step2: "Simulating EDTA titration arms",
        step3: "Checking bench A1 quorum gates",
      },
      steps: [
        "Mapped I-03 breach to arm 4 buffer conditions",
        "Simulated decision value for EDTA titration arms",
        "Verified bench A1 fingerprint and quorum gates",
      ],
      reasoning: `Arm 4's tail-end variance pattern points to cofactor depletion. E-8 - EDTA titration at 5 mM Mg²⁺ with seven arms × N=5 - is the highest decision-value rebuttal.

Quorum confirms I-01 and I-04 held in run-71a, so the protocol design isn't the primary suspect. Bench A1 fingerprint matches the approved environment profile; estimated runtime ~42 minutes.

If E-8 restores σ below 0.12 in mirroring conditions, promotion can resume. Until then run-71a stays blocked.`,
      summary:
        "E-8 is the highest-value rebuttal under cofactor-depletion hypothesis; promotion stays blocked until σ < 0.12.",
    };
  } else if (lower.includes("synthesize") && lower.includes("evidence")) {
    content =
      "Evidence synthesis: run-71a arm 4 σ breach supports cofactor-depletion; arm 2 trace contradicts Zhang '25 low-salt claim. Three primary citations pinned to manuscript §2.";
    thinking = {
      durationSec: 12,
      breadcrumb: "Cross-checking literature at Mg²⁺ window",
      contextLine: "run-71a · manuscript §2",
      investigation: {
        step1: "Aggregated arm variance bands",
        step2: "Matching claims to traces",
        step3: "Pinning citation bundle",
      },
      steps: [
        "Aggregated run-71a arms against I-03 band",
        "Cross-checked literature claims at current Mg²⁺ window",
        "Attached citation bundle to manuscript §2",
      ],
      reasoning: `Pulling all run-71a arms against the I-03 band: only arm 4 breaches. That pattern supports cofactor depletion over a global Mg²⁺ effect.

Arm 2 trace contradicts Zhang '25 on low-salt behaviour at our Mg²⁺ window - I'll flag that for a side-by-side invariant diff. Three primary citations are now pinned to manuscript §2 with hash links to the trace parquet.`,
      summary:
        "Two evidence threads converge on buffer-age hypothesis; Zhang '25 conflict flagged for side-by-side diff.",
    };
  } else if (lower.includes("contradiction")) {
    author = "Halo-A";
    content =
      "Contradictions: (1) Zhang '25 vs arm 2 Mg²⁺ trace; (2) Kepler ECE drift vs folding-rl baseline on K07. I can open a side-by-side invariant diff if you want.";
    thinking = {
      durationSec: 10,
      breadcrumb: "Scanning invariant diffs",
      contextLine: "K11 · K07 · literature conflicts",
      investigation: {
        step1: "Diffed linked program invariants",
        step2: "Isolated unexplained conflicts",
        step3: "Ranked by promotion impact",
      },
      steps: [
        "Scanned invariant diffs across linked programs",
        "Isolated conflicts not explained by shared protocol drift",
        "Ranked by impact on promotion gates",
      ],
      reasoning: `Two contradictions surfaced. Zhang '25 vs arm 2 Mg²⁺ trace is directly tied to run-71a promotion. Kepler ECE drift on K07 is a separate program with a different failure mode - I won't conflate the triage.

Both are rank-ordered by impact on promotion gates. I can open side-by-side invariant diffs for either on request.`,
      summary:
        "K07 ECE drift is a separate failure mode - kept out of run-71a triage.",
    };
  } else if (lower.includes("draft methods")) {
    author = "Quorum";
    content =
      "Methods draft queued for manuscript §3: EDTA titration protocol, N=5 per arm, Bench A1 environment fingerprint. Citing protocol v412 and run-71a hashes.";
    thinking = {
      durationSec: 9,
      breadcrumb: "Aligning protocol lineage",
      contextLine: "manuscript §3 · protocol v412",
      investigation: {
        step1: "Pulled protocol v412 lineage",
        step2: "Matched bench fingerprint",
        step3: "Queued §3 draft with hashes",
      },
      steps: [
        "Pulled protocol v412 lineage for measurement block",
        "Aligned bench environment fingerprint with run-71a",
        "Queued §3 draft with hash citations",
      ],
      reasoning: `Methods block for §3 pulls from protocol v412 with explicit hash citations to run-71a. Bench A1 environment fingerprint is aligned to the approved profile from the registry snapshot.

Draft stays in suggest mode - you'll need to approve before any promotion of methods language.`,
      summary:
        "Draft stays in suggest mode until you approve promotion of methods language.",
    };
  } else if (lower.includes("exp-003") || lower.includes("predict")) {
    content =
      "EXP-003 outcome (median): 68% probability invariant I-03 holds at 5 mM Mg²⁺; 22% partial breach; 10% full breach. Confidence limited by arm 4 variance.";
    thinking = {
      durationSec: 13,
      breadcrumb: "Bootstrapping arm variance posterior",
      contextLine: "EXP-003 · cofactor-depletion model",
      investigation: {
        step1: "Bootstrapped arm 4 variance",
        step2: "Conditioned on depletion model",
        step3: "Calibrated prediction intervals",
      },
      steps: [
        "Bootstrapped arm variance from run-71a traces",
        "Conditioned posterior on cofactor-depletion model",
        "Reported calibrated intervals, not point estimates",
      ],
      reasoning: `Posterior conditioned on cofactor-depletion model with bootstrap resampling from run-71a traces. Median outcome: 68% I-03 holds at 5 mM Mg²⁺, 22% partial breach, 10% full breach.

Wide tail on partial breach reflects limited N in arm 4 - E-8 would materially reduce that epistemic uncertainty.`,
      summary:
        "Wide tail on partial breach reflects limited N in arm 4 - E-8 reduces epistemic uncertainty.",
    };
  } else if (lower.includes("anomal") || lower.includes("summarize")) {
    content =
      "Two anomalies need attention today: (1) I-03 breach in run-71a arm 4 - σ = 0.19; (2) Kepler ECE drift on K07. Cofactor depletion ranks first; Dovetail drafted E-8 as rebuttal.";
    thinking = {
      durationSec: 11,
      breadcrumb: "Ranking active alerts",
      contextLine: "K11 · K07 · promotion blockers",
      investigation: {
        step1: "Scanned program alert queue",
        step2: "Ranked by decision value",
        step3: "Linked owner twins",
      },
      steps: [
        "Scanned active alerts across Program K11 and K07",
        "Ranked by promotion blockers and decision value",
        "Linked each anomaly to owner twin and next action",
      ],
      reasoning: `Two anomalies need attention. I-03 breach in run-71a arm 4 (σ = 0.19) blocks promotion today - cofactor depletion ranks first, Dovetail drafted E-8 as rebuttal.

Kepler ECE drift on K07 is tracked separately to avoid conflated triage. Only run-71a blocks promotion in the current window.`,
      summary:
        "Only run-71a blocks promotion today; K07 tracked separately to avoid conflated triage.",
    };
  } else if (lower.includes("@")) {
    const twin = input.match(/@([\w-]+)/i)?.[1] ?? "agent";
    content = `Routing to ${twin}. Context: open artifacts, invariant registry v412. They will reply in-thread with citations.`;
    thinking = {
      durationSec: 6,
      breadcrumb: `Handing off to ${twin}`,
      contextLine: "Twin routing · semi-auto",
      investigation: {
        step1: "Resolved @mention",
        step2: "Attached artifact bundle",
        step3: "Set citation policy",
      },
      steps: [
        "Resolved @mention to institute twin",
        "Attached open artifact bundle and registry snapshot",
        "Handed off thread with citation policy",
      ],
      reasoning: `Routing to ${twin} with open artifact bundle and registry v412 snapshot. Citation policy requires in-thread hashes for any promoted claim. Semi-auto mode - approve before run promotion.`,
      summary: `Awaiting ${twin} - autonomy mode is semi-auto; approve before any run promotion.`,
    };
  }

  return {
    author,
    thinking,
    message: {
      id: `a-${Date.now()}`,
      role: "assistant",
      author,
      content,
      ts: nowLabel(),
      thinking,
    },
  };
}

export type { ChatMessage };
