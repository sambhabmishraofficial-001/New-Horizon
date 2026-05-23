"use client";

import * as React from "react";

export function useVriCardTilt(enabled: boolean) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const animationRef = React.useRef(0);
  const timeRef = React.useRef(0);
  const rotationRef = React.useRef({ x: 8, y: 12, z: 3 });
  const rotationSpeedRef = React.useRef({ x: 0.15, y: 0.22, z: 0.04 });

  const animate = React.useCallback(() => {
    const card = cardRef.current;
    if (!card || isHovered || !enabled) return;

    rotationRef.current.x += rotationSpeedRef.current.x;
    rotationRef.current.y += rotationSpeedRef.current.y;
    rotationRef.current.z += rotationSpeedRef.current.z;

    if (Math.abs(rotationRef.current.x) > 12) rotationSpeedRef.current.x *= -1;
    if (Math.abs(rotationRef.current.y) > 12) rotationSpeedRef.current.y *= -1;
    if (Math.abs(rotationRef.current.z) > 4) rotationSpeedRef.current.z *= -1;

    card.style.transform = `rotateX(${rotationRef.current.x}deg) rotateY(${rotationRef.current.y}deg) rotateZ(${rotationRef.current.z}deg)`;
    animationRef.current = requestAnimationFrame(animate);
  }, [enabled, isHovered]);

  React.useEffect(() => {
    if (!enabled) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angleX = ((e.clientY - centerY) / (rect.height / 2)) * 40;
      const angleY = (-(e.clientX - centerX) / (rect.width / 2)) * 40;
      card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) rotateZ(${Math.min(Math.abs(angleX) + Math.abs(angleY), 16) / 12}deg)`;
    };

    const onEnter = () => {
      setIsHovered(true);
      cancelAnimationFrame(animationRef.current);
    };

    const onLeave = () => {
      setIsHovered(false);
      if (!reduced) animationRef.current = requestAnimationFrame(animate);
    };

    if (!reduced) {
      animationRef.current = requestAnimationFrame(animate);
      timeRef.current = requestAnimationFrame(function tick() {
        setTime((t) => t + 0.01);
        timeRef.current = requestAnimationFrame(tick);
      });
    }

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      cancelAnimationFrame(timeRef.current);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [animate, enabled]);

  return { cardRef, time };
}
