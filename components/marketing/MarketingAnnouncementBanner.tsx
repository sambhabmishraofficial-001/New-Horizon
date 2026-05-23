"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/cn";

export function MarketingAnnouncementBanner({
  className,
  onDismiss,
}: {
  className?: string;
  onDismiss: () => void;
}) {
  return (
    <div
      data-marketing-banner
      className={cn(
        "flex w-full items-stretch border-b border-[#1d4ed8] bg-[#2563eb]",
        className
      )}
    >
      <Link
        href="/products"
        className="group flex min-w-0 flex-1 items-center justify-center gap-x-1.5 px-4 py-2.5 text-center transition-colors hover:bg-[#1d4ed8] sm:gap-x-2"
      >
        <span className="!font-light font-marketing text-[12px] leading-[1.6] text-white/95 sm:text-[13px]">
          Announcing the first AI-native Virtual Research Institute
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 !font-light font-marketing text-[12px] leading-[1.6] text-white sm:text-[13px]">
          <span className="underline underline-offset-2">Read more</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="flex shrink-0 items-center justify-center border-l border-white/20 px-3.5 text-white/90 transition-colors hover:bg-[#1d4ed8] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50 sm:px-4"
      >
        <X className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
