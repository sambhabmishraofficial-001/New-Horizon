"use client";

import { useEffect, useMemo, useState } from "react";
import { InfiniteBentoPan } from "@/components/marketing/InfiniteBentoPan";
import { cn } from "@/lib/cn";

export function InstituteBentoPreview({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [Player, setPlayer] = useState<typeof import("@remotion/player").Player | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
    import("@remotion/player").then((mod) => setPlayer(() => mod.Player));
  }, []);

  const inputProps = useMemo(
    () => ({
      speed: 1,
      panSpeed: 1,
      accentColor: "#2563eb",
      light: true,
      startProgress: 0.38,
    }),
    []
  );

  return (
    <div className={cn("mx-auto w-full max-w-[1100px]", className)}>
      <div className="overflow-hidden bg-white">
        {!mounted || !Player ? (
          <div
            className="w-full animate-pulse bg-ink-900/[0.04]"
            style={{ aspectRatio: "1280 / 520" }}
            aria-hidden
          />
        ) : (
          <Player
            component={InfiniteBentoPan}
            inputProps={inputProps}
            durationInFrames={240}
            fps={30}
            compositionWidth={1280}
            compositionHeight={520}
            autoPlay
            loop
            controls={false}
            clickToPlay={false}
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "1280 / 520",
              display: "block",
              background: "transparent",
            }}
          />
        )}
      </div>
    </div>
  );
}
