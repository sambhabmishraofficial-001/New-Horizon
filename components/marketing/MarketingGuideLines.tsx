import { cn } from "@/lib/cn";

function GuideFrame({
  tone,
  fixed = false,
  hero = false,
  className,
}: {
  tone: "light" | "dark";
  fixed?: boolean;
  hero?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        fixed ? "nh-marketing-guides" : "nh-hero-guides",
        tone === "dark" ? "nh-guide-lines--dark" : "nh-guide-lines--light",
        className,
      )}
      aria-hidden
    >
      {hero ? (
        <>
          <span className="nh-guide-line nh-guide-line--h nh-guide-line--full nh-guide-line--top" />
          <span className="nh-guide-line nh-guide-line--h nh-guide-line--full nh-guide-line--bottom" />
        </>
      ) : null}
      <div className="nh-marketing-guides__column">
        <span className="nh-guide-line nh-guide-line--v nh-guide-line--left" />
        <span className="nh-guide-line nh-guide-line--v nh-guide-line--right" />
      </div>
    </div>
  );
}

/** Fixed dotted column guides for white page sections. */
export function MarketingGuideLines() {
  return <GuideFrame tone="light" fixed />;
}

/** Dotted guides overlay for the hero video. */
export function HeroGuideLines() {
  return <GuideFrame tone="dark" hero />;
}
