"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-500/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ink-900 text-parchment-50 hover:bg-ink-800",
        destructive: "bg-signal-rose text-white hover:opacity-90",
        outline:
          "border border-ink-900/12 bg-white/80 text-ink-800 hover:bg-ink-50",
        secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200/80",
        ghost: "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900",
        link: "text-beacon-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const liquidbuttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-[color,transform,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-beacon-500/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-ink-900/10 bg-white/45 text-ink-900 hover:scale-[1.02]",
        outline:
          "border border-ink-900/12 bg-white/35 text-ink-700 hover:bg-white/55",
        dark: "border border-white/12 bg-ink-900/35 text-white hover:bg-ink-900/45",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-3",
        lg: "h-11 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean;
  }) {
  const classes = cn(
    "relative inline-flex backdrop-blur-md",
    liquidbuttonVariants({ variant, size, className })
  );

  const content = (
    <>
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.12),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.1),inset_0_0_6px_6px_rgba(255,255,255,0.12)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-[inherit]"
        style={{ backdropFilter: 'url("#container-glass")' }}
        aria-hidden
      />
      <GlassFilter />
    </>
  );

  if (asChild && React.isValidElement(children)) {
    return (
      <span className={classes}>
        {content}
        {React.cloneElement(children, {
          ...children.props,
          className: cn(
            "relative z-10 inline-flex items-center justify-center gap-2",
            children.props.className
          ),
        })}
      </span>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

export { Button, buttonVariants, LiquidButton, liquidbuttonVariants };
