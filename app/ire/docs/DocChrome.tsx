"use client";

import * as React from "react";

export function EditorBreadcrumbs({
  crumbs,
  right,
}: {
  crumbs: string[];
  right?: React.ReactNode;
}) {
  return (
    <div className="h-7 shrink-0 flex items-center justify-between border-b border-[var(--ire-border)] bg-[var(--ire-surface)] px-4 font-mono text-[11.5px] text-[var(--ire-text-muted)]">
      <div className="flex items-center gap-1.5 truncate">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="opacity-40">▸</span>}
            <span
              className={i === crumbs.length - 1 ? "text-[var(--ire-text)]" : ""}
            >
              {c}
            </span>
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
}: {
  crumbs: string[];
  right?: React.ReactNode;
  children: React.ReactNode;
  bg?: "white" | "parchment";
}) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[var(--ire-surface-muted)]">
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
