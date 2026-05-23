"use client";

import * as React from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/cn";

type PlaceholderImageOptions = {
  title: string;
  startColor: string;
  endColor: string;
  accentColor: string;
};

const createPlaceholderImage = ({
  title,
  startColor,
  endColor,
  accentColor,
}: PlaceholderImageOptions) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="720" gradientUnits="userSpaceOnUse">
      <stop stop-color="${startColor}" />
      <stop offset="1" stop-color="${endColor}" />
    </linearGradient>
  </defs>
  <rect width="1200" height="720" rx="40" fill="url(#bg)" />
  <rect x="96" y="96" width="1008" height="528" rx="30" fill="${accentColor}" fill-opacity="0.18" />
  <circle cx="270" cy="220" r="54" fill="${accentColor}" fill-opacity="0.7" />
  <rect x="352" y="184" width="552" height="72" rx="20" fill="${accentColor}" fill-opacity="0.68" />
  <rect x="196" y="350" width="404" height="36" rx="18" fill="${accentColor}" fill-opacity="0.62" />
  <rect x="196" y="410" width="620" height="30" rx="15" fill="${accentColor}" fill-opacity="0.56" />
  <rect x="196" y="456" width="720" height="30" rx="15" fill="${accentColor}" fill-opacity="0.46" />
  <text x="196" y="565" fill="${accentColor}" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700">${title}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const slides = [
  {
    id: "welcome",
    alt: "New Horizon institute overview",
    title: "Welcome to New Horizon",
    description:
      "Your Virtual Research Institute - one persistent workspace for papers, datasets, runs, and results across years of science.",
    image: createPlaceholderImage({
      accentColor: "#0E2258",
      endColor: "#D9E8FF",
      startColor: "#EEF5FF",
      title: "New Horizon",
    }),
  },
  {
    id: "ire",
    alt: "IRE workspace preview",
    title: "Run science in IRE",
    description:
      "Investigate hypotheses, execute programs, and trace every claim back to its source with full provenance.",
    image: createPlaceholderImage({
      accentColor: "#12785A",
      endColor: "#CAF6E8",
      startColor: "#E8FFF7",
      title: "IRE Workspace",
    }),
  },
  {
    id: "labs",
    alt: "Virtual labs preview",
    title: "Virtual Labs & Lattice",
    description:
      "Spin up simulations, explore programs, and connect wet-lab workflows without leaving the institute.",
    image: createPlaceholderImage({
      accentColor: "#5B3FB0",
      endColor: "#E1D4FF",
      startColor: "#F2ECFF",
      title: "Virtual Labs",
    }),
  },
  {
    id: "collaboration",
    alt: "Co-science collaboration preview",
    title: "Co-science with your team",
    description:
      "Work alongside teammates and research twins in context - share feedback where decisions actually happen.",
    image: createPlaceholderImage({
      accentColor: "#B9740C",
      endColor: "#FFE8C2",
      startColor: "#FFF6E8",
      title: "Co-science",
    }),
  },
] as const;

type VriOnboardingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export function VriOnboardingDialog({
  open,
  onOpenChange,
  onComplete,
}: VriOnboardingDialogProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    emblaApi?.scrollTo(0, true);
  }, [open, emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === slides.length - 1;
  const currentSlide = slides[activeIndex] ?? slides[0];

  const finish = React.useCallback(() => {
    onComplete();
    onOpenChange(false);
  }, [onComplete, onOpenChange]);

  const handleNext = () => {
    if (isLastSlide) {
      finish();
      return;
    }
    emblaApi?.scrollNext();
  };

  const handlePrevious = () => emblaApi?.scrollPrev();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vri-onboarding-title"
    >
      <button
        type="button"
        aria-label="Close onboarding"
        className="absolute inset-0 bg-ink-900/60"
        onClick={finish}
      />

      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-lift animate-in fade-in zoom-in-95">
        <div className="p-3 sm:p-4">
          <div ref={emblaRef} className="overflow-hidden rounded-lg">
            <div className="flex">
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-0 flex-[0_0_100%]">
                  <div className="p-1">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            {slides.map((slide, index) => (
              <motion.div
                key={slide.id}
                animate={{
                  opacity: index === activeIndex ? 1 : 0.5,
                  width: index === activeIndex ? 24 : 16,
                }}
                initial={false}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to ${slide.title}`}
                  className={cn(
                    "h-2 w-full cursor-pointer rounded-full transition-colors",
                    index === activeIndex
                      ? "bg-ink-900"
                      : "bg-ink-900/15 hover:bg-ink-900/25"
                  )}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid px-1">
            {slides.map((slide) => (
              <motion.div
                key={slide.id}
                animate={{ opacity: currentSlide.id === slide.id ? 1 : 0 }}
                initial={false}
                className="col-start-1 row-start-1"
                style={{
                  pointerEvents: currentSlide.id === slide.id ? "auto" : "none",
                }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <h2
                  id={currentSlide.id === slide.id ? "vri-onboarding-title" : undefined}
                  className="text-lg font-semibold text-ink-900"
                >
                  {slide.title}
                </h2>
                <p className="mt-2 text-sm text-ink-500">{slide.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between px-1 pb-1">
            <div>
              {!isFirstSlide && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={finish}
                className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer rounded-md bg-ink-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-ink-800"
              >
                {isLastSlide ? "Get started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
