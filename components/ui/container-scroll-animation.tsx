"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/cn";

type ContainerScrollProps = {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Aceternity-style gray device frame around children (off for VRI preview chrome). */
  framed?: boolean;
  /** Tighter layout — sits higher with less scroll runway (product demo). */
  compact?: boolean;
};

export function ContainerScroll({
  titleComponent,
  children,
  className,
  framed = false,
  compact = false,
}: ContainerScrollProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    let scrollEndTimer = 0;

    const markScrolling = () => {
      const container = containerRef.current;
      if (!container) return;
      container.dataset.scrolling = "true";
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => {
        delete container.dataset.scrolling;
      }, 140);
    };

    window.addEventListener("scroll", markScrolling, { passive: true });
    return () => {
      window.removeEventListener("scroll", markScrolling);
      window.clearTimeout(scrollEndTimer);
    };
  }, []);

  const scaleRange: [number, number] = framed
    ? isMobile
      ? [0.7, 0.9]
      : [1.05, 1]
    : [1, 1];
  const rotateRange: [number, number] = reducedMotion
    ? [0, 0]
    : framed
      ? isMobile
        ? [14, 0]
        : [20, 0]
      : isMobile
        ? [10, 0]
        : [14, 0];
  const translateRange: [number, number] = reducedMotion ? [0, 0] : [0, -100];

  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], translateRange);

  return (
    <div
      ref={containerRef}
      className={cn(
        "container-scroll relative flex",
        compact
          ? "h-[42rem] items-start justify-start px-2 pb-8 pt-0 md:h-[54rem] md:px-4 md:pb-12 md:pt-2"
          : "h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full",
          compact ? "py-2 md:py-8" : "py-10 md:py-40",
        )}
        style={{ perspective: reducedMotion ? undefined : "1000px" }}
      >
        {titleComponent ? (
          <ContainerScrollHeader translate={translate}>
            {titleComponent}
          </ContainerScrollHeader>
        ) : null}
        <ContainerScrollCard
          rotate={rotate}
          scale={scale}
          framed={framed}
          withTitle={Boolean(titleComponent)}
        >
          {children}
        </ContainerScrollCard>
      </div>
    </div>
  );
}

function ContainerScrollHeader({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {children}
    </motion.div>
  );
}

function ContainerScrollCard({
  rotate,
  scale,
  framed,
  withTitle,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  framed: boolean;
  withTitle: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        transformOrigin: "center top",
        boxShadow: framed
          ? "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003"
          : undefined,
      }}
      className={cn(
        "container-scroll__card mx-auto w-full will-change-transform",
        framed ? "max-w-5xl" : "max-w-none",
        withTitle && "-mt-12",
        framed &&
          "h-[30rem] border-4 border-[#6C6C6C] bg-[#222222] p-2 shadow-2xl md:h-[40rem] md:p-6 rounded-[30px]",
      )}
    >
      {framed ? (
        <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
          {children}
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
