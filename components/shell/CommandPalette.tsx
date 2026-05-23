"use client";

import { InstituteSpotlight } from "@/components/shell/InstituteSpotlight";

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <InstituteSpotlight open={open} onClose={onClose} />;
}
