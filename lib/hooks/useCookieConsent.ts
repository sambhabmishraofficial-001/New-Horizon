"use client";

import { useCallback, useEffect, useState } from "react";
import {
  acceptAllCookies,
  type CookieConsent,
  type CookieConsentInput,
  readConsent,
  rejectNonEssentialCookies,
  subscribeConsent,
  subscribeOpenCookiePreferences,
  writeConsent,
} from "@/lib/cookie-consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
    return subscribeConsent(setConsent);
  }, []);

  useEffect(() => {
    return subscribeOpenCookiePreferences(() => setPreferencesOpen(true));
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(acceptAllCookies());
    setPreferencesOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    setConsent(rejectNonEssentialCookies());
    setPreferencesOpen(false);
  }, []);

  const savePreferences = useCallback((input: CookieConsentInput) => {
    setConsent(writeConsent(input));
    setPreferencesOpen(false);
  }, []);

  return {
    consent,
    ready,
    hasDecided: consent != null,
    preferencesOpen,
    setPreferencesOpen,
    acceptAll,
    rejectNonEssential,
    savePreferences,
  };
}
