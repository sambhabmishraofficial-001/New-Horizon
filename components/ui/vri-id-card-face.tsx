"use client";

import { cn } from "@/lib/cn";
import type { VriIdCredentials } from "@/lib/vriId";
import { CartoonPortrait } from "@/components/ui/cartoon-portrait";
import { useVriCardTilt } from "@/components/ui/use-vri-card-tilt";
import "./vri-id-cosmic.css";

export type VriIdCardFaceProps = {
  credentials: VriIdCredentials;
  className?: string;
  brandLabel?: string;
  inactive?: boolean;
  userId: string;
  avatarUrl?: string | null;
  holderInitials?: string;
  /** 3D tilt + nebula drift when true (front card in stack). */
  interactive?: boolean;
};

export function VriIdCardFace({
  credentials,
  className,
  brandLabel = "VRI ID",
  inactive = false,
  userId,
  avatarUrl,
  holderInitials = "?",
  interactive = true,
}: VriIdCardFaceProps) {
  const { cardRef, time } = useVriCardTilt(interactive);

  const nebulaStyle = {
    background: `
      radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 28}% ${50 + Math.cos(time * 0.7) * 28}%, rgba(37, 99, 235, 0.55) 0%, transparent 70%),
      radial-gradient(circle at ${50 + Math.cos(time * 0.3) * 36}% ${50 + Math.sin(time * 0.4) * 36}%, rgba(96, 165, 250, 0.35) 0%, transparent 60%),
      radial-gradient(circle at ${50 + Math.sin(time * 0.6) * 32}% ${50 + Math.cos(time * 0.5) * 32}%, rgba(147, 197, 253, 0.25) 0%, transparent 55%)
    `,
  };

  const auroraStyle = {
    background: `
      radial-gradient(ellipse at ${80 + Math.sin(time * 0.4) * 18}% ${20 + Math.cos(time * 0.3) * 18}%, rgba(37, 99, 235, 0.55) 0%, transparent 50%),
      radial-gradient(ellipse at ${20 + Math.cos(time * 0.5) * 18}% ${70 + Math.sin(time * 0.6) * 18}%, rgba(59, 130, 246, 0.45) 0%, transparent 60%)
    `,
  };

  return (
    <div className={cn("vri-id-cosmic-perspective", className)}>
      <div ref={cardRef} className="vri-id-cosmic-tilt">
        <div
          className={cn(
            "vri-id-card-cosmic relative flex h-full min-h-[13.5rem] flex-col justify-between p-5 sm:p-6",
            inactive && "vri-id-card-cosmic--inactive",
          )}
        >
          <div
            className="vri-id-card-cosmic__nebula"
            style={nebulaStyle}
            aria-hidden
          />
          <div
            className="vri-id-card-cosmic__aurora"
            style={auroraStyle}
            aria-hidden
          />
          <div className="vri-id-card-cosmic__holo" aria-hidden />
          <div className="vri-id-card-cosmic__stars-sm" aria-hidden />
          <div className="vri-id-card-cosmic__stars-md" aria-hidden />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div
              className="vri-id-card-cosmic__chip h-8 w-11 shrink-0 rounded-[5px] sm:h-9 sm:w-12"
              aria-hidden
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-sky-100/75 sm:text-[10px]">
              {brandLabel}
            </p>
          </div>

          <div className="relative z-10 mt-4 flex flex-1 items-stretch gap-4 pt-1">
            <div className="flex min-w-0 flex-1 flex-col justify-end space-y-2">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-sky-200/60">
                  Researcher
                </p>
                <p className="truncate font-editorial text-[15px] leading-tight tracking-[-0.02em] text-white sm:text-[16px]">
                  {credentials.holderLabel}
                </p>
              </div>
              <p className="font-mono text-sm font-medium tracking-[0.2em] text-white/95 sm:text-base">
                {credentials.cardDisplay}
              </p>
              <div className="flex items-end justify-between gap-2 text-[9px] uppercase tracking-[0.12em] text-sky-100/70 sm:text-[10px]">
                <span className="truncate font-mono text-[9px] tracking-[0.14em]">
                  {credentials.memberId}
                </span>
                <span className="shrink-0 font-mono">{credentials.validThru}</span>
              </div>
            </div>

            <div className="shrink-0">
              <div className="vri-id-card-cosmic__portrait relative h-[5.5rem] w-[4.25rem] sm:h-24 sm:w-[4.75rem]">
                <CartoonPortrait
                  userId={userId}
                  photoUrl={avatarUrl}
                  holderInitials={holderInitials}
                  alt={`${credentials.holderLabel} caricature portrait`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
