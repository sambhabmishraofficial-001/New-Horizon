"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  id?: string;
  "aria-label"?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  id,
  "aria-label": ariaLabel,
}) => (
  <section
    id={id}
    data-flow-section
    aria-label={ariaLabel}
    className={cx(
      "relative min-h-screen w-full overflow-hidden bg-white",
      className,
    )}
  >
    <div
      data-flow-inner
      className={cx(
        "flow-art-container relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-[clamp(2rem,6vw,3.5rem)] sm:px-8",
        "will-change-transform",
      )}
      style={{ transformOrigin: "bottom left", ...style }}
    >
      {children}
    </div>
  </section>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  "aria-label": ariaLabel = "Story scroll",
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-flow-section]"),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>(".flow-art-container");
        if (!inner) return;

        const startScale = i === 0 ? 1 : 0.965;
        const startY = i === 0 ? 0 : 36;

        gsap.set(inner, {
          transformOrigin: "center top",
          transformPerspective: 1200,
          scale: startScale,
          y: startY,
        });

        const tween = gsap.to(inner, {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: 0.7,
          },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              endTrigger: sections[i + 1],
              end: "top top",
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx("w-full overflow-x-hidden bg-white", className)}
    >
      {children}
    </main>
  );
};

export { FlowArt };
export default FlowArt;
