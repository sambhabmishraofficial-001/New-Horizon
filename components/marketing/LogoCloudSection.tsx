import { cn } from "@/lib/cn";
import { sitePath } from "@/lib/sitePath";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

type Logo = {
  src: string;
  alt: string;
  imgClassName?: string;
};

/** Fixed slot so every mark reads the same size; gap is between slots only. */
const LOGO_TILE_CLASS =
  "logo-cloud-tile flex h-16 w-[180px] shrink-0 items-center justify-center";
const LOGO_IMG_CLASS =
  "max-h-[3.5rem] max-w-[158px] h-auto w-auto object-contain object-center opacity-80";
const LOGO_GAP = 56;

const logos: Logo[] = [
  { src: sitePath("/logos/universities/mit-official.svg"), alt: "MIT" },
  {
    src: sitePath("/logos/universities/stanford-official.svg"),
    alt: "Stanford University",
  },
  {
    src: sitePath("/logos/universities/harvard-official.svg"),
    alt: "Harvard University",
  },
  {
    src: sitePath("/logos/universities/oxford-official.svg"),
    alt: "University of Oxford",
  },
  {
    src: sitePath("/logos/universities/cambridge-official.svg"),
    alt: "University of Cambridge",
  },
  {
    src: sitePath("/logos/johns-hopkins-university.png"),
    alt: "Johns Hopkins University",
  },
  {
    src: sitePath("/logos/ucl-full-v3.png"),
    alt: "University College London",
    imgClassName: "logo-cloud-img--ucl",
  },
  {
    src: sitePath("/logos/university-of-sheffield-full-v3.png"),
    alt: "University of Sheffield",
  },
  {
    src: sitePath("/logos/niser.png"),
    alt: "National Institute of Science Education and Research",
  },
];

function LogoCloud({
  className,
  logos: items,
  ...props
}: React.ComponentProps<"div"> & { logos: Logo[] }) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={LOGO_GAP} duration={80} durationOnHover={25}>
        {items.map((logo) => (
          <div key={logo.alt} className={LOGO_TILE_CLASS}>
            <img
              alt={logo.alt}
              className={cn(
                "pointer-events-none select-none",
                LOGO_IMG_CLASS,
                logo.imgClassName
              )}
              height={56}
              loading="lazy"
              src={logo.src}
              width={158}
            />
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}

export function LogoCloudSection() {
  return (
    <section
      className="logo-cloud-section relative z-20 mt-12 bg-white sm:mt-14 lg:mt-20"
      aria-label="Trusted by researchers from leading institutions"
    >
      <div className="logo-cloud-section__inner mx-auto max-w-[980px] px-6 pb-16 pt-4 sm:px-10 sm:pt-5">
        <h2 className="logo-cloud-heading relative z-10 !font-light font-marketing tracking-tight text-ink-600">
          Trusted by researchers from
        </h2>
        <LogoCloud logos={logos} className="mt-6" />
      </div>
    </section>
  );
}
