"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function EditorBreadcrumbs({
  crumbs,
  right,
}: {
  crumbs: string[];
  right?: React.ReactNode;
}) {
  return (
    <div className="h-7 shrink-0 px-4 flex items-center justify-between border-b border-ink-900/8 bg-white text-[11.5px] text-ink-500 font-mono">
      <div className="flex items-center gap-1.5 truncate">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-ink-300">▸</span>}
            <span className={i === crumbs.length - 1 ? "text-ink-800" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div>{right}</div>
    </div>
  );
}

export function DocShell({
  crumbs,
  right,
  children,
  bg = "white",
}: {
  crumbs: string[];
  right?: React.ReactNode;
  children: React.ReactNode;
  bg?: "white" | "parchment";
}) {
  return (
    <div
      className={cn(
        "flex-1 min-h-0 flex flex-col",
        bg === "white" ? "bg-white" : "bg-parchment-50"
      )}
    >
      <EditorBreadcrumbs crumbs={crumbs} right={right} />
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-400 font-medium">
      {children}
    </div>
  );
}
