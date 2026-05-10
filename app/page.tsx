import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { sitePath } from "@/lib/sitePath";

function SphereField() {
  const meridians = Array.from({ length: 18 }, (_, index) => index * 10);
  const latitudes = [
    -78, -70, -62, -54, -46, -38, -30, -22, -14, -6, 6, 14, 22, 30, 38, 46,
    54, 62, 70, 78,
  ];
  const radius = 260;

  function animatedLongitudeWidths(phase: number) {
    return Array.from({ length: 25 }, (_, index) => {
      const angle = ((phase + index * 15) * Math.PI) / 180;
      return Math.max(2, Math.abs(Math.cos(angle)) * radius).toFixed(1);
    }).join(";");
  }

  return (
    <svg
      viewBox="0 0 600 600"
      className="nh-home-perfect-sphere h-auto w-full max-w-[520px]"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sphereHeatBands" x1="0" y1="40" x2="0" y2="560">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.82" />
          <stop offset="14%" stopColor="#2563eb" stopOpacity="0.8" />
          <stop offset="28%" stopColor="#2563eb" stopOpacity="0.78" />
          <stop offset="42%" stopColor="#2563eb" stopOpacity="0.74" />
          <stop offset="56%" stopColor="#2563eb" stopOpacity="0.7" />
          <stop offset="72%" stopColor="#2563eb" stopOpacity="0.66" />
          <stop offset="86%" stopColor="#2563eb" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.58" />
        </linearGradient>
        <clipPath id="sphereClip">
          <circle cx="300" cy="300" r={radius} />
        </clipPath>
      </defs>

      <g clipPath="url(#sphereClip)">
        <circle cx="300" cy="300" r={radius} fill="url(#sphereHeatBands)" />
      </g>

      <g className="nh-home-perfect-sphere__latitudes">
        {latitudes.map((angle) => {
          const radius = Math.cos((Math.abs(angle) * Math.PI) / 180);
          const offset = Math.sin((angle * Math.PI) / 180) * 50;

          return (
            <ellipse
              key={`latitude-${angle}`}
              cx="300"
              cy={300 + (offset / 50) * 260}
              rx={260 * radius}
              ry={Math.max(2.5, 260 * radius * 0.115)}
              stroke="#ffffff"
              strokeOpacity="0.62"
              strokeWidth="0.35"
            />
          );
        })}
      </g>

      <g className="nh-home-perfect-sphere__longitudes">
        {meridians.map((phase) => (
          <ellipse
            key={`longitude-${phase}`}
            cx="300"
            cy="300"
            rx={Math.max(2, Math.abs(Math.cos((phase * Math.PI) / 180)) * radius)}
            ry={radius}
            stroke="#ffffff"
            strokeOpacity="0.66"
            strokeWidth="0.35"
          >
            <animate
              attributeName="rx"
              dur="14s"
              repeatCount="indefinite"
              values={animatedLongitudeWidths(phase)}
            />
          </ellipse>
        ))}
      </g>

      <ellipse cx="300" cy="300" rx={radius} ry="30" stroke="#ffffff" strokeOpacity="0.68" strokeWidth="0.35" />
      <circle cx="300" cy="300" r={radius} stroke="#ffffff" strokeOpacity="0.78" strokeWidth="0.5" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="marketing-site home-page min-h-screen bg-white text-ink-900 font-marketing">
      <MarketingNav />

      <section className="relative isolate overflow-hidden bg-white">
        <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-[1200px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Applied AI Research Lab
            </div>
            <h1 className="mt-5 whitespace-nowrap font-editorial text-[50px] leading-[0.98] text-ink-900 sm:text-[72px]">
              New Horizon
            </h1>
            <p className="mt-7 max-w-[36ch] font-marketing text-[17px] leading-[1.6] text-ink-600 sm:text-[20px]">
              An Applied AI Research lab building the infrastructure for
              Human-AI Co-Science.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#mission"
                className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl bg-ink-900 px-5 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800"
              >
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/products"
                className="btn-soft inline-flex h-11 items-center gap-2 rounded-xl border border-ink-900/15 bg-white px-5 font-marketing text-[13.5px] font-medium not-italic text-ink-900 hover:bg-ink-50"
              >
                View products <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-visible lg:min-h-[620px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <SphereField />
            </div>
          </div>
        </div>
      </section>

      <section
        id="mission"
        className="border-y border-ink-900/8 bg-white"
      >
        <div className="mx-auto max-w-[980px] px-6 py-28 sm:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Our Mission
          </div>
          <div className="mt-8 space-y-8">
            <p className="home-content-copy max-w-[74ch] font-marketing text-ink-700">
              The research community already possesses{" "}
              <span className="mission-highlight px-1 text-ink-900">
                near-AGI-level
              </span>{" "}
              collective intelligence, but they often underestimate what they can
              achieve. Our aim is to provide the entire community with
              superintelligent systems to unleash their full potential,
              enabling{" "}
              <span className="mission-highlight px-1 text-ink-900">
                Human-AI Co-Science
              </span>{" "}
              at a scale, speed, and scope previously impossible.
            </p>
            <p className="home-content-copy max-w-[72ch] border-t border-ink-900/8 pt-8 font-marketing text-ink-600">
              We are building the{" "}
              <span className="bg-ink-900/8 px-1 text-ink-900">
                Novum Organum
              </span>{" "}
              for the 21st century - a new instrument for the{" "}
              <span className="bg-ink-900/8 px-1 text-ink-900">
                systematization of discovery
              </span>{" "}
              that bridges the gap between human thought bandwidth and the
              infinite abundance of scientific data.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[980px] px-6 py-28 sm:px-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
            Philosophy
          </div>
          <h2 className="home-section-subtitle mt-4 max-w-[16ch] font-editorial text-ink-900">
            Systematizing{" "}
            <span className="text-[#2563eb]">Serendipity</span>
          </h2>

          <div className="mt-12 space-y-6 border-b border-ink-900/8 pb-12">
            <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
              For centuries, the frontier of human knowledge has been pushed
              forward by beautiful accidents: a contaminated petri dish, a
              fortunate walk in the woods, or a coincidental collision of minds
              at an academic conference. Yet, as the complexity of our global
              challenges compounds, we can no longer afford to leave innovation
              to the mercy of chance.
            </p>
            <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
              Our mission is to engineer the{" "}
              <span className="bg-ink-900/8 px-1 text-ink-900">
                end of accidental discovery
              </span>
              . We are replacing serendipity with{" "}
              <span className="bg-ink-900/8 px-1 text-ink-900">
                steerable reasoning
              </span>{" "}
              - building the computational scaffolding necessary to map the
              unseen connections between disciplines.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="home-section-subtitle max-w-[22ch] font-editorial text-ink-900">
              Relationship Between{" "}
              <span className="text-[#2563eb]">Human</span> And{" "}
              <span className="text-[#2563eb]">Machine Intelligence</span>.
            </h3>
            <div className="mt-7 space-y-6">
              <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
                Philosopher Michael Polanyi spent his career describing what he
                called{" "}
                <span className="bg-ink-900/8 px-1 text-ink-900">
                  tacit knowledge
                </span>{" "}
                - the things a scientist knows that they cannot fully
                articulate. That knowledge is not in any dataset. It lives in
                the person. Our systems are built to protect the time and space
                for it to operate.
              </p>
              <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
                This is the distinction we hold as foundational:{" "}
                <span className="bg-ink-900/8 px-1 text-ink-900">
                  amplification, not replacement
                </span>
                . The telescope did not replace the astronomer's eye. It gave
                the eye something worthy of its attention.
              </p>
              <p className="home-content-copy max-w-[72ch] font-marketing text-ink-600">
                Science has always been a collective endeavour. Newton stood on
                the shoulders of giants. We are building the platform that lets
                every scientist stand a little higher.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-900/8 bg-white">
        <div className="mx-auto max-w-[980px] px-6 py-28 sm:px-10">
          <AboutFoundersSection />
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function AboutFoundersSection() {
  const team: Array<{
    name: string;
    role: string;
    initials: string;
    image?: string;
  }> = [
    {
      name: "Sambhab Mishra",
      role: "CEO",
      initials: "SM",
      image: "/images/about/sambhab-mishra-avatar.png",
    },
    { name: "Anonymous", role: "CTO", initials: "A" },
    { name: "Anonymous", role: "CMO", initials: "A" },
  ];

  return (
    <section className="about-founder-strip" aria-label="Who we are">
      <div className="about-founder-strip__intro">
        <div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink-400">
            Who We Are
          </div>
          <h2 className="mt-4 font-editorial text-[46px] leading-none text-ink-900 sm:text-[58px]">
            Team
          </h2>
        </div>
        <div className="about-founder-strip__body">
          <p className="home-content-copy">
            We are building the infrastructure for a new kind of science.
          </p>
          <p className="home-content-copy">
            We are building the conditions under which human scientists -
            curious, creative, intuitive, irreplaceable - can work at a scale
            and speed that was previously impossible. Where a researcher's best
            idea is not limited by how many papers they can read, or how many
            experiments they can run, or whether their institution can afford
            the tools they need. Where the distance between a question and an
            answer is measured in days, not years.
          </p>
        </div>
      </div>

      <div className="about-founder-strip__team">
        {team.map((member) => (
          <article className="about-founder-person" key={`${member.name}-${member.role}`}>
            <div className="about-founder-person__avatar" aria-hidden>
              {member.image ? (
                <img src={sitePath(member.image)} alt="" />
              ) : (
                member.initials
              )}
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
