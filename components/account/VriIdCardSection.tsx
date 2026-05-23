"use client";

import * as React from "react";
import { Check, Copy, IdCard } from "lucide-react";
import { motion } from "framer-motion";
import type { UserProfile } from "@/lib/store/auth";
import { updateProfile } from "@/lib/store/auth";
import { resolveCardholderName } from "@/lib/cardholderName";
import {
  getVriIdCredentials,
  verifyVriActivationCode,
} from "@/lib/vriId";
import { Button } from "@/components/ui/button";
import { VriIdCardFace } from "@/components/ui/vri-id-card-face";
import { VriIdCardDialog } from "@/components/ui/vri-id-card-dialog";

export function VriIdCardSection({ user }: { user: UserProfile }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const holder = resolveCardholderName(user);
  const holderInitials = (user.fullName || user.preferredName || user.email)
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  const credentials = getVriIdCredentials(user.id, holder);
  const isActivated = Boolean(user.vriIdActivatedAt);
  const memberId = user.vriId ?? credentials.memberId;

  const handleActivate = async (code: string) => {
    setError(null);
    await new Promise((r) => setTimeout(r, 600));
    if (!verifyVriActivationCode(user.id, code)) {
      setError("That activation code doesn’t match your VRI ID.");
      throw new Error("invalid");
    }
    updateProfile({
      vriId: credentials.memberId,
      vriIdActivatedAt: Date.now(),
    });
    setDialogOpen(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(credentials.activationCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-ink-900">
            <IdCard className="h-5 w-5 text-[#2563eb]" aria-hidden />
            <h2 className="font-editorial text-[22px] tracking-tight">
              VRI ID card
            </h2>
          </div>
          <p className="mt-2 max-w-[52ch] font-marketing text-[14px] font-light leading-relaxed text-ink-600">
            Your institute pass is unique to your account - member ID, portrait,
            and one-time activation on your institute VRI card.
          </p>
        </div>
        {isActivated ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-marketing text-[12px] text-emerald-800">
            <Check className="h-3.5 w-3.5" aria-hidden />
            Activated
          </span>
        ) : (
          <span className="inline-flex rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 font-marketing text-[12px] text-amber-900">
            Pending activation
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
        <motion.div layout className="w-[min(100%,20rem)]">
          <VriIdCardFace
            credentials={{ ...credentials, memberId }}
            className="h-44 w-full"
            brandLabel="New Horizon · VRI"
            inactive={!isActivated}
            userId={user.id}
            avatarUrl={user.avatarDataUrl}
            holderInitials={holderInitials}
          />
        </motion.div>

        <div className="min-w-0 flex-1 space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                Member ID
              </dt>
              <dd className="mt-1 font-mono text-[13px] text-ink-900">
                {memberId}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                Activation code
              </dt>
              <dd className="mt-1 flex items-center gap-2">
                <span className="font-mono text-[13px] tracking-[0.1em] text-ink-900">
                  {credentials.activationCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="rounded-lg border border-ink-900/10 p-1.5 text-ink-500 hover:bg-ink-50 hover:text-ink-900"
                  aria-label="Copy activation code"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </dd>
            </div>
          </dl>

          {error ? (
            <p className="font-marketing text-[13px] text-signal-rose" role="alert">
              {error}
            </p>
          ) : null}

          {!isActivated ? (
            <Button onClick={() => setDialogOpen(true)}>Activate VRI ID</Button>
          ) : (
            <p className="font-marketing text-[13px] font-light text-ink-600">
              Activated{" "}
              {user.vriIdActivatedAt
                ? new Date(user.vriIdActivatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "recently"}
              . Present this ID for institute verification and lab access.
            </p>
          )}
        </div>
      </div>

      <VriIdCardDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setError(null);
        }}
        onActivate={handleActivate}
        credentials={credentials}
        userId={user.id}
        avatarUrl={user.avatarDataUrl}
        holderInitials={holderInitials}
      />
    </section>
  );
}
