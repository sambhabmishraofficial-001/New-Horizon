"use client";

import { useEffect } from "react";

const BINARY_CHARS = "01";

/**
 * Paints 0/1 glyphs over the text selection bbox (Tetsuwan-style) instead of a solid highlight.
 */
export function SelectionBinaryOverlay() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.selectionOverlay = "binary";
    Object.assign(canvas.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "9999",
      display: "none",
    });
    document.body.appendChild(canvas);

    let raf = 0;

    function draw() {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        canvas.style.display = "none";
        return;
      }

      const rects = Array.from(sel.getRangeAt(0).getClientRects());
      if (!rects.length) {
        canvas.style.display = "none";
        return;
      }

      let minL = Infinity;
      let minT = Infinity;
      let maxR = 0;
      let maxB = 0;

      for (const r of rects) {
        if (r.width < 1 || r.height < 1) continue;
        minL = Math.min(minL, r.left);
        minT = Math.min(minT, r.top);
        maxR = Math.max(maxR, r.right);
        maxB = Math.max(maxB, r.bottom);
      }

      if (minL >= maxR || minT >= maxB) {
        canvas.style.display = "none";
        return;
      }

      const w = maxR - minL;
      const h = maxB - minT;
      const dpr = window.devicePixelRatio || 1;

      canvas.style.display = "block";
      canvas.style.left = `${minL}px`;
      canvas.style.top = `${minT}px`;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.font =
        '9px var(--font-geist-mono, "Geist Mono"), "Geist Mono", monospace';
      ctx.textBaseline = "top";

      for (const e of rects) {
        if (e.width < 1 || e.height < 1) continue;
        const ox = e.left - minL;
        const oy = e.top - minT;

        ctx.fillStyle = "rgba(37, 99, 235, 0.07)";
        ctx.fillRect(ox, oy, e.width, e.height);

        if (reducedMotion) continue;

        const cols = Math.ceil(e.width / 7);
        const rows = Math.ceil(e.height / 11);

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const hash =
              0x9e3779b1 * (col + Math.floor(e.left)) ^
              0x85ebca77 * (row + Math.floor(e.top));
            const a = ((65535 & hash) >>> 0) / 65535;
            if (a < 0.45) continue;

            const alpha = 0.22 + 0.38 * a;
            ctx.fillStyle = `rgba(37, 99, 235, ${alpha.toFixed(2)})`;
            const ch =
              BINARY_CHARS[Math.floor(a * BINARY_CHARS.length) % BINARY_CHARS.length];
            ctx.fillText(ch, ox + 7 * col, oy + 11 * row + 1);
          }
        }
      }
    }

    function paint() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    }

    function paintIfSelecting() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
      paint();
    }

    document.addEventListener("selectionchange", paint);
    window.addEventListener("scroll", paintIfSelecting, { passive: true });
    window.addEventListener("resize", paintIfSelecting, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("selectionchange", paint);
      window.removeEventListener("scroll", paintIfSelecting);
      window.removeEventListener("resize", paintIfSelecting);
      canvas.remove();
    };
  }, []);

  return null;
}
