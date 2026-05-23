"use client";

import { openCookiePreferences } from "@/lib/cookie-consent";

export function CookieSettingsButton({
  className = "text-[13px] text-ink-600 hover:text-ink-900",
}: {
  className?: string;
}) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Cookie settings
    </button>
  );
}
