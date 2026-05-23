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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  markWindowsInviteRedeemed,
  triggerWindowsDownload,
  validateWindowsInviteCode,
} from "@/lib/windowsInvite";

type WindowsDownloadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M3 4.5 10.5 3.45v7.05H3V4.5zm0 8.25h7.5v7.05L3 18.75v-6zm9.75-8.7L21 2.7v8.85h-8.25V3.75zm0 10.05H21V21l-8.25-1.2v-6z" />
    </svg>
  );
}

export function WindowsDownloadDialog({
  open,
  onOpenChange,
}: WindowsDownloadDialogProps) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [verified, setVerified] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setCode("");
      setError(null);
      setVerified(false);
      setSubmitting(false);
    }
  }, [open]);

  function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    window.setTimeout(() => {
      if (!validateWindowsInviteCode(code)) {
        setError("That invite code isn't valid. Check your email or request access.");
        setSubmitting(false);
        return;
      }

      markWindowsInviteRedeemed(code);
      setVerified(true);
      setSubmitting(false);
      triggerWindowsDownload();
    }, 350);
  }

  function handleDownloadAgain() {
    triggerWindowsDownload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 sm:rounded-2xl">
        <div className="border-b border-ink-900/8 px-6 py-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-[#2563eb]">
              <WindowsIcon className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Invite only
              </span>
            </div>
            <DialogTitle className="font-marketing text-[22px] font-medium tracking-[-0.03em]">
              {verified ? "Download ready" : "Download for Windows"}
            </DialogTitle>
            <DialogDescription className="text-[14px] leading-relaxed">
              {verified
                ? "Your invite code was accepted. If the download didn't start, use the button below."
                : "Lattice for Windows is invite-only. Enter the code from your onboarding email to download the installer."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {verified ? (
            <div className="space-y-4">
              <Button
                type="button"
                className="btn-xai btn-xai-primary h-10 w-full"
                onClick={handleDownloadAgain}
              >
                <WindowsIcon className="mr-1 h-4 w-4" />
                Download Lattice for Windows
              </Button>
              <p className="text-center font-marketing text-[12px] text-ink-500">
                Need help?{" "}
                <a
                  href="mailto:contact@newhorizon.dev"
                  className="text-[#2563eb] hover:underline"
                >
                  Contact support
                </a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="windows-invite-code"
                  className="font-marketing text-[12px] font-medium text-ink-700"
                >
                  Invite code
                </label>
                <Input
                  id="windows-invite-code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder=""
                  autoComplete="off"
                  autoFocus
                  spellCheck={false}
                  className="h-11 font-mono text-[13px] uppercase tracking-[0.08em]"
                />
                {error ? (
                  <p className="font-marketing text-[12px] text-signal-rose" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={!code.trim() || submitting}
                className="btn-xai btn-xai-primary h-10 w-full disabled:opacity-45"
              >
                {submitting ? "Checking code…" : "Continue"}
              </Button>

              <p className="text-center font-marketing text-[12px] leading-relaxed text-ink-500">
                Don&apos;t have a code?{" "}
                <Link
                  href="/enrol"
                  className="text-[#2563eb] hover:underline"
                  onClick={() => onOpenChange(false)}
                >
                  Request access
                </Link>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
