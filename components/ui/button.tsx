import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer group/button inline-flex shrink-0 items-center justify-center rounded-full border border-white/[0.10] bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-4 focus-visible:ring-white/[0.08] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default:
          "gap-2 px-5 py-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9 rounded-full",
        "icon-lg": "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-7 rounded-full [&_svg:not([class*='size-'])]:size-3.5",
        lg: "gap-2.5 px-6 py-3 text-base has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        sm: "gap-1.5 rounded-full px-3.5 py-1.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "gap-1 rounded-full px-2.5 py-1 text-xs has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg:not([class*='size-'])]:size-3",
      },
      variant: {
        clear: "text-destructive! hover:text-destructive border-transparent bg-transparent",
        default:
          "bg-ink text-paper border-transparent hover:bg-ink/90 shadow-[0_1px_3px_rgba(0,0,0,0.12)]",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 focus-visible:ring-destructive/20",
        ghost: "border-transparent hover:bg-white/[0.08] text-ink",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
        outline:
          "bg-[#18181b] text-ink border-white/[0.10] hover:bg-white/[0.06] hover:border-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
        secondary:
          "bg-[#27272a] text-ink border-white/[0.10] hover:bg-[#3f3f46] shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
      },
    },
  },
);

function Button({
  asChild = false,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
