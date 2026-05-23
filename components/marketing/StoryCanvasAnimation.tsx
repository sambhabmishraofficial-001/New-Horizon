"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const CANVAS_WIDTH = 180;
const CANVAS_HEIGHT = 180;
const GLOBAL_SPEED = 0.5;
const INK_FILL = (opacity: number) =>
  `rgba(17, 17, 16, ${Math.max(0, Math.min(1, opacity))})`;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type AnimationSetupFunction = (ctx: CanvasRenderingContext2D) => () => void;

export type StoryCanvasAnimationId =
  | "crystalline-refraction"
  | "voxel-matrix-morph"
  | "crystalline-cube-refraction";

const setupCrystallineRefraction: AnimationSetupFunction = (ctx) => {
  let frameId: number;
  let time = 0;
  let lastTime = 0;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const gridSize = 15;
  const spacing = CANVAS_WIDTH / (gridSize - 1);
  const dots = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    x: (i % gridSize) * spacing,
    y: Math.floor(i / gridSize) * spacing,
  }));

  const animate = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    time += deltaTime * 0.16 * GLOBAL_SPEED;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const waveRadius = time % (CANVAS_WIDTH * 1.2);
    const waveWidth = 60;
    dots.forEach((dot) => {
      const dist = Math.hypot(dot.x - centerX, dot.y - centerY);
      const distToWave = Math.abs(dist - waveRadius);
      let displacement = 0;
      if (distToWave < waveWidth / 2) {
        const wavePhase = (distToWave / (waveWidth / 2)) * Math.PI;
        displacement = easeInOutCubic(Math.sin(wavePhase)) * 10;
      }
      const angleToCenter = Math.atan2(dot.y - centerY, dot.x - centerX);
      const dx = Math.cos(angleToCenter) * displacement;
      const dy = Math.sin(angleToCenter) * displacement;
      ctx.beginPath();
      ctx.arc(
        dot.x + dx,
        dot.y + dy,
        1.2 + (Math.abs(displacement) / 10) * 2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = INK_FILL(0.2 + (Math.abs(displacement) / 10) * 0.8);
      ctx.fill();
    });
    frameId = requestAnimationFrame(animate);
  };
  frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
};

const setupVoxelMatrixMorph: AnimationSetupFunction = (ctx) => {
  let frameId: number;
  let time = 0;
  let lastTime = 0;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const gridSize = 5;
  const spacing = 20;
  const totalSize = (gridSize - 1) * spacing;
  const points = Array.from({ length: gridSize ** 3 }, (_, i) => ({
    x: ((i % gridSize) - (gridSize - 1) / 2) * spacing,
    y: (Math.floor(i / gridSize) % gridSize - (gridSize - 1) / 2) * spacing,
    z: (Math.floor(i / gridSize ** 2) - (gridSize - 1) / 2) * spacing,
  }));

  const animate = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    time += (timestamp - lastTime) * 0.0005 * GLOBAL_SPEED;
    lastTime = timestamp;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const rotX = time * 0.4;
    const rotY = time * 0.6;
    const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
    const scanLine = (easedTime * 2 - 1) * (totalSize / 2 + 10);
    const scanWidth = 30;
    points.forEach((p) => {
      let { x, y, z } = p;
      let nX = x * Math.cos(rotY) - z * Math.sin(rotY);
      let nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
      x = nX;
      z = nZ;
      let nY = y * Math.cos(rotX) - z * Math.sin(rotX);
      nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = nY;
      z = nZ;
      const distToScan = Math.abs(y - scanLine);
      let scanInfluence = 0;
      let displacement = 1;
      if (distToScan < scanWidth) {
        scanInfluence = Math.cos((distToScan / scanWidth) * (Math.PI / 2));
        displacement = 1 + scanInfluence * 0.4;
      }
      const scale = (z + 80) / 160;
      ctx.beginPath();
      ctx.arc(
        centerX + x * displacement,
        centerY + y * displacement,
        Math.max(0, scale * 2 + scanInfluence * 2),
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = INK_FILL(Math.max(0.1, scale * 0.7 + scanInfluence * 0.3));
      ctx.fill();
    });
    frameId = requestAnimationFrame(animate);
  };
  frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
};

const setupCrystallineCubeRefraction: AnimationSetupFunction = (ctx) => {
  let frameId: number;
  let time = 0;
  let lastTime = 0;
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const fov = 250;
  const gridSize = 7;
  const spacing = 15;
  const cubeHalfSize = ((gridSize - 1) * spacing) / 2;
  const maxDist = Math.hypot(cubeHalfSize, cubeHalfSize, cubeHalfSize);
  const points: { x: number; y: number; z: number }[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        points.push({
          x: x * spacing - cubeHalfSize,
          y: y * spacing - cubeHalfSize,
          z: z * spacing - cubeHalfSize,
        });
      }
    }
  }

  const animate = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    time += (timestamp - lastTime) * 0.0003 * GLOBAL_SPEED;
    lastTime = timestamp;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const rotX = time * 2;
    const rotY = time * 3;
    const waveRadius = (timestamp * 0.04 * GLOBAL_SPEED) % (maxDist * 1.5);
    const waveWidth = 40;
    const displacementMagnitude = 10;
    const pointsToDraw: {
      x: number;
      y: number;
      z: number;
      size: number;
      opacity: number;
    }[] = [];
    points.forEach((pOrig) => {
      let { x, y, z } = pOrig;
      const distFromCenter = Math.hypot(x, y, z);
      let waveInfluence = 0;
      if (
        distFromCenter > 0 &&
        Math.abs(distFromCenter - waveRadius) < waveWidth / 2
      ) {
        const displacementAmount =
          easeInOutCubic(
            Math.cos(
              (Math.abs(distFromCenter - waveRadius) / (waveWidth / 2)) *
                (Math.PI / 2),
            ),
          ) * displacementMagnitude;
        const ratio = (distFromCenter + displacementAmount) / distFromCenter;
        x *= ratio;
        y *= ratio;
        z *= ratio;
        waveInfluence = displacementAmount / displacementMagnitude;
      }
      let tX = x * Math.cos(rotY) - z * Math.sin(rotY);
      let tZ = x * Math.sin(rotY) + z * Math.cos(rotY);
      x = tX;
      z = tZ;
      let tY = y * Math.cos(rotX) - z * Math.sin(rotX);
      tZ = y * Math.sin(rotX) + z * Math.cos(rotX);
      y = tY;
      z = tZ;
      const scale = fov / (fov + z);
      const size = (1.5 + waveInfluence * 2.5) * scale;
      if (size > 0.1) {
        pointsToDraw.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          z,
          size,
          opacity: Math.max(0.1, scale * 0.7 + waveInfluence * 0.4),
        });
      }
    });
    pointsToDraw
      .sort((a, b) => a.z - b.z)
      .forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = INK_FILL(p.opacity);
        ctx.fill();
      });
    frameId = requestAnimationFrame(animate);
  };
  frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
};

const animationMap: Record<StoryCanvasAnimationId, AnimationSetupFunction> = {
  "crystalline-refraction": setupCrystallineRefraction,
  "voxel-matrix-morph": setupVoxelMatrixMorph,
  "crystalline-cube-refraction": setupCrystallineCubeRefraction,
};

interface StoryCanvasAnimationProps {
  animationId: StoryCanvasAnimationId;
  className?: string;
  "aria-hidden"?: boolean;
}

export function StoryCanvasAnimation({
  animationId,
  className,
  "aria-hidden": ariaHidden = true,
}: StoryCanvasAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const setup = animationMap[animationId];
    if (!setup) return;
    return setup(ctx);
  }, [animationId, isInView]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "story-canvas-animation relative flex shrink-0 items-center justify-center",
        className,
      )}
      aria-hidden={ariaHidden}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="h-[180px] w-[180px]"
      />
    </div>
  );
}
