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
          "var(--font-geist-sans)",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        marketing: [
          "var(--font-geist-sans)",
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
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
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgba(17,17,16,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,16,0.045) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        noise:
          "radial-gradient(rgba(17,17,16,0.04) 1px, transparent 1px)",
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
      },
      animation: {
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
        shimmer: "shimmer 2.8s linear infinite",
        shimmer2: "shimmer2 2s infinite linear",
        drawStroke: "drawStroke 2.5s infinite",
        textShimmerBreadcrumb: "textShimmerBreadcrumb 2s ease-in-out infinite",
      },
      backgroundSize: {
        "shimmer-flow": "200% 100%",
      },
    },
  },
  plugins: [],
};

export default config;
