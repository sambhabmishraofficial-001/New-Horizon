"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search, ChevronDown } from "lucide-react";
import { BRAND } from "@/lib/nav";
import { Kbd } from "@/components/ui/Primitives";
import { AvatarMenu } from "@/components/shell/AvatarMenu";
import { useSession } from "@/lib/store/auth";

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { user } = useSession();
  return (
    <header className="h-14 shrink-0 bg-parchment-50/90 backdrop-blur-md border-b border-ink-900/8 flex items-center px-5 gap-5 sticky top-0 z-40 font-marketing not-italic">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="h-7 min-w-8 px-1 grid place-items-center font-marketing text-[15px] font-light not-italic tracking-[0.02em] leading-none text-ink-900">
          {BRAND.logo}
        </div>
        <div className="font-marketing text-[15px] font-medium not-italic text-ink-900 leading-none">
          {BRAND.name}
        </div>
      </div>

      <div className="h-5 w-px bg-ink-900/10" />

      {/* Context */}
      <button className="inline-flex items-center gap-1.5 font-marketing text-[13px] not-italic text-ink-600 hover:text-ink-900">
        Helix Bio Group
        <span className="text-ink-300">/</span>
        <span className="font-marketing not-italic text-ink-700">K11 · Ribozyme</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
      </button>

      {/* Command bar */}
      <button
        onClick={onOpenCommand}
        className="flex-1 max-w-[520px] mx-auto h-9 px-3 rounded-lg bg-white hover:bg-white border border-ink-900/10 flex items-center gap-2.5 text-left font-marketing not-italic transition-colors"
        aria-label="Open command palette"
      >
        <Search className="h-3.5 w-3.5 text-ink-400" />
        <span className="font-marketing text-[13px] not-italic text-ink-400 truncate">
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
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-900/10 bg-white px-3 font-marketing text-[13px] font-medium not-italic text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
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
