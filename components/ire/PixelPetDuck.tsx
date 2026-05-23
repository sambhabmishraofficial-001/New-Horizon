"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const DUCK_COLORS: Record<string, string> = {
  ".": "transparent",
  Y: "#f5c518",
  O: "#e8871e",
  B: "#111110",
  W: "#ffffff",
  S: "#6bb8e8",
};

const DUCK_FRAMES: readonly string[][] = [
  [
    "..SSSS..",
    ".SSSSSS.",
    "..YYYY..",
    ".YYYYYY.",
    "YYYYYYYY",
    ".YBBBY..",
    "..Y..Y..",
    "..O..O..",
  ],
  [
    "..SSSS..",
    ".SSSSSS.",
    "..YYYY..",
    ".YYYYYY.",
    "YYYYYYYY",
    ".YBBBY..",
    "..Y..Y..",
    ".O....O.",
  ],
];

function PixelDuckFrame({ frame, scale = 2 }: { frame: readonly string[]; scale?: number }) {
  const height = frame.length * scale;
  const width = frame[0]?.length * scale;

  return (
    <div
      className="pixel-pet-duck__sprite"
      style={{ width, height, position: "relative", imageRendering: "pixelated" }}
      aria-hidden
    >
      {frame.map((row, y) =>
        row.split("").map((cell, x) => {
          const color = DUCK_COLORS[cell];
          if (!color || color === "transparent") return null;
          return (
            <span
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * scale,
                top: y * scale,
                width: scale,
                height: scale,
                backgroundColor: color,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export function PixelPetDuck({ className }: { className?: string }) {
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((prev) => (prev + 1) % DUCK_FRAMES.length);
    }, 220);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={cn("pixel-pet-duck", className)} aria-hidden>
      <div className="pixel-pet-duck__track">
        <div className="pixel-pet-duck__walker">
          <PixelDuckFrame frame={DUCK_FRAMES[frame] ?? DUCK_FRAMES[0]} />
        </div>
      </div>
    </div>
  );
}
