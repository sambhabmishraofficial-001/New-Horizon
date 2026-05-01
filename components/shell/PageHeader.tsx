import * as React from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  lede,
  right,
  className,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("px-10 pt-14 pb-10 border-b border-ink-900/8", className)}>
      <div className="max-w-[1180px]">
        {eyebrow && (
          <div className="text-[11.5px] uppercase tracking-[0.18em] text-ink-400 font-medium mb-5">
            {eyebrow}
          </div>
        )}
        <div className="flex items-end justify-between gap-8">
          <h1 className="font-display text-[46px] leading-[1.02] text-ink-900 max-w-[22ch] text-balance">
            {title}
          </h1>
          {right && <div className="shrink-0 pb-2">{right}</div>}
        </div>
        {lede && (
          <p className="mt-5 text-ink-600 text-[15px] max-w-[66ch] leading-[1.7] font-normal">
            {lede}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
