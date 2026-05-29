"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { HeroGrainOverlay } from "@/components/marketing/HeroGrainOverlay";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { sitePath } from "@/lib/sitePath";

const HERO_BG = sitePath("/images/home-hero-bg.png");

export function LiteFoldHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const framePadding = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0rem", "0rem"] : ["0.75rem", "0rem"],
  );
  const frameRadius = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ["0px", "0px"] : ["12px", "0px"],
  );

  return (
    <section ref={sectionRef} className="home-litefold-hero relative h-[200vh]">
      <MarketingNav
        variant="dark"
        hideOnScroll={false}
        showBanner
        showSpacer={false}
      />

      <div className="sticky top-0 left-0 h-screen min-h-[500px] w-full overflow-hidden">
        <motion.div
          style={{ padding: framePadding }}
          className="flex h-full w-full items-center justify-center"
        >
          <motion.div
            style={{ borderRadius: frameRadius }}
            className="relative flex h-full w-full flex-col justify-end overflow-hidden"
          >
            <Image
              src={HERO_BG}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/15 to-black/5 mix-blend-multiply" />
            <HeroGrainOverlay />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-between px-4 pb-6 pt-[15vh] sm:px-6 sm:pb-8 sm:pt-[18vh] md:px-12 md:pb-12 md:pt-[20vh] xl:px-16">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="home-hero-title max-w-5xl font-editorial text-[32px] leading-[1] tracking-[-0.04em] text-white sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.06em] md:text-6xl lg:text-7xl xl:text-[90px]">
                  New Horizon
                </h1>
              </motion.div>

              <div className="mt-auto flex w-full flex-col items-start gap-4 text-white sm:gap-6 md:flex-row md:items-end md:justify-between">
                <motion.p
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="home-hero-lede max-w-3xl text-base font-normal leading-relaxed tracking-tight text-white/95 sm:text-lg md:text-xl lg:text-[22px]"
                >
                  An Applied AI Research lab building the infrastructure for
                  Human-AI Co-Science.
                </motion.p>

                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="home-hero-cta mt-2 flex w-full items-center gap-2 sm:mt-4 sm:w-auto md:mt-0"
                >
                  <Link
                    href="#mission"
                    className="flex-1 whitespace-nowrap rounded-lg bg-[#243033]/95 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-[#1a2325] sm:flex-none sm:rounded-xl sm:px-6 sm:py-4 sm:text-[11px] md:px-8 md:text-xs"
                  >
                    Explore
                  </Link>
                  <Link
                    href="/products"
                    aria-label="View products"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#d3eff5] text-[#1a2325] transition-colors hover:bg-[#fbfbfb] sm:h-12 sm:w-12 sm:rounded-xl"
                  >
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
