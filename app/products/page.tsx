"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { InstituteBentoPreview } from "@/components/marketing/InstituteBentoPreview";
import { VriIdCardDemo } from "@/components/marketing/VriIdCardDemo";
import { PillarsFeatureCarousel } from "@/components/marketing/PillarsFeatureCarousel";
import { PrinciplesInteractiveCards } from "@/components/marketing/PrinciplesInteractiveCards";
import { SphereFileGrid } from "@/components/marketing/SphereFileGrid";
import { Macbook } from "@/components/marketing/Macbook";
import { ProductHeroTitle } from "@/components/marketing/vri/ProductHeroTitle";
import { VriCtaRow } from "@/components/marketing/vri/VriCtaRow";
import { SupportedBySection } from "@/components/marketing/SupportedBySection";
import { VriJobNotificationsSection } from "@/components/marketing/VriJobNotificationsSection";
import { VriProductPreviewSection } from "@/components/marketing/vri/VriProductPreviewSection";
import { IreDemoPreloader } from "@/components/marketing/vri/IreDemoPreloader";
import { prefetchIreDemoPreview } from "@/lib/ire-demo-preview";
import { useClientSearchParamsReady } from "@/lib/hooks/useClientSearchParams";
import { isVriProductOpen, vriProductHref } from "@/lib/vriProduct";
import {
  isLatticeProductOpen,
  latticeProductHref,
} from "@/lib/latticeProduct";
import { LatticeProductExperience } from "@/components/marketing/lattice/LatticeProductExperience";
import { RetroWindowsTaskbar } from "@/components/marketing/RetroWindowsTaskbar";
import { RetroBrowserChrome } from "@/components/marketing/RetroBrowserChrome";
import {
  CorpusIcon,
  DocumentsFolderIcon,
  FineTuneIcon,
  FolderIcon,
  LatticeAppIcon,
  LeaderboardIcon,
  ModelStackIcon,
  MyComputerIcon,
  PreprintIcon,
  SciDuckAppIcon,
  TaskSuiteIcon,
  VriAppIcon,
} from "@/components/marketing/RetroDesktopIcons";
import { sitePath } from "@/lib/sitePath";
import { cn } from "@/lib/cn";

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="marketing-site min-h-screen bg-white font-marketing" aria-busy />
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const paramsReady = useClientSearchParamsReady();
  const showVri = paramsReady && isVriProductOpen(searchParams);
  const showLattice = paramsReady && isLatticeProductOpen(searchParams);

  useEffect(() => {
    if (showVri) prefetchIreDemoPreview();
  }, [showVri]);

  if (!showVri && !showLattice) {
    return (
      <div className="marketing-site min-h-screen bg-white text-ink-900 font-marketing">
        <MarketingNav variant="light" />
        <main className="bg-white">
          <section className="bg-white px-4 pb-24 pt-10 text-ink-900 sm:px-6">
            <div className="mx-auto max-w-[980px]">
              <p className="mb-7 text-center font-marketing text-[13px] !font-light leading-relaxed tracking-[-0.012em] text-ink-500 sm:text-[14px]">
                Click the VRI [NH] or Lattice icon to open a product page
              </p>
              <RetroComputer />
            </div>
          </section>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  if (showLattice && !showVri) {
    return <LatticeProductExperience />;
  }

  return (
    <div className="marketing-site min-h-screen bg-white text-ink-900 font-marketing">
      <IreDemoPreloader />
      <MarketingNav variant="light" />

      <section
        id="vri-overview"
        className="relative isolate scroll-mt-24 overflow-x-hidden bg-white text-ink-900"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 pb-4 pt-10 text-center sm:px-10 sm:pb-6 sm:pt-12">
          <Macbook />
          <ProductHeroTitle />

          <VriCtaRow className="mt-9" variant="hero" />

          <SupportedBySection className="mt-10 sm:mt-12" />
        </div>

        <div
          id="vri-workspace"
          className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <VriProductPreviewSection />
        </div>
      </section>

      <div id="vri-institute" className="scroll-mt-24">
        <VriIdCardDemo className="bg-parchment-50/30" />
      </div>

      <section
        id="vri-how-it-works"
        className="scroll-mt-24 bg-white"
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

          <div className="mt-16">
            <PillarsFeatureCarousel />
          </div>
        </div>

        <HowItWorksSection />
      </section>

      <VriJobNotificationsSection id="vri-notifications" className="scroll-mt-24" />

      <section id="vri-corpus" className="scroll-mt-24 bg-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:py-28">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Research corpus
            </div>
            <h2 className="mt-4 max-w-[16ch] font-editorial text-[40px] leading-[1.05] text-ink-900 sm:text-[52px]">
              Every file your institute touches.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-[1.75] text-ink-600">
              Papers, datasets, notebooks, microscopy, protocols, and pipeline
              configs - indexed, linked, and ready for twins to read. Drag the
              sphere to explore a living research library.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <SphereFileGrid
              containerSize={480}
              sphereRadius={190}
              autoRotate
              autoRotateSpeed={0.2}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          PRINCIPLES - alternating editorial rows
          ============================================================ */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-28 sm:px-10">
          <PrinciplesInteractiveCards />
        </div>
      </section>

      {/* ============================================================
          FINAL CTA
          ============================================================ */}
      <section id="vri-start" className="relative isolate scroll-mt-24 overflow-hidden bg-white text-ink-900">
        <div className="mx-auto max-w-[1000px] px-6 py-32 text-center sm:px-10">
          <h2 className="mx-auto max-w-[18ch] font-editorial text-[52px] leading-[1.02] sm:text-[80px]">
            Your institute
            <br />
            <span className="font-editorial text-ink-700">is waiting.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-[16px] leading-[1.75] text-ink-600">
            Join the first researchers building inside New Horizon. Cohort 01
            opens this season - twins on duty, invariants holding, critical paths
            visible from day one.
          </p>

          <InstituteBentoPreview className="mt-14" />

          <VriCtaRow className="mt-10" variant="footer" />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function RetroComputer() {
  type RetroTab = "products" | "models" | "benchmarks" | "research";
  const [activeTab, setActiveTab] = useState<RetroTab>("products");

  return (
    <div className="retro-computer" aria-label="Virtual Research Institute desktop">
      <div className="retro-monitor">
        <div className="retro-screen-shell">
          <div className="retro-screen">
            <RetroBrowserChrome activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="retro-desktop-panel">
              {activeTab === "products" ? (
                <div className="retro-desktop">
                  <div className="retro-desktop-icon retro-desktop-icon--computer">
                    <MyComputerIcon />
                    <span>My Computer</span>
                  </div>

                  <div className="retro-desktop-icon retro-desktop-icon--docs">
                    <DocumentsFolderIcon />
                    <span>Documents</span>
                  </div>

                  <Link
                    href={vriProductHref()}
                    prefetch
                    onClick={() => prefetchIreDemoPreview()}
                    className="retro-desktop-icon retro-desktop-icon--nh retro-desktop-icon--link"
                    aria-label="Open Virtual Research Institute product page"
                  >
                    <VriAppIcon />
                    <span>Virtual Research Institute</span>
                  </Link>

                  <div className="retro-desktop-icon retro-desktop-icon--sciduck">
                    <SciDuckAppIcon />
                    <span>SciDuck</span>
                  </div>

                  <Link
                    href={latticeProductHref()}
                    prefetch
                    className="retro-desktop-icon retro-desktop-icon--lattice retro-desktop-icon--link"
                    aria-label="Open Lattice studio"
                  >
                    <LatticeAppIcon />
                    <span>Lattice</span>
                  </Link>

                  <div className="retro-hand-cursor" aria-hidden>
                    <img
                      src={sitePath("/cursors/mac-hand-pointer.png")}
                      alt=""
                      className="h-12 w-12 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                </div>
              ) : null}

              {activeTab === "models" ? (
                <div className="retro-desktop">
                  <div className="retro-desktop-icon retro-desktop-icon--models-a">
                    <ModelStackIcon />
                    <span>Base models</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--models-b">
                    <FineTuneIcon />
                    <span>Fine-tunes</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--models-c">
                    <FolderIcon />
                    <span>Model registry</span>
                  </div>
                </div>
              ) : null}

              {activeTab === "benchmarks" ? (
                <div className="retro-desktop">
                  <div className="retro-desktop-icon retro-desktop-icon--bench-a">
                    <LeaderboardIcon />
                    <span>Leaderboard</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--bench-b">
                    <TaskSuiteIcon />
                    <span>Task suites</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--bench-c">
                    <FolderIcon />
                    <span>Run reports</span>
                  </div>
                </div>
              ) : null}

              {activeTab === "research" ? (
                <div className="retro-desktop">
                  <div className="retro-desktop-icon retro-desktop-icon--research-a">
                    <CorpusIcon />
                    <span>Corpus</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--research-b">
                    <PreprintIcon />
                    <span>Preprints</span>
                  </div>
                  <div className="retro-desktop-icon retro-desktop-icon--research-c">
                    <FolderIcon />
                    <span>Protocols</span>
                  </div>
                </div>
              ) : null}
            </div>

            <RetroWindowsTaskbar />
          </div>
        </div>

        <div className="retro-controls" aria-hidden>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="retro-led" aria-hidden />
      </div>
      <div className="retro-stand" aria-hidden>
        <div className="retro-stand__neck" />
        <div className="retro-stand__base" />
      </div>
      <div className="retro-keyboard" aria-hidden>
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}


/* ============================================================
   Live IRE workspace preview - see VriProductPreview.tsx
   ============================================================ */

/* ============================================================
   How it works - 100 live labs (10×10) in one institute
   ============================================================ */

const TOTAL_LABS = 100;

// Deterministic pseudo-random in [0,1) seeded by index + salt - used for the
// per-cell visual variants (wall/floor/equipment) which stay stable.
function rnd(i: number, salt: number) {
  const v = Math.sin((i + 1) * 9301 + salt * 49297) * 43758.5453;
  return v - Math.floor(v);
}

type LabState = "idle" | "running" | "done";

const LAB_KEYFRAMES = `
@keyframes nh-bubble { 0%{opacity:0;transform:translateY(0)} 18%{opacity:0.95} 100%{opacity:0;transform:translateY(-7px)} }
@keyframes nh-flicker { 0%,100%{opacity:0.95} 47%{opacity:0.4} 53%{opacity:1} }
@keyframes nh-pulse { 0%,100%{opacity:0.9} 50%{opacity:0.3} }
@keyframes nh-tick-in { 0%{opacity:0;transform:scale(0.4)} 60%{opacity:1;transform:scale(1.12)} 100%{opacity:1;transform:scale(1)} }
@keyframes nh-glow { 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,0)} 50%{box-shadow:0 0 0 2px rgba(37,99,235,0.22)} }

.nh-lab .anim-bubble, .nh-lab .anim-pulse {
  transform-origin: center; transform-box: fill-box;
}
.nh-lab .anim-bubble { animation: nh-bubble 1.9s ease-in infinite; }
.nh-lab .anim-flicker { animation: nh-flicker 1.7s ease-in-out infinite; }
.nh-lab .anim-pulse { animation: nh-pulse 1.4s ease-in-out infinite; }
.nh-lab-tick { animation: nh-tick-in 0.55s cubic-bezier(0.5,1.6,0.5,1) backwards; }
.nh-lab-done-glow { animation: nh-glow 2.4s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .nh-lab *, .nh-lab-tick, .nh-lab-done-glow { animation: none !important; }
}
`;

function HowItWorksSection() {
  return (
    <section className="bg-parchment-50/40">
      <style>{LAB_KEYFRAMES}</style>
      <div className="mx-auto w-full max-w-none px-3 pb-14 pt-28 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-[60ch] text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            The institute
          </div>
          <h2 className="mt-3 font-editorial text-[40px] leading-[1.05] text-ink-900 sm:text-[52px]">
            Multiple labs. All running.
          </h2>
          <p className="mx-auto mt-7 max-w-[58ch] text-[15.5px] leading-[1.75] text-ink-600">
            Every New Horizon institute spins up multiple virtual
            laboratories at once. Each is its own working environment -
            different bench layout, different instruments, different agents
            walking between stations. Some are mid-experiment, some have
            already finished.
          </p>
        </div>

        <div className="mt-14">
          <InstituteFloor />
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          <LayerCard
            tag="L1"
            title="Institute"
            copy="Command console, shared knowledge base, examination & grading, recruitment center, and meeting room - orchestrating every lab."
          />
          <LayerCard
            tag="L2"
            title="Laboratory"
            copy="Dynamically generated for each research thread, with resource-aware scheduling and pause/resume across wet-lab and compute."
          />
          <LayerCard
            tag="L3"
            title="Faculty"
            copy="A hierarchy of agents - PI, PhD, postdoc, specialists - graded, recruited, and promoted on the strength of their actual work."
          />
        </div>
      </div>
    </section>
  );
}

function LayerCard({
  tag,
  title,
  copy,
}: {
  tag: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-lg border border-ink-900/8 bg-white px-5 py-5">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-400">
          {tag}
        </span>
        <span className="font-editorial text-[20px] text-ink-900">
          {title}
        </span>
      </div>
      <p className="mt-2 font-marketing text-[13.5px] leading-[1.6] text-ink-600">
        {copy}
      </p>
    </div>
  );
}

function InstituteFloor() {
  // Asterlab-style: a small set of cells is "lit" at any moment. Each tick
  // we fully swap the highlighted set - previous highlights clear, a fresh
  // random set lights up. A few cells briefly flash a prominent done-tick.
  const RUNNING_PER_TICK = 15;
  const DONE_PER_TICK = 1;
  const DONE_HOLD_MS = 850;

  const [labs, setLabs] = useState<LabState[]>(() =>
    Array<LabState>(TOTAL_LABS).fill("idle")
  );
  const completedAtRef = useRef<Map<number, number>>(new Map());
  const runningOrderRef = useRef<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    let tickTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      if (cancelled) return;
      const now = Date.now();

      setLabs((prev) => {
        const next = prev.slice();

        // 1) Clear ALL previous running highlights - nothing stays lit.
        for (let i = 0; i < TOTAL_LABS; i++) {
          if (next[i] === "running") next[i] = "idle";
        }
        runningOrderRef.current = [];

        // 2) Expire any done cells whose hold has elapsed. Also belt-and-
        //    suspenders: any "done" cell with no completedAt entry is stale
        //    and must be reset.
        for (let i = 0; i < TOTAL_LABS; i++) {
          if (next[i] === "done" && !completedAtRef.current.has(i)) {
            next[i] = "idle";
          }
        }
        for (const [idx, ts] of completedAtRef.current.entries()) {
          if (now - ts > DONE_HOLD_MS) {
            if (next[idx] === "done") next[idx] = "idle";
            completedAtRef.current.delete(idx);
          }
        }

        // 3) Pick a fresh random set of running cells.
        let placed = 0;
        let attempts = 0;
        while (placed < RUNNING_PER_TICK && attempts < 200) {
          const i = Math.floor(Math.random() * TOTAL_LABS);
          if (next[i] === "idle" && !completedAtRef.current.has(i)) {
            next[i] = "running";
            runningOrderRef.current.push(i);
            placed++;
          }
          attempts++;
        }

        // 4) Fire a fresh batch of done-flashes elsewhere on the floor.
        let doneAdded = 0;
        let doneAttempts = 0;
        while (doneAdded < DONE_PER_TICK && doneAttempts < 60) {
          const i = Math.floor(Math.random() * TOTAL_LABS);
          if (next[i] === "idle" && !completedAtRef.current.has(i)) {
            next[i] = "done";
            completedAtRef.current.set(i, now);
            doneAdded++;
          }
          doneAttempts++;
        }

        return next;
      });

      tickTimer = setTimeout(tick, 650 + Math.random() * 350);
    };

    tickTimer = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      if (tickTimer) clearTimeout(tickTimer);
    };
  }, []);

  const runningCount = labs.reduce((n, s) => (s === "running" ? n + 1 : n), 0);
  const doneCount = labs.reduce((n, s) => (s === "done" ? n + 1 : n), 0);

  return (
    <div className="mx-auto w-full max-w-none">
      <div className="mb-[6px] flex items-center justify-between px-[2px] font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        <span className="tracking-[0.22em] text-ink-400">
          Institute · 100 labs
        </span>
        <span className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 anim-pulse" />
            live
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-beacon-500" />
            <span className="tabular-nums">
              {String(runningCount).padStart(2, "0")}
            </span>{" "}
            running
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span className="tabular-nums">
              {String(doneCount).padStart(2, "0")}
            </span>{" "}
            done
          </span>
        </span>
      </div>

      <div className="grid grid-cols-10 gap-[2px]">
        {labs.map((state, i) => (
          <Lab key={i} index={i} state={state} />
        ))}
      </div>
    </div>
  );
}

function Lab({
  index,
  state,
}: {
  index: number;
  state: LabState;
}) {
  const done = state === "done";
  const active = state === "running";
  const wallVariant = Math.floor(rnd(index, 11) * 6);
  const floorVariant = Math.floor(rnd(index, 17) * 4);
  const benchVariant = Math.floor(rnd(index, 23) * 6);
  const motionA = Math.floor(rnd(index, 31) * 5);
  const motionB = Math.floor(rnd(index, 41) * 4);
  const accentVariant = Math.floor(rnd(index, 53) * 5);
  const begin = (rnd(index, 67) * 3.5).toFixed(2);

  return (
    <div
      className={cn(
        "nh-lab relative aspect-[16/9] overflow-hidden rounded-[7px] border bg-white transition-all duration-300",
        done
          ? "border-beacon-500/40 nh-lab-done-glow"
          : active
            ? "border-beacon-500/80 shadow-[0_0_0_1px_rgba(37,99,235,0.22),0_0_14px_rgba(37,99,235,0.32)]"
            : "border-ink-900/8"
      )}
    >
      <LabScene
        wallVariant={wallVariant}
        floorVariant={floorVariant}
        benchVariant={benchVariant}
        motionA={motionA}
        motionB={motionB}
        accentVariant={accentVariant}
        begin={begin}
        dimmed={done}
      />
      {done && <DoneOverlay />}
      {active && <ActiveOverlay />}
    </div>
  );
}


function ActiveOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-beacon-500/45" />
      <div
        className="nh-lab-tick pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[28%] w-auto"
          style={{ filter: "drop-shadow(0 0 5px rgba(37,99,235,0.95))" }}
        >
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
      <span className="absolute right-1 top-1 h-[5px] w-[5px] rounded-full bg-white anim-pulse shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
    </>
  );
}

function DoneOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-beacon-500/45" />
      <div
        className="nh-lab-tick pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[28%] w-auto"
          style={{ filter: "drop-shadow(0 0 5px rgba(37,99,235,0.95))" }}
        >
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
    </>
  );
}

/**
 * One lab cell rendered in a single SVG (viewBox 0 0 100 64).
 * Layers: back wall · wall items · bench · equipment · stools · humans · floor.
 * Walking is done with SMIL <animateTransform> so it scales with the cell.
 */
function LabScene({
  wallVariant,
  floorVariant,
  benchVariant,
  motionA,
  motionB,
  accentVariant,
  begin,
  dimmed,
}: {
  wallVariant: number;
  floorVariant: number;
  benchVariant: number;
  motionA: number;
  motionB: number;
  accentVariant: number;
  begin: string;
  dimmed: boolean;
}) {
  const accents = ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#0891b2"];
  const rugTints = ["#fbbf24", "#a78bfa", "#60a5fa", "#34d399", "#fb923c", "#f472b6"];
  const wall = "#d8dde2";
  const wallTrim = "#a4b0bd";
  const floor = "#b8865a";
  const floorDark = "#7a553a";
  const tile = "#a8cfe6";
  const tileShade = "#7fb1cf";
  const accent = accents[accentVariant];
  const rug = rugTints[(wallVariant + benchVariant + floorVariant) % rugTints.length];
  const rugX = 30 + (benchVariant % 3) * 10;

  return (
    <svg
      viewBox="0 0 100 64"
      shapeRendering="crispEdges"
      preserveAspectRatio="none"
      className="block h-full w-full"
      style={{ imageRendering: "pixelated", opacity: dimmed ? 0.75 : 1 }}
      aria-hidden
    >
      {/* Back wall - flat light gray */}
      <rect x="0" y="0" width="100" height="38" fill={wall} />
      {/* Subtle wall paneling */}
      <line x1="0" y1="6" x2="100" y2="6" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.4" />
      <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.4" />
      {[25, 50, 75].map((x) => (
        <line key={`wv-${x}`} x1={x} y1="0" x2={x} y2="34" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.4" />
      ))}
      {/* Wall trim */}
      <rect x="0" y="36" width="100" height="2" fill={wallTrim} />

      {/* Wood plank floor */}
      <rect x="0" y="38" width="100" height="26" fill={floor} />
      {/* Plank seams (horizontal) */}
      {[42, 46, 50, 54, 58, 62].map((y) => (
        <line key={`pk-${y}`} x1="0" y1={y} x2="100" y2={y} stroke={floorDark} strokeOpacity="0.45" strokeWidth="0.4" />
      ))}
      {/* Offset board joins (vertical) for plank texture */}
      <rect x="22" y="38" width="0.3" height="4" fill={floorDark} opacity="0.5" />
      <rect x="56" y="42" width="0.3" height="4" fill={floorDark} opacity="0.5" />
      <rect x="82" y="46" width="0.3" height="4" fill={floorDark} opacity="0.5" />
      <rect x="14" y="50" width="0.3" height="4" fill={floorDark} opacity="0.5" />
      <rect x="64" y="54" width="0.3" height="4" fill={floorDark} opacity="0.5" />
      <rect x="36" y="58" width="0.3" height="4" fill={floorDark} opacity="0.5" />

      {/* Carpet rug on floor */}
      <rect x={rugX} y="56" width="22" height="6" fill={rug} opacity="0.85" />
      <rect x={rugX} y="56" width="22" height="6" fill="none" stroke={rug} strokeWidth="0.4" />

      {/* Corner plant */}
      <Plant x={3} y={48} />

      {/* Blue tile perimeter strip (front edge) */}
      <rect x="0" y="62" width="100" height="2" fill={tile} />
      <rect x="0" y="62" width="100" height="0.5" fill={tileShade} opacity="0.7" />

      {/* Wall items: pick 1-2 by hash */}
      <WallItems wallVariant={wallVariant} accent={accent} begin={begin} />

      {/* Bench */}
      <rect x="6" y="32" width="88" height="1.4" fill="#ffffff" />
      <rect x="6" y="33.4" width="88" height="2" fill="#cbd5e1" />
      <rect x="8" y="35.4" width="1.2" height="6" fill="#94a3b8" />
      <rect x="90.8" y="35.4" width="1.2" height="6" fill="#94a3b8" />

      {/* Bench equipment by benchVariant */}
      <BenchEquipment benchVariant={benchVariant} accent={accent} begin={begin} />

      {/* Stools */}
      <Stool x={22} />
      <Stool x={50} />
      <Stool x={78} />

      {/* Walking human A - primary motion (varied by motionA) */}
      <g transform="translate(0, 44)">
        <g>
          <WalkAnim type={motionA} begin={`${begin}s`} />
          <PixelWorker x={10} y={0} role="pi" />
        </g>
      </g>

      {/* Secondary human B - different motion */}
      <g transform="translate(0, 44)">
        <g>
          <WalkAnim type={motionB + 5} begin={`-${begin}s`} />
          <PixelWorker x={62} y={0} role={(motionB === 0 ? "phd" : motionB === 1 ? "postdoc" : "specialist")} />
        </g>
      </g>
    </svg>
  );
}

/* ----- SMIL walking animations (operate in viewBox units, scale with SVG) ----- */

function WalkAnim({ type, begin }: { type: number; begin: string }) {
  // 10 distinct motion patterns
  switch (type) {
    case 0:
      // Long stroll: walk right, brief pause, walk back
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 60,0; 60,0; 0,0; 0,0"
          keyTimes="0; 0.45; 0.5; 0.95; 1"
          dur="7.2s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 1:
      // Short shuffle near workstation
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 16,0; 0,0; -8,0; 0,0"
          keyTimes="0; 0.3; 0.55; 0.8; 1"
          dur="4.6s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 2:
      // Pacing back and forth
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 36,0; 0,0"
          keyTimes="0; 0.5; 1"
          dur="5.4s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 3:
      // Stop-start motion (interrupt-driven worker)
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,0; 22,0; 22,0; 44,0; 44,0; 22,0; 0,0"
          keyTimes="0; 0.15; 0.3; 0.45; 0.6; 0.75; 0.9; 1"
          dur="8s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 4:
      // Slow drift one way (loops by jumping back)
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-12,0; 78,0"
          dur="6.5s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 5:
      // Bench-bound: small lean forward + return
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 1.5,-0.6; 0,0; -1.2,0; 0,0"
          keyTimes="0; 0.25; 0.5; 0.75; 1"
          dur="2.8s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 6:
      // Reverse direction stroll (right → left → right)
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; -28,0; -28,0; 0,0; 0,0"
          keyTimes="0; 0.4; 0.5; 0.9; 1"
          dur="6.2s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 7:
      // Steady linear loop
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 24,0; 0,0"
          keyTimes="0; 0.5; 1"
          dur="3.8s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    case 8:
      // Long traverse with mid-pause
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 30,0; 30,0; 56,0; 56,0; 28,0; 0,0"
          keyTimes="0; 0.18; 0.32; 0.5; 0.65; 0.85; 1"
          dur="9.4s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
    default:
      // Idle micro-shift (rare, almost still)
      return (
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0.6,-0.3; 0,0"
          keyTimes="0; 0.5; 1"
          dur="3.2s"
          begin={begin}
          repeatCount="indefinite"
        />
      );
  }
}

/* ----- Wall items ----- */

function WallItems({
  wallVariant,
  accent,
  begin,
}: {
  wallVariant: number;
  accent: string;
  begin: string;
}) {
  switch (wallVariant) {
    case 0:
      return (
        <>
          <WallScreen x={6} y={5} accent={accent} begin={begin} />
          <WallShelf x={56} y={4} accent={accent} />
        </>
      );
    case 1:
      return (
        <>
          <WallShelf x={4} y={4} accent={accent} />
          <WallPoster x={42} y={6} accent={accent} />
          <WallScreen x={70} y={5} accent={accent} begin={begin} />
        </>
      );
    case 2:
      return (
        <>
          <WallPoster x={8} y={6} accent={accent} />
          <WallScreen x={36} y={5} accent={accent} begin={begin} />
          <WallShelf x={70} y={4} accent={accent} />
        </>
      );
    case 3:
      return (
        <>
          <Whiteboard x={10} y={4} accent={accent} />
          <WallPoster x={70} y={6} accent={accent} />
        </>
      );
    case 4:
      return (
        <>
          <WallShelf x={6} y={4} accent={accent} />
          <Whiteboard x={48} y={4} accent={accent} />
        </>
      );
    default:
      return (
        <>
          <WallScreen x={20} y={5} accent={accent} begin={begin} />
          <WallScreen x={56} y={5} accent={accent} begin={`-${begin}`} />
        </>
      );
  }
}

function WallScreen({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x - 0.5} y={y - 0.5} width="21" height="11" fill="#0f172a" />
      <rect x={x} y={y} width="20" height="10" fill="#0b1220" />
      <g className="anim-flicker" style={{ animationDelay: begin }}>
        <rect x={x + 1.5} y={y + 1.5} width="6" height="0.8" fill={accent} opacity="0.9" />
        <rect x={x + 1.5} y={y + 3} width="10" height="0.8" fill="#22d3ee" opacity="0.7" />
        <rect x={x + 1.5} y={y + 4.5} width="4" height="0.8" fill="#a3e635" opacity="0.8" />
        <rect x={x + 1.5} y={y + 6} width="12" height="0.8" fill="#f472b6" opacity="0.6" />
        <rect x={x + 1.5} y={y + 7.5} width="7" height="0.8" fill={accent} opacity="0.7" />
      </g>
      <line
        x1={x}
        y1={y + 1}
        x2={x + 20}
        y2={y + 1}
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="0.4"
      >
        <animate
          attributeName="y1"
          values={`${y + 1}; ${y + 9}; ${y + 1}`}
          keyTimes="0; 0.5; 1"
          dur="2.4s"
          begin={begin}
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          values={`${y + 1}; ${y + 9}; ${y + 1}`}
          keyTimes="0; 0.5; 1"
          dur="2.4s"
          begin={begin}
          repeatCount="indefinite"
        />
      </line>
      <rect x={x + 9} y={y + 10} width="2" height="1.2" fill="#475569" />
    </g>
  );
}

function WallShelf({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x} y={y + 6} width="20" height="0.8" fill="#ffffff" />
      <rect x={x + 2} y={y + 3} width="1.6" height="3" fill={accent} opacity="0.85" />
      <rect x={x + 5} y={y + 2} width="1.6" height="4" fill="#22d3ee" opacity="0.8" />
      <rect x={x + 8} y={y + 4} width="1.6" height="2" fill="#f59e0b" opacity="0.85" />
      <rect x={x + 11} y={y + 1} width="1.6" height="5" fill="#a3e635" opacity="0.8" />
      <rect x={x + 14} y={y + 3} width="1.6" height="3" fill="#f472b6" opacity="0.8" />
      <rect x={x + 17} y={y + 2} width="1.6" height="4" fill={accent} opacity="0.7" />
    </g>
  );
}

function WallPoster({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x} y={y} width="14" height="11" fill="#ffffff" stroke="#475569" strokeWidth="0.4" />
      <rect x={x + 1} y={y + 1} width="12" height="1.6" fill={accent} opacity="0.85" />
      <rect x={x + 1} y={y + 3.6} width="5" height="3" fill="#22d3ee" opacity="0.6" />
      <rect x={x + 7} y={y + 3.6} width="6" height="3" fill="#f59e0b" opacity="0.5" />
      <rect x={x + 1} y={y + 7.6} width="12" height="0.5" fill="#94a3b8" />
      <rect x={x + 1} y={y + 8.8} width="9" height="0.5" fill="#94a3b8" />
      <rect x={x + 1} y={y + 10} width="11" height="0.5" fill="#94a3b8" />
    </g>
  );
}

function Whiteboard({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x} y={y} width="34" height="11" fill="#ffffff" stroke="#475569" strokeWidth="0.4" />
      <rect x={x + 2} y={y + 2} width="14" height="0.6" fill={accent} opacity="0.85" />
      <rect x={x + 2} y={y + 3.6} width="22" height="0.5" fill="#475569" />
      <rect x={x + 2} y={y + 5} width="18" height="0.5" fill="#475569" />
      <rect x={x + 2} y={y + 6.4} width="12" height="0.5" fill={accent} opacity="0.6" />
      <rect x={x + 18} y={y + 7.5} width="14" height="2.5" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.6" />
    </g>
  );
}

/* ----- Bench equipment ----- */

function BenchEquipment({
  benchVariant,
  accent,
  begin,
}: {
  benchVariant: number;
  accent: string;
  begin: string;
}) {
  switch (benchVariant) {
    case 0:
      return (
        <>
          <Beaker x={16} y={26} accent={accent} begin={begin} />
          <Microscope x={36} y={22} accent={accent} />
          <BenchMonitor x={56} y={22} accent={accent} begin={begin} />
          <FlaskTall x={78} y={24} accent={accent} begin={begin} />
        </>
      );
    case 1:
      return (
        <>
          <FlaskTall x={14} y={24} accent={accent} begin={begin} />
          <FlaskTall x={28} y={24} accent={`-${begin}`} begin={begin} />
          <Centrifuge x={46} y={24} accent={accent} begin={begin} />
          <Beaker x={68} y={26} accent={accent} begin={`-${begin}`} />
          <Microscope x={80} y={22} accent={accent} />
        </>
      );
    case 2:
      return (
        <>
          <BenchMonitor x={14} y={22} accent={accent} begin={begin} />
          <BenchMonitor x={36} y={22} accent={accent} begin={`-${begin}`} />
          <ServerRack x={60} y={22} accent={accent} begin={begin} />
          <BenchMonitor x={78} y={22} accent={accent} begin={begin} />
        </>
      );
    case 3:
      return (
        <>
          <Centrifuge x={14} y={24} accent={accent} begin={begin} />
          <Beaker x={32} y={26} accent={accent} begin={begin} />
          <Microscope x={48} y={22} accent={accent} />
          <FlaskTall x={68} y={24} accent={accent} begin={begin} />
          <BenchMonitor x={80} y={22} accent={accent} begin={begin} />
        </>
      );
    case 4:
      return (
        <>
          <Microscope x={14} y={22} accent={accent} />
          <BenchMonitor x={32} y={22} accent={accent} begin={begin} />
          <Beaker x={56} y={26} accent={accent} begin={begin} />
          <Beaker x={66} y={26} accent={accent} begin={`-${begin}`} />
          <Centrifuge x={80} y={24} accent={accent} begin={begin} />
        </>
      );
    default:
      return (
        <>
          <FlaskTall x={14} y={24} accent={accent} begin={begin} />
          <Bunsen x={30} y={24} accent={accent} />
          <Beaker x={50} y={26} accent={accent} begin={begin} />
          <BenchMonitor x={66} y={22} accent={accent} begin={begin} />
          <FlaskTall x={84} y={24} accent={accent} begin={`-${begin}`} />
        </>
      );
  }
}

function Beaker({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width="6" height="6" fill="#a5f3fc" opacity="0.55" stroke="#475569" strokeWidth="0.3" />
      <rect x={x + 0.5} y={y + 2.5} width="5" height="3" fill={accent} opacity="0.85" />
      <g className="anim-bubble" style={{ animationDelay: begin }}>
        <circle cx={x + 2} cy={y + 1} r="0.6" fill="#ffffff" />
        <circle cx={x + 4} cy={y - 1} r="0.5" fill="#ffffff" />
      </g>
    </g>
  );
}

function FlaskTall({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x + 1.5} y={y - 2} width="2" height="2.5" fill="#a5f3fc" opacity="0.6" stroke="#475569" strokeWidth="0.3" />
      <rect x={x + 0.5} y={y + 0.5} width="4" height="1.5" fill="#a5f3fc" opacity="0.6" />
      <rect x={x} y={y + 2} width="5" height="3.5" fill="#a5f3fc" opacity="0.6" stroke="#475569" strokeWidth="0.3" />
      <rect x={x + 0.5} y={y + 3} width="4" height="2" fill={accent} opacity="0.9" />
      <g className="anim-bubble" style={{ animationDelay: begin }}>
        <circle cx={x + 2.5} cy={y - 3} r="0.4" fill="#ffffff" />
      </g>
    </g>
  );
}

function Microscope({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x} y={y + 7} width="7" height="2" fill="#1f2937" />
      <rect x={x + 1.5} y={y + 3} width="2" height="4" fill="#1f2937" />
      <rect x={x + 3.5} y={y + 2} width="3" height="1" fill="#1f2937" />
      <rect x={x + 2} y={y} width="2" height="3" fill="#0f172a" />
      <rect x={x + 1.5} y={y - 0.6} width="3" height="1.2" fill={accent} opacity="0.7" />
      <rect x={x + 0.5} y={y + 6} width="6" height="1" fill="#94a3b8" />
    </g>
  );
}

function Centrifuge({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x} y={y + 3} width="9" height="6" fill="#1e293b" />
      <rect x={x + 1} y={y + 4} width="7" height="3" fill="#0f172a" />
      <g className="anim-flicker" style={{ animationDelay: begin }}>
        <rect x={x + 2} y={y + 5} width="1.6" height="0.8" fill={accent} />
        <rect x={x + 5} y={y + 5} width="1.6" height="0.8" fill={accent} />
      </g>
      <rect x={x} y={y + 2} width="9" height="1" fill="#475569" />
    </g>
  );
}

function BenchMonitor({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x + 5} y={y + 7} width="1.6" height="2" fill="#475569" />
      <rect x={x + 3} y={y + 8.6} width="6" height="0.6" fill="#475569" />
      <rect x={x} y={y} width="11" height="8" fill="#1f2937" />
      <rect x={x + 0.6} y={y + 0.6} width="9.8" height="6.8" fill="#0b1220" />
      <g className="anim-flicker" style={{ animationDelay: begin }}>
        <rect x={x + 1.4} y={y + 1.4} width="3" height="0.6" fill={accent} opacity="0.9" />
        <rect x={x + 1.4} y={y + 2.5} width="6" height="0.6" fill="#22d3ee" opacity="0.8" />
        <rect x={x + 2.2} y={y + 3.6} width="4" height="0.6" fill="#a3e635" opacity="0.8" />
        <rect x={x + 1.4} y={y + 4.7} width="7" height="0.6" fill="#f472b6" opacity="0.7" />
        <rect x={x + 2.2} y={y + 5.8} width="5" height="0.6" fill="#22d3ee" opacity="0.8" />
      </g>
    </g>
  );
}

function ServerRack({
  x,
  y,
  accent,
  begin,
}: {
  x: number;
  y: number;
  accent: string;
  begin: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width="10" height="11" fill="#0f172a" stroke="#1e293b" strokeWidth="0.3" />
      {[1, 3, 5, 7, 9].map((dy) => (
        <g key={dy}>
          <rect x={x + 0.6} y={y + dy} width="8.8" height="1.2" fill="#1e293b" />
          <g className="anim-flicker" style={{ animationDelay: `-${(dy * 0.13).toFixed(2)}s` }}>
            <rect x={x + 1} y={y + dy + 0.4} width="0.6" height="0.4" fill={accent} />
            <rect x={x + 2} y={y + dy + 0.4} width="0.6" height="0.4" fill="#22d3ee" />
            <rect x={x + 3} y={y + dy + 0.4} width="0.6" height="0.4" fill="#a3e635" />
          </g>
        </g>
      ))}
    </g>
  );
}

function Bunsen({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <g>
      <rect x={x + 1.5} y={y + 5} width="3" height="2" fill="#475569" />
      <rect x={x + 2} y={y + 1} width="2" height="4" fill="#94a3b8" />
      <rect x={x + 1.6} y={y - 1.2} width="2.8" height="2.2" fill="#f59e0b" opacity="0.9">
        <animate
          attributeName="opacity"
          values="0.6;0.95;0.7;1;0.65"
          keyTimes="0;0.25;0.5;0.75;1"
          dur="0.7s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x={x + 2} y={y - 2.4} width="2" height="1.2" fill={accent} opacity="0.85">
        <animate
          attributeName="opacity"
          values="0.4;0.95;0.5;0.9;0.4"
          keyTimes="0;0.25;0.5;0.75;1"
          dur="0.7s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
  );
}

function Stool({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 1.6} y="50" width="3.2" height="1" fill="#475569" />
      <rect x={x - 0.4} y="51" width="0.8" height="5" fill="#475569" />
      <rect x={x - 1.6} y="55.5" width="3.2" height="0.6" fill="#334155" />
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* terracotta pot */}
      <rect x={x} y={y + 5} width="4" height="3.5" fill="#7c3a26" />
      <rect x={x} y={y + 5} width="4" height="0.6" fill="#5d2916" />
      <rect x={x + 0.4} y={y + 5.2} width="3.2" height="0.3" fill="#9c5238" opacity="0.8" />
      {/* leaves - voxel cluster */}
      <rect x={x - 0.4} y={y + 2.5} width="1.2" height="2.8" fill="#15803d" />
      <rect x={x + 0.6} y={y + 1} width="1.2" height="4.2" fill="#16a34a" />
      <rect x={x + 1.6} y={y} width="1.2" height="5.4" fill="#22c55e" />
      <rect x={x + 2.6} y={y + 0.8} width="1.2" height="4.6" fill="#16a34a" />
      <rect x={x + 3.4} y={y + 2.2} width="1.2" height="3.2" fill="#15803d" />
      {/* leaf highlights */}
      <rect x={x + 1.8} y={y + 0.4} width="0.4" height="1.2" fill="#4ade80" />
      <rect x={x + 0.8} y={y + 1.6} width="0.3" height="1" fill="#4ade80" />
    </g>
  );
}

/* ----- Pixel humans (Habbo-like) ----- */

function PixelWorker({
  x,
  y,
  role,
}: {
  x: number;
  y: number;
  role: "pi" | "phd" | "postdoc" | "specialist";
}) {
  const palette: Record<typeof role, { hair: string; skin: string; shirt: string; pants: string; coat: string | null }> = {
    pi: { hair: "#1f2937", skin: "#e7c8a0", shirt: "#1e3a8a", pants: "#0f172a", coat: "#ffffff" },
    phd: { hair: "#3b2a1a", skin: "#f1d3a3", shirt: "#2563eb", pants: "#1e293b", coat: null },
    postdoc: { hair: "#262626", skin: "#d9b48a", shirt: "#7c2d12", pants: "#1c1917", coat: "#f8fafc" },
    specialist: { hair: "#1c1917", skin: "#f3d6ad", shirt: "#0f766e", pants: "#1e293b", coat: null },
  };
  const c = palette[role];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="2" y="0" width="4" height="1" fill={c.hair} />
      <rect x="2" y="1" width="4" height="3" fill={c.skin} />
      <rect x="2" y="1" width="1" height="1" fill={c.hair} />
      <rect x="5" y="1" width="1" height="1" fill={c.hair} />
      <rect x="3" y="2" width="0.7" height="0.7" fill="#0f172a" />
      <rect x="4.5" y="2" width="0.7" height="0.7" fill="#0f172a" />
      <rect x="3" y="4" width="2" height="1" fill={c.skin} />
      {c.coat && <rect x="0" y="5" width="8" height="9" fill={c.coat} />}
      <rect x="3" y="5" width="2" height="3" fill={c.shirt} />
      <rect x="0" y="5" width="1" height="4" fill={c.coat ?? c.shirt} />
      <rect x="7" y="5" width="1" height="4" fill={c.coat ?? c.shirt} />
      <rect x="0" y="9" width="1" height="1" fill={c.skin} />
      <rect x="7" y="9" width="1" height="1" fill={c.skin} />
      {c.coat && <rect x="1" y="9" width="6" height="3" fill={c.coat} />}
      <rect x="1" y={c.coat ? 12 : 9} width="3" height={c.coat ? 2 : 4} fill={c.pants} />
      <rect x="4" y={c.coat ? 12 : 9} width="3" height={c.coat ? 2 : 4} fill={c.pants} />
      <rect x="1" y="14" width="3" height="1" fill="#0a0a0a" />
      <rect x="4" y="14" width="3" height="1" fill="#0a0a0a" />
    </g>
  );
}
