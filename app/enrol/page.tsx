import { ArrowRight } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function EnrolPage() {
  return (
    <div className="min-h-screen bg-parchment-50 font-marketing text-ink-900">
      <MarketingNav variant="light" />

      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-6 sm:px-10 sm:pt-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
              Cohort 01 · Onboarding
            </div>
            <h1 className="mt-4 max-w-[16ch] font-editorial text-[52px] leading-[1.02] text-ink-900 sm:text-[72px]">
              Request access
              <span className="font-editorial"> to New Horizon.</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[16.5px] leading-[1.75] text-ink-600">
              We're onboarding researchers in cohorts. Tell us about your work -
              one of our founding researchers will reply within two days.
            </p>

            <div className="mt-12 space-y-6 border-l border-ink-900/10 pl-6 text-[14px] leading-[1.75] text-ink-600">
              <p className="font-editorial text-[19px] text-ink-800">
                “The first three programs we onboarded were a ribozyme catalysis
                study, a kinase-resistance program, and a lipid-NP screen.”
              </p>
              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-400">
                What gets onboarded
              </div>
              <ul className="space-y-2.5 text-[13.5px] text-ink-700">
                <li>· One active research program</li>
                <li>· Up to three active hypotheses per program</li>
                <li>· BYO compute (cluster, cloud, or HHMI allocation)</li>
                <li>· Dedicated founding-team support during cohort</li>
              </ul>
            </div>
          </div>

          <div className="lg:pt-12">
            <form
              className="rounded-2xl border border-ink-900/10 bg-white p-7 shadow-editorial"
              action="mailto:contact@newhorizon.dev?subject=Access%20Request"
              method="post"
              encType="text/plain"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-400">
                Tell us about your work
              </div>
              <div className="mt-1 font-editorial text-[24px] leading-tight text-ink-900">
                Five fields. Two minutes.
              </div>

              <div className="mt-6 space-y-4">
                <Field label="Name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Affiliation" name="affiliation" />
                <label className="block">
                  <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-ink-500">
                    Domain
                  </span>
                  <select
                    name="domain"
                    className="mt-1.5 h-11 w-full rounded-lg border border-ink-900/12 bg-white px-3 text-[14px] text-ink-900 outline-none transition focus:border-ink-900"
                  >
                    <option>Bio</option>
                    <option>Chem</option>
                    <option>Physics</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-ink-500">
                    One-line research focus
                  </span>
                  <textarea
                    name="research focus"
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-ink-900/12 bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink-900 outline-none transition focus:border-ink-900"
                    placeholder="e.g. Mechanisms of acquired resistance in EGFR-mutant NSCLC"
                  />
                </label>
              </div>

              <button className="btn-soft mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 font-marketing text-[13.5px] font-medium not-italic text-parchment-50 hover:bg-ink-800">
                Request Access <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <p className="mt-4 text-center text-[12px] text-ink-500">
                We reply personally · No marketing list
              </p>
            </form>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-ink-500">
        {label}
      </span>
      <input
        name={name}
        type={type}
        className="mt-1.5 h-11 w-full rounded-lg border border-ink-900/12 bg-white px-3 text-[14px] text-ink-900 outline-none transition focus:border-ink-900"
      />
    </label>
  );
}
