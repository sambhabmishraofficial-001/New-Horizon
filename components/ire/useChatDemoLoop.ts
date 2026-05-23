"use client";

import * as React from "react";
import { ALETHEIA_REASONING } from "@/app/ire/AletheiaThinkingBlock";
import type {
  ChatMessage,
  ChatThinking,
  PendingTurn,
} from "@/app/ire/IreChatThread";

/** Minimum time Aletheia spends working before any reply. */
export const CHAT_WORK_MS = 10000;

const CYCLE_MS = 26000;

const T = {
  userTypingStart: 800,
  userMessage: 2000,
  workStart: 2800,
  workEnd: 2800 + CHAT_WORK_MS,
  replyStreamEnd: 2800 + CHAT_WORK_MS + 1800,
  holdEnd: 22000,
} as const;

const DEMO_USER =
  "What anomalies are blocking promotion on run-71a?";

const DEMO_THINKING: ChatThinking = {
  durationSec: 10,
  breadcrumb: "Ranking active alerts",
  contextLine: "Program K11 · run-71a · invariant I-03",
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
  reasoning: ALETHEIA_REASONING,
  summary:
    "Only run-71a blocks promotion today; K07 tracked separately to avoid conflated triage.",
};

const DEMO_REPLY =
  "Two anomalies need attention today: (1) I-03 breach in run-71a arm 4 - σ = 0.19; (2) Kepler ECE drift on K07. Cofactor depletion ranks first; Dovetail drafted E-8 as rebuttal.";

export type ChatDemoState = {
  messages: ChatMessage[];
  pendingTurn: PendingTurn | null;
  showUserTyping: boolean;
  streamingReply: string | null;
  sessionLabel: string | null;
};

function computeDemoState(cycleMs: number): ChatDemoState {
  const showUserTyping =
    cycleMs >= T.userTypingStart && cycleMs < T.userMessage;
  const userVisible =
    cycleMs >= T.userMessage && cycleMs < T.holdEnd;
  const working =
    cycleMs >= T.workStart && cycleMs < T.workEnd;
  const replyVisible =
    cycleMs >= T.workEnd && cycleMs < T.holdEnd;

  const messages: ChatMessage[] = [];

  if (userVisible) {
    messages.push({
      id: "demo-user",
      role: "user",
      content: DEMO_USER,
      ts: "09:14",
    });
  }

  let streamingReply: string | null = null;

  if (replyVisible) {
    const streamT = Math.min(
      1,
      (cycleMs - T.workEnd) / (T.replyStreamEnd - T.workEnd)
    );
    const streamed = DEMO_REPLY.slice(
      0,
      Math.max(1, Math.floor(DEMO_REPLY.length * streamT))
    );

    if (cycleMs < T.replyStreamEnd) {
      streamingReply = streamed;
    } else {
      messages.push({
        id: "demo-assistant",
        role: "assistant",
        author: "Aletheia",
        content: DEMO_REPLY,
        ts: "09:15",
        thinking: DEMO_THINKING,
      });
    }
  }

  const pendingTurn: PendingTurn | null = working
    ? {
        author: "Aletheia",
        thinking: DEMO_THINKING,
        phase: "scanning",
      }
    : null;

  const sessionLabel =
    cycleMs >= T.userTypingStart && cycleMs < T.holdEnd
      ? "Program K11 · run-71a · invariant I-03"
      : null;

  return {
    messages,
    pendingTurn,
    showUserTyping,
    streamingReply,
    sessionLabel,
  };
}

/**
 * Marketing preview chat loop (mount-aligned):
 * - user typing indicator
 * - user question
 * - Aletheia works for 10s (loader, steps, reasoning)
 * - reply streams in, then holds
 */
export function useChatDemoLoop(enabled: boolean): ChatDemoState {
  const startRef = React.useRef<number | null>(null);
  const [state, setState] = React.useState<ChatDemoState>({
    messages: [],
    pendingTurn: null,
    showUserTyping: false,
    streamingReply: null,
    sessionLabel: null,
  });

  React.useEffect(() => {
    if (!enabled) {
      startRef.current = null;
      setState({
        messages: [],
        pendingTurn: null,
        showUserTyping: false,
        streamingReply: null,
        sessionLabel: null,
      });
      return;
    }

    startRef.current = Date.now();

    const tick = () => {
      if (startRef.current === null) return;
      const cycleMs = (Date.now() - startRef.current) % CYCLE_MS;
      setState(computeDemoState(cycleMs));
    };

    tick();
    const id = window.setInterval(tick, 50);
    return () => window.clearInterval(id);
  }, [enabled]);

  return state;
}

export { DEMO_THINKING, DEMO_REPLY, DEMO_USER };
