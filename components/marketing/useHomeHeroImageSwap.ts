"use client";

import { useEffect } from "react";

function swapImages(container: HTMLElement) {
  const front = container.querySelector<HTMLElement>(".home-hero-atmo-image--front");
  const back = container.querySelector<HTMLElement>(".home-hero-atmo-image--back");
  if (!front || !back) return;

  const frontOpacity = front.style.opacity || getComputedStyle(front).opacity;
  const nextFront = frontOpacity === "0" ? "1" : "0";
  const nextBack = nextFront === "1" ? "0" : "1";

  front.style.opacity = nextFront;
  back.style.opacity = nextBack;
}

function groupDelay(group: string) {
  if (group === "2") return 8000;
  if (group === "3") return 13000;
  return 3000;
}

export function useHomeHeroImageSwap() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const containers = Array.from(
      document.querySelectorAll<HTMLElement>(".home-hero-atmo-image-div"),
    );
    if (!containers.length) return;

    const timeouts: number[] = [];
    let cancelled = false;

    function runSwapLoop() {
      if (cancelled) return;

      containers.forEach((container) => {
        const group = container.dataset.imageGroup ?? "1";
        const id = window.setTimeout(() => {
          if (!cancelled) swapImages(container);
        }, groupDelay(group));
        timeouts.push(id);
      });

      const loopId = window.setTimeout(runSwapLoop, 15000);
      timeouts.push(loopId);
    }

    runSwapLoop();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);
}
