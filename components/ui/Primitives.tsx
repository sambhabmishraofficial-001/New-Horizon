import * as React from "react";
import { cn } from "@/lib/cn";

/* ---------------- Card ---------------- */
export function Card({
  className,
  children,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Tag
      className={cn(
        "rounded-xl bg-white border border-ink-900/8",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  eyebrow,
  title,
  subtitle,
  right,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-6 px-6 pt-5 pb-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.18em] text-ink-400 font-medium mb-1.5">
            {eyebrow}
          </div>
        )}
        <div className="font-display text-[17px] text-ink-900 leading-tight">{title}</div>
        {subtitle && (
          <div className="text-[13px] text-ink-500 mt-1 leading-snug">{subtitle}</div>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* ---------------- Tag ---------------- */
export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "beacon" | "emerald" | "amber" | "rose" | "violet" | "outline";
  children: React.ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "text-ink-600 bg-transparent",
    beacon: "text-beacon-700 bg-transparent",
    emerald: "text-emerald-700 bg-transparent",
    amber: "text-amber-800 bg-transparent",
    rose: "text-rose-700 bg-transparent",
    violet: "text-violet-700 bg-transparent",
    outline: "text-ink-600 bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11.5px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Pill (only when a real status marker is needed) ---------------- */
export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "beacon" | "emerald" | "amber" | "rose" | "violet" | "outline";
  children: React.ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-900/5 text-ink-700",
    beacon: "bg-beacon-50 text-beacon-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-800",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
    outline: "bg-transparent border border-ink-900/10 text-ink-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ---------------- Keyboard ---------------- */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[1.5em] h-[18px] px-1 rounded-[4px] border border-ink-900/12 bg-white text-[10.5px] font-mono text-ink-600",
        className
      )}
    >
      {children}
    </kbd>
  );
}

/* ---------------- Button ---------------- */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-7 px-2.5 text-[12.5px]",
    md: "h-8 px-3 text-[13px]",
    lg: "h-10 px-4 text-[13.5px]",
  };
  const variants = {
    primary: "bg-ink-900 text-parchment-50 hover:bg-ink-800",
    secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200/80",
    ghost: "hover:bg-ink-900/5 text-ink-700",
    outline: "bg-white text-ink-800 border border-ink-900/12 hover:bg-ink-50",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium not-italic transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Divider / hairline ---------------- */
export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-ink-900/8", className)} />;
}

/* ---------------- Section title ---------------- */
export function SectionTitle({
  children,
  right,
  className,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3 mb-4", className)}>
      <h2 className="font-display text-[20px] leading-none text-ink-900">{children}</h2>
      {right && <div className="text-[12.5px] text-ink-500">{right}</div>}
    </div>
  );
}

/* ---------------- Stat ---------------- */
export function Stat({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  tone?: "neutral" | "emerald" | "rose" | "beacon";
}) {
  const deltaTones: Record<string, string> = {
    neutral: "text-ink-500",
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    beacon: "text-beacon-700",
  };
  return (
    <div>
      <div className="text-[11.5px] text-ink-500">{label}</div>
      <div className="font-display text-[30px] leading-[1.1] text-ink-900 mt-1 tabular-nums">
        {value}
      </div>
      {delta && (
        <div className={cn("text-[12px] mt-1 tabular-nums", deltaTones[tone])}>{delta}</div>
      )}
    </div>
  );
}

/* ---------------- Dot ---------------- */
export function Dot({
  tone = "emerald",
  className,
}: {
  tone?: "emerald" | "amber" | "rose" | "beacon" | "ink";
  className?: string;
}) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    beacon: "bg-beacon-500",
    ink: "bg-ink-400",
  };
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 rounded-full", tones[tone], className)}
    />
  );
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({
  values,
  height = 28,
  width = 120,
  color = "currentColor",
  className,
}: {
  values: number[];
  height?: number;
  width?: number;
  color?: string;
  className?: string;
}) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className={cn("overflow-visible", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
