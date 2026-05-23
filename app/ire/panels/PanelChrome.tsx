"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function PanelShell({
  title,
  actions,
  search,
  onSearch,
  children,
  footer,
}: {
  title: string;
  actions?: React.ReactNode;
  search?: string;
  onSearch?: (v: string) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col bg-[var(--ire-surface)] min-w-0">
      <div className="h-10 shrink-0 px-3 flex items-center justify-between border-b border-[var(--ire-border)]">
        <div className="ire-label truncate normal-case tracking-[0.12em] text-[11px]">
          {title}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>

      {onSearch && (
        <div className="px-3 py-2.5 border-b border-[var(--ire-border)]">
          <div className="h-8 px-2.5 rounded-lg bg-[var(--ire-surface-muted)] border border-[var(--ire-border)] flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-ink-400" />
            <input
              value={search ?? ""}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-ink-400"
              placeholder="Search…"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>

      {footer && (
        <div className="px-3 h-7 shrink-0 flex items-center justify-between text-[10.5px] text-ink-500 border-t border-[var(--ire-border)] font-mono">
          {footer}
        </div>
      )}
    </div>
  );
}

export function PanelGroup({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-[var(--ire-border)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center h-8 px-3 ire-label hover:bg-ink-900/[0.04] gap-1.5 normal-case tracking-normal text-[11px]"
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 text-ink-400 transition-transform shrink-0",
            !open && "-rotate-90"
          )}
        />
        <span className="flex-1 text-left truncate font-medium">{title}</span>
        {typeof count === "number" && (
          <span className="text-ink-400 font-mono text-[10px]">{count}</span>
        )}
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

export function PanelRow({
  children,
  onClick,
  active,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 text-[12.5px] hover:bg-ink-900/[0.04] flex items-center gap-2",
        active && "bg-beacon-50/80 text-ink-900",
        className
      )}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-900/[0.06] text-ink-500 border border-transparent hover:border-[var(--ire-border)]"
    >
      {children}
    </button>
  );
}
