"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { Shell } from "./Shell";

const marketingRoutes = new Set(["/", "/products", "/pricing", "/enrol"]);
const WORKSPACE_PASSWORD = "098765";

export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (marketingRoutes.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <WorkspacePasswordGate>
      <Shell>{children}</Shell>
    </WorkspacePasswordGate>
  );
}

function WorkspacePasswordGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const embeddedPreview = window.self !== window.top;

    if (embeddedPreview) {
      setUnlocked(true);
      setReady(true);
      return;
    }

    setReady(true);
  }, []);

  function submitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() !== WORKSPACE_PASSWORD) {
      setError("Incorrect password. Please try again.");
      return;
    }

    setUnlocked(true);
    setError("");
  }

  if (!ready) {
    return <div className="min-h-screen bg-parchment-50" />;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-parchment-50 px-6 font-marketing not-italic text-ink-900">
      <div className="w-full max-w-[420px] rounded-2xl border border-ink-900/10 bg-white p-8 shadow-[0_28px_80px_-44px_rgba(17,17,16,0.45)]">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-bone-50">
          <LockKeyhole className="h-4 w-4 text-ink-700" />
        </div>
        <div className="mt-7">
          <div className="font-marketing text-[11px] font-medium uppercase not-italic tracking-[0.18em] text-ink-400">
            Protected workspace
          </div>
          <h1 className="mt-3 font-marketing text-[32px] font-medium leading-tight not-italic text-ink-900">
            Enter password to open the live institute.
          </h1>
          <p className="mt-3 font-marketing text-[14px] leading-6 not-italic text-ink-600">
            This workspace is private. Use the access password to continue.
          </p>
        </div>

        <form onSubmit={submitPassword} className="mt-7 space-y-3">
          <label className="block">
            <span className="font-marketing text-[12px] font-medium not-italic text-ink-600">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              autoFocus
              className="mt-2 h-11 w-full rounded-xl border border-ink-900/15 bg-white px-4 font-marketing text-[14px] not-italic text-ink-900 outline-none transition focus:border-ink-900/45"
              placeholder="Enter workspace password"
            />
          </label>
          {error && (
            <div className="font-marketing text-[12.5px] not-italic text-rose-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn-soft inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800"
          >
            Open workspace <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 font-marketing text-[13px] font-medium not-italic text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>
    </main>
  );
}
