import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnomalousBlob } from "@/components/marketing/AnomalousBlob";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { LogoCloudSection } from "@/components/marketing/LogoCloudSection";
import { StoryFlowSections } from "@/components/marketing/StoryFlowSections";

export default function HomePage() {
  return (
    <div className="marketing-site home-page min-h-screen bg-white text-ink-900 font-marketing">
      <MarketingNav />

      <section className="relative isolate overflow-hidden bg-white">
        <div className="home-hero-grid mx-auto w-full max-w-[1140px] px-6 pt-8 pb-14 sm:px-10 sm:pt-10 sm:pb-16 lg:pt-6 lg:pb-14 xl:pt-8 xl:pb-16 2xl:max-w-[1200px] 2xl:pt-10 2xl:pb-20">
          <div className="home-hero-inner flex flex-col items-center gap-8 sm:gap-10 lg:-mt-2 lg:items-start lg:justify-start lg:pl-28 lg:pr-6 xl:-mt-3 xl:pl-36 2xl:pl-40">
            <div className="home-hero-copy relative z-10 w-full min-w-0 pl-5 sm:pl-10 lg:w-auto lg:pl-0 lg:pr-0">
              <div className="home-hero-headline-row flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10">
                <div className="home-hero-text w-full min-w-0 lg:flex lg:flex-col lg:justify-end lg:py-1 lg:max-w-[32rem]">
                  <div className="home-hero-stack mt-8 sm:mt-10 lg:mt-0">
                    <h1 className="home-hero-title font-editorial text-[40px] leading-[1] text-ink-900 sm:text-[52px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px]">
                      New Horizon
                    </h1>
                    <p className="home-hero-lede mt-4 max-w-[33ch] !font-light font-marketing text-[15px] leading-[1.55] text-ink-600 sm:mt-5 sm:text-[17px] lg:mt-3.5 lg:text-[18px] xl:text-[19px]">
                      An Applied AI Research lab building the infrastructure for
                      Human-AI Co-Science.
                    </p>
                    <div className="home-hero-cta mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
                    <Link
                      href="#mission"
                      className="btn-xai btn-xai-primary h-10 px-5"
                    >
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/products"
                      className="btn-xai btn-xai-secondary h-10 px-5"
                    >
                      View products <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                    </div>
                  </div>
                </div>
                <div className="home-hero-blob relative flex w-full shrink-0 items-center justify-center sm:min-h-[240px] lg:min-h-0 lg:w-auto lg:self-stretch">
                  <AnomalousBlob />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoCloudSection />

      <StoryFlowSections />

      <MarketingFooter />
    </div>
  );
}
