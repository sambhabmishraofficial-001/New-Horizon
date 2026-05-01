import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

const plans = [
  {
    eyebrow: "Academic",
    price: "Free",
    sub: "For verified researchers",
    bullets: [
      "Full institute access",
      "One active program",
      "Community support",
      "BYO compute",
    ],
    cta: "Request access",
    href: "/enrol",
  },
  {
    eyebrow: "Solo",
    flag: "Recommended",
    price: "$29",
    cadence: "/ month",
    sub: "For independent researchers",
    bullets: [
      "Everything in Academic",
      "Unlimited programs",
      "Priority support",
      "Branch + replicate at scale",
      "Manuscript export (LaTeX, journal-ready)",
    ],
    cta: "Start",
    href: "/enrol",
    recommended: true,
  },
  {
    eyebrow: "Lab",
    price: "$99",
    cadence: "/ seat / month",
    sub: "For research groups",
    bullets: [
      "Everything in Solo",
      "Shared institute across the lab",
      "Lab-level invariants and quorum",
      "Cross-program lens",
      "Faculty-level controls",
    ],
    cta: "Talk to us",
    href: "mailto:hello@newhorizon.dev?subject=Lab%20pricing",
  },
  {
    eyebrow: "Institute",
    price: "Custom",
    sub: "For organizations and consortia",
    bullets: [
      "Everything in Lab",
      "SSO + SOC 2",
      "On-prem or VPC deploy",
      "Custom MCPs for your instruments",
      "Dedicated success engineer",
    ],
    cta: "Talk to us",
    href: "mailto:hello@newhorizon.dev?subject=Institute%20pricing",
  },
];

const faq = [
  {
    q: "Is BYO compute supported?",
    a: "Yes — bring AWS, GCP, on-prem, or your university cluster. We orchestrate.",
  },
  {
    q: "Where does my data live?",
    a: "In your compute. The institute hosts the orchestration layer; your data and IP never leave your environment.",
  },
  {
    q: "Can I migrate from a notebook / ELN?",
    a: "Yes. We import from Jupyter, RSpace, Benchling, and structured CSVs.",
  },
];

export default function PricingPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav variant="light" />

      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-20 sm:px-10 sm:pt-28">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
          Pricing
        </div>
        <h1 className="mt-4 max-w-[18ch] font-editorial text-[56px] leading-[1.02] text-ink-900 sm:text-[80px]">
          Choose your
          <span className="font-editorial"> institute.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.7] text-ink-600">
          Free for verified researchers. Pricing scales with the institute, not
          the seat.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-ink-900/8 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.eyebrow}
              className={`relative flex flex-col bg-white p-7 ${
                plan.recommended ? "bg-white" : ""
              }`}
            >
              {plan.flag && (
                <div className="absolute right-5 top-5 rounded-full border border-ink-900/10 bg-ink-900 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-parchment-50">
                  {plan.flag}
                </div>
              )}
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                {plan.eyebrow}
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <div className="font-editorial text-[44px] leading-none text-ink-900">
                  {plan.price}
                </div>
                {plan.cadence && (
                  <div className="text-[13px] text-ink-500">{plan.cadence}</div>
                )}
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.6] text-ink-600">
                {plan.sub}
              </p>

              <div className="my-6 h-px w-full bg-ink-900/10" />

              <ul className="space-y-3">
                {plan.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-[13px] leading-snug text-ink-700"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-900" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`btn-soft mt-8 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-medium ${
                  plan.recommended
                    ? "bg-ink-900 text-parchment-50 hover:bg-ink-800"
                    : "border border-ink-900/15 text-ink-800 hover:bg-ink-900 hover:text-parchment-50"
                }`}
              >
                {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 grid gap-12 border-t border-ink-900/10 pt-14 md:grid-cols-3">
          {faq.map((item) => (
            <div key={item.q}>
              <h2 className="font-editorial text-[22px] leading-tight text-ink-900">
                {item.q}
              </h2>
              <p className="mt-4 text-[14px] leading-[1.75] text-ink-600">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
