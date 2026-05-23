import { cn } from "@/lib/cn";
import { sitePath } from "@/lib/sitePath";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Partner = {
  id: string;
  name: string;
  sub: string;
  logo: string;
  logoClassName?: string;
};

const PARTNER_TILE_CLASS =
  "flex h-[5.2rem] w-[162px] shrink-0 flex-col items-center justify-center gap-1.5";
const PARTNER_LOGO_SLOT_CLASS =
  "flex h-[3.6rem] w-full items-center justify-center";
const PARTNER_LOGO_IMG_CLASS =
  "pointer-events-none max-h-[3.15rem] max-w-[142px] h-auto w-auto select-none object-contain object-center opacity-80";
const PARTNER_GAP = 50;

const PARTNERS: Partner[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    sub: "AWS Activate",
    logo: sitePath("/logos/partners/aws.svg"),
    logoClassName: "max-w-[65px]",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    sub: "for startups",
    logo: sitePath("/logos/partners/anthropic.svg"),
    logoClassName: "max-w-[108px]",
  },
  {
    id: "openai",
    name: "OpenAI",
    sub: "for startups",
    logo: sitePath("/logos/partners/openai.svg"),
    logoClassName: "max-w-[86px]",
  },
  {
    id: "grok",
    name: "Grok",
    sub: "for startups",
    logo: sitePath("/logos/partners/grok.svg"),
    logoClassName: "max-w-[65px]",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    sub: "for startups",
    logo: sitePath("/logos/partners/microsoft.svg"),
    logoClassName: "max-w-[86px]",
  },
];

function PartnerMark({ partner }: { partner: Partner }) {
  return (
    <div className={PARTNER_TILE_CLASS}>
      <div className={PARTNER_LOGO_SLOT_CLASS}>
        <img
          src={partner.logo}
          alt={partner.name}
          className={cn(PARTNER_LOGO_IMG_CLASS, partner.logoClassName)}
          height={50}
          width={142}
          loading="lazy"
        />
      </div>
      <p className="font-marketing text-[10px] leading-tight text-ink-400">
        {partner.sub}
      </p>
    </div>
  );
}

function PartnerCloud({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden pt-3 pb-0 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={PARTNER_GAP} duration={80} durationOnHover={25}>
        {PARTNERS.map((partner) => (
          <PartnerMark key={partner.id} partner={partner} />
        ))}
      </InfiniteSlider>
    </div>
  );
}

export function SupportedBySection({ className }: { className?: string }) {
  return (
    <section
      className={cn("supported-by-section relative z-20 w-full", className)}
      aria-label="Supported by"
    >
      <h2 className="logo-cloud-heading relative z-10 !font-light font-marketing tracking-tight text-ink-600">
        Supported by
      </h2>
      <PartnerCloud className="mt-5" />
    </section>
  );
}
