"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getVriIdCredentials } from "@/lib/vriId";
import { DEMO_RESEARCHERS } from "@/lib/vriIdDemo";
import { Button } from "@/components/ui/button";
import { VriIdCardDialog } from "@/components/ui/vri-id-card-dialog";
import { VriIdCardStack } from "@/components/marketing/vri/VriIdCardStack";

export function VriIdCardDemo({ className }: { className?: string }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [demoActivated, setDemoActivated] = React.useState(false);

  const amy = DEMO_RESEARCHERS[0];
  const credentials = React.useMemo(
    () => getVriIdCredentials(amy.userId, amy.name),
    [amy.name, amy.userId],
  );

  const handleDemoActivate = async (code: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const normalized = code.trim().replace(/\s+/g, "").toUpperCase();
    if (normalized !== credentials.activationCode) {
      throw new Error("invalid");
    }
    setDemoActivated(true);
    setDialogOpen(false);
  };

  return (
    <section className={className} aria-label="VRI ID card demo">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-16">
          <div className="max-w-[52ch]">
            <span className="inline-flex rounded-full border border-[#2563eb]/20 bg-[#2563eb]/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#1d4ed8]">
              Institute ID
            </span>
            <h2 className="mt-4 font-editorial text-[36px] leading-[1.05] tracking-tight text-ink-900 sm:text-[44px]">
              Your VRI ID, issued once per researcher.
            </h2>
            <p className="mt-5 font-marketing text-[15px] font-light leading-[1.75] text-ink-600 sm:text-[16px]">
              When you join New Horizon, you receive a personal institute pass
              linked to your profile - a unique member number and a one-time
              activation step before your card is enabled for lab and institute
              access.
            </p>
            <p className="mt-4 font-marketing text-[15px] font-light leading-[1.75] text-ink-600 sm:text-[16px]">
              Each researcher gets their own pass. Use Amy&apos;s sample details
              below to walk through activation, or sign up to receive yours.
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-ink-900/8 bg-ink-50/50 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  Sample member ID
                </dt>
                <dd className="mt-1 font-mono text-[12px] text-ink-900">
                  {credentials.memberId}
                </dd>
              </div>
              <div className="rounded-xl border border-ink-900/8 bg-ink-50/50 px-4 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
                  Sample activation code
                </dt>
                <dd className="mt-1 font-mono text-[12px] tracking-[0.08em] text-ink-900">
                  {credentials.activationCode}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="btn-xai btn-xai-primary h-10"
              >
                Preview activation
              </Button>
              <Link href="/signup" className="btn-xai btn-xai-secondary h-10">
                Get your own ID <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {demoActivated ? (
              <p className="mt-4 font-marketing text-[13px] text-emerald-700">
                Activation complete. After signup, your personal VRI ID will be
                issued to your account.
              </p>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-[380px] pb-10 lg:mx-0 lg:justify-self-end">
            <VriIdCardStack />
          </div>
        </div>
      </div>

      <VriIdCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onActivate={handleDemoActivate}
        credentials={credentials}
        userId={amy.userId}
        holderInitials={amy.initials}
      />
    </section>
  );
}
