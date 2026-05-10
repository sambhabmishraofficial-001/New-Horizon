"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function SettingsHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-ink-900/8 pb-5">
      <h2 className="font-editorial text-[26px] leading-[1.1] text-ink-900">{title}</h2>
      {description && (
        <div className="mt-1.5 text-[13.5px] text-ink-500">{description}</div>
      )}
    </div>
  );
}

export function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7">
      {title && (
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
          {title}
        </div>
      )}
      <div className={cn(title ? "mt-3" : "")}>{children}</div>
    </div>
  );
}

export function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-ink-900/6 py-4 last:border-b-0">
      <div className="min-w-0 max-w-[60%]">
        <div className="text-[13.5px] font-medium text-ink-900">{label}</div>
        {description && (
          <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        checked
          ? "bg-ink-900 border-ink-900"
          : "bg-white border-ink-900/15 hover:border-ink-900/30"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform",
          checked ? "translate-x-[22px] bg-parchment-50" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

export function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="h-9 min-w-[180px] rounded-md border border-ink-900/12 bg-white px-3 text-[13px] text-ink-900 outline-none transition focus:border-ink-900"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  width = "min-w-[220px]",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  width?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-9 rounded-md border border-ink-900/12 bg-white px-3 text-[13px] text-ink-900 outline-none transition focus:border-ink-900",
        width
      )}
    />
  );
}

export function Segment<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (next: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-ink-900/10 bg-white p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-7 px-3 rounded text-[12.5px] font-medium transition-colors",
            value === o.value
              ? "bg-ink-900 text-parchment-50"
              : "text-ink-600 hover:text-ink-900"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "outline",
  type = "button",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "primary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    outline: "border border-ink-900/12 bg-white hover:bg-ink-50 text-ink-800",
    primary: "bg-ink-900 text-parchment-50 hover:bg-ink-800",
    danger: "bg-rose-700 text-white hover:bg-rose-800",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-md px-3 text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant]
      )}
    >
      {children}
    </button>
  );
}

export function SavedToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-emerald-700">
      Saved.
    </div>
  );
}
