"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { prefetchIreDemoPreview } from "@/lib/ire-demo-preview";

const MARKETING_ROUTES = [
  "/",
  "/products",
  "/playground",
  "/team",
  "/blog",
  "/pricing",
  "/login",
  "/enrol",
];

/** Prefetch marketing routes during idle time so page changes feel instant. */
export function MarketingRoutePrefetch() {
  const router = useRouter();

  useEffect(() => {
    const run = () => {
      for (const href of MARKETING_ROUTES) {
        router.prefetch(href);
      }
      prefetchIreDemoPreview();
    };

    let idleId: number | undefined;
    let timerId: number | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      timerId = window.setTimeout(run, 300);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [router]);

  return null;
}
