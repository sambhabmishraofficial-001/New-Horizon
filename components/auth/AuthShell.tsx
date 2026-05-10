import * as React from "react";
import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment-50 font-marketing not-italic text-ink-900 flex flex-col">
      <header className="h-16 shrink-0 border-b border-ink-900/8 bg-white">
        <div className="mx-auto flex h-full max-w-[1360px] items-center px-5 sm:px-7 lg:px-8 xl:px-10">
          <Link href="/" className="inline-flex items-center gap-3 text-ink-900">
            <span className="font-marketing text-[19px] font-light leading-none tracking-[0.12em]">
              [NH]
            </span>
            <span className="font-marketing text-[17px] font-medium leading-none tracking-[0.01em]">
              New Horizon
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-16">
        <div className="w-full max-w-[440px]">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            {eyebrow}
          </div>
          <h1 className="mt-3 font-editorial text-[42px] leading-[1.05] text-ink-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-600">
              {subtitle}
            </p>
          )}
          <div className="mt-8 rounded-2xl border border-ink-900/10 bg-white p-7 shadow-editorial">
            {children}
          </div>
          {footer && (
            <div className="mt-5 text-center text-[13px] text-ink-500">
              {footer}
            </div>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

export function AuthField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-ink-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 h-11 w-full rounded-lg border border-ink-900/12 bg-white px-3 text-[14px] text-ink-900 outline-none transition focus:border-ink-900 focus-visible:ring-2 focus-visible:ring-beacon-500"
      />
      {hint && (
        <span className="mt-1 block text-[12px] text-ink-500">{hint}</span>
      )}
    </label>
  );
}

export function AuthSubmit({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn-soft mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function AuthError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
      {children}
    </div>
  );
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-ink-400">
      <div className="h-px flex-1 bg-ink-900/8" />
      {children}
      <div className="h-px flex-1 bg-ink-900/8" />
    </div>
  );
}

export function OAuthButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink-900/12 bg-white px-3 text-[13.5px] font-medium text-ink-800 transition hover:bg-ink-50 focus-visible:ring-2 focus-visible:ring-beacon-500"
    >
      {icon}
      {label}
    </button>
  );
}
