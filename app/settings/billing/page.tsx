"use client";

import * as React from "react";
import { Coins, Sparkles, Zap } from "lucide-react";
import {
  SettingsHeader,
  SettingsSection,
  Row,
  Button,
} from "@/components/settings/SettingsKit";
import { SystemStatusBlock } from "@/components/ui/system-status-block";

type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  creditsIncluded?: string;
  current?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "scholar",
    name: "Scholar",
    price: "$0",
    cadence: "free, forever",
    blurb: "For students and independents. Single workspace, capped compute, public outputs.",
    creditsIncluded: "500 credits / month",
  },
  {
    id: "research",
    name: "Research",
    price: "$49",
    cadence: "per researcher / month",
    blurb: "Full IRE, private projects, agent autonomy controls, FAIR exports.",
    creditsIncluded: "5,000 credits / month",
    current: true,
  },
  {
    id: "lab",
    name: "Lab",
    price: "$199",
    cadence: "per seat / month",
    blurb: "Shared institutes, role-based access, audit trails, SAML SSO, BYO compute.",
    creditsIncluded: "25,000 credits / seat / month",
  },
  {
    id: "institution",
    name: "Institution",
    price: "Talk to us",
    cadence: "annual contract",
    blurb: "Cohort onboarding, on-prem deploys, IRB integrations, compliance review.",
    creditsIncluded: "Custom credit pools",
  },
];

type CreditPack = {
  id: string;
  credits: number;
  price: string;
  bonus?: string;
  popular?: boolean;
};

const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", credits: 1000, price: "$12" },
  { id: "standard", credits: 5000, price: "$49", bonus: "+250 bonus", popular: true },
  { id: "lab", credits: 25000, price: "$199", bonus: "+2,500 bonus" },
  { id: "institute", credits: 100000, price: "$699", bonus: "+15,000 bonus" },
];

type Usage = { label: string; used: number; cap: number; unit: string };

const USAGE: Usage[] = [
  { label: "Compute hours", used: 38, cap: 100, unit: "h" },
  { label: "Storage", used: 12.4, cap: 50, unit: "GB" },
  { label: "Agent runs", used: 184, cap: 500, unit: "runs" },
  { label: "Seats", used: 1, cap: 1, unit: "seat" },
];

const CREDIT_USAGE = [
  { label: "Twin inference", spent: 820, unit: "credits" },
  { label: "Virtual lab runs", spent: 640, unit: "credits" },
  { label: "Literature synthesis", spent: 210, unit: "credits" },
  { label: "Manuscript drafting", spent: 180, unit: "credits" },
];

function UsageBar({ u }: { u: Usage }) {
  const pct = Math.min(100, Math.round((u.used / u.cap) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="text-[13px] text-ink-800">{u.label}</div>
        <div className="font-mono text-[11.5px] text-ink-500">
          {u.used} / {u.cap} {u.unit}
        </div>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/8">
        <div
          className="h-full rounded-full bg-ink-900"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={
        "rounded-xl border p-4 " +
        (plan.current
          ? "border-ink-900/40 bg-ink-900/[0.02] shadow-pane"
          : "border-ink-900/10 bg-white")
      }
    >
      <div className="flex items-baseline justify-between">
        <div className="font-editorial text-[18px] text-ink-900">{plan.name}</div>
        {plan.current && (
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-500">
            current
          </span>
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <div className="font-editorial text-[22px] text-ink-900">{plan.price}</div>
        <div className="text-[12px] text-ink-500">{plan.cadence}</div>
      </div>
      {plan.creditsIncluded ? (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-beacon-50 px-2.5 py-1 text-[11px] font-medium text-beacon-900">
          <Coins className="h-3 w-3" />
          {plan.creditsIncluded}
        </div>
      ) : null}
      <div className="mt-2 text-[12.5px] leading-relaxed text-ink-600">{plan.blurb}</div>
      <div className="mt-3">
        {plan.current ? (
          <Button variant="outline" onClick={() => {}}>
            Manage plan
          </Button>
        ) : (
          <Button variant="primary" onClick={() => {}}>
            Switch to {plan.name}
          </Button>
        )}
      </div>
    </div>
  );
}

function CreditPackCard({ pack }: { pack: CreditPack }) {
  return (
    <div
      className={
        "relative rounded-xl border p-4 " +
        (pack.popular
          ? "border-beacon-500/30 bg-beacon-50/40 shadow-pane"
          : "border-ink-900/10 bg-white")
      }
    >
      {pack.popular ? (
        <span className="absolute -top-2.5 right-3 rounded-full bg-beacon-600 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          Popular
        </span>
      ) : null}
      <div className="flex items-center gap-2 text-ink-900">
        <Sparkles className="h-4 w-4 text-beacon-700" strokeWidth={1.75} />
        <span className="font-editorial text-[20px]">
          {pack.credits.toLocaleString()}
        </span>
        <span className="text-[12px] text-ink-500">credits</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-editorial text-[22px] text-ink-900">{pack.price}</span>
        {pack.bonus ? (
          <span className="text-[11px] font-medium text-emerald-700">{pack.bonus}</span>
        ) : null}
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-500">
        One-time purchase. Credits never expire on paid plans.
      </p>
      <div className="mt-3">
        <Button variant={pack.popular ? "primary" : "outline"} onClick={() => {}}>
          Purchase
        </Button>
      </div>
    </div>
  );
}

export default function BillingSettings() {
  const [autoReload, setAutoReload] = React.useState(true);

  return (
    <div>
      <SettingsHeader
        title="Billing & credits"
        description="Manage your plan, institute credits, compute usage, and invoices."
      />

      <SettingsSection title="Credit balance">
        <div className="grid gap-4 rounded-xl border border-ink-900/10 bg-white p-5 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-ink-500">
              <Coins className="h-4 w-4" strokeWidth={1.75} />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                Available credits
              </span>
            </div>
            <div className="mt-2 font-editorial text-[42px] leading-none text-ink-900">
              2,450
            </div>
            <p className="mt-2 text-[13px] text-ink-600">
              Included with Research plan:{" "}
              <strong className="font-medium text-ink-900">5,000 / month</strong>
              {" · "}
              Resets in 9 days
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => {}}>
                Buy credits
              </Button>
              <Button variant="outline" onClick={() => {}}>
                View usage log
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-ink-900/8 bg-parchment-50/80 p-4">
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-400">
              Spent this month
            </div>
            <ul className="mt-3 space-y-2.5">
              {CREDIT_USAGE.map((row) => (
                <li key={row.label} className="flex items-center justify-between text-[12.5px]">
                  <span className="text-ink-700">{row.label}</span>
                  <span className="font-mono text-ink-500">
                    {row.spent} {row.unit}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-ink-900/8 pt-3 text-[13px] font-medium text-ink-900">
              <span>Total spent</span>
              <span className="font-mono">1,850 credits</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Purchase credits">
        <p className="mb-3 text-[13px] text-ink-500">
          Top up anytime for agent runs, virtual lab sessions, and twin inference.
          Larger packs include bonus credits.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {CREDIT_PACKS.map((pack) => (
            <CreditPackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Auto-reload">
        <Row
          label="Reload when balance is low"
          description="Automatically purchase the Standard pack when credits drop below 500."
        >
          <button
            type="button"
            role="switch"
            aria-checked={autoReload}
            onClick={() => setAutoReload((v) => !v)}
            className={
              "relative h-6 w-11 rounded-full transition-colors " +
              (autoReload ? "bg-ink-900" : "bg-ink-900/15")
            }
          >
            <span
              className={
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " +
                (autoReload ? "translate-x-[22px]" : "translate-x-0.5")
              }
            />
          </button>
        </Row>
      </SettingsSection>

      <SettingsSection title="What credits buy">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Compute & runs",
              body: "Virtual lab sessions, batch jobs, and instrument time on institute benches.",
            },
            {
              icon: Sparkles,
              title: "Twin & agent work",
              body: "Literature synthesis, hypothesis generation, protocol drafting, and manuscript passes.",
            },
            {
              icon: Coins,
              title: "Exports & storage",
              body: "Large dataset egress, long-term artifact retention, and FAIR package publishing.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-ink-900/10 bg-white p-4"
            >
              <Icon className="h-4 w-4 text-ink-500" strokeWidth={1.75} />
              <div className="mt-2 text-[13.5px] font-medium text-ink-900">{title}</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">{body}</p>
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Plan">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Usage this month">
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-ink-900/10 bg-white p-4 md:grid-cols-2">
          {USAGE.map((u) => (
            <UsageBar key={u.label} u={u} />
          ))}
        </div>
        <div className="mt-3 text-[12px] text-ink-500">
          Resets on the first of the month. Overages bill at the on-demand rate listed in your contract.
        </div>
      </SettingsSection>

      <SettingsSection title="Institute status">
        <p className="mb-3 text-[13px] text-ink-500">
          Live health for compute and agent services that draw on your credit
          balance. Degraded services may slow runs or queue twin inference.
        </p>
        <SystemStatusBlock />
      </SettingsSection>

      <SettingsSection title="Payment & invoices">
        <Row
          label="Payment method"
          description="Visa ending in 4242. Expires 12/29."
        >
          <Button variant="outline" onClick={() => {}}>
            Update
          </Button>
        </Row>
        <Row
          label="Invoices"
          description="Download past invoices as PDF or CSV from the Stripe portal."
        >
          <Button variant="outline" onClick={() => {}}>
            Open portal
          </Button>
        </Row>
        <Row
          label="Tax & company"
          description="Tax ID, billing address, and PO references for institutional billing."
        >
          <Button variant="outline" onClick={() => {}}>
            Edit
          </Button>
        </Row>
      </SettingsSection>
    </div>
  );
}
