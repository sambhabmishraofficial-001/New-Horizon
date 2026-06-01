"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { sitePath } from "@/lib/sitePath";
import { useHomeHeroImageSwap } from "@/components/marketing/useHomeHeroImageSwap";

type HeroCellConfig = {
  id: string;
  col: string;
  row: string;
  content?: ReactNode;
  className?: string;
};

const meta = (...items: string[]) => (
  <div className="home-hero-atmo-meta">
    {items.map((item) => (
      <span key={item}>{item}</span>
    ))}
  </div>
);

const image = (
  front: string,
  back: string,
  group: 1 | 2 | 3 = 1,
  alt = "",
) => (
  <div className="home-hero-atmo-image-div" data-image-group={group}>
    <img
      className="home-hero-atmo-image home-hero-atmo-image--front"
      src={sitePath(front)}
      alt={alt}
    />
    <img
      className="home-hero-atmo-image home-hero-atmo-image--back"
      src={sitePath(back)}
      alt=""
      aria-hidden
    />
  </div>
);

const HERO_CELLS: HeroCellConfig[] = [
  {
    id: "top-left",
    col: "1 / 3",
    row: "1 / 2",
    content: meta("Foundation models", "scientific research", "discovery systems"),
  },
  {
    id: "earth-wide",
    col: "3 / 6",
    row: "1 / 2",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-galaxy.png",
      "/images/hero-atmo-black-hole.png",
      1,
    ),
  },
  {
    id: "top-mid",
    col: "6 / 7",
    row: "1 / 2",
    content: meta("Lattice", "experiment memory", "versioned claims"),
  },
  {
    id: "top-right-wide",
    col: "7 / 9",
    row: "1 / 2",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-fossil.png",
      "/images/hero-atmo-skeleton.png",
      2,
    ),
  },
  {
    id: "top-right-box",
    col: "9 / 11",
    row: "1 / 2",
    content: meta("VRI", "AI research workspace", "agents + tools", "human review"),
  },
  {
    id: "cape",
    col: "9 / 11",
    row: "2 / 3",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-yellow-red.png",
      "/images/hero-atmo-red-teal.png",
      3,
    ),
  },
  {
    id: "landscape",
    col: "1 / 3",
    row: "2 / 4",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-cells-blue.png",
      "/images/hero-atmo-cells-purple.png",
      1,
    ),
  },
  {
    id: "earth-meta",
    col: "3 / 6",
    row: "2 / 4",
    className: "home-hero-atmo-cell--headline",
    content: (
      <div className="home-hero-atmo-main-copy">
        <h1>
          <span>An Applied AI Research lab</span>
          <span>building the infrastructure for <span className="home-hero-atmo-highlight">Human-AI Co-Science</span>.</span>
        </h1>
      </div>
    ),
  },
  {
    id: "storm",
    col: "6 / 7",
    row: "2 / 3",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-mri.png",
      "/images/hero-atmo-anatomy.png",
      2,
    ),
  },
  {
    id: "philippines",
    col: "7 / 9",
    row: "2 / 3",
    content: (
      <>
        <span className="home-hero-atmo-arrow home-hero-atmo-arrow--corner">←</span>
        {meta("Biology", "Systems biology", "molecular networks", "cell dynamics")}
      </>
    ),
  },
  {
    id: "nevada",
    col: "1 / 3",
    row: "4 / 5",
    content: meta("Model systems", "literature reasoning", "hypothesis search", "paper-to-proof loops"),
  },
  {
    id: "headline-bed-b",
    col: "3 / 6",
    row: "4 / 5",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-flower-cell.png",
      "/images/hero-atmo-cell-iridescent.png",
      3,
    ),
  },
  {
    id: "center-feed",
    col: "6 / 7",
    row: "3 / 5",
    content: (
      <>
        <span className="home-hero-atmo-arrow home-hero-atmo-arrow--corner">→</span>
        {meta("Physics", "Complex systems", "field models", "emergent order")}
      </>
    ),
  },
  {
    id: "anatomy",
    col: "7 / 9",
    row: "3 / 5",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-rainbow-cells.png",
      "/images/hero-atmo-green-micrograph.png",
      1,
    ),
  },
  {
    id: "sf",
    col: "9 / 11",
    row: "3 / 5",
    content: (
      <>
        <span className="home-hero-atmo-arrow home-hero-atmo-arrow--corner">↑</span>
        {meta("Neuroscience", "Cognitive systems", "brain mapping", "learning signals")}
      </>
    ),
  },
  {
    id: "bottom-left-box",
    col: "1 / 3",
    row: "5 / 6",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-earth-horizon.png",
      "/images/hero-atmo-aurora-earth.png",
      2,
    ),
  },
  {
    id: "headline-copy",
    col: "3 / 6",
    row: "5 / 6",
    content: meta("Discovery engine", "simulate", "evaluate", "replicate", "ship knowledge"),
  },
  {
    id: "bottom-blue",
    col: "6 / 7",
    row: "5 / 6",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-fish.png",
      "/images/hero-atmo-contour.png",
      3,
    ),
  },
  {
    id: "bottom-green",
    col: "7 / 9",
    row: "5 / 6",
    content: meta("Scientific copilots", "domain-tuned agents", "benchmarks", "research automation"),
  },
  {
    id: "bottom-right",
    col: "9 / 11",
    row: "5 / 6",
    className: "home-hero-atmo-cell--media",
    content: image(
      "/images/hero-atmo-tree.png",
      "/images/hero-atmo-green-microscopy.png",
      1,
    ),
  },
];

export function HeroCell({
  id,
  col,
  row,
  children,
  className,
}: HeroCellConfig & {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-hero-cell={id}
      style={{ gridColumn: col, gridRow: row }}
      className={cn(
        "home-hero-atmo-cell",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HomeHeroGrid({ children }: { children?: ReactNode }) {
  useHomeHeroImageSwap();

  return (
    <div className="home-hero-atmo-grid-wrap" aria-label="Hero layout grid">
      <div className="home-hero-atmo-grid">
        {children ??
          HERO_CELLS.map((cell) => (
            <HeroCell key={cell.id} {...cell}>
              {cell.content}
            </HeroCell>
          ))}
      </div>
    </div>
  );
}

export { HERO_CELLS };
