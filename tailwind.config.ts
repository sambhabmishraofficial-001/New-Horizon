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
          "Geist",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "Exposure",
          "Georgia",
          "serif",
        ],
        editorial: [
          "Exposure",
          "Georgia",
          "serif",
        ],
        marketing: [
          "Geist",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
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
          50: "#FBFAF6",
          100: "#F5F2EA",
          200: "#EAE4D3",
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
      },
      animation: {
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
        shimmer: "shimmer 2.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
