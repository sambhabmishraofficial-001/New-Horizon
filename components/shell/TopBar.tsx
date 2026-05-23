"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { Kbd } from "@/components/ui/Primitives";
import { AvatarMenu } from "@/components/shell/AvatarMenu";
import { useSession } from "@/lib/store/auth";

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { user } = useSession();
  return (
    <header className="h-14 shrink-0 bg-[var(--ire-bg)]/95 backdrop-blur-md border-b border-[var(--ire-border)] flex items-center px-5 gap-3 sticky top-0 z-40 font-marketing not-italic">
      {/* Context */}
      <button className="inline-flex items-center gap-1.5 font-marketing text-[13px] not-italic text-ink-600 hover:text-ink-900">
        Helix Bio Group
        <span className="text-ink-300">/</span>
        <span className="font-marketing not-italic text-ink-700">K11 · Ribozyme</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
      </button>

      {/* Spotlight search trigger */}
      <button
        onClick={onOpenCommand}
        className="group mx-auto flex h-10 w-full max-w-[560px] flex-1 items-center gap-3 rounded-full border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] px-4 text-left font-marketing not-italic shadow-[0_1px_0_rgba(17,17,16,0.03),0_8px_24px_-16px_rgba(17,17,16,0.18)] transition-[border-color,box-shadow,transform] hover:border-[var(--ire-border-strong)] hover:shadow-[0_10px_30px_-18px_rgba(17,17,16,0.22)] active:scale-[0.995]"
        aria-label="Open institute spotlight search"
      >
        <Search className="h-4 w-4 text-ink-400 transition-colors group-hover:text-ink-600" />
        <span className="truncate text-[14px] text-ink-400 transition-colors group-hover:text-ink-500">
          Search the institute
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </button>

      {/* Right */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--ire-border)] bg-[var(--ire-surface-elevated)] px-3 font-marketing text-[13px] font-medium not-italic text-ink-600 transition-colors hover:bg-[var(--ire-surface)] hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <Link
          href="/help"
          className="font-marketing text-[13px] not-italic text-ink-600 hover:text-ink-900"
        >
          Docs
        </Link>
        <div className="h-5 w-px bg-ink-900/10" />
        {user ? (
          <AvatarMenu />
        ) : (
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-ink-900 px-4 text-[13px] font-medium not-italic text-parchment-50 transition-colors hover:bg-ink-800"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
