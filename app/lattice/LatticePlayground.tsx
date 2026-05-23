"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Send } from "lucide-react";
import {
  PLAYGROUND_EXAMPLES,
  PROMPT_STARTERS,
  LATTICE_PROGRAMS,
  type LatticeTask,
} from "./lattice-data";

export function LatticePlayground({
  selectedTask,
  autonomy,
  onAutonomyChange,
}: {
  selectedTask: LatticeTask | null;
  autonomy: number;
  onAutonomyChange: (i: number) => void;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = React.useState("");
  const program = selectedTask
    ? LATTICE_PROGRAMS.find((p) => p.id === selectedTask.programId)
    : LATTICE_PROGRAMS[0];

  function submit() {
    const text = prompt.trim();
    if (!text) return;
    router.push(`/ire?prompt=${encodeURIComponent(text)}`);
  }

  return (
    <main className="flex-1 min-w-0 flex flex-col bg-[var(--ire-surface)]">
      <header className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-[var(--ire-border)]">
        <nav className="flex items-center gap-1.5 text-[12px] text-ink-600 min-w-0">
          <span className="text-ink-400">program</span>
          <span className="text-ink-300">/</span>
          <span className="font-medium text-ink-900 truncate">
            {program?.code ?? "K11"} · {program?.title.slice(0, 36) ?? "Ribozyme catalysis"}
          </span>
          <span className="text-ink-300">/</span>
          <span className="text-ink-900 shrink-0">session</span>
        </nav>
        <AutonomySegment active={autonomy} onChange={onAutonomyChange} />
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-[640px]">
          <p className="text-center ire-label mb-2">Virtual Research Institute</p>
          <h1 className="ire-ui-serif text-center text-[26px] sm:text-[32px] text-ink-900 leading-[1.15] font-normal">
            Start from a program or a prompt.
          </h1>
          <p className="mt-3 text-center text-[13.5px] text-ink-600 leading-relaxed">
            Pick an active program, open the integrated workspace, or ask the
            co-science team to advance the next experiment.
          </p>

          {selectedTask && (
            <p className="mt-4 text-center font-mono text-[11px] text-ink-500">
              Selected · {selectedTask.code}
            </p>
          )}

          <div className="mt-8 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder={
                program
                  ? `Ask about ${program.code} - hypotheses, runs, or evidence…`
                  : "Connect tau biology to early neurodegeneration signals…"
              }
              className="w-full resize-none rounded-2xl border border-[var(--ire-border)] bg-white px-4 py-3.5 pr-12 text-[14px] leading-relaxed text-ink-900 placeholder:text-ink-400 outline-none focus:border-[var(--ire-border-strong)] focus:shadow-[0_0_0_3px_rgba(43,82,176,0.08)]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <button
              type="button"
              onClick={submit}
              title="Send to workspace"
              className="absolute right-2 bottom-2 h-9 w-9 rounded-full bg-ink-900 text-white grid place-items-center hover:bg-ink-800"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 text-[11.5px] text-ink-500">
            <span>
              Compute credits · <strong className="text-ink-800 font-medium">2.0k</strong> remaining
            </span>
            <button
              type="button"
              className="text-beacon-700 hover:underline font-medium"
            >
              Get more
            </button>
          </div>

          <ul className="mt-8 space-y-2">
            {PROMPT_STARTERS.map((p) => (
              <li key={p.label}>
                {p.href ? (
                  <Link href={p.href} className="ire-prompt-chip inline-flex items-center justify-between gap-2">
                    {p.label}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrompt(p.label)}
                    className="ire-prompt-chip"
                  >
                    {p.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <p className="ire-label mb-3">Examples</p>
            <ul className="space-y-2">
              {PLAYGROUND_EXAMPLES.map((ex) => (
                <li key={ex}>
                  <button
                    type="button"
                    onClick={() => setPrompt(ex)}
                    className="text-[12.5px] text-beacon-700 hover:underline text-left leading-snug"
                  >
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-center text-[11.5px] text-ink-500">
            Type a prompt, attach a file in{" "}
            <Link href="/ire" className="text-ink-800 underline underline-offset-2">
              workspace
            </Link>
            , or press{" "}
            <kbd className="px-1 py-0.5 rounded border border-[var(--ire-border)] font-mono text-[10px]">
              /
            </kbd>{" "}
            for commands.
          </p>
        </div>
      </div>
    </main>
  );
}

function AutonomySegment({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  const levels = ["draft", "review", "run"] as const;
  return (
    <div className="ire-segment shrink-0" role="group" aria-label="Autonomy mode">
      {levels.map((l, i) => (
        <button
          key={l}
          type="button"
          data-active={active === i}
          onClick={() => onChange(i)}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
