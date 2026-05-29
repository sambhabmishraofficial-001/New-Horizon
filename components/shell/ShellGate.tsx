"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { MarketingSmoothScroll } from "@/components/marketing/MarketingSmoothScroll";
import { MarketingRoutePrefetch } from "@/components/marketing/MarketingRoutePrefetch";
import { SelectionBinaryOverlay } from "@/components/marketing/SelectionBinaryOverlay";
import { CookieConsentRoot } from "@/components/consent/CookieConsentRoot";
import { KeyboardShortcutsHost } from "@/components/shell/KeyboardShortcutsDialog";
import { useStandaloneInstituteChrome } from "@/components/institute/institute-app-shell";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { Shell } from "./Shell";
import { useSession } from "@/lib/store/auth";

const PUBLIC_ROUTES = new Set([
  "/",
  "/products",
  "/labs",
  "/pricing",
  "/team",
  "/blog",
  "/playground",
  "/enrol",
  "/login",
  "/signup",
  "/forgot",
  "/privacy",
  "/terms",
  "/lattice",
]);

const PUBLIC_PREFIXES = ["/help", "/signup", "/login", "/forgot", "/blog"];

const INSTITUTE_EMBED_PATHS = new Set(["/ire", "/workspace"]);

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

function readEmbedBypass(pathname: string): boolean {
  if (typeof window === "undefined") return false;

  if (window.self !== window.top) {
    return INSTITUTE_EMBED_PATHS.has(normalizePath(pathname));
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") !== "1") return false;

  return INSTITUTE_EMBED_PATHS.has(normalizePath(pathname));
}

export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const standaloneChrome = useStandaloneInstituteChrome(pathname);
  const normalized = normalizePath(pathname);

  if (normalized === "/lattice") {
    return <>{children}</>;
  }

  if (isPublic(pathname)) {
    return (
      <>
        <MarketingSmoothScroll />
        <MarketingRoutePrefetch />
        <SelectionBinaryOverlay />
        {children}
        <CookieConsentRoot />
        <KeyboardShortcutsHost />
      </>
    );
  }

  return (
    <>
      <SessionGate pathname={pathname}>
        {standaloneChrome ? children : <Shell>{children}</Shell>}
      </SessionGate>
      <KeyboardShortcutsHost />
    </>
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
  const hydrated = useHydrated();
  const embedBypass = hydrated && readEmbedBypass(pathname);
  const { user, loading } = useSession();

  React.useEffect(() => {
    if (!hydrated || loading) return;
    if (embedBypass) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, embedBypass, loading, user, pathname, router]);

  if (embedBypass) {
    return <>{children}</>;
  }

  if (!hydrated || loading) {
    return null;
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
