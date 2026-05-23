"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { X } from "lucide-react";
import {
  FileCard,
  type FormatFileProps,
} from "@/components/ui/file-card";
import { cn } from "@/lib/cn";

export interface FileSphereItem {
  id: string;
  formatFile: FormatFileProps;
  title: string;
  description?: string;
}

export interface SphereFileGridProps {
  files?: FileSphereItem[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseItemScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

interface Position3D {
  x: number;
  y: number;
  z: number;
}

interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}

interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}

interface RotationState {
  x: number;
  y: number;
  z: number;
}

interface VelocityState {
  x: number;
  y: number;
}

const SPHERE_MATH = {
  degreesToRadians: (degrees: number): number => degrees * (Math.PI / 180),
  normalizeAngle: (angle: number): number => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  },
};

export const scientificResearchFiles: FileSphereItem[] = [
  {
    id: "1",
    formatFile: "pdf",
    title: "ribozyme-kinetics.pdf",
    description: "Preprint on catalytic rate constants and folding intermediates.",
  },
  {
    id: "2",
    formatFile: "csv",
    title: "rna-seq-counts.csv",
    description: "Normalized transcript counts from a 96-well perturbation screen.",
  },
  {
    id: "3",
    formatFile: "xlsx",
    title: "plate-reader-assay.xlsx",
    description: "Enzyme activity curves with replicate metadata.",
  },
  {
    id: "4",
    formatFile: "md",
    title: "lab-notebook.md",
    description: "Daily bench notes, deviations, and sample lineage.",
  },
  {
    id: "5",
    formatFile: "json",
    title: "sample-manifest.json",
    description: "Structured metadata for cohorts, batches, and instruments.",
  },
  {
    id: "6",
    formatFile: "pptx",
    title: "group-meeting.pptx",
    description: "Figures and interim results for the weekly lab meeting.",
  },
  {
    id: "7",
    formatFile: "png",
    title: "he-stain-004.png",
    description: "Histology slice from the latest tissue validation run.",
  },
  {
    id: "8",
    formatFile: "tsx",
    title: "fit-kinetics.tsx",
    description: "Analysis script for nonlinear regression on time-series data.",
  },
  {
    id: "9",
    formatFile: "pdf",
    title: "review-catalysis.pdf",
    description: "Foundational review cited across the program's literature graph.",
  },
  {
    id: "10",
    formatFile: "csv",
    title: "mass-spec-peaks.csv",
    description: "Peak tables exported from the Orbitrap acquisition pipeline.",
  },
  {
    id: "11",
    formatFile: "mdx",
    title: "methods-draft.mdx",
    description: "Living methods section linked to executable notebooks.",
  },
  {
    id: "12",
    formatFile: "zip",
    title: "sequencer-run.zip",
    description: "Raw instrument export bundled with run-level QC reports.",
  },
  {
    id: "13",
    formatFile: "json",
    title: "pipeline-config.json",
    description: "Nextflow parameters for reproducible batch processing.",
  },
  {
    id: "14",
    formatFile: "doc",
    title: "aims-overview.doc",
    description: "Grant supplement outlining hypotheses and milestones.",
  },
  {
    id: "15",
    formatFile: "jpg",
    title: "western-blot.jpg",
    description: "Protein expression validation for the latest construct.",
  },
  {
    id: "16",
    formatFile: "pdf",
    title: "supplementary-figures.pdf",
    description: "Extended data tables and control experiments.",
  },
  {
    id: "17",
    formatFile: "csv",
    title: "flow-cytometry.csv",
    description: "Gated population statistics from the immunology panel.",
  },
  {
    id: "18",
    formatFile: "code",
    title: "simulate-pathway.py",
    description: "ODE model exploring feedback under parameter sweeps.",
  },
  {
    id: "19",
    formatFile: "png",
    title: "microscopy-stack.png",
    description: "Composite fluorescence image from the confocal time course.",
  },
  {
    id: "20",
    formatFile: "txt",
    title: "protocol-v2.txt",
    description: "Bench protocol for cell culture and treatment schedule.",
  },
];

export function SphereFileGrid({
  files = scientificResearchFiles,
  containerSize = 480,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseItemScale = 0.22,
  perspective = 1000,
  autoRotate = true,
  autoRotateSpeed = 0.25,
  className = "",
}: SphereFileGridProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState<RotationState>({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState<VelocityState>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileSphereItem | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseItemSize = containerSize * baseItemScale;

  const generateSpherePositions = useCallback((): SphericalPosition[] => {
    const positions: SphericalPosition[] = [];
    const imageCount = files.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = (2 * Math.PI) / goldenRatio;

    for (let i = 0; i < imageCount; i++) {
      const t = i / imageCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      let phi = inclination * (180 / Math.PI);
      let theta = (azimuth * (180 / Math.PI)) % 360;

      const poleBonus = (Math.abs(phi - 90) / 90) ** 0.6 * 35;
      if (phi < 90) {
        phi = Math.max(5, phi - poleBonus);
      } else {
        phi = Math.min(175, phi + poleBonus);
      }

      phi = 15 + (phi / 180) * 150;

      const randomOffset = (Math.random() - 0.5) * 20;
      theta = (theta + randomOffset) % 360;
      phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));

      positions.push({
        theta,
        phi,
        radius: actualSphereRadius,
      });
    }

    return positions;
  }, [files.length, actualSphereRadius]);

  const clampRotationSpeed = useCallback(
    (speed: number): number =>
      Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed)),
    [maxRotationSpeed]
  );

  const worldPositions = useMemo((): WorldPosition[] => {
    const positions = imagePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
      const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
      const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);

      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      let y = pos.radius * Math.cos(phiRad);
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);

      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1;
      z = z1;

      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2;
      z = z2;

      const fadeZoneStart = -10;
      const fadeZoneEnd = -30;
      const isVisible = z > fadeZoneEnd;

      let fadeOpacity = 1;
      if (z <= fadeZoneStart) {
        fadeOpacity = Math.max(
          0,
          (z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd)
        );
      }

      const isPoleImage = pos.phi < 30 || pos.phi > 150;
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      const distanceRatio = Math.min(distanceFromCenter / actualSphereRadius, 1);
      const distancePenalty = isPoleImage ? 0.4 : 0.7;
      const centerScale = Math.max(0.3, 1 - distanceRatio * distancePenalty);
      const depthScale = (z + actualSphereRadius) / (2 * actualSphereRadius);
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);

      return {
        x,
        y,
        z,
        scale,
        zIndex: Math.round(1000 + z),
        isVisible,
        fadeOpacity,
        originalIndex: index,
      };
    });

    const adjustedPositions = [...positions];

    for (let i = 0; i < adjustedPositions.length; i++) {
      const pos = adjustedPositions[i];
      if (!pos.isVisible) continue;

      let adjustedScale = pos.scale;
      const itemSize = baseItemSize * adjustedScale;

      for (let j = 0; j < adjustedPositions.length; j++) {
        if (i === j) continue;
        const other = adjustedPositions[j];
        if (!other.isVisible) continue;

        const otherSize = baseItemSize * other.scale;
        const dx = pos.x - other.x;
        const dy = pos.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (itemSize + otherSize) / 2 + 25;

        if (distance < minDistance && distance > 0) {
          const overlap = minDistance - distance;
          const reductionFactor = Math.max(
            0.4,
            1 - (overlap / minDistance) * 0.6
          );
          adjustedScale = Math.min(adjustedScale, adjustedScale * reductionFactor);
        }
      }

      adjustedPositions[i] = {
        ...pos,
        scale: Math.max(0.25, adjustedScale),
      };
    }

    return adjustedPositions;
  }, [imagePositions, rotation, actualSphereRadius, baseItemSize]);

  const updateMomentum = useCallback(() => {
    if (isDragging) return;

    setVelocity((prev) => {
      const newVelocity = {
        x: prev.x * momentumDecay,
        y: prev.y * momentumDecay,
      };

      if (
        !autoRotate &&
        Math.abs(newVelocity.x) < 0.01 &&
        Math.abs(newVelocity.y) < 0.01
      ) {
        return { x: 0, y: 0 };
      }

      return newVelocity;
    });

    setRotation((prev) => {
      let newY = prev.y;
      if (autoRotate) newY += autoRotateSpeed;
      newY += clampRotationSpeed(velocity.y);

      return {
        x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(velocity.x)),
        y: SPHERE_MATH.normalizeAngle(newY),
        z: prev.z,
      };
    });
  }, [
    isDragging,
    momentumDecay,
    velocity,
    clampRotationSpeed,
    autoRotate,
    autoRotateSpeed,
  ]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      const rotationDelta = {
        x: -deltaY * dragSensitivity,
        y: deltaX * dragSensitivity,
      };

      setRotation((prev) => ({
        x: SPHERE_MATH.normalizeAngle(
          prev.x + clampRotationSpeed(rotationDelta.x)
        ),
        y: SPHERE_MATH.normalizeAngle(
          prev.y + clampRotationSpeed(rotationDelta.y)
        ),
        z: prev.z,
      }));

      setVelocity({
        x: clampRotationSpeed(rotationDelta.x),
        y: clampRotationSpeed(rotationDelta.y),
      });

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging, dragSensitivity, clampRotationSpeed]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePos.current.x;
      const deltaY = touch.clientY - lastMousePos.current.y;
      const rotationDelta = {
        x: -deltaY * dragSensitivity,
        y: deltaX * dragSensitivity,
      };

      setRotation((prev) => ({
        x: SPHERE_MATH.normalizeAngle(
          prev.x + clampRotationSpeed(rotationDelta.x)
        ),
        y: SPHERE_MATH.normalizeAngle(
          prev.y + clampRotationSpeed(rotationDelta.y)
        ),
        z: prev.z,
      }));

      setVelocity({
        x: clampRotationSpeed(rotationDelta.x),
        y: clampRotationSpeed(rotationDelta.y),
      });

      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    },
    [isDragging, dragSensitivity, clampRotationSpeed]
  );

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    setImagePositions(generateSpherePositions());
    setIsMounted(true);
  }, [generateSpherePositions]);

  useEffect(() => {
    if (!isMounted) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isMounted]);

  useEffect(() => {
    const animate = () => {
      updateMomentum();
      animationFrame.current = requestAnimationFrame(animate);
    };

    if (isMounted && isInView) {
      animationFrame.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isMounted, isInView, updateMomentum]);

  useEffect(() => {
    if (!isMounted || !isInView) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMounted, isInView, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  if (!files.length) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-dashed border-ink-900/15 bg-ink-50"
        style={{ width: containerSize, height: containerSize }}
      >
        <p className="text-sm text-ink-400">No files to display</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className={cn(
          "relative cursor-grab select-none active:cursor-grabbing",
          className
        )}
        style={{
          width: containerSize,
          height: containerSize,
          perspective: `${perspective}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {!isMounted || imagePositions.length === 0 ? (
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-ink-900/[0.04]" />
        ) : null}

        <div className="relative h-full w-full" style={{ zIndex: 10 }}>
          {files.map((file, index) => {
            const position = worldPositions[index];
            if (!position || !position.isVisible) return null;

            const itemSize = baseItemSize * position.scale;
            const isHovered = hoveredIndex === index;
            const finalScale = isHovered ? Math.min(1.15, 1.15 / position.scale) : 1;

            return (
              <div
                key={file.id}
                className="absolute transition-transform duration-200 ease-out"
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  left: `${containerSize / 2 + position.x}px`,
                  top: `${containerSize / 2 + position.y}px`,
                  opacity: position.fadeOpacity,
                  transform: `translate(-50%, -50%) scale(${finalScale})`,
                  zIndex: position.zIndex,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedFile(file)}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <FileCard formatFile={file.formatFile} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/30 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-ink-900/10 bg-white p-6 shadow-editorial"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <FileCard formatFile={selectedFile.formatFile} />
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900/5 text-ink-600 transition hover:bg-ink-900/10"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="mt-5 font-marketing text-base font-medium text-ink-900">
              {selectedFile.title}
            </h3>
            {selectedFile.description && (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {selectedFile.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SphereFileGrid;
