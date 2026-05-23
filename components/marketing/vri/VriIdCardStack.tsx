"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getVriIdCredentials } from "@/lib/vriId";
import { DEMO_RESEARCHERS } from "@/lib/vriIdDemo";
import { VriIdCardFace } from "@/components/ui/vri-id-card-face";

type StackPosition = "front" | "middle" | "back";

function positionForSlot(slot: number): StackPosition {
  if (slot === 0) return "front";
  if (slot === 1) return "middle";
  return "back";
}

type VriIdStackCardProps = {
  researcherIndex: number;
  position: StackPosition;
  onShuffle: () => void;
};

function VriIdStackCard({
  researcherIndex,
  position,
  onShuffle,
}: VriIdStackCardProps) {
  const reducedMotion = useReducedMotion();
  const isFront = position === "front";
  const researcher = DEMO_RESEARCHERS[researcherIndex];
  const credentials = getVriIdCredentials(
    researcher.userId,
    researcher.name,
  );

  return (
    <motion.div
      className="absolute left-0 top-0 w-full"
      style={{
        zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
      }}
      animate={{
        rotate: position === "front" ? -6 : position === "middle" ? 0 : 6,
        x: position === "front" ? "0%" : position === "middle" ? "28%" : "56%",
      }}
      drag={isFront && !reducedMotion}
      dragElastic={0.35}
      dragListener={isFront && !reducedMotion}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100) {
          onShuffle();
        }
      }}
      transition={{ duration: 0.35 }}
    >
      <div className={isFront ? "cursor-grab active:cursor-grabbing" : ""}>
        <VriIdCardFace
          credentials={credentials}
          userId={researcher.userId}
          brandLabel="New Horizon · VRI"
          inactive={false}
          holderInitials={researcher.initials}
          interactive={isFront}
        />
      </div>
    </motion.div>
  );
}

export function VriIdCardStack() {
  const [order, setOrder] = React.useState([0, 1, 2]);

  const handleShuffle = React.useCallback(() => {
    setOrder((prev) => {
      const next = [...prev];
      next.push(next.shift()!);
      return next;
    });
  }, []);

  return (
    <div className="relative h-[15.5rem] w-full sm:h-[16rem]">
      {[2, 1, 0].map((slot) => {
        const researcherIndex = order[slot];
        const position = positionForSlot(slot);
        const researcher = DEMO_RESEARCHERS[researcherIndex];

        return (
          <VriIdStackCard
            key={researcher.userId}
            researcherIndex={researcherIndex}
            position={position}
            onShuffle={handleShuffle}
          />
        );
      })}
      <p className="absolute -bottom-8 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
        Drag front card left to shuffle
      </p>
    </div>
  );
}
