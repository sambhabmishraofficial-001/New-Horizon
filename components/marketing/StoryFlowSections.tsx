"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sitePath } from "@/lib/sitePath";

gsap.registerPlugin(ScrollTrigger);

type StoryImageTone = "crowd" | "default" | "human-machine";

type StorySection = {
  body: React.ReactNode;
  imageSrc: string;
  imageTone: StoryImageTone;
  label: string;
  title: React.ReactNode;
};

const STORY_SECTIONS: StorySection[] = [
  {
    label: "Our Mission",
    imageSrc: "/images/mission-community.jpg",
    imageTone: "crowd",
    title: <h2 className="story-atmo-title">Our Mission</h2>,
    body: (
      <>
        <p className="home-content-copy">
          The research community already possesses{" "}
          <span className="mission-highlight">near-AGI-level</span>{" "}
          collective intelligence, but they often underestimate what they can
          achieve. Our aim is to provide the entire community with
          superintelligent systems to unleash their full potential, enabling{" "}
          <span className="mission-highlight">Human-AI Co-Science</span> at a
          scale, speed, and scope previously impossible.
        </p>
        <p className="home-content-copy">
          We are building the{" "}
          <span className="mission-highlight">Novum Organum</span> for the 21st
          century - a new instrument for the systematization of discovery that
          bridges the gap between human thought bandwidth and the infinite
          abundance of scientific data.
        </p>
      </>
    ),
  },
  {
    label: "Systematizing Serendipity",
    imageSrc: "/images/mission-serendipity.jpg",
    imageTone: "default",
    title: <h2 className="story-atmo-title">Systematizing Serendipity</h2>,
    body: (
      <>
        <p className="home-content-copy">
          For centuries, the frontier of human knowledge has been pushed
          forward by beautiful accidents: a contaminated petri dish, a
          fortunate walk in the woods, or a coincidental collision of minds at
          an academic conference. Yet, as the complexity of our global
          challenges compounds, we can no longer afford to leave innovation to
          the mercy of chance.
        </p>
        <p className="home-content-copy">
          Our mission is to engineer the{" "}
          <span className="mission-highlight">end of accidental discovery</span>
          . We are replacing serendipity with{" "}
          <span className="mission-highlight">steerable reasoning</span> -
          building the computational scaffolding necessary to map the unseen
          connections between disciplines.
        </p>
      </>
    ),
  },
  {
    label: "Relationship Between Human And Machine Intelligence",
    imageSrc: "/images/mission-human-machine.jpg",
    imageTone: "human-machine",
    title: (
      <h2 className="story-atmo-title">
        Relationship Between Human And Machine Intelligence.
      </h2>
    ),
    body: (
      <>
        <p className="home-content-copy">
          Philosopher Michael Polanyi spent his career describing what he called{" "}
          <span className="mission-highlight">tacit knowledge</span> - the
          things a scientist knows that they cannot fully articulate. That
          knowledge is not in any dataset. It lives in the person. Our systems
          are built to protect the time and space for it to operate.
        </p>
        <p className="home-content-copy">
          This is the distinction we hold as foundational:{" "}
          <span className="mission-highlight">amplification, not replacement</span>
          . The telescope did not replace the astronomer's eye. It gave the eye
          something worthy of its attention.
        </p>
        <p className="home-content-copy">
          Science has always been a collective endeavour. Newton stood on the
          shoulders of giants. We are building the platform that lets every
          scientist stand a little higher.
        </p>
      </>
    ),
  },
];

function getVisualClassName(imageTone: StoryImageTone): string {
  if (imageTone === "crowd") {
    return "story-atmo-visual story-atmo-visual--image story-atmo-visual--image-crowd";
  }

  if (imageTone === "human-machine") {
    return "story-atmo-visual story-atmo-visual--image story-atmo-visual--image-human-machine";
  }

  return "story-atmo-visual story-atmo-visual--image";
}

export function StoryFlowSections() {
  const rootRef = React.useRef<HTMLElement>(null);
  const copyRef = React.useRef<HTMLDivElement>(null);
  const visualFrameRef = React.useRef<HTMLDivElement>(null);
  const stepRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = React.useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches);
    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);
    return () => mediaQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  useGSAP(
    () => {
      if (!rootRef.current || reducedMotion) return;
      const setSection = (nextIndex: number) => {
        if (nextIndex === activeIndexRef.current) return;

        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      };

      setSection(0);

      const triggers = stepRefs.current
        .filter((step): step is HTMLDivElement => Boolean(step))
        .map((step, stepIndex) => {
          const sectionIndex = stepIndex + 1;

          return ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onEnter: () => setSection(sectionIndex),
            onEnterBack: () => setSection(sectionIndex),
            onLeaveBack: () => setSection(sectionIndex - 1),
          });
        });

      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  useGSAP(
    () => {
      if (reducedMotion) return;

      const targets = [copyRef.current, visualFrameRef.current].filter(Boolean);
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.08,
          y: 0,
        },
      );
    },
    { scope: rootRef, dependencies: [activeIndex, reducedMotion] },
  );

  const activeSection = STORY_SECTIONS[activeIndex];

  return (
    <section
      ref={rootRef}
      aria-label="Mission and philosophy"
      className="story-atmo-scroll"
    >
      <div className="story-atmo-scroll__sticky">
        <div className="story-atmo-panel">
          <div className="story-atmo-copy">
            <div className="story-atmo-tabs" aria-label="Mission sections">
              {STORY_SECTIONS.map((section, index) => (
                <span
                  key={section.label}
                  className={index === activeIndex ? "is-active" : undefined}
                >
                  <span aria-hidden>→</span>
                  {section.label}
                </span>
              ))}
            </div>

            <div
              key={`copy-${activeIndex}`}
              ref={copyRef}
              className="story-atmo-content"
            >
              {activeSection.title}
              <div className="story-atmo-body">{activeSection.body}</div>
            </div>
          </div>

          <aside
            className={getVisualClassName(activeSection.imageTone)}
            aria-hidden
          >
            <div
              key={`visual-${activeIndex}`}
              ref={visualFrameRef}
              className="story-atmo-image-frame"
            >
              <img
                src={sitePath(activeSection.imageSrc)}
                alt=""
                className="story-atmo-image"
              />
            </div>
          </aside>
        </div>
      </div>

      {!reducedMotion ? (
        <div className="story-atmo-scroll__steps" aria-hidden>
          {STORY_SECTIONS.slice(1).map((section, index) => (
            <div
              key={section.label}
              ref={(node) => {
                stepRefs.current[index] = node;
              }}
              className="story-atmo-scroll__step"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
