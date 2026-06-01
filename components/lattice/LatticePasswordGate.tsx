"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  checkLatticePassword,
  isLatticeUnlocked,
  unlockLattice,
} from "@/lib/latticeAccess";
import { sitePath } from "@/lib/sitePath";

export function LatticePasswordGate({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setUnlocked(isLatticeUnlocked());
    setReady(true);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (checkLatticePassword(password)) {
      unlockLattice();
      setUnlocked(true);
      setError("");
      return;
    }
    setError("Incorrect password.");
  }

  if (!ready) {
    return (
      <div
        className="flex items-center justify-center bg-[#171717] text-[#94a3b8]"
        style={{ minHeight: compact ? "100%" : "100dvh" }}
      />
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative flex items-center justify-center bg-[#171717] px-6"
      style={{ minHeight: compact ? "100%" : "100dvh" }}
    >
      {!compact ? (
        <Link
          href={sitePath("/products/")}
          className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-[#94a3b8] transition-colors hover:bg-white/5 hover:text-white sm:left-6 sm:top-6"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back
        </Link>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className={`w-full rounded-md border border-white/10 bg-[#1c1c1c] shadow-[0_24px_64px_rgba(0,0,0,0.35)] ${
          compact ? "max-w-sm p-6" : "max-w-md p-8"
        }`}
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-[#262626] font-semibold text-white">
            L
          </div>
          <h1 className="text-lg font-medium text-white">Lattice Studio</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">Enter the access password to continue.</p>
        </div>

        <label className="block text-xs uppercase tracking-[0.14em] text-[#787878]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) setError("");
            }}
            autoComplete="current-password"
            autoFocus
            className="mt-2 w-full rounded-sm border border-white/10 bg-[#171717] px-3 py-2.5 text-sm text-white outline-none ring-0 placeholder:text-[#4a4a4a] focus:border-white/25"
            placeholder="•••••••"
          />
        </label>

        {error ? <p className="mt-3 text-sm text-[#f87171]">{error}</p> : null}

        <button
          type="submit"
          className="mt-5 w-full rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-[#171717] hover:bg-[#e5e5e5]"
        >
          Open Lattice
        </button>
      </form>
    </div>
  );
}
