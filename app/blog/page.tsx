import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { BlogCardStack } from "@/components/marketing/BlogCardStack";

export default function BlogPage() {
  return (
    <div className="marketing-site boxed-theme-page min-h-screen bg-white font-marketing text-ink-900">
      <MarketingNav />

      <section className="boxed-theme-page__surface bg-white">
        <div className="mx-auto max-w-[980px] px-6 py-20 sm:px-10 sm:py-28">
          <div className="text-center">
            <h1 className="home-section-subtitle font-editorial text-ink-900">
              Blog
            </h1>
            <p className="home-content-copy mx-auto mt-6 max-w-[48ch] !font-light font-marketing text-[16px] leading-[1.65] text-ink-600 sm:text-[17px] !text-left sm:!text-center">
              Essays and notes on Human-AI Co-Science, the future of discovery,
              and the ideas shaping New Horizon.
            </p>
          </div>

          <div className="mt-14">
            <BlogCardStack />
          </div>
        </div>
      </section>

      <div className="boxed-theme-page__surface boxed-theme-page__surface--footer">
        <MarketingFooter />
      </div>
    </div>
  );
}
