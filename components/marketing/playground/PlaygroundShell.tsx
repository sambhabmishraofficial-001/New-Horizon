"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Send } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { GradientBackground } from "@/components/ui/noisy-gradient-backgrounds";
import { cn } from "@/lib/cn";
import {
  mockPlaygroundReply,
  PLAYGROUND_MODES,
  type PlaygroundMode,
} from "@/lib/playground-mocks";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function PlaygroundComposer({
  mode,
  onModeChange,
  onSend,
  disabled,
}: {
  mode: PlaygroundMode;
  onModeChange: (mode: PlaygroundMode) => void;
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const activeMode =
    PLAYGROUND_MODES.find((item) => item.id === mode) ?? PLAYGROUND_MODES[0];

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="w-full">
      <div
        className="mb-3 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Playground mode"
      >
        {PLAYGROUND_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            onClick={() => onModeChange(item.id)}
            className={cn(
              "rounded-full px-3 py-1 font-marketing text-[11.5px] font-medium tracking-[-0.01em] transition-colors",
              mode === item.id
                ? "bg-ink-900 text-white"
                : "border border-ink-900/10 bg-white text-ink-800 hover:bg-parchment-50"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-[0_16px_48px_-20px_rgba(17,17,16,0.4)]">
        <div className="flex items-end gap-3 px-4 py-3 sm:px-4 sm:py-3.5">
          <textarea
            ref={textareaRef}
            value={value}
            rows={1}
            disabled={disabled}
            placeholder={activeMode.placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            className="max-h-28 min-h-[44px] flex-1 resize-none bg-white font-marketing text-[14px] leading-relaxed text-ink-900 placeholder:text-ink-900/40 focus:outline-none disabled:opacity-60"
          />
          <button
            type="button"
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-white transition-opacity hover:bg-ink-800 disabled:opacity-35"
          >
            {disabled ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Send className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>

        <div className="flex justify-end border-t border-ink-900/8 px-4 py-2">
          <Link
            href="/enrol"
            className="inline-flex items-center gap-1 font-marketing text-[11px] font-medium text-ink-900/65 transition-colors hover:text-ink-900"
          >
            Request access
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(100%,34rem)] rounded-xl px-3.5 py-2.5 font-marketing text-[13px] leading-relaxed tracking-[-0.01em] bg-white text-ink-900 shadow-sm",
          !isUser && "border border-ink-900/8"
        )}
      >
        {!isUser ? (
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-900/45">
            Institute twin
          </p>
        ) : null}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

function PlaygroundPanel({
  mode,
  onModeChange,
  messages,
  pending,
  onSend,
}: {
  mode: PlaygroundMode;
  onModeChange: (mode: PlaygroundMode) => void;
  messages: Message[];
  pending: boolean;
  onSend: (text: string) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  return (
    <div className="playground-panel relative mx-auto w-full max-w-[920px] overflow-hidden rounded-[1.75rem] sm:rounded-[2rem]">
      <div className="relative min-h-[min(68vh,580px)]">
        <GradientBackground
          enableNoise
          noisePatternAlpha={50}
          noiseIntensity={1}
          noisePatternRefreshInterval={1}
        />

        <div className="relative z-10 flex min-h-[min(68vh,580px)] flex-col items-center justify-center px-5 py-10 sm:px-10 sm:py-12">
          {hasMessages ? (
            <div
              ref={scrollRef}
              className="mb-6 w-full max-w-[620px] max-h-[min(36vh,320px)] space-y-2.5 overflow-y-auto overscroll-contain py-1"
            >
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {pending ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-ink-900/8 bg-white px-3.5 py-2.5 text-[12px] text-ink-900/55 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Reasoning…
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="w-full max-w-[620px] shrink-0">
            <PlaygroundComposer
              mode={mode}
              onModeChange={onModeChange}
              onSend={onSend}
              disabled={pending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaygroundShell() {
  const [mode, setMode] = React.useState<PlaygroundMode>("co-science");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [pending, setPending] = React.useState(false);

  async function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: text },
    ]);
    setPending(true);

    await new Promise((resolve) =>
      window.setTimeout(resolve, 900 + Math.random() * 700)
    );

    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: mockPlaygroundReply(mode, text),
      },
    ]);
    setPending(false);
  }

  return (
    <div className="marketing-site playground-page min-h-[100dvh] bg-white font-marketing text-ink-900">
      <MarketingNav variant="light" hideOnScroll={false} showBanner={false} />

      <main className="px-4 pb-16 pt-6 sm:px-6">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-900/50">
            Playground
          </p>
          <h1 className="mt-3 font-marketing text-[clamp(2rem,5vw,3rem)] font-light leading-[1.08] tracking-[-0.035em] text-ink-900">
            Try for free
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-900/65">
            Co-science, literature, invariants, and experiments - no signup
            required.
          </p>
        </header>

        <PlaygroundPanel
          mode={mode}
          onModeChange={setMode}
          messages={messages}
          pending={pending}
          onSend={handleSend}
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
