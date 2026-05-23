"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  CreditCard,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  DISCOVERY_FEATURES,
  INSTITUTE_FEATURES,
  institutePathActive,
} from "@/lib/instituteNav";
import {
  EXPANDABLE_INSTITUTE_FEATURES,
  staticSubFeaturesFor,
} from "@/lib/instituteSubFeatures";
import { useInstituteNavContext } from "@/components/institute/institute-nav-context";
import { InstituteSidebarHeader } from "@/components/institute/InstituteSidebarToggle";
import { useInstituteSidebarState } from "@/components/institute/use-institute-sidebar-state";

type InstituteNavSidebarProps = {
  className?: string;
};

export function InstituteNavSidebar({ className }: InstituteNavSidebarProps) {
  const pathname = usePathname() ?? "/";
  const subNav = useInstituteNavContext()?.subFeatureNav;
  const {
    ready,
    collapsed,
    toggleGroup,
    isGroupExpanded,
    setGroupExpanded,
  } = useInstituteSidebarState();

  React.useEffect(() => {
    INSTITUTE_FEATURES.forEach((item) => {
      if (
        EXPANDABLE_INSTITUTE_FEATURES.has(item.id) &&
        institutePathActive(pathname, item.href)
      ) {
        setGroupExpanded(item.id, true);
      }
    });
  }, [pathname, setGroupExpanded]);

  return (
    <nav
      data-tour="institute-nav"
      data-collapsed={collapsed ? "true" : "false"}
      className={cn(
        "institute-sidebar shrink-0 flex flex-col border-r border-[var(--ire-border,theme(colors.ink.900/8))] bg-[var(--ire-sidebar,theme(colors.parchment.50))] transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[220px]",
        !ready && "opacity-0",
        ready && "opacity-100",
        className
      )}
      aria-label="Virtual Research Institute"
    >
      <InstituteSidebarHeader />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-4">
        <ul className="space-y-0.5">
          {INSTITUTE_FEATURES.map((item) => {
              const Icon = item.icon;
              const active = institutePathActive(pathname, item.href);
              const expandable = EXPANDABLE_INSTITUTE_FEATURES.has(item.id);
              const onRouteWithLiveSubNav =
                subNav?.parentFeatureId === item.id &&
                institutePathActive(pathname, item.href);
              const groupOpen =
                !collapsed &&
                expandable &&
                isGroupExpanded(item.id, active);
              const subItems = onRouteWithLiveSubNav
                ? subNav!.items
                : staticSubFeaturesFor(item.id);

              return (
                <li key={item.id}>
                  <div
                    data-active={active}
                    className={cn(
                      "ire-nav-item min-w-0",
                      collapsed && "justify-center px-2",
                      active && "shadow-[0_0_0_1px_var(--ire-border)]"
                    )}
                  >
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : item.description}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2",
                        collapsed && "justify-center"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
                      {!collapsed ? (
                        <span className="truncate text-left">{item.label}</span>
                      ) : null}
                    </Link>
                    {expandable && !collapsed ? (
                      <button
                        type="button"
                        onClick={() => toggleGroup(item.id)}
                        aria-expanded={groupOpen}
                        aria-label={`${groupOpen ? "Collapse" : "Expand"} ${item.label}`}
                        className="ire-nav-chevron shrink-0"
                      >
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-150",
                            groupOpen && "rotate-90"
                          )}
                          strokeWidth={1.75}
                        />
                      </button>
                    ) : null}
                  </div>

                  {groupOpen && subItems.length > 0 ? (
                    <ul
                      className="mt-0.5 ml-[1.125rem] border-l border-[var(--ire-border,theme(colors.ink.900/8))] pl-1.5 space-y-0.5"
                      aria-label={`${item.label} features`}
                    >
                      {subItems.map((child) => {
                        const childActive =
                          onRouteWithLiveSubNav && subNav!.activeId === child.id;
                        const badge = onRouteWithLiveSubNav
                          ? subNav!.badges?.[child.id]
                          : undefined;

                        return (
                          <li key={child.id}>
                            {onRouteWithLiveSubNav ? (
                              <button
                                type="button"
                                data-active={childActive}
                                onClick={() => subNav!.onSelect(child.id)}
                                className={cn(
                                  "ire-nav-item ire-nav-subitem w-full",
                                  childActive && "shadow-[0_0_0_1px_var(--ire-border)]"
                                )}
                              >
                                <span className="flex-1 text-left truncate">{child.label}</span>
                                {badge != null ? (
                                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500/90 text-white text-[9px] font-medium grid place-items-center">
                                    {badge}
                                  </span>
                                ) : null}
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                className="ire-nav-item ire-nav-subitem w-full text-ink-500 hover:text-ink-800"
                              >
                                <span className="truncate">{child.label}</span>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
        </ul>

        <NavSection title="Discovery" collapsed={collapsed}>
          <ul className="space-y-0.5">
            {DISCOVERY_FEATURES.map((item) => {
              const Icon = item.icon;
              const active = institutePathActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-active={active}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "ire-nav-item",
                      collapsed && "justify-center px-2",
                      active && "shadow-[0_0_0_1px_var(--ire-border)]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </NavSection>
      </div>

      <div className="shrink-0 border-t border-[var(--ire-border,theme(colors.ink.900/8))] p-2 space-y-0.5">
        {!collapsed ? <div className="ire-label px-2 mb-1">Account</div> : null}
        <Link
          href="/account"
          title={collapsed ? "Profile" : undefined}
          className={cn("ire-nav-item", collapsed && "justify-center px-2")}
        >
          <User className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
          {!collapsed ? "Profile" : null}
        </Link>
        <Link
          href="/settings/billing"
          data-active={pathname.startsWith("/settings/billing")}
          title={collapsed ? "Billing & credits" : undefined}
          className={cn(
            "ire-nav-item",
            collapsed && "justify-center px-2",
            pathname.startsWith("/settings/billing") &&
              "shadow-[0_0_0_1px_var(--ire-border)] bg-[var(--ire-surface-elevated)]"
          )}
        >
          <CreditCard className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
          {!collapsed ? "Billing & credits" : null}
        </Link>
        <Link
          href="/settings/general"
          title={collapsed ? "Settings" : undefined}
          className={cn("ire-nav-item", collapsed && "justify-center px-2")}
        >
          <Settings className="h-3.5 w-3.5 shrink-0 text-ink-500" strokeWidth={1.65} />
          {!collapsed ? "Settings" : null}
        </Link>
      </div>
    </nav>
  );
}

function NavSection({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  if (collapsed) return <div>{children}</div>;
  return (
    <div>
      <div className="ire-label px-2 mb-1">{title}</div>
      {children}
    </div>
  );
}
