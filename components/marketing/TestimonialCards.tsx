"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Testimonial } from "@/components/marketing/Testimonial";

export interface TestimonialCardProps {
  className?: string;
  avatar?: string;
  username?: string;
  handle?: string;
  affiliation?: string;
  content?: string;
  date?: string;
  verified?: boolean;
  likes?: number;
  retweets?: number;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  isFocused?: boolean;
  onTap?: () => void;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg
      className="size-3.5 text-[#2563eb] sm:size-4"
      viewBox="0 0 22 22"
      fill="currentColor"
      aria-label="Verified"
    >
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function TestimonialCard({
  className,
  avatar,
  username = "Researcher",
  handle = "@researcher",
  affiliation,
  content = "Human-AI Co-Science is the future of how we do discovery.",
  date = "Jan 2026",
  verified = true,
  likes = 0,
  retweets = 0,
  onHover,
  onLeave,
  isActive,
  isFocused,
  onTap,
}: TestimonialCardProps) {
  return (
    <article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onTap}
      className={cn(
        "relative flex h-auto min-h-[140px] w-[260px] -skew-y-[6deg] select-none flex-col rounded-2xl border border-ink-900/10 bg-parchment-50/95 px-3 py-3 font-marketing shadow-lift backdrop-blur-sm transition-all duration-500 sm:min-h-[180px] sm:w-[380px] sm:px-4 sm:py-4",
        "hover:border-ink-900/18 hover:bg-white hover:shadow-editorial",
        isActive && "ring-2 ring-[#2563eb]/35",
        isFocused &&
          "z-40 !grayscale-0 border-ink-900/18 bg-white shadow-editorial before:!opacity-0",
        className
      )}
    >
      <div className="relative z-10 flex flex-1 flex-col">
      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ink-900/8 bg-ink-50 sm:size-12">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
              NH
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-xs font-medium text-ink-900 sm:text-base">
              {username}
            </span>
            {verified && <VerifiedBadge />}
          </div>
          <span className="block truncate text-[10px] text-ink-400 sm:text-sm">
            {handle}
          </span>
          {affiliation && (
            <span className="mt-0.5 block truncate text-[9px] uppercase tracking-[0.12em] text-ink-400 sm:text-[10px]">
              {affiliation}
            </span>
          )}
        </div>
        <XIcon className="size-3.5 shrink-0 text-ink-300 sm:size-4" />
      </div>

      <p
        className={cn(
          "mb-2 text-xs leading-relaxed text-ink-700 sm:mb-3 sm:text-[15px]",
          isFocused ? "text-ink-900" : "line-clamp-3 sm:line-clamp-4"
        )}
      >
        {content}
      </p>

      <div className="mt-auto flex items-center justify-between text-[10px] text-ink-400 sm:text-sm">
        <span>{date}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg
              className="size-3.5 sm:size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="size-3.5 sm:size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span>{retweets}</span>
          </div>
        </div>
      </div>
      </div>
    </article>
  );
}

export interface TestimonialsProps {
  cards?: TestimonialCardProps[];
  className?: string;
}

const stackBase =
  "[grid-area:stack] before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:border before:border-ink-900/8 before:bg-ink-900/[0.04] before:content-[''] before:transition-opacity before:duration-500 hover:before:opacity-0";

export const defaultVoiceCards: TestimonialCardProps[] = [
  {
    className: cn(
      stackBase,
      "grayscale hover:-translate-y-10 hover:grayscale-0"
    ),
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=DrChen",
    username: "Dr. Elena Vasquez",
    handle: "@evasquez_lab",
    affiliation: "Computational Biology",
    content:
      "The telescope didn't replace the astronomer - it gave the eye something worthy of its attention. AI in science should work the same way: amplification, not replacement.",
    date: "Mar 12, 2026",
    verified: true,
    likes: 284,
    retweets: 41,
  },
  {
    className: cn(
      stackBase,
      "translate-x-8 translate-y-6 grayscale sm:translate-x-16 sm:translate-y-10 hover:-translate-y-1 hover:grayscale-0"
    ),
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=JamesOkonkwo",
    username: "James Okonkwo",
    handle: "@jokonkwo_struct",
    affiliation: "Science & Society",
    content:
      "For decades the bottleneck was access - papers, data, compute. That bottleneck is breaking. The new constraint is judgment: knowing which questions are worth asking. That's where human-AI co-science begins.",
    date: "Feb 28, 2026",
    verified: true,
    likes: 167,
    retweets: 29,
  },
  {
    className: cn(
      stackBase,
      "translate-x-16 translate-y-12 sm:translate-x-32 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10"
    ),
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=PriyaNair",
    username: "Priya Nair",
    handle: "@priya_nair_pi",
    affiliation: "Research Policy",
    content:
      "We're entering an era where the distance between a question and an answer could shrink from years to days. Not because machines think for us - but because they let us think at the scale the world actually demands.",
    date: "Feb 14, 2026",
    verified: true,
    likes: 412,
    retweets: 87,
  },
];

export function TestimonialCards({
  cards = defaultVoiceCards,
  className,
}: TestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getCardClassName = (index: number, baseClassName: string) => {
    const focusedIndex = hoveredIndex ?? activeIndex;

    if (focusedIndex === 0 && index === 1) {
      return (
        baseClassName +
        " !translate-y-20 sm:!translate-y-32 !translate-x-14 sm:!translate-x-24"
      );
    }
    if (focusedIndex === 0 && index === 2) {
      return (
        baseClassName +
        " !translate-y-28 sm:!translate-y-44 !translate-x-24 sm:!translate-x-40"
      );
    }
    if (focusedIndex === 1 && index === 2) {
      return (
        baseClassName +
        " !translate-y-24 sm:!translate-y-40 !translate-x-24 sm:!translate-x-40"
      );
    }
    return baseClassName;
  };

  const handleTap = (index: number) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
    }
  };

  return (
    <div
      className={cn(
        "relative grid w-[340px] [grid-template-areas:'stack'] place-items-center opacity-100 transition-opacity duration-700 sm:w-[560px]",
        className
      )}
    >
      {cards.map((cardProps, index) => {
        const focusedIndex = hoveredIndex ?? activeIndex;
        const isFocused = focusedIndex === index;

        return (
          <TestimonialCard
            key={`${cardProps.username}-${index}`}
            {...cardProps}
            className={getCardClassName(index, cardProps.className || "")}
            onHover={() => setHoveredIndex(index)}
            onLeave={() => setHoveredIndex(null)}
            isActive={activeIndex === index}
            isFocused={isFocused}
            onTap={() => handleTap(index)}
          />
        );
      })}
    </div>
  );
}

export function TestimonialCardsSection() {
  return (
    <section
      className="bg-white"
      aria-label="The conversation on AI and science"
    >
      <div className="mx-auto max-w-[980px] px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            The Conversation
          </div>
          <h2 className="home-section-subtitle mt-4 max-w-[16ch] font-editorial text-ink-900">
            A new era of{" "}
            <span className="text-[#2563eb]">discovery</span>
          </h2>
          <p className="home-content-copy mt-7 max-w-[42ch] font-marketing text-ink-600 !text-left">
            What happens when human intuition meets machine intelligence - and
            what it could mean for the future of science. Not product pitches.
            Just the ideas shaping what comes next.
          </p>
        </div>

        <div className="mt-14 flex w-full items-center justify-center overflow-visible lg:mt-0">
          <Testimonial />
        </div>
      </div>
    </section>
  );
}

export { TestimonialCard, TestimonialCards as Testimonials };
