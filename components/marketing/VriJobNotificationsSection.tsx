"use client";

import { cn } from "@/lib/cn";
import { GmailInboxPreview } from "@/components/marketing/GmailInboxPreview";
import { NotificationCenter } from "@/components/ui/notification-center";

export function VriJobNotificationsSection({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "bg-parchment-50/35",
        className,
      )}
      aria-label="Job completion notifications"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-6 pb-20 pt-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-x-12 lg:gap-y-10 lg:pb-24 lg:pt-14">
        <div className="order-1 lg:col-start-1 lg:row-start-1 lg:max-w-[52ch]">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Stay in the loop
          </span>
          <h2 className="mt-3 font-editorial text-[40px] leading-[1.05] tracking-tight text-ink-900 sm:text-[48px]">
            When a run finishes, you hear about it.
          </h2>
        </div>

        <div className="order-3 lg:col-start-1 lg:row-start-2 lg:max-w-[52ch]">
          <p className="font-marketing text-[15px] font-light leading-[1.75] text-ink-600 sm:text-[16px]">
            Twins close the loop on every experiment, audit, and manuscript
            draft. New Horizon sends a real-time push summary and a full email
            report - invariants checked, artifacts linked, and the next move on
            your critical path.
          </p>
          <ul className="mt-8 space-y-3 font-marketing text-[14px] leading-[1.65] text-ink-600">
            <li className="flex gap-2">
              <span className="font-mono text-[#2563eb]">01</span>
              Run completes in any virtual lab
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-[#2563eb]">02</span>
              Push alert lands on your device instantly
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-[#2563eb]">03</span>
              Email digest with evidence, twins, and next steps
            </li>
          </ul>
        </div>

        <div className="order-2 mx-auto w-full max-w-[400px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:justify-self-end">
          <NotificationCenter
            showCaption
            cardTitle="Run complete alerts"
            cardDescription="Push and email the moment a twin finishes - with invariant status, artifact links, and suggested next steps."
            notificationTitle="New Horizon"
            notificationDescription="Run complete - EXP-S041 · 412/418 invariants holding."
            notificationTime="now"
            className="border-0 bg-transparent p-0"
          />

          <GmailInboxPreview className="mt-6" />
        </div>
      </div>
    </section>
  );
}
