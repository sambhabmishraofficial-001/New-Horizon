"use client";

import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { CHAT_WORK_MS } from "@/components/ire/useChatDemoLoop";
import { IreChatWorkPanel } from "./IreChatWorkPanel";

export type WorkPhase = "scanning" | "investigating" | "reasoning";

export type ChatThinking = {
  durationSec: number;
  breadcrumb: string;
  contextLine?: string;
  investigation: {
    step1: string;
    step2: string;
    step3: string;
  };
  steps: string[];
  reasoning: string;
  summary: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  author?: string;
  content: string;
  ts: string;
  thinking?: ChatThinking;
};

export type PendingTurn = {
  author: string;
  thinking: ChatThinking;
  phase: WorkPhase;
  /** Demo loop anchor — when set, elapsed is derived from cycle time. */
  startedAt?: number;
};

export function ChatThread({
  messages,
  pendingTurn,
  variant = "light",
  showUserTyping = false,
  sessionLabel,
  streamingReply,
}: {
  messages: ChatMessage[];
  pendingTurn: PendingTurn | null;
  variant?: "light" | "dark";
  showUserTyping?: boolean;
  sessionLabel?: string | null;
  streamingReply?: {
    author: string;
    content: string;
    thinking?: ChatThinking;
  } | null;
}) {
  return (
    <div className="ire-chat-thread">
      {sessionLabel ? <SessionContext label={sessionLabel} /> : null}
      {messages.map((message) =>
        message.role === "system" ? (
          <SessionContext key={message.id} label={message.content} />
        ) : (
          <ChatTurn key={message.id} message={message} variant={variant} />
        )
      )}

      {showUserTyping ? <UserTypingBubble variant={variant} /> : null}

      {pendingTurn ? (
        <PendingTurnBlock turn={pendingTurn} variant={variant} />
      ) : null}

      {streamingReply ? (
        <StreamingAssistantTurn
          author={streamingReply.author}
          content={streamingReply.content}
          thinking={streamingReply.thinking}
          variant={variant}
        />
      ) : null}
    </div>
  );
}

function SessionContext({ label }: { label: string }) {
  return (
    <div className="ire-chat-session">
      <span>{label}</span>
    </div>
  );
}

function ChatTurn({
  message,
  variant,
}: {
  message: ChatMessage;
  variant: "light" | "dark";
}) {
  if (message.role === "user") {
    return (
      <div className="ire-chat-turn ire-chat-turn--user">
        <div className="ire-chat-turn__content">
          <div className="ire-chat-turn__meta ire-chat-turn__meta--user">
            <span className="ire-chat-turn__ts">{message.ts}</span>
          </div>
          <div className="ire-chat-bubble ire-chat-bubble--user">
            <p className="ire-chat-bubble__body">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ire-chat-turn ire-chat-turn--assistant">
      <AgentAvatar author={message.author ?? "Agent"} />
      <div className="ire-chat-turn__content">
        <div className="ire-chat-turn__meta">
          <span className="ire-chat-turn__author">{message.author ?? "Assistant"}</span>
          <span className="ire-chat-turn__ts">{message.ts}</span>
        </div>

        {message.thinking ? (
          <ThinkingBlock
            thinking={message.thinking}
            author={message.author ?? "Aletheia"}
            variant={variant}
          />
        ) : null}

        <div className="ire-chat-bubble ire-chat-bubble--assistant">
          <p className="ire-chat-bubble__body">{message.content}</p>
        </div>
      </div>
    </div>
  );
}

function UserTypingBubble({ variant }: { variant: "light" | "dark" }) {
  return (
    <div className="ire-chat-turn ire-chat-turn--user">
      <div className="ire-chat-turn__content">
        <div className="ire-chat-bubble ire-chat-bubble--user ire-chat-bubble--typing">
          <TypingDots variant={variant} />
        </div>
      </div>
    </div>
  );
}

function StreamingAssistantTurn({
  author,
  content,
  thinking,
  variant,
}: {
  author: string;
  content: string;
  thinking?: ChatThinking;
  variant: "light" | "dark";
}) {
  return (
    <div className="ire-chat-turn ire-chat-turn--assistant">
      <AgentAvatar author={author} />
      <div className="ire-chat-turn__content">
        <div className="ire-chat-turn__meta">
          <span className="ire-chat-turn__author">{author}</span>
          <span className="ire-chat-turn__status">Writing</span>
        </div>
        <div className="ire-chat-bubble ire-chat-bubble--assistant">
          <p className="ire-chat-bubble__body">
            {content}
            <span className="ire-chat-stream-cursor" aria-hidden />
          </p>
        </div>
      </div>
    </div>
  );
}

function PendingTurnBlock({
  turn,
  variant,
}: {
  turn: PendingTurn;
  variant: "light" | "dark";
}) {
  const [elapsed, setElapsed] = React.useState(0);
  const mountRef = React.useRef(Date.now());

  React.useEffect(() => {
    mountRef.current = Date.now();
    setElapsed(0);
    const id = window.setInterval(() => {
      setElapsed(Date.now() - mountRef.current);
    }, 50);
    return () => window.clearInterval(id);
  }, [turn.author, turn.thinking.breadcrumb]);

  return (
    <div className="ire-chat-turn ire-chat-turn--assistant">
      <AgentAvatar author={turn.author} />
      <div className="ire-chat-turn__content">
        <div className="ire-chat-turn__meta">
          <span className="ire-chat-turn__author">{turn.author}</span>
          <span className="ire-chat-turn__status">
            Working · {Math.min(CHAT_WORK_MS, elapsed) / 1000 | 0}s
          </span>
        </div>
        <IreChatWorkPanel
          thinking={turn.thinking}
          author={turn.author}
          phase={turn.phase}
          active
          variant={variant}
          workElapsedMs={elapsed}
        />
      </div>
    </div>
  );
}

function TypingDots({ variant }: { variant: "light" | "dark" }) {
  return (
    <span
      className={cn(
        "ire-chat-typing-dots inline-flex items-center gap-1 py-0.5",
        variant === "dark" && "ire-chat-typing-dots--dark"
      )}
      aria-label="Typing"
    >
      <span />
      <span />
      <span />
    </span>
  );
}

function AgentAvatar({ author }: { author: string }) {
  const initial = author.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="ire-chat-avatar" aria-hidden title={author}>
      {author === "Aletheia" ? (
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

function ThinkingBlock({
  thinking,
  author,
  variant,
}: {
  thinking: ChatThinking;
  author: string;
  variant: "light" | "dark";
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="ire-chat-thinking">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ire-chat-thinking__toggle"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn("ire-chat-thinking__chevron", open && "ire-chat-thinking__chevron--open")}
        />
        <span>Thought for {thinking.durationSec}s</span>
      </button>

      {open ? (
        <IreChatWorkPanel
          className="mt-2"
          thinking={thinking}
          author={author}
          active={false}
          complete
          variant={variant}
        />
      ) : null}
    </div>
  );
}

export function useIreChatVariant(): "light" | "dark" {
  const [variant, setVariant] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const root = document.querySelector(".ire-workspace");
    const sync = () => {
      setVariant(root?.getAttribute("data-ire-theme") === "dark" ? "dark" : "light");
    };
    sync();
    if (!root) return;
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-ire-theme"] });
    return () => observer.disconnect();
  }, []);

  return variant;
}
