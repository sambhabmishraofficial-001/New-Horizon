import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";

export default function TermsPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav showBanner={false} />
      <main className="mx-auto max-w-[760px] px-6 py-16 sm:px-10 sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Legal
        </p>
        <h1 className="mt-3 font-editorial text-[40px] leading-[1.05] tracking-tight text-ink-900 sm:text-[48px]">
          Terms of service
        </h1>
        <p className="mt-5 font-marketing text-[15px] leading-[1.75] text-ink-600">
          These terms govern use of the New Horizon preview site and demo
          workspace. This is a product preview, not a production research
          platform agreement.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Preview use
          </h2>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            You may explore the interface, create demo accounts, and evaluate
            features for research planning purposes. Do not submit regulated,
            confidential, or patient-identifiable data to this environment.
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Accounts
          </h2>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            Demo accounts and workspace data may be reset without notice during
            preview development. You are responsible for keeping your sign-in
            credentials private.
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Privacy
          </h2>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            Our use of cookies and browser storage is described in the{" "}
            <Link
              href="/privacy/"
              className="text-[#1d4ed8] underline underline-offset-2"
            >
              privacy &amp; cookies policy
            </Link>
            .
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Contact
          </h2>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            For terms questions, email{" "}
            <a
              href="mailto:contact@newhorizon.dev"
              className="text-[#1d4ed8] underline underline-offset-2"
            >
              contact@newhorizon.dev
            </a>
            .
          </p>
        </section>

        <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
          Last updated May 22, 2026
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
