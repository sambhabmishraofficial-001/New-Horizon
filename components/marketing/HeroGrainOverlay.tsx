"use client";

import { useId } from "react";

export function HeroGrainOverlay() {
  const id = useId().replace(/:/g, "");
  const fineId = `hero-grain-fine-${id}`;
  const coarseId = `hero-grain-coarse-${id}`;

  return (
    <>
      <svg className="hidden" aria-hidden>
        <filter id={fineId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={4}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values={`1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.6 0`}
          />
        </filter>
        <filter id={coarseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.4"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values={`1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.4 0`}
          />
        </filter>
      </svg>
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ filter: `url(#${fineId})`, mixBlendMode: "overlay" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-70"
        style={{ filter: `url(#${coarseId})`, mixBlendMode: "soft-light" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-white/[0.03] via-transparent to-black/[0.05]"
        style={{ mixBlendMode: "overlay" }}
        aria-hidden
      />
    </>
  );
}
