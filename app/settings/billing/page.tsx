"use client";

import {
  SettingsHeader,
  SettingsSection,
  Row,
  Button,
} from "@/components/settings/SettingsKit";

type Plan = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  current?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "scholar",
    name: "Scholar",
    price: "$0",
    cadence: "free, forever",
    blurb: "For students and independents. Single workspace, capped compute, public outputs.",
  },
  {
    id: "research",
    name: "Research",
    price: "$49",
    cadence: "per researcher / month",
    blurb: "Full IRE, private projects, agent autonomy controls, FAIR exports.",
    current: true,
  },
  {
    id: "lab",
    name: "Lab",
    price: "$199",
    cadence: "per seat / month",
    blurb: "Shared institutes, role-based access, audit trails, SAML SSO, BYO compute.",
  },
  {
    id: "institution",
    name: "Institution",
    price: "Talk to us",
    cadence: "annual contract",
    blurb: "Cohort onboarding, on-prem deploys, IRB integrations, compliance review.",
  },
];

type Usage = { label: string; used: number; cap: number; unit: string };

const USAGE: Usage[] = [
  { label: "Compute hours", used: 38, cap: 100, unit: "h" },
  { label: "Storage", used: 12.4, cap: 50, unit: "GB" },
  { label: "Agent runs", used: 184, cap: 500, unit: "runs" },
  { label: "Seats", used: 1, cap: 1, unit: "seat" },
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
      <div className="mt-2 text-[12.5px] leading-relaxed text-ink-600">{plan.blurb}</div>
      <div className="mt-3">
        {plan.current ? (
          <Button variant="outline" onClick={() => {}}>
            Manage
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

export default function BillingSettings() {
  return (
    <div>
      <SettingsHeader
        title="Billing"
        description="Plan, usage, payment, and invoices. Stripe portal opens in a new tab."
      />

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
