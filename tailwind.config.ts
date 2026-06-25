import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "var(--font-geist-sans)",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        editorial: [
          "var(--font-family-marketing)",
          "Arial Nova Light",
          "Arial Nova",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        marketing: [
          "var(--font-family-marketing)",
          "Arial Nova Light",
          "Arial Nova",
          "Arial",
          "Helvetica",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "Geist Mono",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        ink: {
          50: "#F7F7F5",
          100: "#EEEEE9",
          200: "#D9D9D1",
          300: "#B8B8AC",
          400: "#8E8E80",
          500: "#6B6B5E",
          600: "#4C4C42",
          700: "#34342E",
          800: "#1F1F1B",
          900: "#111110",
          950: "#0A0A09",
        },
        parchment: {
          50: "#FAF8F4",
          100: "#F3EFE6",
          200: "#E8E2D4",
        },
        bone: {
          50: "#FBF9F4",
          100: "#F4F0E6",
          200: "#E8E2D2",
          300: "#CFC7B3",
        },
        obsidian: {
          50: "#1A1A18",
          100: "#141413",
          200: "#0F0F0E",
          300: "#0B0B0A",
          400: "#080808",
          500: "#050505",
          900: "#020202",
        },
        beacon: {
          50: "#EEF5FF",
          100: "#D9E8FF",
          300: "#7DA7F5",
          500: "#3B6FE0",
          600: "#2A58BE",
          700: "#1E4394",
          900: "#0E2258",
        },
        signal: {
          emerald: "#12785A",
          amber: "#B9740C",
          rose: "#B4315F",
          violet: "#5B3FB0",
        },
      },
      boxShadow: {
        pane: "0 1px 0 rgba(17,17,16,0.04), 0 0 0 1px rgba(17,17,16,0.06)",
        lift: "0 10px 40px -12px rgba(17,17,16,0.18), 0 0 0 1px rgba(17,17,16,0.06)",
        glow: "0 0 0 1px rgba(59,111,224,0.35), 0 10px 30px -10px rgba(59,111,224,0.35)",
        editorial:
          "0 1px 0 rgba(17,17,16,0.04), 0 30px 60px -30px rgba(17,17,16,0.28), 0 0 0 1px rgba(17,17,16,0.06)",
        glass:
          "0 4px 24px -2px rgba(17,17,16,0.08), 0 0 0 1px rgba(255,255,255,0.45), inset 0 1px 0 rgba(255,255,255,0.6)",
        "glass-hover":
          "0 8px 32px -4px rgba(17,17,16,0.14), 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.7)",
        "glass-inset":
          "inset 0 2px 4px rgba(17,17,16,0.06), 0 0 0 1px rgba(17,17,16,0.06)",
        "beacon-glow":
          "0 0 0 1px rgba(59,111,224,0.4), 0 0 20px -4px rgba(59,111,224,0.3), 0 10px 30px -10px rgba(59,111,224,0.25)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(17,17,16,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,16,0.045) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        noise:
          "radial-gradient(rgba(17,17,16,0.04) 1px, transparent 1px)",
        mesh:
          "radial-gradient(ellipse at 20% 0%, rgba(59,111,224,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(18,120,90,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(91,63,176,0.04) 0%, transparent 60%)",
        "gradient-beacon":
          "linear-gradient(135deg, #2A58BE 0%, #3B6FE0 50%, #7DA7F5 100%)",
        "gradient-ink":
          "linear-gradient(135deg, #111110 0%, #1F1F1B 50%, #34342E 100%)",
      },
      keyframes: {
        pulseSoft: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shimmer2: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "-200% 0%" },
        },
        drawStroke: {
          "0%": {
            strokeDashoffset: "var(--path-length)",
            animationTimingFunction: "ease-in-out",
          },
          "50%": {
            strokeDashoffset: "0",
            animationTimingFunction: "ease-in-out",
          },
          "100%": { strokeDashoffset: "calc(var(--path-length) * -1)" },
        },
        textShimmerBreadcrumb: {
          "0%": { backgroundPosition: "-100% center" },
          "100%": { backgroundPosition: "100% center" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 8px 2px rgba(59,111,224,0.2)" },
          "50%": { boxShadow: "0 0 16px 4px rgba(59,111,224,0.35)" },
        },
        breathe: {
          "0%,100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
        shimmer: "shimmer 2.8s linear infinite",
        shimmer2: "shimmer2 2s infinite linear",
        drawStroke: "drawStroke 2.5s infinite",
        textShimmerBreadcrumb: "textShimmerBreadcrumb 2s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        fadeInDown: "fadeInDown 0.35s cubic-bezier(0.16,1,0.3,1) both",
        slideInLeft: "slideInLeft 0.35s cubic-bezier(0.16,1,0.3,1) both",
        glowPulse: "glowPulse 2.4s ease-in-out infinite",
        breathe: "breathe 3s ease-in-out infinite",
        scaleIn: "scaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both",
      },
      backgroundSize: {
        "shimmer-flow": "200% 100%",
      },
    },
  },
  plugins: [],
};

export default config;
