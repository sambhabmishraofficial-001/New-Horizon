"use client";

import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HomeHeroGrid } from "@/components/marketing/HomeHeroGrid";

export function HomeHero() {
  return (
    <section className="home-hero-section home-hero-atmo relative">
      <MarketingNav
        variant="light"
        hideOnScroll={false}
        showBanner={false}
        showSpacer={false}
      />

      <div className="home-hero-stage relative h-screen min-h-[640px] w-full overflow-hidden bg-white text-[#111110]">
        <div className="home-hero-stage__grid relative z-10 flex h-full w-full items-stretch">
          <HomeHeroGrid />
        </div>
      </div>
    </section>
  );
}
