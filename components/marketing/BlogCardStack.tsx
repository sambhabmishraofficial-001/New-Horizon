"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  BLOG_POSTS,
  blogPostHref,
  type BlogPostId,
} from "@/lib/blog-posts";

interface BlogCard {
  id: number;
  contentType: BlogPostId;
}

const initialCards: BlogCard[] = [
  { id: 1, contentType: 1 },
  { id: 2, contentType: 2 },
  { id: 3, contentType: 3 },
];

const positionStyles = [
  { scale: 1, y: 12 },
  { scale: 0.95, y: -16 },
  { scale: 0.9, y: -44 },
];

const exitAnimation = {
  y: 340,
  scale: 1,
  zIndex: 10,
};

const enterAnimation = {
  y: -16,
  scale: 0.9,
};

function BlogCardContent({ contentType }: { contentType: BlogPostId }) {
  const post = BLOG_POSTS[contentType];
  const href = blogPostHref(post.slug);
  const isPublished = post.slug === "manifesto";

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-ink-900/10 bg-ink-50">
        <img
          src={post.image}
          alt=""
          className="h-full w-full select-none object-cover"
        />
      </div>
      <div className="flex w-full items-center justify-between gap-3 px-3 pb-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
            {post.category}
          </span>
          <span className="truncate font-medium text-ink-900">{post.title}</span>
          <span className="line-clamp-2 text-sm text-ink-600">
            {post.description}
          </span>
        </div>
        {isPublished ? (
          <Link
            href={href}
            className="inline-flex h-10 shrink-0 select-none items-center gap-0.5 rounded-full bg-ink-900 pl-4 pr-3 text-sm font-medium text-parchment-50 transition hover:bg-ink-800"
          >
            Read
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              aria-hidden
            >
              <path d="M9.5 18L15.5 12L9.5 6" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex h-10 shrink-0 select-none items-center rounded-full border border-ink-900/12 px-4 text-sm font-medium text-ink-500">
            Soon
          </span>
        )}
      </div>
    </div>
  );
}

function AnimatedBlogCard({
  card,
  index,
  isAnimating,
}: {
  card: BlogCard;
  index: number;
  isAnimating: boolean;
}) {
  const { scale, y } = positionStyles[index] ?? positionStyles[2];
  const zIndex = index === 0 && isAnimating ? 10 : 3 - index;
  const exitAnim = index === 0 ? exitAnimation : undefined;
  const initialAnim = index === 2 ? enterAnimation : undefined;

  return (
    <motion.div
      key={card.id}
      initial={initialAnim}
      animate={{ y, scale }}
      exit={exitAnim}
      transition={{
        type: "spring",
        duration: 1,
        bounce: 0,
      }}
      style={{
        zIndex,
        left: "50%",
        x: "-50%",
        bottom: 0,
      }}
      className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-xl border border-b-0 border-ink-900/10 bg-white p-1 shadow-lift will-change-transform sm:w-[512px]"
    >
      <BlogCardContent contentType={card.contentType} />
    </motion.div>
  );
}

export function BlogCardStack({ className }: { className?: string }) {
  const [cards, setCards] = useState(initialCards);
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextId, setNextId] = useState(4);

  const handleNext = () => {
    setIsAnimating(true);

    const nextContentType = (((cards[2].contentType % 3) + 1) as BlogPostId);

    setCards([...cards.slice(1), { id: nextId, contentType: nextContentType }]);
    setNextId((prev) => prev + 1);

    window.setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <div className={cn("flex w-full flex-col items-center justify-center pt-2", className)}>
      <div className="relative h-[380px] w-full overflow-hidden sm:w-[644px]">
        <AnimatePresence initial={false}>
          {cards.slice(0, 3).map((card, index) => (
            <AnimatedBlogCard
              key={card.id}
              card={card}
              index={index}
              isAnimating={isAnimating}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-ink-900/10 py-4 sm:w-[644px]">
        <button
          type="button"
          onClick={handleNext}
          className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 rounded-lg border border-ink-900/12 bg-white px-4 font-marketing text-sm font-medium text-ink-700 transition-all hover:bg-ink-50 active:scale-[0.98]"
        >
          Next post
        </button>
      </div>
    </div>
  );
}

export default BlogCardStack;
