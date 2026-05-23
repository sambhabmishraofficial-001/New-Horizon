"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SMOOTH_SCROLL_PATHS = new Set([
  "/",
  "/products",
  "/pricing",
  "/team",
  "/blog",
  "/enrol",
  "/login",
  "/signup",
  "/forgot",
]);

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function isSmoothScrollPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (SMOOTH_SCROLL_PATHS.has(path)) return true;
  return path.startsWith("/help") || path.startsWith("/blog");
}

export function MarketingSmoothScroll() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!isSmoothScrollPath(pathname)) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setNativeSmoothScroll = () => {
      document.documentElement.style.scrollBehavior = reducedMotionQuery.matches
        ? "auto"
        : "smooth";
    };

    const onAnchorClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      event.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({
        top,
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      });
    };

    setNativeSmoothScroll();
    reducedMotionQuery.addEventListener("change", setNativeSmoothScroll);
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      reducedMotionQuery.removeEventListener("change", setNativeSmoothScroll);
      document.documentElement.style.scrollBehavior = "";
    };
  }, [pathname]);

  return null;
}
