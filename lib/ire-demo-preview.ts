import { sitePath } from "@/lib/sitePath";



export const IRE_DEMO_PREVIEW_SRC = `${sitePath("/ire/")}?theme=dark&demo=1`;



let prefetched = false;



/** Warm the demo document as early as possible. Safe to call repeatedly. */

export function prefetchIreDemoPreview() {

  if (typeof window === "undefined" || prefetched) return;

  prefetched = true;



  const existing = document.querySelector('link[data-ire-demo-prefetch="1"]');

  if (existing) return;



  const link = document.createElement("link");

  link.rel = "prefetch";

  link.as = "document";

  link.href = IRE_DEMO_PREVIEW_SRC;

  link.setAttribute("data-ire-demo-prefetch", "1");

  document.head.appendChild(link);

}

