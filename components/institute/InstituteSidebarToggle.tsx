"use client";

import Link from "next/link";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { BRAND } from "@/lib/nav";
import { useInstituteSidebarStateOptional } from "@/components/institute/use-institute-sidebar-state";
import { cn } from "@/lib/cn";

type InstituteSidebarToggleProps = {
  className?: string;
};

function SidebarCollapseButton({
  collapsed,
  onClick,
  className,
}: {
  collapsed: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] text-ink-500 shadow-[0_1px_0_rgba(42,36,28,0.04)] transition-colors hover:bg-[var(--ire-surface)] hover:text-ink-900",
        className
      )}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
      ) : (
        <PanelLeftClose className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
    </button>
  );
}

/** Brand + collapse control - one row in the sidebar header (Edison-style). */
export function InstituteSidebarHeader({ className }: InstituteSidebarToggleProps) {
  const sidebar = useInstituteSidebarStateOptional();
  if (!sidebar) return null;

  const { collapsed, toggleCollapsed } = sidebar;

  return (
    <div
      className={cn(
        "institute-sidebar-header shrink-0 flex h-11 items-center border-b border-[var(--ire-border,theme(colors.ink.900/8))]",
        collapsed ? "justify-between gap-0.5 px-1.5" : "gap-2 px-3",
        className
      )}
    >
      {!collapsed ? (
        <Link
          href="/lattice"
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
          title={BRAND.tagline}
        >
          <span className="shrink-0 font-marketing text-[15px] font-light not-italic tracking-[0.02em] leading-none text-ink-900">
            {BRAND.logo}
          </span>
          <span className="truncate font-marketing text-[14px] font-semibold not-italic leading-none text-ink-900">
            {BRAND.name}
          </span>
        </Link>
      ) : (
        <Link
          href="/lattice"
          className="inline-flex min-w-0 shrink items-center font-marketing text-[11px] font-light not-italic tracking-[0.02em] leading-none text-ink-900"
          title={BRAND.name}
        >
          {BRAND.logo}
        </Link>
      )}
      <SidebarCollapseButton
        collapsed={collapsed}
        onClick={toggleCollapsed}
        className={collapsed ? "h-6 w-6" : undefined}
      />
    </div>
  );
}

/** @deprecated Use InstituteSidebarHeader in the sidebar instead. */
export function InstituteSidebarToggle(_props: InstituteSidebarToggleProps) {
  return null;
}

/** @deprecated Use InstituteSidebarHeader in the sidebar instead. */
export function InstituteSidebarToggleStandalone(_props: InstituteSidebarToggleProps) {
  return null;
}
