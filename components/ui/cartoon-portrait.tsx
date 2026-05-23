"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { getCaricatureAvatarUrl } from "@/lib/avatarCaricature";

type CartoonPortraitProps = {
  userId: string;
  photoUrl?: string | null;
  holderInitials?: string;
  alt?: string;
  className?: string;
};

function posterizeChannel(value: number, levels: number): number {
  const step = 255 / levels;
  return Math.round(Math.round(value / step) * step);
}

/** Posterize + edge emphasis for a caricature / cartoon look on uploaded photos. */
function cartoonizeImageData(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const levels = 6;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = posterizeChannel(data[i], levels);
    data[i + 1] = posterizeChannel(data[i + 1], levels);
    data[i + 2] = posterizeChannel(data[i + 2], levels);
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const satBoost = 1.28;
    data[i] = Math.min(255, avg + (data[i] - avg) * satBoost);
    data[i + 1] = Math.min(255, avg + (data[i + 1] - avg) * satBoost);
    data[i + 2] = Math.min(255, avg + (data[i + 2] - avg) * satBoost);
  }

  ctx.putImageData(imageData, 0, 0);

  const edgeData = ctx.getImageData(0, 0, width, height);
  const src = edgeData.data;
  const out = ctx.createImageData(width, height);
  const dst = out.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;
      const up = ((y - 1) * width + x) * 4;
      const down = ((y + 1) * width + x) * 4;
      const gx =
        -src[left] +
        src[right] -
        src[left + 1] +
        src[right + 1] -
        src[left + 2] +
        src[right + 2];
      const gy =
        -src[up] +
        src[down] -
        src[up + 1] +
        src[down + 1] -
        src[up + 2] +
        src[down + 2];
      const edge = Math.min(255, Math.hypot(gx, gy) * 0.38);
      dst[idx] = src[idx];
      dst[idx + 1] = src[idx + 1];
      dst[idx + 2] = src[idx + 2];
      dst[idx + 3] = 255;
      if (edge > 40) {
        dst[idx] *= 0.5;
        dst[idx + 1] *= 0.5;
        dst[idx + 2] *= 0.5;
      }
    }
  }

  ctx.putImageData(out, 0, 0);
}

export function CartoonPortrait({
  userId,
  photoUrl,
  alt = "Researcher caricature portrait",
  className,
}: CartoonPortraitProps) {
  const [cartoonPhoto, setCartoonPhoto] = React.useState<string | null>(null);
  const [photoFailed, setPhotoFailed] = React.useState(false);
  const generatedUrl = getCaricatureAvatarUrl(userId, photoUrl);

  React.useEffect(() => {
    setPhotoFailed(false);
    setCartoonPhoto(null);

    if (!photoUrl) return;

    let cancelled = false;
    const img = new Image();
    if (!photoUrl.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      if (cancelled) return;
      const size = 280;
      const canvas = document.createElement("canvas");
      const aspect = img.width / img.height;
      let w = size;
      let h = size;
      if (aspect > 1) h = Math.round(size / aspect);
      else w = Math.round(size * aspect);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, w, h);
      cartoonizeImageData(ctx, w, h);
      try {
        setCartoonPhoto(canvas.toDataURL("image/png", 0.9));
      } catch {
        setPhotoFailed(true);
      }
    };
    img.onerror = () => {
      if (!cancelled) setPhotoFailed(true);
    };
    img.src = photoUrl;

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  const useCartoonPhoto = Boolean(photoUrl && cartoonPhoto && !photoFailed);
  const src = useCartoonPhoto ? cartoonPhoto! : generatedUrl;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="vri-id-card-metallic__portrait-img"
      />
      <div
        className="vri-id-card-metallic__portrait-gloss pointer-events-none absolute inset-0"
        aria-hidden
      />
    </div>
  );
}
