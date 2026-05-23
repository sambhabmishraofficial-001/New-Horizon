import Link from "next/link";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { FooterStarWarsToggle } from "@/components/marketing/FooterStarWarsToggle";

const columns = [
  {
    title: "Product",
    links: [
      ["Products", "/products"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Team", "/team"],
      ["Blog", "/blog"],
      ["Careers", "#"],
      ["Press", "#"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy/"],
      ["Terms of Service", "/terms/"],
    ],
  },
  {
    title: "Community",
    links: [
      ["X / Twitter", "#"],
      ["GitHub", "#"],
      ["Discord", "#"],
      ["Contact", "mailto:contact@newhorizon.dev"],
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="overflow-hidden bg-white font-marketing text-ink-900">
      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 sm:px-10 sm:pt-20">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-ink-900"
            >
              <span
                className="font-marketing text-[18px] font-light leading-none tracking-[0.12em]"
                aria-hidden
              >
                [NH]
              </span>
              <span className="font-editorial text-[22px] tracking-tight">
                New Horizon
              </span>
            </Link>
            <a
              href="mailto:contact@newhorizon.dev"
              className="mt-3 block text-[13.5px] text-ink-700 hover:text-ink-900"
            >
              contact@newhorizon.dev →
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-400">
                  {column.title}
                </div>
                <ul className="space-y-3">
                  {column.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        data-todo={href === "#" ? "true" : undefined}
                        className="text-[13px] text-ink-600 hover:text-ink-900"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-ink-900/10 pt-8">
          <div className="flex flex-col items-center gap-8 overflow-visible py-2">
            <FooterStarWarsToggle />
            <div className="flex w-full flex-col gap-3 text-[12.5px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© 2026 New Horizon Research, Inc.</div>
              <CookieSettingsButton />
            </div>
          </div>
        </div>

        <div className="footer-stripe-wordmark" aria-hidden>
          New Horizon
        </div>
      </div>
    </footer>
  );
}
