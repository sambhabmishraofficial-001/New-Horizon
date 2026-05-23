"use client";

import * as React from "react";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { GmailIcon } from "@/components/ui/brand-app-icons";

type InboxEmail = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
};

const INBOX_EMAILS: InboxEmail[] = [
  {
    id: 1,
    from: "New Horizon",
    subject: "Run complete - EXP-S041",
    preview: "Ribosome profiling · Lab 07 - artifacts linked, critical path updated.",
    time: "2:41 PM",
    unread: true,
  },
  {
    id: 2,
    from: "New Horizon",
    subject: "Invariant audit - Program K11",
    preview: "412 of 418 holding. One candidate violation flagged for your review.",
    time: "12:29 PM",
    unread: true,
  },
  {
    id: 3,
    from: "New Horizon",
    subject: "Twin summary · manuscript §3",
    preview: "Literature synthesist closed the loop on §3 with cited evidence.",
    time: "10:41 AM",
    unread: false,
  },
];

function InboxCheckbox({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] w-[18px] shrink-0 rounded border border-neutral-300 bg-white",
        className,
      )}
      aria-hidden
    />
  );
}

function EmailRow({ email }: { email: InboxEmail }) {
  return (
    <article
      className={cn(
        "group grid grid-cols-[auto_auto_1fr_auto] items-start gap-x-3 gap-y-0.5 border-b border-neutral-100 px-3 py-3 transition-colors last:border-b-0 hover:bg-[#f2f6fc] sm:grid-cols-[auto_auto_minmax(0,140px)_1fr_auto] sm:items-center sm:gap-x-4 sm:px-4 sm:py-2.5",
        email.unread && "bg-[#f2f6fc]/80",
      )}
    >
      <InboxCheckbox />
      <button
        type="button"
        aria-label="Star email"
        className="mt-0.5 text-neutral-300 transition-colors hover:text-[#f4b400] sm:mt-0"
      >
        <Star className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <p
        className={cn(
          "truncate font-['Roboto',system-ui,sans-serif] text-[13px] text-neutral-900 sm:col-start-3",
          email.unread ? "font-semibold" : "font-normal text-neutral-700",
        )}
      >
        {email.from}
      </p>

      <div className="col-span-2 min-w-0 sm:col-span-1 sm:col-start-4">
        <p className="truncate font-['Roboto',system-ui,sans-serif] text-[13px] leading-snug text-neutral-800">
          <span className={cn(email.unread && "font-semibold text-neutral-900")}>
            {email.subject}
          </span>
          <span className="hidden font-normal text-neutral-500 sm:inline">
            {" "}
            - {email.preview}
          </span>
        </p>
        <p className="mt-0.5 truncate font-['Roboto',system-ui,sans-serif] text-[12px] text-neutral-500 sm:hidden">
          {email.preview}
        </p>
      </div>

      <time
        className={cn(
          "shrink-0 self-start font-['Roboto',system-ui,sans-serif] text-[12px] sm:col-start-5 sm:self-center",
          email.unread ? "font-semibold text-neutral-900" : "text-neutral-500",
        )}
      >
        {email.time}
      </time>
    </article>
  );
}

export function GmailInboxPreview({ className }: { className?: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const visibleEmails = expanded ? INBOX_EMAILS : INBOX_EMAILS.slice(0, 1);
  const hiddenCount = INBOX_EMAILS.length - 1;

  return (
    <div
      className={cn(
        "w-full max-w-[400px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(17,17,16,0.08)]",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-neutral-200 bg-white px-4 py-3">
        <GmailIcon className="h-7 w-7 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-['Roboto',system-ui,sans-serif] text-[15px] font-medium text-neutral-800">
            Inbox
          </p>
          <p className="font-['Roboto',system-ui,sans-serif] text-[12px] text-neutral-500">
            contact@newhorizon.dev
          </p>
        </div>
        <span className="rounded-full bg-[#d3e3fd] px-2 py-0.5 font-['Roboto',system-ui,sans-serif] text-[11px] font-medium text-[#041e49]">
          {INBOX_EMAILS.filter((e) => e.unread).length} new
        </span>
      </div>

      <div className="flex items-center gap-4 border-b border-neutral-100 bg-[#fafafa] px-4 py-2">
        <span className="border-b-2 border-[#0b57d0] pb-1 font-['Roboto',system-ui,sans-serif] text-[13px] font-medium text-[#0b57d0]">
          Primary
        </span>
        <span className="font-['Roboto',system-ui,sans-serif] text-[13px] text-neutral-500">
          Updates
        </span>
      </div>

      <div role="list" aria-label="Inbox messages">
        {visibleEmails.map((email) => (
          <EmailRow key={email.id} email={email} />
        ))}
      </div>

      {hiddenCount > 0 ? (
        <div className="border-t border-neutral-100 bg-white px-4 py-2.5">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 font-['Roboto',system-ui,sans-serif] text-[13px] font-medium text-[#0b57d0] transition hover:text-[#0842a0]"
          >
            {expanded ? "Show less" : `${hiddenCount} more in Primary`}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                expanded && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
