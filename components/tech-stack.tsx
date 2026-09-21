"use client";

import { type HTMLAttributes } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface TechStackItem {
  logo: string;
  logoClassName?: string;
  name: string;
}

export const DEFAULT_TECH_STACK: TechStackItem[] = [
  {
    logo: "/stack/better-auth_wordmark.svg",
    logoClassName: "h-5 w-auto",
    name: "Better Auth",
  },
  {
    logo: "/stack/drizzle-orm.svg",
    logoClassName: "h-5.5 w-auto",
    name: "Drizzle ORM",
  },
  {
    logo: "/stack/neon-wordmark.svg",
    logoClassName: "h-5.5 w-auto",
    name: "Neon Postgres",
  },
  {
    logo: "/stack/nextjs_logo.svg",
    logoClassName: "h-5 w-auto",
    name: "Next.js",
  },
  {
    logo: "/stack/phosphoricons-wordmark.svg",
    logoClassName: "h-5.5 w-auto",
    name: "Phosphor Icons",
  },
  {
    logo: "/stack/react_wordmark_dark.svg",
    logoClassName: "h-5.5 w-auto",
    name: "React 19",
  },
  {
    logo: "/stack/shadcn-ui.svg",
    logoClassName: "size-6",
    name: "Shadcn UI",
  },
  {
    logo: "/stack/tailwindcss-wordmark.svg",
    logoClassName: "h-4.5 w-auto",
    name: "Tailwind CSS v4",
  },
];

interface TechStackProps extends HTMLAttributes<HTMLElement> {
  items?: TechStackItem[];
  title?: string;
}

export function TechStack({
  title = "Syntax Stash is powered by",
  className,
  items = DEFAULT_TECH_STACK,
  ...props
}: TechStackProps) {
  return (
    <section
      aria-label="Technologies powering Syntax Stash"
      className={cn(
        "bg-background relative overflow-hidden border-b-[1.5px] border-white/8 px-6 py-20 sm:px-12 lg:px-24",
        className,
      )}
      {...props}
    >
      {/* Dot grid background texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_70%,transparent_100%)] bg-size-[24px_24px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Caption Header */}
        <p className="text-muted-foreground mb-8 text-center font-mono text-xs font-bold tracking-widest uppercase">
          {title}
        </p>

        {/* Tech Stack Logo Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {items.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "group border-line bg-card/60 relative flex h-12 min-w-16 cursor-default items-center justify-center rounded-lg border-[1.5px] px-4.5 shadow-2xs backdrop-blur-xs transition-all duration-200 select-none",
                    "hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 hover:shadow-xs",
                  )}
                  tabIndex={0}
                  role="img"
                  aria-label={item.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo}
                    alt={item.name}
                    className={cn(
                      "w-auto max-w-32 object-contain transition-all duration-200 group-hover:scale-105",
                      item.logoClassName,
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="font-mono text-xs font-bold">
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
}
