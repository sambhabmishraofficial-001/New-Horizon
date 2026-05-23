"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CookieConsentInput } from "@/lib/cookie-consent";

type CategoryRowProps = {
  title: string;
  description: string;
  locked?: boolean;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

function CategoryRow({
  title,
  description,
  locked = false,
  checked,
  onCheckedChange,
}: CategoryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-white/50 bg-white/35 px-4 py-3.5 backdrop-blur-md">
      <div className="min-w-0">
        <p className="font-marketing text-[14px] font-medium text-ink-900">
          {title}
        </p>
        <p className="mt-1 font-marketing text-[13px] leading-[1.55] text-ink-600">
          {description}
        </p>
      </div>
      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={locked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
        />
        <span
          aria-hidden
          className="h-6 w-10 rounded-full bg-ink-900/15 transition peer-checked:bg-[#2563eb] peer-disabled:opacity-60 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink-900/20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-4"
        />
        <span className="sr-only">{locked ? "Always on" : "Toggle"}</span>
      </label>
    </div>
  );
}

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  initialFunctional,
  initialAnalytics,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFunctional: boolean;
  initialAnalytics: boolean;
  onSave: (input: CookieConsentInput) => void;
}) {
  const [functional, setFunctional] = React.useState(initialFunctional);
  const [analytics, setAnalytics] = React.useState(initialAnalytics);

  React.useEffect(() => {
    if (!open) return;
    setFunctional(initialFunctional);
    setAnalytics(initialAnalytics);
  }, [open, initialFunctional, initialAnalytics]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-5 border-white/40 bg-white/55 shadow-[0_24px_80px_rgba(17,17,16,0.12)] backdrop-blur-xl backdrop-saturate-150 sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-editorial text-[24px] tracking-tight text-ink-900">
            Cookie preferences
          </DialogTitle>
          <DialogDescription className="font-marketing text-[14px] leading-[1.65] text-ink-600">
            Choose which optional cookies and local storage we may use. Necessary
            items keep the site secure and signed-in sessions working.{" "}
            <Link
              href="/privacy/"
              className="text-[#1d4ed8] underline underline-offset-2"
            >
              Privacy policy
            </Link>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <CategoryRow
            title="Necessary"
            description="Required for sign-in, security, and remembering your consent choice."
            locked
            checked
          />
          <CategoryRow
            title="Functional"
            description="Remembers UI preferences such as theme and dismissed banners."
            checked={functional}
            onCheckedChange={setFunctional}
          />
          <CategoryRow
            title="Analytics"
            description="Helps us understand product usage. Not enabled in this preview build."
            checked={analytics}
            onCheckedChange={setAnalytics}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <button
            type="button"
            className="btn-xai btn-xai-secondary h-10"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-xai btn-xai-primary h-10"
            onClick={() => onSave({ functional, analytics })}
          >
            Save preferences
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
