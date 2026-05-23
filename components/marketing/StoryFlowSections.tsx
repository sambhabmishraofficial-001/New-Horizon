"use client";

import type { ReactNode } from "react";
import { FlowArt, FlowSection } from "@/components/marketing/FlowArt";
import {
  StoryCanvasAnimation,
  type StoryCanvasAnimationId,
} from "@/components/marketing/StoryCanvasAnimation";

function StorySectionPanel({
  title,
  animationId,
  children,
}: {
  title: ReactNode;
  animationId: StoryCanvasAnimationId;
  children: ReactNode;
}) {
  return (
    <div className="story-section-panel mx-auto w-full max-w-[980px] px-6 sm:px-8">
      {title}
      <div className="story-section-panel__grid mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_180px] lg:gap-12">
        <div className="min-w-0 space-y-6">{children}</div>
        <aside className="flex justify-center">
          <StoryCanvasAnimation animationId={animationId} />
        </aside>
      </div>
    </div>
  );
}

export function StoryFlowSections() {
  return (
    <FlowArt aria-label="Mission and philosophy">
      <FlowSection id="mission" aria-label="Our Mission">
        <StorySectionPanel
          animationId="crystalline-refraction"
          title={
            <h2 className="home-section-subtitle mx-auto max-w-[16ch] font-editorial text-ink-900 lg:mx-0">
              Our <span className="text-[#2563eb]">Mission</span>
            </h2>
          }
        >
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            The research community already possesses{" "}
            <span className="mission-highlight px-1 text-ink-900">
              near-AGI-level
            </span>{" "}
            collective intelligence, but they often underestimate what they can
            achieve. Our aim is to provide the entire community with
            superintelligent systems to unleash their full potential, enabling{" "}
            <span className="mission-highlight px-1 text-ink-900">
              Human-AI Co-Science
            </span>{" "}
            at a scale, speed, and scope previously impossible.
          </p>
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            We are building the{" "}
            <span className="mission-highlight px-1 text-ink-900">
              Novum Organum
            </span>{" "}
            for the 21st century - a new instrument for the systematization of
            discovery that bridges the gap between human thought bandwidth and
            the infinite abundance of scientific data.
          </p>
        </StorySectionPanel>
      </FlowSection>

      <FlowSection aria-label="Systematizing Serendipity">
        <StorySectionPanel
          animationId="voxel-matrix-morph"
          title={
            <h2 className="home-section-subtitle mx-auto max-w-[16ch] font-editorial text-ink-900 lg:mx-0">
              Systematizing{" "}
              <span className="text-[#2563eb]">Serendipity</span>
            </h2>
          }
        >
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            For centuries, the frontier of human knowledge has been pushed
            forward by beautiful accidents: a contaminated petri dish, a
            fortunate walk in the woods, or a coincidental collision of minds at
            an academic conference. Yet, as the complexity of our global
            challenges compounds, we can no longer afford to leave innovation to
            the mercy of chance.
          </p>
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            Our mission is to engineer the{" "}
            <span className="mission-highlight px-1 text-ink-900">
              end of accidental discovery
            </span>
            . We are replacing serendipity with{" "}
            <span className="mission-highlight px-1 text-ink-900">
              steerable reasoning
            </span>{" "}
            - building the computational scaffolding necessary to map the unseen
            connections between disciplines.
          </p>
        </StorySectionPanel>
      </FlowSection>

      <FlowSection aria-label="Relationship Between Human And Machine Intelligence">
        <StorySectionPanel
          animationId="crystalline-cube-refraction"
          title={
            <h2 className="home-section-subtitle mx-auto max-w-[22ch] font-editorial text-ink-900 lg:mx-0">
              Relationship Between{" "}
              <span className="text-[#2563eb]">Human</span> And{" "}
              <span className="text-[#2563eb]">Machine Intelligence</span>.
            </h2>
          }
        >
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            Philosopher Michael Polanyi spent his career describing what he
            called{" "}
            <span className="mission-highlight px-1 text-ink-900">
              tacit knowledge
            </span>{" "}
            - the things a scientist knows that they cannot fully articulate.
            That knowledge is not in any dataset. It lives in the person. Our
            systems are built to protect the time and space for it to operate.
          </p>
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            This is the distinction we hold as foundational:{" "}
            <span className="mission-highlight px-1 text-ink-900">
              amplification, not replacement
            </span>
            . The telescope did not replace the astronomer's eye. It gave the eye
            something worthy of its attention.
          </p>
          <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
            Science has always been a collective endeavour. Newton stood on the
            shoulders of giants. We are building the platform that lets every
            scientist stand a little higher.
          </p>
        </StorySectionPanel>
      </FlowSection>
    </FlowArt>
  );
}
