"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { IRE_DEMO_PREVIEW_SRC, prefetchIreDemoPreview } from "@/lib/ire-demo-preview";
import { sitePath } from "@/lib/sitePath";
import { VRI_PATHS } from "@/lib/vriProduct";

const SOFT_BLACK = "#282824";
const SOFT_BLACK_SURFACE = "#30302c";

export function VriProductPreview() {
  React.useEffect(() => {
    prefetchIreDemoPreview();
  }, []);

  return (
    <div
      className="vri-product-preview relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_34px_90px_-38px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05)]"
      style={{ backgroundColor: SOFT_BLACK }}
      aria-label="Virtual Research Institute workspace"
    >
      <div
        className="flex h-11 items-center gap-3 border-b border-white/[0.07] px-4 sm:px-5"
        style={{ backgroundColor: SOFT_BLACK_SURFACE }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex shrink-0 items-center gap-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 items-center gap-2 text-[#e8e8e4]">
            <span className="font-marketing text-[13px] font-light leading-none tracking-[0.02em]">
              [NH]
            </span>
            <span className="font-marketing text-[13px] font-medium leading-none">
              Virtual Research Institute
            </span>
          </div>
          <span className="hidden min-w-0 truncate font-mono text-[7.5px] leading-none tracking-tight text-[#e8e8e4]/35 sm:inline">
            ~/institute/atp-promise-r01
          </span>
        </div>
        <Link
          href={VRI_PATHS.workspace}
          className="btn-soft inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-[#317cff] px-3 font-marketing text-[11.5px] font-medium not-italic text-white hover:bg-[#4991e5]"
        >
          Open workspace <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div
        className="product-app-preview-screen vri-product-preview-screen relative aspect-[16/10] min-h-[420px] sm:min-h-[520px] lg:min-h-[640px]"
        style={{ backgroundColor: SOFT_BLACK }}
      >
        <div className="vri-product-preview-iframe-layer absolute inset-0 overflow-hidden">
          <iframe
            src={IRE_DEMO_PREVIEW_SRC}
            title="Live Virtual Research Institute workspace"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[125%] w-[125%] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.8] border-0"
            style={{ backgroundColor: SOFT_BLACK }}
            loading="eager"
            tabIndex={-1}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_14%,transparent_88%,rgba(0,0,0,0.14))]"
          aria-hidden
        />
        <div className="demo-cursor pointer-events-none absolute z-20">
          <img
            src={sitePath("/cursors/mac-hand-pointer.png")}
            alt=""
            aria-hidden
            className="h-12 w-12 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
