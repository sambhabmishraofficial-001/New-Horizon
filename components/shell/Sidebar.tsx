"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/cn";

const sections: Array<NavItem["section"]> = [
  "Institute",
  "Discovery",
  "Systems",
  "People",
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[232px] shrink-0 border-r border-ink-900/8 bg-parchment-50 flex flex-col font-marketing not-italic">
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {sections.map((sec, idx) => (
          <div key={sec} className={idx === 0 ? "" : "mt-7"}>
            <div className="px-2 pb-2 font-marketing text-[10.5px] font-medium uppercase not-italic tracking-[0.16em] text-ink-400">
              {sec}
            </div>
            <ul className="space-y-px">
              {NAV.filter((n) => n.section === sec).map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2.5 h-8 px-2 rounded-md font-marketing text-[13px] not-italic transition-colors",
                        active
                          ? "bg-ink-900/6 text-ink-900"
                          : "text-ink-600 hover:text-ink-900 hover:bg-ink-900/4"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[15px] w-[15px] shrink-0",
                          active ? "text-ink-900" : "text-ink-400 group-hover:text-ink-700"
                        )}
                        strokeWidth={active ? 2 : 1.75}
                      />
                      <span className="flex-1 truncate font-marketing not-italic">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 font-marketing text-[11px] not-italic leading-relaxed text-ink-400">
        New Horizon · 0.9 Atrium
      </div>
    </aside>
  );
}
