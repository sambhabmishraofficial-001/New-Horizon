"use client";

import { useCallback, useEffect, useState } from "react";

export const VRI_ONBOARDING_DISMISSED_KEY = "nh_vri_onboarding_v1";

export const VRI_ONBOARDING_REPLAY_EVENT = "vri-onboarding-replay";

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(VRI_ONBOARDING_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeVriOnboardingDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VRI_ONBOARDING_DISMISSED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearVriOnboardingDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(VRI_ONBOARDING_DISMISSED_KEY);
  } catch {
    /* ignore */
  }
}

export function replayVriOnboarding(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VRI_ONBOARDING_REPLAY_EVENT));
}

export function useVriOnboardingDismissed() {
  const [dismissed, setDismissed] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDismissed(readDismissed());
    setReady(true);
  }, []);

  const dismiss = useCallback(() => {
    writeVriOnboardingDismissed();
    setDismissed(true);
  }, []);

  const reset = useCallback(() => {
    clearVriOnboardingDismissed();
    setDismissed(false);
  }, []);

  return { dismissed, ready, dismiss, reset };
}
