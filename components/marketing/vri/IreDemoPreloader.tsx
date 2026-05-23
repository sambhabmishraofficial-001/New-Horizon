"use client";

import * as React from "react";
import { prefetchIreDemoPreview } from "@/lib/ire-demo-preview";

/** Starts loading the IRE demo the moment the product page is opened. */
export function IreDemoPreloader() {
  React.useEffect(() => {
    prefetchIreDemoPreview();
  }, []);

  return null;
}
