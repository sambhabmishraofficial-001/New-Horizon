"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const testimonials = [
  {
    quote:
      "The telescope didn't replace the astronomer - it gave the eye something worthy of its attention. AI in science should work the same way: amplification, not replacement.",
    author: "Dr. Elena Vasquez",
    role: "Computational Biology",
    company: "@evasquez_lab",
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=DrChen",
  },
  {
    quote:
      "For decades the bottleneck was access - papers, data, compute. That bottleneck is breaking. The new constraint is judgment: knowing which questions are worth asking. That's where human-AI co-science begins.",
    author: "James Okonkwo",
    role: "Science & Society",
    company: "@jokonkwo_struct",
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=JamesOkonkwo",
  },
  {
    quote:
      "We're entering an era where the distance between a question and an answer could shrink from years to days. Not because machines think for us - but because they let us think at the scale the world actually demands.",
    author: "Priya Nair",
    role: "Research Policy",
    company: "@priya_nair_pi",
    avatar:
      "https://api.dicebear.com/7.x/notionists/svg?seed=PriyaNair",
  },
];

function usePreloadImages(images: string[]) {
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);
}

function SplitText({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <span className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            delay: i * 0.03,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  usePreloadImages(testimonials.map((t) => t.avatar));

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl px-8 py-20"
      style={{ cursor: "none" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNext}
    >
      <motion.div
        className="pointer-events-none absolute z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full bg-ink-900"
          animate={{
            width: isHovered ? 80 : 0,
            height: isHovered ? 80 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <motion.span
            className="text-xs font-medium uppercase tracking-wider text-parchment-50"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
          >
            Next
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-8 top-8 flex items-baseline gap-1 font-mono text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.span
          className="text-2xl font-light text-ink-900"
          key={activeIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {String(activeIndex + 1).padStart(2, "0")}
        </motion.span>
        <span className="text-ink-400">/</span>
        <span className="text-ink-400">
          {String(testimonials.length).padStart(2, "0")}
        </span>
      </motion.div>

      <motion.div
        className="absolute left-8 top-8 flex -space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
      >
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className={`h-6 w-6 overflow-hidden rounded-full border-2 border-white transition-all duration-300 ${
              i === activeIndex
                ? "opacity-100 ring-1 ring-[#2563eb] ring-offset-1 ring-offset-white"
                : "opacity-50 grayscale"
            }`}
            whileHover={{ scale: 1.1, opacity: 1 }}
          >
            <img
              src={t.avatar}
              alt={t.author}
              className="h-full w-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="text-xl font-light leading-relaxed tracking-tight text-ink-900 md:text-2xl"
          >
            <SplitText text={currentTestimonial.quote} />
          </motion.blockquote>
        </AnimatePresence>

        <motion.div className="relative mt-12" layout>
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <motion.div
                className="absolute -inset-1.5 rounded-full border border-[#2563eb]/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {testimonials.map((t, i) => (
                <motion.img
                  key={t.avatar}
                  src={t.avatar}
                  alt={t.author}
                  className="absolute inset-0 h-12 w-12 rounded-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                  animate={{
                    opacity: i === activeIndex ? 1 : 0,
                    zIndex: i === activeIndex ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="relative pl-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute bottom-0 left-0 top-0 w-px bg-[#2563eb]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ originY: 0 }}
                />
                <span className="block text-sm font-medium tracking-wide text-ink-900">
                  {currentTestimonial.author}
                </span>
                <span className="mt-0.5 block font-mono text-xs uppercase tracking-widest text-ink-400">
                  {currentTestimonial.role} - {currentTestimonial.company}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="relative mt-16 h-px overflow-hidden bg-ink-900/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#2563eb]"
            initial={{ width: "0%" }}
            animate={{
              width: `${((activeIndex + 1) / testimonials.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-8 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.4 : 0.2 }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">
          Click anywhere
        </span>
      </motion.div>
    </div>
  );
}
