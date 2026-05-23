"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { PathLoader } from "@/components/ui/path-loader";

interface LoadingBreadcrumbProps {
  text?: string;
  className?: string;
  variant?: "light" | "dark";
}

export function LoadingBreadcrumb({
  text = "Building explanation cone",
  className,
  variant = "light",
}: LoadingBreadcrumbProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[13px] font-medium tracking-wide",
        className
      )}
    >
      <PathLoader
        size={18}
        strokeWidth={2.5}
        className={cn(isDark ? "text-parchment-100/70" : "text-ink-600")}
      />
      <span
        className={cn(
          "animate-textShimmerBreadcrumb bg-[length:200%_auto] bg-clip-text text-transparent",
          isDark
            ? "bg-[linear-gradient(90deg,#8e8e80_0%,#8e8e80_40%,#faf8f4_50%,#8e8e80_60%,#8e8e80_100%)]"
            : "bg-[linear-gradient(90deg,#6b6b5e_0%,#6b6b5e_40%,#111110_50%,#6b6b5e_60%,#6b6b5e_100%)]"
        )}
      >
        {text}
      </span>
      <ChevronRight
        size={15}
        className={cn(isDark ? "text-parchment-100/35" : "text-ink-400")}
      />
    </div>
  );
}
