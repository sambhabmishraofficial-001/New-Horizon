import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-ink-900 text-parchment-50",
    secondary: "bg-ink-900/6 text-ink-700",
    outline: "border border-ink-900/12 bg-white text-ink-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
