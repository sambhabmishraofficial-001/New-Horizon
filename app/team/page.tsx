import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { TeamSectionBlock } from "@/components/marketing/TeamSectionBlock";

export default function TeamPage() {
  return (
    <div className="marketing-site min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav />
      <TeamSectionBlock />
      <MarketingFooter />
    </div>
  );
}
