"use client";

import Link from "next/link";
import { CookiePreferencesDialog } from "@/components/consent/CookiePreferencesDialog";
import { useCookieConsent } from "@/lib/hooks/useCookieConsent";

export function CookieConsentRoot() {
  const {
    consent,
    ready,
    hasDecided,
    preferencesOpen,
    setPreferencesOpen,
    acceptAll,
    rejectNonEssential,
    savePreferences,
  } = useCookieConsent();

  if (!ready || hasDecided) {
    return (
      <CookiePreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        initialFunctional={consent?.functional ?? false}
        initialAnalytics={consent?.analytics ?? false}
        onSave={savePreferences}
      />
    );
  }

  return (
    <>
      <div
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-desc"
        className="fixed inset-x-0 bottom-0 z-[150] border-t border-white/40 bg-white/45 px-4 py-4 shadow-[0_-12px_40px_rgba(17,17,16,0.05)] backdrop-blur-xl backdrop-saturate-150 sm:px-6"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[62ch]">
            <p
              id="cookie-consent-title"
              className="font-marketing text-[14px] font-medium text-ink-900"
            >
              We use cookies
            </p>
            <p
              id="cookie-consent-desc"
              className="mt-1 font-marketing text-[13px] leading-[1.65] text-ink-600"
            >
              New Horizon uses necessary cookies for sign-in and security, and
              optional cookies for preferences and analytics. You can accept all,
              reject non-essential cookies, or manage your choices.{" "}
              <Link
                href="/privacy/"
                className="text-[#1d4ed8] underline underline-offset-2"
              >
                Learn more
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <button
              type="button"
              className="btn-xai btn-xai-secondary h-10"
              onClick={() => setPreferencesOpen(true)}
            >
              Manage
            </button>
            <button
              type="button"
              className="btn-xai btn-xai-secondary h-10"
              onClick={rejectNonEssential}
            >
              Reject non-essential
            </button>
            <button
              type="button"
              className="btn-xai btn-xai-primary h-10"
              onClick={acceptAll}
            >
              Accept all
            </button>
          </div>
        </div>
      </div>

      <CookiePreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        initialFunctional={consent?.functional ?? false}
        initialAnalytics={consent?.analytics ?? false}
        onSave={savePreferences}
      />
    </>
  );
}
