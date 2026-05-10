"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { STEPS, type StepId } from "@/lib/store/signup";

const SUBSTANTIVE_STEPS = STEPS.filter((s) => s.id !== "done");

export function WizardShell({
  step,
  title,
  description,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  onSkip,
  showSkip = true,
}: {
  step: Exclude<StepId, "done">;
  title: string;
  description?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  onSkip?: () => void;
  showSkip?: boolean;
}) {
  const current = STEPS.find((s) => s.id === step)!;
  return (
    <div className="min-h-screen bg-parchment-50 font-marketing not-italic text-ink-900">
      <div className="border-b border-ink-900/8 bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-ink-900"
          >
            <span className="font-marketing text-[17px] font-light leading-none tracking-[0.12em]">
              [NH]
            </span>
            <span className="font-marketing text-[15px] font-medium leading-none">
              New Horizon
            </span>
          </Link>
          <ProgressDots index={current.index} total={SUBSTANTIVE_STEPS.length} />
          <Link
            href="/login"
            aria-label="Cancel and return to sign in"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-500 hover:text-ink-900"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-12 sm:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          Step {current.index + 1} of {SUBSTANTIVE_STEPS.length} · {current.label}
        </div>
        <h1 className="mt-3 font-editorial text-[34px] leading-[1.1] text-ink-900 sm:text-[40px]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-600">
            {description}
          </p>
        )}

        <div className="mt-10">{children}</div>

        <div className="mt-12 flex items-center justify-between border-t border-ink-900/8 pt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors",
              onBack
                ? "text-ink-700 hover:bg-ink-50"
                : "text-ink-300 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {showSkip && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="text-[12.5px] text-ink-500 underline-offset-2 hover:text-ink-900 hover:underline"
              >
                Skip for now
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-md bg-ink-900 px-4 text-[13px] font-medium text-parchment-50 transition-colors hover:bg-ink-800 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {nextLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgressDots({ index, total }: { index: number; total: number }) {
  return (
    <div className="hidden items-center gap-1.5 md:flex" aria-label={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i < index && "w-3 bg-ink-900",
            i === index && "w-6 bg-ink-900",
            i > index && "w-3 bg-ink-900/15"
          )}
        />
      ))}
    </div>
  );
}

export function FieldLabel({
  children,
  hint,
  required,
}: {
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label className="text-[12.5px] font-medium text-ink-800">
        {children}
        {required && <span className="ml-1 text-rose-700">*</span>}
      </label>
      {hint && <span className="text-[11.5px] text-ink-400">{hint}</span>}
    </div>
  );
}

export function FieldInput({
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  name?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      className="h-10 w-full rounded-md border border-ink-900/12 bg-white px-3 text-[13.5px] text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-ink-900"
    />
  );
}

export function FieldTextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-ink-900/12 bg-white px-3 py-2 text-[13.5px] leading-relaxed text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-ink-900"
    />
  );
}

export function FieldGroup({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel hint={hint} required={required}>{label}</FieldLabel>
      {children}
    </div>
  );
}

export function ChipToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-colors",
        checked
          ? "border-ink-900 bg-ink-900/[0.03]"
          : "border-ink-900/12 bg-white hover:border-ink-900/25"
      )}
    >
      <span className="text-[13px] font-medium text-ink-900">{label}</span>
      {description && (
        <span className="text-[11.5px] leading-snug text-ink-500">{description}</span>
      )}
    </button>
  );
}

export function ErrorBanner({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50/60 px-3 py-2 text-[12.5px] text-rose-800">
      {children}
    </div>
  );
}
