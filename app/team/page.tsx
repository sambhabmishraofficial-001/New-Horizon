import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { TeamSectionBlock } from "@/components/marketing/TeamSectionBlock";

export default function TeamPage() {
  return (
    <div className="marketing-site boxed-theme-page min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav />
      <main className="boxed-theme-page__surface">
        <TeamSectionBlock />
      </main>
      <div className="boxed-theme-page__surface boxed-theme-page__surface--footer">
        <MarketingFooter />
      </div>
    </div>
  );
}
