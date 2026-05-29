import { HomeHero } from "@/components/marketing/HomeHero";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { LogoCloudSection } from "@/components/marketing/LogoCloudSection";
import { StoryFlowSections } from "@/components/marketing/StoryFlowSections";

export default function HomePage() {
  return (
    <div className="marketing-site home-page min-h-screen bg-white text-ink-900 font-marketing">
      <HomeHero />

      <LogoCloudSection />

      <StoryFlowSections />

      <MarketingFooter />
    </div>
  );
}
