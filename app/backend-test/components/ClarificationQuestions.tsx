"use client";

import * as React from "react";
import { CheckCircle2, Send, Sparkles } from "lucide-react";

import {
  VRI_DELEGATION_ANSWER,
  VRI_DELEGATION_OPTION,
} from "../constants";
import type { ClarificationItem, VriPlannerReply } from "../types";

export function hasClarifications(reply: VriPlannerReply) {
  return getClarificationItems(reply).length > 0;
}

export function ClarificationQuestions({
  onSubmit,
  reply,
}: {
  onSubmit: (message?: string) => void;
  reply: VriPlannerReply;
}) {
  const items = getClarificationItems(reply);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const answeredItems = items.filter((item) => answers[item.id]?.trim());
  const allAnswered = answeredItems.length === items.length;

  if (items.length === 0) return null;

  function submitAnswers() {
    if (!allAnswered) return;
    const message = [
      "Answers to clarification questions:",
      ...items.map((item, index) => `${index + 1}. ${item.label}: ${answers[item.id].trim()}`),
    ].join("\n");
    onSubmit(message);
  }

  return (
    <div className="mt-4 rounded-lg border border-ink-900/8 bg-parchment-50/65 p-3">
      <p className="border-b border-ink-900/8 px-3 py-2 text-xs uppercase tracking-[0.14em] text-ink-500">
        {clarificationStatusLabel(reply)}
      </p>
      <div className="space-y-5 px-1 py-3">
        {items.map((item) => (
          <div key={item.id}>
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-sm text-ink-700">{item.question}</p>
            {item.input_type === "single_choice" && item.options.length >= 2 ? (
              <div className="mt-2 space-y-2">
                {clarificationOptions(item).map((option) => {
                  const answerValue =
                    option.label === VRI_DELEGATION_OPTION.label
                      ? VRI_DELEGATION_ANSWER
                      : option.label;
                  const selected = answers[item.id] === answerValue;
                  return (
                    <button
                      key={option.label}
                      className={cx(
                        "flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left transition",
                        selected
                          ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                          : "border-ink-900/8 bg-white hover:bg-ink-900/[0.025]"
                      )}
                      onClick={() => setAnswers((current) => ({ ...current, [item.id]: answerValue }))}
                      type="button"
                    >
                      <span
                        className={cx(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                          selected ? "border-beacon-600 bg-beacon-100 text-beacon-700" : "border-ink-300"
                        )}
                      >
                        {selected ? <CheckCircle2 className="h-3 w-3" /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{option.label}</span>
                        {option.detail ? (
                          <span className="mt-1 block text-xs leading-5 text-ink-500">{option.detail}</span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <textarea
                  className="min-h-24 w-full resize-y rounded-md border border-ink-900/10 bg-white px-3 py-2 text-sm outline-none placeholder:text-ink-400 focus:border-beacon-500/45"
                  onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))}
                  placeholder="Type your answer here, or let VRI choose if you have not decided..."
                  value={answers[item.id] ?? ""}
                />
                <button
                  className={cx(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    answers[item.id] === VRI_DELEGATION_ANSWER
                      ? "border-beacon-500/40 bg-beacon-50 text-beacon-900"
                      : "border-ink-900/10 bg-white text-ink-600 hover:bg-ink-900/[0.03]"
                  )}
                  onClick={() => setAnswers((current) => ({ ...current, [item.id]: VRI_DELEGATION_ANSWER }))}
                  type="button"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Let VRI choose
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-beacon-700 bg-beacon-600 px-4 py-2 text-sm font-medium text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!allAnswered}
        onClick={submitAnswers}
        type="button"
      >
        <Send className="h-4 w-4" />
        {allAnswered ? "Send answers" : `Answer ${items.length - answeredItems.length} more`}
      </button>
    </div>
  );
}

function clarificationStatusLabel(reply: VriPlannerReply) {
  if (reply.answer_quality === "invalid") return "Repair needed";
  if (reply.missing_information?.length) return "Clarifying objective";
  const round = reply.clarification_round ?? 1;
  return `Clarification round ${round}`;
}

function getClarificationItems(reply: VriPlannerReply): ClarificationItem[] {
  if (reply.clarification_items?.length) return reply.clarification_items;
  return reply.clarification_questions.map((question, index) => ({
    id: `q${index + 1}`,
    label: `${index + 1}. Clarification`,
    question,
    input_type: "free_text",
    options: [],
  }));
}

function clarificationOptions(item: ClarificationItem) {
  const hasDelegation = item.options.some((option) =>
    /vri|choose|not sure|default/i.test(`${option.label} ${option.detail ?? ""}`)
  );
  return hasDelegation ? item.options : [...item.options, VRI_DELEGATION_OPTION];
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
