"use client";

import * as React from "react";
import {
  useVriOnboardingDismissed,
  VRI_ONBOARDING_REPLAY_EVENT,
} from "@/lib/hooks/useVriOnboardingDismissed";
import { VriOnboardingDialog } from "./VriOnboardingDialog";

function isEmbeddedPreview(): boolean {
  if (typeof window === "undefined") return false;
  return window.self !== window.top;
}

/** Shows the welcome carousel the first time a user enters the institute shell. */
export function VriOnboardingGate() {
  const { dismissed, ready, dismiss, reset } = useVriOnboardingDismissed();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!ready) return;
    if (isEmbeddedPreview()) return;
    setOpen(!dismissed);
  }, [ready, dismissed]);

  React.useEffect(() => {
    const onReplay = () => {
      reset();
      setOpen(true);
    };
    window.addEventListener(VRI_ONBOARDING_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(VRI_ONBOARDING_REPLAY_EVENT, onReplay);
  }, [reset]);

  const handleComplete = React.useCallback(() => {
    dismiss();
  }, [dismiss]);

  return (
    <VriOnboardingDialog
      open={open}
      onOpenChange={setOpen}
      onComplete={handleComplete}
    />
  );
}
