"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HeroGrainOverlay } from "@/components/marketing/HeroGrainOverlay";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { cn } from "@/lib/cn";
import { sitePath } from "@/lib/sitePath";

const HERO_BG_IMAGE = sitePath("/images/home-hero-bg.png");
const HERO_BG_VIDEO = sitePath("/videos/home-hero-bg.mp4");

function HeroBackground({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = HERO_BG_VIDEO;
    link.type = "video/mp4";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setVideoReady(true);

    video.addEventListener("canplay", markReady);
    if (video.readyState >= 3) markReady();

    void video.play().catch(() => {
      markReady();
    });

    return () => {
      video.removeEventListener("canplay", markReady);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <Image
        src={HERO_BG_IMAGE}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center"
      />
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-[#061018]" aria-hidden />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out",
          videoReady ? "opacity-100" : "opacity-0",
        )}
      >
        <source src={HERO_BG_VIDEO} type="video/mp4" />
      </video>
    </>
  );
}

export function HomeHero() {
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
    <section ref={sectionRef} className="home-hero-section relative h-[200vh]">
      <MarketingNav
        variant="dark"
        hideOnScroll={false}
        showBanner={false}
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
            <HeroBackground reducedMotion={reducedMotion} />
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
                  className="home-hero-cta mt-2 flex w-full flex-wrap items-center gap-3 sm:mt-4 md:mt-0 md:w-auto"
                >
                  <Link
                    href="#mission"
                    className="btn-xai h-10 border border-white/30 bg-white/10 px-5 text-white hover:border-white/50 hover:bg-white/15"
                  >
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/products"
                    className="btn-xai h-10 border border-white/30 bg-transparent px-5 text-white hover:border-white/50 hover:bg-white/10"
                  >
                    View products <ArrowUpRight className="h-3.5 w-3.5" />
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
