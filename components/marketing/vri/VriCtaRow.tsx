"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { WindowsDownloadDialog } from "@/components/marketing/vri/WindowsDownloadDialog";

type VriCtaRowProps = {
  className?: string;
  variant?: "hero" | "footer";
};

const SHINY_SWEEP = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop" as const,
    repeatDelay: 1,
    type: "spring" as const,
    stiffness: 20,
    damping: 15,
    mass: 2,
  },
};

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
    >
      <path d="M3 4.5 10.5 3.45v7.05H3V4.5zm0 8.25h7.5v7.05L3 18.75v-6zm9.75-8.7L21 2.7v8.85h-8.25V3.75zm0 10.05H21V21l-8.25-1.2v-6z" />
    </svg>
  );
}

export function VriCtaRow({ className }: VriCtaRowProps) {
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <div className={cn("flex flex-wrap items-center justify-center gap-2.5", className)}>
        <motion.button
          type="button"
          onClick={() => setDownloadOpen(true)}
          {...(reducedMotion ? {} : SHINY_SWEEP)}
          style={{ "--x": "100%" } as React.CSSProperties}
          className="btn-xai btn-xai-primary btn-xai-rainbow-shimmer btn-xai-shiny"
        >
          <span
            className="btn-xai-shiny__label relative z-[3] inline-flex items-center gap-2"
            style={{
              WebkitMaskImage:
                "linear-gradient(-75deg,#fff calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#fff calc(var(--x) + 100%))",
              maskImage:
                "linear-gradient(-75deg,#fff calc(var(--x) + 20%),transparent calc(var(--x) + 30%),#fff calc(var(--x) + 100%))",
            }}
          >
            <WindowsIcon className="h-3.5 w-3.5" />
            Download for Windows
          </span>
          <span className="btn-xai-shiny__sheen" aria-hidden />
        </motion.button>
      </div>

      <WindowsDownloadDialog open={downloadOpen} onOpenChange={setDownloadOpen} />
    </>
  );
}
