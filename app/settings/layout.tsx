"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Keyboard,
  Sparkles,
  Plug,
  CreditCard,
  Shield,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: typeof SettingsIcon;
  description: string;
};

const ITEMS: Item[] = [
  { href: "/settings/general", label: "General", icon: SettingsIcon, description: "Display name, language, timezone." },
  { href: "/settings/appearance", label: "Appearance", icon: Palette, description: "Theme, font size, density, motion." },
  { href: "/settings/notifications", label: "Notifications", icon: Bell, description: "Email and in-app alerts." },
  { href: "/settings/keyboard", label: "Keyboard", icon: Keyboard, description: "Layout and shortcut overrides." },
  { href: "/settings/agents", label: "Agents", icon: Sparkles, description: "Default autonomy and approvals." },
  { href: "/settings/integrations", label: "Integrations", icon: Plug, description: "Connect external services." },
  { href: "/settings/billing", label: "Billing", icon: CreditCard, description: "Plan, usage, invoices." },
  { href: "/settings/security", label: "Security", icon: Shield, description: "Password, sessions, API tokens." },
  { href: "/settings/labs", label: "Labs", icon: FlaskConical, description: "Early-access feature flags." },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return (
    <div className="font-marketing not-italic text-ink-900 bg-parchment-50">
      <div className="mx-auto max-w-[1100px] px-6 py-12 sm:px-10">
        <div className="border-b border-ink-900/8 pb-7">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Settings
          </div>
          <h1 className="mt-1.5 font-editorial text-[36px] leading-[1.05] text-ink-900">
            Preferences
          </h1>
          <div className="mt-2 text-[13.5px] text-ink-500">
            Tune the institute to your hand. Changes save instantly to this browser.
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
          <nav className="space-y-1" role="tablist" aria-label="Settings sections">
            {ITEMS.map((it) => {
              const active = pathname === it.href || pathname.startsWith(it.href + "/");
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "flex items-center gap-2 h-9 px-3 rounded-md text-[13px] transition-colors",
                    active
                      ? "bg-ink-900/5 text-ink-900 font-medium"
                      : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {it.label}
                </Link>
              );
            })}
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
