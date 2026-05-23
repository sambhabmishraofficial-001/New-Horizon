import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { COOKIE_INVENTORY } from "@/lib/cookie-consent";

export default function PrivacyPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav showBanner={false} />
      <main className="mx-auto max-w-[760px] px-6 py-16 sm:px-10 sm:py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Legal
        </p>
        <h1 className="mt-3 font-editorial text-[40px] leading-[1.05] tracking-tight text-ink-900 sm:text-[48px]">
          Privacy &amp; cookies
        </h1>
        <p className="mt-5 font-marketing text-[15px] leading-[1.75] text-ink-600">
          This page describes how New Horizon uses cookies and browser storage in
          this preview environment. We keep necessary data to run the product and
          ask before enabling optional preferences or analytics.
        </p>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Cookie categories
          </h2>
          <ul className="space-y-3 font-marketing text-[15px] leading-[1.75] text-ink-600">
            <li>
              <strong className="font-medium text-ink-900">Necessary</strong> -
              required for sign-in, security, and storing your consent choice.
            </li>
            <li>
              <strong className="font-medium text-ink-900">Functional</strong> -
              remembers UI preferences such as theme and dismissed banners.
            </li>
            <li>
              <strong className="font-medium text-ink-900">Analytics</strong> -
              would help us understand usage. Not active in this preview build.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            What we store
          </h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-ink-900/10">
            <table className="min-w-full text-left font-marketing text-[13px]">
              <thead className="bg-ink-50/80 text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Name
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Type
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Category
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Purpose
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/8 text-ink-700">
                {COOKIE_INVENTORY.map((item) => (
                  <tr key={item.name}>
                    <td className="px-4 py-3 font-mono text-[12px] text-ink-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3">{item.kind}</td>
                    <td className="px-4 py-3 capitalize">{item.category}</td>
                    <td className="px-4 py-3">{item.purpose}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="font-editorial text-[24px] tracking-tight text-ink-900">
            Your choices
          </h2>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            When you first visit, we show a cookie banner so you can accept all
            cookies, reject non-essential cookies, or manage categories. You can
            reopen those settings anytime from the site footer.
          </p>
          <p className="font-marketing text-[15px] leading-[1.75] text-ink-600">
            Questions? Email{" "}
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
