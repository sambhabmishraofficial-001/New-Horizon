"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const DOT_DELAYS = [0, 0.3, 0.6] as const;

interface PulsatingDotsProps {
  className?: string;
  dotClassName?: string;
  size?: "sm" | "md";
}

export function PulsatingDots({
  className,
  dotClassName = "bg-signal-rose",
  size = "sm",
}: PulsatingDotsProps) {
  const dotSize = size === "sm" ? "h-2 w-2" : "h-3 w-3";

  return (
    <div className={cn("flex items-center justify-center", className)} aria-hidden>
      <div className="flex gap-1.5">
        {DOT_DELAYS.map((delay) => (
          <motion.div
            key={delay}
            className={cn("rounded-full", dotSize, dotClassName)}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}
