"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/cn";
import { MARKETING_GRADIENTS } from "@/lib/marketing-gradients";
import {
  GradientBackground,
  type GradientBackgroundProps,
} from "@/components/ui/noisy-gradient-backgrounds";
import type { LucideIcon } from "lucide-react";

export type PrincipleCardVariant = "persistent" | "accountable" | "yours";

const PRINCIPLE_GRADIENTS: Record<PrincipleCardVariant, GradientBackgroundProps> = {
  persistent: MARKETING_GRADIENTS.twins,
  accountable: MARKETING_GRADIENTS.invariants,
  yours: MARKETING_GRADIENTS.criticalPath,
};

const PRINCIPLE_LABELS: Record<PrincipleCardVariant, string> = {
  persistent: "Twins-grade memory",
  accountable: "Invariants-grade audit",
  yours: "Critical-path ownership",
};

export interface AnimatedPrincipleCardProps {
  icon: LucideIcon;
  lead: string;
  body: string;
  tags: string[];
  variant: PrincipleCardVariant;
  className?: string;
  onClick?: () => void;
}

export function AnimatedPrincipleCard({
  icon: Icon,
  lead,
  body,
  tags,
  variant,
  className,
  onClick,
}: AnimatedPrincipleCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left - width / 2);
    mouseY.set(e.clientY - top - height / 2);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);
  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      layout
      onClick={onClick}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "group relative w-full shrink-0 transform-gpu overflow-hidden rounded-[1.75rem] border border-ink-900/12 bg-transparent shadow-[0_18px_50px_-28px_rgba(17,17,16,0.35)] transition-shadow duration-300 hover:shadow-[0_28px_70px_-24px_rgba(17,17,16,0.45)]",
        className
      )}
      aria-label={lead}
      tabIndex={0}
    >
      <GradientBackground {...PRINCIPLE_GRADIENTS[variant]} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.22)_55%,rgba(0,0,0,0.42))]"
      />

      <div
        style={{ transform: "translateZ(24px)" }}
        className="relative z-10 flex min-h-[280px] flex-col justify-between p-6 text-white sm:min-h-[320px] sm:p-7"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.65} />
            </div>
            <span className="rounded-full border border-white/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75">
              {PRINCIPLE_LABELS[variant]}
            </span>
          </div>

          <div>
            <h3 className="animated-principle-card__lead font-editorial text-[28px] leading-tight !text-white sm:text-[30px]">
              {lead}
            </h3>
            <p className="mt-3 text-[15px] leading-[1.75] text-white/82">{body}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/85 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
