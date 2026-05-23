"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Library,
  FileText,
  LifeBuoy,
  FolderOpen,
  Settings,
  User,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { NAV } from "@/lib/nav";

const INSTITUTE_LINKS = NAV.filter((n) => n.section === "Institute");
const DISCOVERY_LINKS = NAV.filter((n) => n.section === "Discovery").slice(0, 4);

export function LatticeNavSidebar({
  view,
  onViewChange,
}: {
  view: "playground" | "tasks";
  onViewChange: (v: "playground" | "tasks") => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      className="w-[200px] shrink-0 flex flex-col border-r border-[var(--ire-border)] bg-[var(--ire-sidebar)]"
      aria-label="Lattice navigation"
    >
      <div className="h-11 shrink-0 flex items-center justify-between px-3 border-b border-[var(--ire-border)]">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <span className="text-[15px] font-medium tracking-[0.12em] text-ink-900">
            [NH]
          </span>
          <span className="text-[12px] font-medium text-ink-700 truncate">
            Lattice
          </span>
        </Link>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto py-2 px-2 space-y-4">
        <div>
          <div className="ire-label px-2 mb-1">Institute</div>
          <ul className="space-y-0.5">
            <li>
              <button
                type="button"
                data-active={view === "playground"}
                onClick={() => onViewChange("playground")}
                className="ire-nav-item w-full"
              >
                <Sparkles className="h-3.5 w-3.5 text-beacon-600" strokeWidth={1.65} />
                <span className="flex-1 text-left">
                  Co-science playground
                  <span className="block text-[10px] font-normal text-ink-500 mt-0.5 leading-snug">
                    Prompt, delegate, open workspace
                  </span>
                </span>
                <span className="shrink-0 rounded px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                  live
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                data-active={view === "tasks"}
                onClick={() => onViewChange("tasks")}
                className="ire-nav-item w-full"
              >
                <FolderOpen className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
                View all programs
              </button>
            </li>
          </ul>
        </div>

        <div>
          <div className="ire-label px-2 mb-1">Workspace</div>
          <ul className="space-y-0.5">
            {INSTITUTE_LINKS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>
        </div>

        <div>
          <div className="ire-label px-2 mb-1">Discovery</div>
          <ul className="space-y-0.5">
            {DISCOVERY_LINKS.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </ul>
        </div>

        <div>
          <div className="ire-label px-2 mb-1">Recent</div>
          <ul className="space-y-0.5 text-[11.5px] text-ink-600">
            {["K11 · Ribozyme", "EGFR resistance", "Folding-RL 7c3"].map((label) => (
              <li key={label}>
                <Link
                  href="/ire"
                  className="ire-nav-item py-1.5"
                >
                  <span className="h-5 w-5 rounded bg-ink-900/6 grid place-items-center text-[9px] font-mono shrink-0">
                    ◆
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shrink-0 border-t border-[var(--ire-border)] p-2 space-y-0.5">
        <div className="ire-label px-2 mb-1">Support</div>
        <Link href="/help" className="ire-nav-item">
          <FileText className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
          Docs
        </Link>
        <Link href="/help" className="ire-nav-item">
          <LifeBuoy className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
          Support
        </Link>
        <Link href="/library" className="ire-nav-item">
          <Library className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
          Files
        </Link>
        <Link href="/settings/general" className="ire-nav-item">
          <Settings className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
          Settings
        </Link>
        <Link href="/account" className="ire-nav-item mt-1">
          <User className="h-3.5 w-3.5 text-ink-500" strokeWidth={1.65} />
          Account
        </Link>
        <Link
          href="/"
          className="ire-nav-item text-ink-500 mt-2"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.65} />
          Home
        </Link>
      </div>
    </nav>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: (typeof NAV)[number];
  pathname: string;
}) {
  const Icon = item.icon;
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <li>
      <Link
        href={item.href}
        data-active={active}
        className={cn("ire-nav-item", active && "shadow-[0_0_0_1px_var(--ire-border)]")}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
