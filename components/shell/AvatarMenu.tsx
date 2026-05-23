"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Settings as SettingsIcon,
  LifeBuoy,
  Keyboard,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "@/lib/store/auth";
import { cn } from "@/lib/cn";
import { replayVriOnboarding } from "@/lib/hooks/useVriOnboardingDismissed";
import { replayIreTour } from "@/components/tour/IreTour";
import { openKeyboardShortcutsDialog } from "@/lib/keyboard-shortcuts-dialog";

function initials(name?: string, email?: string) {
  const src = (name && name.trim()) || (email ? email.split("@")[0] : "");
  if (!src) return "-";
  const parts = src.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export function AvatarMenu({
  variant = "light",
  showCaret = false,
}: {
  variant?: "light" | "dark";
  showCaret?: boolean;
}) {
  const { user } = useSession();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [pathname, setPathname] = React.useState<string>("");
  React.useEffect(() => {
    setPathname(window.location.pathname);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const onSignOut = () => {
    signOut();
    setOpen(false);
    router.push("/");
  };

  const labelName = user.preferredName || user.fullName || user.email;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full transition-colors",
          showCaret ? "pr-1 pl-1 py-1" : "p-0",
          variant === "dark" ? "hover:bg-white/10" : "hover:bg-ink-900/5"
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.avatarDataUrl ? (
          <img
            src={user.avatarDataUrl}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-beacon-500 to-signal-violet text-[11px] font-semibold text-white">
            {initials(labelName, user.email)}
          </div>
        )}
        {showCaret && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5",
              variant === "dark" ? "text-white/55" : "text-ink-400"
            )}
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-64 rounded-xl border border-ink-900/10 bg-white shadow-lift"
        >
          <div className="border-b border-ink-900/6 px-4 py-3">
            <div className="text-[13px] font-medium text-ink-900 truncate">
              {labelName}
            </div>
            <div className="mt-0.5 text-[11.5px] text-ink-500 truncate">{user.email}</div>
          </div>
          <div className="p-1">
            <MenuLink href="/account" icon={UserIcon} onClick={() => setOpen(false)}>
              Profile
            </MenuLink>
            <MenuLink
              href="/settings/general"
              icon={SettingsIcon}
              onClick={() => setOpen(false)}
            >
              Settings
            </MenuLink>
            <MenuLink href="/help" icon={LifeBuoy} onClick={() => setOpen(false)}>
              Help & docs
            </MenuLink>
            <button
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-ink-700 hover:bg-ink-50"
              onClick={() => {
                setOpen(false);
                openKeyboardShortcutsDialog();
              }}
            >
              <Keyboard className="h-4 w-4 text-ink-400" />
              Keyboard shortcuts
              <span className="ml-auto font-mono text-[10.5px] text-ink-400">⌘/</span>
            </button>
            <button
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-ink-700 hover:bg-ink-50"
              onClick={() => {
                setOpen(false);
                replayVriOnboarding();
              }}
            >
              <Sparkles className="h-4 w-4 text-ink-400" />
              Replay welcome tour
            </button>
            <button
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-ink-700 hover:bg-ink-50"
              onClick={() => {
                setOpen(false);
                if (pathname.startsWith("/ire")) {
                  replayIreTour();
                } else {
                  router.push("/ire?tour=1");
                }
              }}
            >
              <Sparkles className="h-4 w-4 text-ink-400" />
              Replay IRE tour
            </button>
          </div>
          <div className="border-t border-ink-900/6 p-1">
            <button
              role="menuitem"
              onClick={onSignOut}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-ink-700 hover:bg-ink-50"
            >
              <LogOut className="h-4 w-4 text-ink-400" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-ink-700 hover:bg-ink-50"
    >
      <Icon className="h-4 w-4 text-ink-400" />
      {children}
    </Link>
  );
}
