import Link from "next/link";
import { cn } from "@/lib/cn";
import { VRI_PATHS } from "@/lib/vriProduct";

const shimmerBase = cn(
  "btn-soft inline-flex items-center justify-center gap-2 rounded-xl border font-marketing font-medium not-italic transition-colors",
  "animate-shimmer2 bg-shimmer-flow",
  "border-ink-800 bg-[linear-gradient(110deg,#111110,42%,#34342e,50%,#111110)]",
  "text-parchment-50 hover:border-ink-700",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900/40"
);

type ShimmerButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
};

export function ShimmerButton({
  href = VRI_PATHS.signup,
  children,
  className,
}: ShimmerButtonProps) {
  return (
    <Link href={href} className={cn(shimmerBase, "h-11 px-5 text-[13.5px]", className)}>
      {children}
    </Link>
  );
}
