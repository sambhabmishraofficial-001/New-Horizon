"use client";

import { useCallback, useEffect, useState } from "react";
import { hasCategoryConsent } from "@/lib/cookie-consent";
import { COOKIE_MAX_AGE, getCookie, setCookie } from "@/lib/cookies";

export const MARKETING_BANNER_DISMISSED_KEY = "nh-marketing-banner-dismissed";

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;

  const cookieValue = getCookie(MARKETING_BANNER_DISMISSED_KEY);
  if (cookieValue === "1") return true;

  try {
    const raw = window.localStorage.getItem(MARKETING_BANNER_DISMISSED_KEY);
    if (raw === "1" || raw === "true") return true;
    if (raw != null) return JSON.parse(raw) === true;
  } catch {
    /* ignore */
  }

  return false;
}

function writeDismissed(): void {
  if (typeof window === "undefined") return;
  if (!hasCategoryConsent("functional")) return;

  try {
    window.localStorage.setItem(
      MARKETING_BANNER_DISMISSED_KEY,
      JSON.stringify(true),
    );
  } catch {
    /* ignore */
  }

  setCookie(MARKETING_BANNER_DISMISSED_KEY, "1", {
    maxAge: COOKIE_MAX_AGE.preference,
    sameSite: "Lax",
  });
}

export function useMarketingBannerDismissed() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed());
    setReady(true);
  }, []);

  const dismiss = useCallback(() => {
    writeDismissed();
    setDismissed(true);
  }, []);

  return { dismissed, ready, dismiss };
}
