import * as React from "react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const variants = {
    default: "bg-ink-900 text-parchment-50 hover:bg-ink-800",
    secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200/80",
    ghost: "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900",
    outline:
      "border border-ink-900/12 bg-white text-ink-800 hover:bg-ink-50",
    destructive:
      "bg-signal-rose text-white hover:bg-signal-rose/90",
  };

  const sizes = {
    default: "h-9 px-4 text-[13px]",
    sm: "h-8 px-3 text-[12px]",
    lg: "h-11 px-6 text-[14px]",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium not-italic transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
