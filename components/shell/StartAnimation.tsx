"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function StartAnimation({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(true);
  const [exitMs, setExitMs] = React.useState(0.35);

  React.useEffect(() => {
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fast) {
      setExitMs(0);
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="vriu-start"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-parchment-50"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: exitMs, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-[22px] sm:text-2xl text-ink-900 tracking-tight">
                New Horizon
              </div>
              <motion.div
                className="mt-2.5 mx-auto h-px w-10 origin-center bg-ink-900/12"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
              <p className="text-[10.5px] uppercase tracking-[0.22em] text-ink-400 mt-3">
                Virtual Research Institute
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
