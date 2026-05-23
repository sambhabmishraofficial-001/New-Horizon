import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { BLOG_POSTS } from "@/lib/blog-posts";

const post = BLOG_POSTS[1];

export const metadata: Metadata = {
  title: `${post.title} - New Horizon Blog`,
  description: post.description,
};

function ManifestoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-editorial text-[28px] leading-[1.15] tracking-tight text-ink-900 sm:text-[32px]">
        {title}
      </h2>
      <div className="space-y-4 font-marketing text-[16px] leading-[1.75] text-ink-600">
        {children}
      </div>
    </section>
  );
}

export default function ManifestoPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav />

      <article className="border-b border-ink-900/8">
        <div className="mx-auto max-w-[720px] px-6 py-16 sm:px-10 sm:py-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-marketing text-[13px] font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Blog
          </Link>

          <header className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
              {post.category} · {post.date}
            </p>
            <h1 className="mt-4 font-editorial text-[40px] leading-[1.05] tracking-tight text-ink-900 sm:text-[52px]">
              {post.title}
            </h1>
            <p className="mt-5 font-marketing text-[17px] leading-relaxed text-ink-600">
              {post.description}
            </p>
          </header>

          <div className="mt-12 space-y-14">
            <ManifestoSection title="Our mission">
              <p>
                The research community already possesses near-AGI-level
                collective intelligence, but often underestimates what it can
                achieve. Our aim is to provide the entire community with
                superintelligent systems to unleash their full potential,
                enabling Human-AI Co-Science at a scale, speed, and scope
                previously impossible.
              </p>
              <p>
                We are building the Novum Organum for the 21st century - a new
                instrument for the systematization of discovery that bridges the
                gap between human thought bandwidth and the infinite abundance
                of scientific data.
              </p>
            </ManifestoSection>

            <ManifestoSection title="Systematizing serendipity">
              <p>
                For centuries, the frontier of human knowledge has been pushed
                forward by beautiful accidents: a contaminated petri dish, a
                fortunate walk in the woods, or a coincidental collision of
                minds at an academic conference. As the complexity of our global
                challenges compounds, we can no longer afford to leave
                innovation to the mercy of chance.
              </p>
              <p>
                Our mission is to engineer the end of accidental discovery. We
                are replacing serendipity with steerable reasoning - building
                the computational scaffolding necessary to map the unseen
                connections between disciplines.
              </p>
            </ManifestoSection>

            <ManifestoSection title="Amplification, not replacement">
              <p>
                Philosopher Michael Polanyi spent his career describing what he
                called tacit knowledge - the things a scientist knows that they
                cannot fully articulate. That knowledge is not in any dataset.
                It lives in the person. Our systems are built to protect the
                time and space for it to operate.
              </p>
              <p>
                The distinction we hold as foundational: amplification, not
                replacement. The telescope did not replace the astronomer&apos;s
                eye. It gave the eye something worthy of its attention.
              </p>
              <p>
                Science has always been a collective endeavour. Newton stood on
                the shoulders of giants. We are building the platform that lets
                every scientist stand a little higher.
              </p>
            </ManifestoSection>

            <ManifestoSection title="First principles">
              <ul className="space-y-3">
                <li>
                  <strong className="font-medium text-ink-900">
                    Persistent.
                  </strong>{" "}
                  Your institute remembers every paper, dataset, hypothesis, run,
                  and result - across years, not sessions.
                </li>
                <li>
                  <strong className="font-medium text-ink-900">
                    Accountable.
                  </strong>{" "}
                  Every claim traces to its source. Every result traces to the
                  run that produced it.
                </li>
                <li>
                  <strong className="font-medium text-ink-900">Yours.</strong>{" "}
                  Your data, your IP, your compute. The institute is hosted; the
                  science stays yours.
                </li>
              </ul>
            </ManifestoSection>
          </div>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
