"use client";

import Link from "next/link";
import * as React from "react";
import { Check, ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

const YEARLY_SAVE_PERCENT = 23;

type Billing = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  description: string;
  /** Monthly price (USD); null for custom wording */
  monthlyPrice: number | null;
  /** Shown when monthlyPrice is null (e.g. "Free", "Custom") */
  priceLabel?: string;
  bullets: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

function yearlyMonthlyEquivalent(monthly: number) {
  const annual = monthly * 12 * (1 - YEARLY_SAVE_PERCENT / 100);
  return Math.round(annual / 12);
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const plans: Plan[] = [
  {
    id: "academic",
    name: "Academic",
    description: "For verified researchers getting started.",
    monthlyPrice: 0,
    priceLabel: "$0",
    bullets: [
      "Full institute access",
      "One active program",
      "Community support",
      "BYO compute",
    ],
    cta: "Get started",
    href: "/signup",
  },
  {
    id: "solo",
    name: "Solo",
    description: "For independent researchers shipping programs.",
    monthlyPrice: 29,
    bullets: [
      "Everything in Academic",
      "Unlimited programs",
      "Priority support",
      "Branch + replicate at scale",
      "Manuscript export (LaTeX, journal-ready)",
    ],
    cta: "Get Solo",
    href: "/signup",
    featured: true,
  },
  {
    id: "lab",
    name: "Lab",
    description: "For research teams across shared projects.",
    monthlyPrice: 99,
    bullets: [
      "Everything in Solo",
      "Shared institute across the lab",
      "Lab-level invariants and quorum",
      "Cross-program lens",
      "Faculty-level controls",
    ],
    cta: "Start a Lab",
    href: "mailto:contact@newhorizon.dev?subject=Lab%20pricing",
  },
  {
    id: "institute",
    name: "Institute",
    description: "For organizations and consortia.",
    monthlyPrice: null,
    priceLabel: "Custom",
    bullets: [
      "Everything in Lab",
      "SSO + SOC 2 roadmap",
      "On-prem or VPC deploy",
      "Custom MCPs for your instruments",
      "Dedicated success engineer",
    ],
    cta: "Talk to Sales",
    href: "mailto:contact@newhorizon.dev?subject=Institute%20pricing",
  },
];

const faq = [
  {
    q: "Is BYO compute supported?",
    a: "Yes - bring AWS, GCP, on-prem, or your university cluster. We orchestrate.",
  },
  {
    q: "Where does my data live?",
    a: "In your compute. The institute hosts the orchestration layer; your data and IP stay in your environment.",
  },
  {
    q: "Can I migrate from a notebook / ELN?",
    a: "Yes. We import from Jupyter, RSpace, Benchling, and structured CSVs.",
  },
];

function PlanCard({
  plan,
  billing,
}: {
  plan: Plan;
  billing: Billing;
}) {
  const isFreeOrCustom =
    plan.monthlyPrice === null || plan.monthlyPrice === 0;

  let priceMain = plan.priceLabel ?? "";
  let priceSub: string | null = null;
  let billedNote: string | null = null;

  if (plan.monthlyPrice === 0) {
    priceMain = "$0";
    priceSub = "/ mo";
  } else if (plan.monthlyPrice !== null) {
    if (billing === "monthly") {
      priceMain = formatUsd(plan.monthlyPrice);
      priceSub =
        plan.id === "lab" ? "/ seat / mo" : "/ mo";
    } else {
      const equiv = yearlyMonthlyEquivalent(plan.monthlyPrice);
      priceMain = formatUsd(equiv);
      priceSub =
        plan.id === "lab" ? "/ seat / mo" : "/ mo";
      billedNote =
        plan.id === "lab"
          ? "Billed annually per seat"
          : "Billed annually";
    }
  } else {
    priceSub = null;
    billedNote = null;
  }

  return (
    <div
      className={`pricing-card relative flex h-full flex-col rounded-2xl border bg-white p-7 sm:p-8 ${
        plan.featured
          ? "border-ink-900 shadow-[0_8px_40px_-12px_rgba(17,17,16,0.18)] ring-1 ring-ink-900/10"
          : "border-ink-900/10 shadow-[0_2px_24px_-8px_rgba(17,17,16,0.08)]"
      }`}
    >
      {plan.featured && (
        <div className="absolute right-5 top-5 rounded-full bg-ink-900 px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.18em] text-parchment-50">
          Popular
        </div>
      )}
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
        {plan.name}
      </div>
      <p className="mt-3 text-[14px] leading-snug text-ink-600">
        {plan.description}
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-1 gap-y-0">
        <span className="font-editorial text-[40px] leading-none tracking-tight text-ink-900 sm:text-[44px]">
          {priceMain}
        </span>
        {priceSub && (
          <span className="text-[14px] font-medium text-ink-500">{priceSub}</span>
        )}
      </div>
      {billedNote && !isFreeOrCustom && (
        <p className="mt-2 text-[12.5px] leading-tight text-ink-500">
          {billedNote}
        </p>
      )}
      <div className="my-6 h-px w-full bg-ink-900/10" />

      <ul className="flex flex-1 flex-col gap-3">
        {plan.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-2.5 text-[13.5px] leading-snug text-ink-700"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink-900/70" />
            {bullet}
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`btn-soft mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-medium not-italic ${
          plan.featured
            ? "bg-ink-900 text-parchment-50 hover:bg-ink-800"
            : "border border-ink-900/15 bg-white text-ink-900 hover:bg-ink-50"
        }`}
      >
        {plan.cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = React.useState<Billing>("yearly");

  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav variant="light" />

      <main className="mx-auto max-w-[1240px] px-5 pb-24 pt-6 sm:px-8 sm:pt-10 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-editorial text-[44px] leading-[1.05] tracking-tight text-ink-900 sm:text-[56px] lg:text-[64px]">
            Choose your institute.
          </h1>
          <p className="mx-auto mt-5 max-w-[52ch] !font-light font-marketing text-[16px] leading-[1.65] text-ink-600 sm:text-[17px]">
            Free for verified researchers. Scale from solo programs to full lab
            collaboration - pricing that grows with your science, not surprise
            seat taxes.
          </p>

          <div className="mx-auto mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <div
              className="inline-flex rounded-xl border border-ink-900/12 bg-ink-900/[0.03] p-1"
              role="group"
              aria-label="Billing period"
            >
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                className={`rounded-lg px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  billing === "yearly"
                    ? "bg-white text-ink-900 shadow-sm ring-1 ring-ink-900/10"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                Yearly
                <span className="ml-2 hidden font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700 sm:inline">
                  Save up to {YEARLY_SAVE_PERCENT}%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`rounded-lg px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  billing === "monthly"
                    ? "bg-white text-ink-900 shadow-sm ring-1 ring-ink-900/10"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                Monthly
              </button>
            </div>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 sm:text-left">
              {billing === "yearly"
                ? `Annual billing saves about ${YEARLY_SAVE_PERCENT}% on Solo & Lab.`
                : "Pay month to month - cancel anytime."}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-[900px] rounded-2xl border border-ink-900/10 bg-ink-900/[0.02] px-6 py-8 text-center sm:px-10">
          <p className="font-editorial text-[22px] text-ink-900 sm:text-[26px]">
            Need a pilot or university-wide rollout?
          </p>
          <p className="mx-auto mt-3 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-600">
            We work with cohorts, departments, and industry R&D. Tell us your
            timeline and compliance needs - we&apos;ll propose a clear package.
          </p>
          <Link
            href="mailto:contact@newhorizon.dev?subject=Pricing%20-%20pilot%20or%20enterprise"
            className="btn-soft mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-ink-900/15 bg-white px-6 text-[13px] font-medium not-italic text-ink-900 hover:bg-ink-50"
          >
            Email contact@newhorizon.dev
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-20 grid gap-10 border-t border-ink-900/10 pt-16 md:grid-cols-3 md:gap-12">
          {faq.map((item) => (
            <div key={item.q}>
              <h2 className="font-editorial text-[20px] leading-tight text-ink-900 sm:text-[22px]">
                {item.q}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.75] text-ink-600">
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
