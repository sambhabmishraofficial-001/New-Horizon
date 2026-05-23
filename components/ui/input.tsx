import * as React from "react";
import { cn } from "@/lib/cn";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-ink-900/12 bg-white px-3 py-2 font-marketing text-sm text-ink-900 shadow-sm shadow-ink-900/5 transition-shadow placeholder:text-ink-400 focus-visible:border-beacon-500/50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-beacon-500/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
