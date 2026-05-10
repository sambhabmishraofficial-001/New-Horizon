"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Shell } from "./Shell";
import { useSession } from "@/lib/store/auth";

const PUBLIC_ROUTES = new Set([
  "/",
  "/products",
  "/pricing",
  "/enrol",
  "/login",
  "/signup",
  "/forgot",
]);

const PUBLIC_PREFIXES = ["/help", "/signup", "/login", "/forgot"];

function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function isPublic(path: string): boolean {
  const normalized = normalizePath(path);
  if (PUBLIC_ROUTES.has(normalized)) return true;
  return PUBLIC_PREFIXES.some(
    (p) => normalized === p || normalized.startsWith(`${p}/`)
  );
}

/** Full-viewport surfaces that ship their own chrome — avoid Shell + StartAnimation (z‑stack clashes, wrong heights when minimized). */
function isStandaloneWorkspacePath(path: string): boolean {
  const n = normalizePath(path);
  return n === "/ire" || n === "/workspace";
}

export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  if (isPublic(pathname)) {
    return <>{children}</>;
  }

  return (
    <SessionGate pathname={pathname}>
      {isStandaloneWorkspacePath(pathname) ? children : <Shell>{children}</Shell>}
    </SessionGate>
  );
}

function SessionGate({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useSession();

  /** Must not rely on state + effects — otherwise we redirect before bypass flips (broken product iframe). */
  const embeddedPreview =
    typeof window !== "undefined" && window.self !== window.top;

  React.useEffect(() => {
    if (loading) return;
    if (embeddedPreview) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, embeddedPreview, user, pathname, router]);

  if (loading) {
    return <div className="min-h-screen bg-parchment-50" />;
  }

  if (embeddedPreview || user) {
    return <>{children}</>;
  }

  return <div className="min-h-screen bg-parchment-50" />;
}
