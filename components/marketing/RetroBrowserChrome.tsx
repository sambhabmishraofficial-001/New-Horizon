"use client";

import { cn } from "@/lib/cn";

type RetroTab = "products" | "models" | "benchmarks" | "research";

function TabCloseButton({ label }: { label: string }) {
  return (
    <span
      className="retro-browser-chrome__tab-close"
      role="presentation"
      aria-hidden
      title={`Close ${label}`}
    >
      ×
    </span>
  );
}

function SectionTab({
  id,
  label,
  active,
  onSelect,
}: {
  id: RetroTab;
  label: string;
  active: boolean;
  onSelect: (id: RetroTab) => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn("retro-browser-chrome__tab", active && "is-active")}
      onClick={() => onSelect(id)}
    >
      <span className="retro-browser-chrome__tab-label">{label}</span>
      <TabCloseButton label={label} />
    </button>
  );
}

export function RetroBrowserChrome({
  activeTab,
  onTabChange,
}: {
  activeTab: RetroTab;
  onTabChange: (tab: RetroTab) => void;
}) {
  return (
    <div className="retro-browser-chrome" aria-label="Window chrome">
      <div className="retro-browser-chrome__tabs" role="tablist" aria-label="Open tabs">
        <SectionTab
          id="products"
          label="Products"
          active={activeTab === "products"}
          onSelect={onTabChange}
        />
        <SectionTab
          id="models"
          label="Models"
          active={activeTab === "models"}
          onSelect={onTabChange}
        />
        <SectionTab
          id="benchmarks"
          label="Benchmarks"
          active={activeTab === "benchmarks"}
          onSelect={onTabChange}
        />
        <SectionTab
          id="research"
          label="Research"
          active={activeTab === "research"}
          onSelect={onTabChange}
        />
        <button type="button" className="retro-browser-chrome__new-tab" aria-label="New tab">
          +
        </button>
      </div>

      <div className="retro-browser-chrome__actions">
        <button type="button" className="retro-browser-chrome__assist" aria-label="Assist">
          <span className="retro-browser-chrome__assist-icon" aria-hidden>
            ✦
          </span>
          <span>Assist</span>
        </button>

        <div className="retro-browser-chrome__win-controls" aria-label="Window controls">
          <button type="button" aria-label="Minimize">
            <span aria-hidden>—</span>
          </button>
          <button type="button" aria-label="Maximize">
            <span aria-hidden>□</span>
          </button>
          <button type="button" className="is-close" aria-label="Close">
            <span aria-hidden>×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
