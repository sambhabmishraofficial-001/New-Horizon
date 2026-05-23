"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { VRI_SECTIONS, scrollToVriSection } from "@/lib/vriProduct";

export function VriSectionNav() {
  const [activeId, setActiveId] = useState<string>(VRI_SECTIONS[0].id);

  useEffect(() => {
    const sections = VRI_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="VRI product sections"
      className="sticky top-[4.25rem] z-30 border-b border-ink-900/8 bg-white/92 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {VRI_SECTIONS.map((section) => {
          const active = activeId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToVriSection(section.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 font-marketing text-[12.5px] font-normal transition-colors sm:text-[13px]",
                active
                  ? "bg-ink-900 text-parchment-50"
                  : "text-ink-600 hover:bg-ink-900/[0.05] hover:text-ink-900"
              )}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
