"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { sitePath } from "@/lib/sitePath";

const pillars = [
  {
    index: "01",
    title: "Twins",
    body:
      "Six of fourteen Twins on duty. Each with a role: literature synthesist, invariant auditor, experiment designer, generative modeler, anomaly triage. Named, persistent, accountable.",
  },
  {
    index: "02",
    title: "Invariants",
    body:
      "412 of 418 invariants holding. Every claim your institute makes is checked against the formal properties of your domain — energy monotonicity, kinetic saturation, calibration bounds. Wrong answers don't ship.",
  },
  {
    index: "03",
    title: "Critical Path",
    body:
      "Hypothesis → Invariant → Environment → Evidence. Every program has one path that matters. Your institute keeps it visible, executable, and four moves from a testable claim.",
  },
];

const principles = [
  {
    lead: "Persistent.",
    body:
      "Your institute remembers every paper, dataset, hypothesis, run, and result — across years, not sessions. Branches, replicates, attestations are first-class.",
  },
  {
    lead: "Accountable.",
    body:
      "Every claim traces to its source. Every result traces to the run that produced it. Every invariant violation gets a name, a candidate, and a rebuttal experiment.",
  },
  {
    lead: "Yours.",
    body:
      "Your data, your IP, your compute. Bring your cluster. Bring your wet-lab. The institute is hosted; the science stays yours.",
  },
];

const partnerLogos = [
  {
    name: "University of Sheffield",
    src: "/logos/university-of-sheffield-full-v3.png",
    className: "max-h-[78px] max-w-[258px]",
  },
  {
    name: "University College London",
    src: "/logos/ucl-full-v3.png",
    className: "max-h-[84px] max-w-[244px]",
  },
  {
    name: "Johns Hopkins University",
    src: "/logos/johns-hopkins-university.png",
    className: "max-h-[67px] max-w-[220px]",
  },
  {
    name: "National Institute of Science Education and Research",
    src: "/logos/niser.png",
    className: "max-h-[74px] max-w-[119px]",
  },
];

export default function LandingPage() {
  const [showProduct, setShowProduct] = useState(false);

  function openProduct() {
    setShowProduct(true);
    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 0);
  }

  if (!showProduct) {
    return (
      <div className="marketing-site min-h-screen bg-white text-ink-900 font-marketing">
        <MarketingNav variant="light" />
        <main className="bg-white">
          <section className="bg-white px-4 py-24 text-ink-900 sm:px-6">
            <div className="mx-auto max-w-[980px]">
              <p className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Click the VRI [NH] icon to open the product page
              </p>
              <RetroComputer onOpen={openProduct} />
            </div>
          </section>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="marketing-site min-h-screen bg-white text-ink-900 font-marketing">
      {/* ============================================================
          HERO — obsidian aurora editorial
          ============================================================ */}
      <section className="relative isolate overflow-hidden bg-white text-ink-900">
        <div className="hidden" aria-hidden />
        <div className="hidden" aria-hidden />
        <div className="hidden" aria-hidden />
        <div
          className="hidden"
          aria-hidden
        />
        <MarketingNav variant="light" />

        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 pb-28 pt-20 text-center sm:px-10 sm:pb-36 sm:pt-28">
          <div className="mb-5 flex items-center justify-center gap-2" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <h1 className="max-w-[14ch] text-balance font-editorial text-[58px] leading-[0.98] sm:text-[92px]">
            AI Native Virtual Research Institute
          </h1>

          <p className="mx-auto mt-7 max-w-[58ch] text-[17.5px] leading-[1.7] text-ink-600">
            New Horizon is the first AI-native Virtual Research Institute. Your
            twins read the literature, propose experiments,
            run them on your compute, audit invariants, and draft the manuscript —
            at your pace, on your science.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/enrol"
              className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl bg-ink-900 px-5 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800"
            >
              Request Access <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/atrium"
              className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl border border-ink-900/15 bg-white px-5 font-marketing text-[13.5px] font-medium not-italic text-ink-900 hover:bg-ink-50"
            >
              See the live institute
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================
          PRODUCT PREVIEW — premium framed mockup
          ============================================================ */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-0 sm:px-6">
          <HeroPreview />

          <div className="mt-14 border-t border-ink-900/8 pt-10">
            <div className="mb-7 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Trusted by researchers from
            </div>
            <div className="mx-auto flex max-w-[1080px] items-center justify-center gap-x-2 overflow-x-auto sm:gap-x-3">
              {partnerLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="logo-tile flex h-[98px] w-[208px] shrink-0 items-center justify-center"
                >
                  <img
                                src={sitePath(logo.src)}
                    alt={logo.name}
                    className={`${logo.className} object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PILLARS — editorial numbered cards
          ============================================================ */}
      <section
        id="how-it-works"
        className="border-t border-ink-900/8 bg-white"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-28 sm:px-10">
          <div className="max-w-[60ch]">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              How it works
            </div>
            <h2 className="mt-3 font-editorial text-[44px] leading-[1.05] text-ink-900 sm:text-[56px]">
              An institute,
              <span className="font-editorial"> not a chatbot.</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-px bg-ink-900/8 lg:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.index}
                className="group relative bg-white p-10"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                  {p.index}
                </div>
                <h3 className="mt-6 font-editorial text-[34px] leading-[1.05] text-ink-900">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-[42ch] text-[14.5px] leading-[1.75] text-ink-600">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-900/8 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-28 sm:px-6">
          <div className="mb-10 max-w-[58ch] px-2 sm:px-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Institute simulation
            </div>
            <h2 className="mt-3 font-editorial text-[40px] leading-[1.05] text-ink-900 sm:text-[52px]">
              Virtual labs, visible in motion.
            </h2>
          </div>

          <SimulationPreview />
        </div>
      </section>

      {/* ============================================================
          PRINCIPLES — alternating editorial rows
          ============================================================ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[980px] px-6 py-28 sm:px-10">
          <div className="max-w-[56ch]">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              First principles
            </div>
            <h2 className="mt-3 font-editorial text-[40px] leading-[1.05] text-ink-900 sm:text-[52px]">
              Built like an institute.
              <br />
              <span className="font-editorial text-ink-700">
                Not a notebook. Not a chatbot.
              </span>
            </h2>
          </div>

          <div className="mt-14 divide-y divide-ink-900/10 border-y border-ink-900/10">
            {principles.map((row) => (
              <div
                key={row.lead}
                className="grid gap-6 py-10 sm:grid-cols-[200px_1fr]"
              >
                <div className="font-editorial text-[24px] leading-tight text-ink-900">
                  {row.lead}
                </div>
                <p className="max-w-[64ch] text-[15.5px] leading-[1.85] text-ink-600">
                  {row.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section className="relative isolate overflow-hidden border-t border-ink-900/8 bg-white text-ink-900">
        <div className="hidden" aria-hidden />
        <div className="hidden" aria-hidden />

        <div className="mx-auto max-w-[1000px] px-6 py-32 text-center sm:px-10">
          <h2 className="mx-auto max-w-[18ch] font-editorial text-[52px] leading-[1.02] sm:text-[80px]">
            Your institute
            <br />
            <span className="font-editorial text-ink-700">
              is waiting.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[16px] leading-[1.75] text-ink-600">
            Join the first researchers building inside New Horizon. Cohort 01
            opens this season.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/enrol"
              className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl bg-ink-900 px-5 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800"
            >
              Request Access <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/atrium"
              className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl border border-ink-900/15 bg-white px-5 font-marketing text-[13.5px] font-medium not-italic text-ink-900 hover:bg-ink-50"
            >
              See the live demo
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function RetroComputer({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="retro-computer" aria-label="Virtual Research Institute desktop">
      <div className="retro-monitor">
        <div className="retro-screen-shell">
          <div className="retro-screen">
            <div className="retro-window-bar">
              <div className="retro-product-tab">Products</div>
              <div className="retro-window-dots" aria-hidden>
                <span className="retro-dot-close" />
                <span className="retro-dot-min" />
                <span className="retro-dot-max" />
              </div>
            </div>

            <div className="retro-desktop">
              <div className="retro-desktop-icon retro-desktop-icon--computer">
                <span className="retro-icon retro-icon-monitor" />
                <span>My Computer</span>
              </div>

              <div className="retro-desktop-icon retro-desktop-icon--docs">
                <span className="retro-icon retro-icon-folder" />
                <span>Documents</span>
              </div>

              <button
                type="button"
                onClick={onOpen}
                className="retro-desktop-icon retro-desktop-icon--nh"
                aria-label="Open Virtual Research Institute product page"
              >
                <span className="retro-icon retro-icon-nh">[NH]</span>
                <span>Virtual Research Institute</span>
              </button>

              <div className="retro-desktop-icon retro-desktop-icon--soon">
                <span className="retro-icon retro-icon-soon">?</span>
                <span>Coming Soon</span>
              </div>

              <div className="retro-hand-cursor" aria-hidden>
                <img
                              src={sitePath("/cursors/mac-hand-pointer.png")}
                  alt=""
                  className="h-12 w-12 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="retro-controls" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
          <em>21:06</em>
        </div>
        <div className="retro-led" aria-hidden />
      </div>
      <div className="retro-neck" aria-hidden />
      <div className="retro-base" aria-hidden />
      <div className="retro-keyboard" aria-hidden>
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}

function SimulationPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/25 bg-white shadow-[0_34px_90px_-38px_rgba(17,17,16,0.45),0_0_0_1px_rgba(17,17,16,0.18)]">
      <div className="relative flex h-11 items-center justify-between border-b border-ink-900/20 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-ink-500">
          untitled.ai/dashboard
        </div>
        <div className="flex items-center gap-2 text-ink-400" aria-hidden>
          <span className="h-3 w-3 rounded-[3px] border border-ink-900/25" />
          <span className="h-3 w-3 rounded-[3px] border border-ink-900/25 before:block before:h-px before:w-2 before:translate-x-[1px] before:translate-y-[5px] before:bg-ink-400" />
          <span className="relative h-3 w-3 rounded-[3px] border border-ink-900/25 before:absolute before:left-1/2 before:top-1/2 before:h-px before:w-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-ink-400 after:absolute after:left-1/2 after:top-1/2 after:h-px after:w-2 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-ink-400" />
        </div>
      </div>

      <div className="relative aspect-[16/9] min-h-[700px] bg-[#0a0d11]">
        <iframe
          src={sitePath("/vri-simulation.html")}
          title="Virtual Research Institute simulation"
          className="absolute inset-0 h-full w-full border-0 bg-[#0a0d11]"
        />
      </div>
    </div>
  );
}

/* ============================================================
   Live IRE product demo frame
   ============================================================ */
function HeroPreview() {
  return (
    <div className="relative -mt-16 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-[0_34px_90px_-38px_rgba(17,17,16,0.45),0_0_0_1px_rgba(17,17,16,0.04)]">
      <div className="flex h-11 items-center justify-between border-b border-ink-900/10 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 text-ink-900">
            <span className="font-marketing text-[13px] font-light leading-none tracking-[0.02em]">
              [NH]
            </span>
            <span className="font-marketing text-[13px] font-medium leading-none">
              New Horizon
            </span>
          </div>
        </div>
        <div aria-hidden />
        <Link
          href="/ire"
          className="btn-soft inline-flex h-7 items-center gap-1.5 rounded-lg bg-ink-900 px-3 font-marketing text-[11.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800"
        >
          Open workspace <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative aspect-[16/9] min-h-[700px] bg-white">
        <iframe
          src={sitePath("/ire/")}
          title="Live IRE workspace demo"
          className="absolute left-1/2 top-1/2 h-[125%] w-[125%] origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.8] border-0 bg-parchment-50"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06),transparent_18%,transparent_82%,rgba(0,0,0,0.08))]"
          aria-hidden
        />
        <div className="demo-cursor pointer-events-none absolute z-20">
          <img
            src={sitePath("/cursors/mac-hand-pointer.png")}
            alt=""
            aria-hidden
            className="h-12 w-12 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </div>
  );
}
