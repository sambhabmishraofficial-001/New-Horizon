"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import { GmailIcon, PHONE_APPS } from "@/components/ui/brand-app-icons";

export type NotificationCenterProps = {
  cardTitle?: string;
  cardDescription?: string;
  notificationTitle?: string;
  notificationDescription?: string;
  notificationTime?: string;
  emailSubject?: string;
  emailPreview?: string;
  className?: string;
  showCaption?: boolean;
};

function IconWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-300 to-neutral-200">
      {children}
    </div>
  );
}

function LockIcon({ fill = "#545454" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
      <g fill={fill}>
        <path d="M3 8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
        <path d="M8 3a2.5 2.5 0 0 0-2.5 2.5V9h-1V5.5a3.5 3.5 0 1 1 7 0V9h-1V5.5A2.5 2.5 0 0 0 8 3Z" />
      </g>
    </svg>
  );
}

export function NotificationCenter({
  cardTitle = "Run complete alerts",
  cardDescription = "Push and email the moment a twin finishes - with invariant status, artifact links, and suggested next steps.",
  notificationTitle = "Gmail",
  notificationDescription = "Run complete - EXP-S041. 412/418 invariants holding.",
  notificationTime = "now",
  emailSubject,
  emailPreview,
  className,
  showCaption = true,
}: NotificationCenterProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [timeLabel, setTimeLabel] = React.useState("9:41");

  React.useEffect(() => {
    setTimeLabel(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  }, []);

  const displayDescription =
    notificationDescription ||
    [emailSubject, emailPreview].filter(Boolean).join(" - ");

  const phoneVariant: Variants = {
    open: {
      transform: "translateY(-36px)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    close: {
      transform: "translateY(0px)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };

  const notificationVariant: Variants = {
    open: {
      transform: "translateY(48px) scale(1)",
      filter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeInOut", delay: 0.1 },
    },
    close: {
      transform: "translateY(-72px) scale(0.75)",
      filter: "blur(10px)",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const lockVariant: Variants = {
    open: {
      backgroundColor: "#2563eb",
      transition: { duration: 0.1, ease: "easeInOut" },
    },
    close: {
      backgroundColor: "#262626",
      transition: { duration: 0.1, ease: "easeInOut" },
    },
  };

  const lockLightVariant: Variants = {
    open: {
      backgroundColor: "#2563eb",
      transition: { duration: 0.1, ease: "easeInOut" },
    },
    close: {
      backgroundColor: "#a3a3a3",
      transition: { duration: 0.1, ease: "easeInOut" },
    },
  };

  const parentVariant: Variants = {
    open: {
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
    close: {
      transition: { staggerChildren: 0.075, delayChildren: 0.15 },
    },
  };

  const row1 = PHONE_APPS.slice(0, 4);
  const row2 = PHONE_APPS.slice(4, 8);

  return (
    <motion.div
      onClick={() => setIsHovered((prev) => !prev)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="close"
      animate={isHovered ? "open" : "close"}
      variants={parentVariant}
      className={cn(
        "relative flex w-full max-w-[350px] items-center justify-center",
        showCaption ? "rounded-lg border border-ink-900/5 bg-neutral-100 p-6" : "p-0",
        className,
      )}
    >
      <motion.div
        variants={phoneVariant}
        className="relative mx-auto h-[270px] w-[264px] rounded-[44px] bg-neutral-300 p-1.5 shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
      >
        <div className="relative h-[258px] overflow-hidden rounded-[38px] bg-neutral-200">
          <div
            className="absolute left-8 top-3.5 font-mono text-[9px] text-neutral-500"
            suppressHydrationWarning
          >
            {timeLabel}
          </div>

          <motion.div
            variants={lockVariant}
            className="absolute left-[112px] top-2 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <LockIcon />
          </motion.div>

          <motion.div
            variants={notificationVariant}
            className="absolute left-3.5 z-10 h-12 w-[90%] overflow-hidden rounded-md bg-neutral-300 shadow-lg"
          >
            <div className="flex h-full items-center gap-3 px-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-200 shadow-lg">
                <GmailIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-neutral-900">
                    {notificationTitle}
                  </p>
                  <span className="shrink-0 pr-2 text-[9px] text-neutral-500">
                    {notificationTime}
                  </span>
                </div>
                <p className="w-[95%] truncate text-start text-[10px] text-neutral-600">
                  {displayDescription}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="absolute top-10 flex h-full w-full flex-col items-center gap-3 px-4 pt-4">
            <div className="flex w-full items-center justify-between gap-3">
              {row1.map((app) => (
                <IconWrapper key={app.id}>
                  <app.Icon className="h-6 w-6" />
                </IconWrapper>
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              {row2.map((app) => (
                <IconWrapper key={app.id}>
                  <app.Icon className="h-6 w-6" />
                  {app.id === "gmail" && "badge" in app ? (
                    <motion.div
                      variants={lockVariant}
                      className="absolute -left-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-white"
                    >
                      {app.badge}
                    </motion.div>
                  ) : null}
                </IconWrapper>
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-3">
              <IconWrapper />
              <IconWrapper />
              <IconWrapper />
              <IconWrapper />
            </div>
          </div>
        </div>
      </motion.div>

      {showCaption ? (
        <>
          <div className="pointer-events-none absolute bottom-0 left-0 h-[190px] w-full rounded-b-lg bg-gradient-to-t from-neutral-100 via-neutral-100/70 to-transparent" />
          <div className="absolute bottom-4 left-0 w-full px-6">
            <h3 className="font-marketing text-sm font-semibold text-ink-900">
              {cardTitle}
            </h3>
            <p className="mt-1 font-marketing text-xs text-neutral-500">
              {cardDescription}
            </p>
          </div>
        </>
      ) : (
        <div className="pointer-events-none absolute bottom-0 left-0 h-[72px] w-full bg-gradient-to-t from-parchment-50/90 to-transparent" />
      )}
    </motion.div>
  );
}

export default NotificationCenter;
