import { sitePath } from "@/lib/sitePath";

export type BlogPostId = 1 | 2 | 3;

export type BlogPost = {
  id: BlogPostId;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
};

export const BLOG_POSTS: Record<BlogPostId, BlogPost> = {
  1: {
    id: 1,
    slug: "manifesto",
    title: "Our Manifesto",
    description:
      "Why we are building the Novum Organum for Human-AI Co-Science",
    image: sitePath("/globe/hero-panel-bg.png"),
    category: "Manifesto",
    date: "May 2026",
  },
  2: {
    id: 2,
    slug: "systematizing-serendipity",
    title: "Systematizing Serendipity",
    description: "From accidental discovery to steerable reasoning",
    image: sitePath("/globe/earth-topology.png"),
    category: "Philosophy",
    date: "Coming soon",
  },
  3: {
    id: 3,
    slug: "novum-organum",
    title: "The Novum Organum",
    description: "A new instrument for the systematization of discovery",
    image: sitePath("/globe/earth-blue-marble.jpg"),
    category: "Vision",
    date: "Coming soon",
  },
};

export function blogPostHref(slug: string) {
  return `/blog/${slug}`;
}

export function getBlogPost(id: BlogPostId) {
  return BLOG_POSTS[id];
}
