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
    <div className="h-full flex flex-col bg-parchment-100 border-r border-ink-900/8 min-w-0">
      <div className="h-8 shrink-0 px-3 flex items-center justify-between border-b border-ink-900/8">
        <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium truncate">
          {title}
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>

      {onSearch && (
        <div className="px-3 py-2 border-b border-ink-900/8">
          <div className="h-7 px-2 rounded-md bg-white border border-ink-900/10 flex items-center gap-1.5">
            <Search className="h-3 w-3 text-ink-400" />
            <input
              value={search ?? ""}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[11.5px] placeholder:text-ink-400"
              placeholder="Search…"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>

      {footer && (
        <div className="px-3 h-6 shrink-0 flex items-center justify-between text-[10.5px] text-ink-400 border-t border-ink-900/8 font-mono">
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
    <div className="border-b border-ink-900/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center h-7 px-3 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-medium hover:bg-ink-900/5 gap-1.5"
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 text-ink-400 transition-transform",
            !open && "-rotate-90"
          )}
        />
        <span className="flex-1 text-left truncate">{title}</span>
        {typeof count === "number" && (
          <span className="text-ink-400 font-mono normal-case tracking-normal">
            {count}
          </span>
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
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-1.5 text-[12px] hover:bg-ink-900/5 flex items-center gap-2",
        active && "bg-beacon-50 text-ink-900",
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
      title={title}
      onClick={onClick}
      className="h-5 w-5 grid place-items-center rounded hover:bg-ink-900/6 text-ink-500"
    >
      {children}
    </button>
  );
}
