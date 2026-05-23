import type { GradientBackgroundProps } from "@/components/ui/noisy-gradient-backgrounds";

export const MARKETING_GRADIENTS = {
  twins: {
    gradientOrigin: "top-left",
    colors: [
      { color: "rgba(0,20,30,1)", stop: "0%" },
      { color: "rgba(0,51,78,1)", stop: "20%" },
      { color: "rgba(0,119,182,1)", stop: "50%" },
      { color: "rgba(3,169,244,1)", stop: "75%" },
      { color: "rgba(173,216,230,1)", stop: "100%" },
    ],
    noiseIntensity: 0.8,
    noisePatternSize: 100,
    noisePatternRefreshInterval: 1,
  },
  invariants: {
    gradientOrigin: "top-middle",
    colors: [
      { color: "rgba(38,50,56,1)", stop: "0%" },
      { color: "rgba(84,110,122,1)", stop: "30%" },
      { color: "rgba(176,190,197,1)", stop: "60%" },
      { color: "rgba(236,239,241,1)", stop: "85%" },
      { color: "rgba(255,255,255,1)", stop: "100%" },
    ],
    noiseIntensity: 1.3,
    noisePatternSize: 100,
    noisePatternRefreshInterval: 1,
  },
  criticalPath: {
    gradientOrigin: "bottom-right",
    colors: [
      { color: "rgba(120,40,40,1)", stop: "0%" },
      { color: "rgba(188,71,73,1)", stop: "30%" },
      { color: "rgba(244,143,177,1)", stop: "60%" },
      { color: "rgba(252,207,178,1)", stop: "85%" },
      { color: "rgba(255,235,215,1)", stop: "100%" },
    ],
    noiseIntensity: 1.1,
    noisePatternSize: 95,
    noisePatternRefreshInterval: 2,
  },
} as const satisfies Record<string, GradientBackgroundProps>;

export type MarketingGradientKey = keyof typeof MARKETING_GRADIENTS;
