import Link from "next/link";

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
      ["About", "#"],
      ["Blog", "#"],
      ["Careers", "#"],
      ["Press", "#"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "#"],
      ["Terms of Service", "#"],
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
    <footer className="overflow-hidden border-t border-ink-900/10 bg-white font-marketing text-ink-900">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10">
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

        <div className="mt-16 flex flex-col gap-3 border-t border-ink-900/10 pt-6 text-[12.5px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© 2026 New Horizon Research, Inc.</div>
        </div>

        <div className="footer-stripe-wordmark" aria-hidden>
          New Horizon
        </div>
      </div>
    </footer>
  );
}
