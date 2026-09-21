"use client";

import Link from "next/link";
import { type HTMLAttributes } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface TechStackItem {
  name: string;
  category?: string;
  highlight?: "orange" | "purple" | "green";
  href?: string;
  logo: string;
  logoClassName?: string;
}

export const DEFAULT_TECH_STACK: TechStackItem[] = [
  {
    category: "Authentication",
    highlight: "green",
    href: "https://better-auth.com",
    logo: "/stack/better-auth_wordmark.svg",
    logoClassName: "size-5 rounded-xs",
    name: "Better Auth",
  },
  {
    category: "Components",
    highlight: "orange",
    href: "https://ui.shadcn.com",
    logo: "/stack/shadcn-ui.svg",
    logoClassName: "size-5 text-foreground",
    name: "Shadcn UI",
  },
  {
    category: "Framework",
    highlight: "orange",
    href: "https://nextjs.org",
    logo: "/stack/nextjs_logo.svg",
    logoClassName: "h-4.5 w-auto",
    name: "Next.js",
  },
  {
    category: "Iconography",
    highlight: "purple",
    href: "https://phosphoricons.com",
    logo: "/stack/phosphoricons-wordmark.svg",
    logoClassName: "h-5 w-auto invert dark:invert",
    name: "Phosphor Icons",
  },
  {
    category: "Serverless DB",
    highlight: "orange",
    href: "https://neon.tech",
    logo: "/stack/neon-wordmark.svg",
    logoClassName: "h-4.5 w-auto",
    name: "Neon Postgres",
  },
  {
    category: "Styling Engine",
    highlight: "green",
    href: "https://tailwindcss.com",
    logo: "/stack/tailwindcss-wordmark.svg",
    logoClassName: "h-4 w-auto",
    name: "Tailwind CSS v4",
  },
  {
    category: "Type-Safe ORM",
    highlight: "purple",
    href: "https://orm.drizzle.team",
    logo: "/stack/drizzle-orm.svg",
    logoClassName: "size-5",
    name: "Drizzle ORM",
  },
  {
    category: "UI Library",
    highlight: "purple",
    href: "https://react.dev",
    logo: "/stack/react_wordmark_dark.svg",
    logoClassName: "h-4.5 w-auto",
    name: "React 19",
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] [background-size:24px_24px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Caption Header */}
        <p className="text-muted-foreground mb-8 text-center font-mono text-xs font-bold tracking-widest uppercase">
          {title}
        </p>

        {/* Tech Stack Logo Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {items.map((item) => {
            const containerClasses = cn(
              "group border-line bg-card/60 relative flex h-12 min-w-16 items-center justify-center rounded-lg border-[1.5px] px-4 shadow-2xs backdrop-blur-xs transition-all duration-200 select-none",
              "hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 hover:shadow-xs",
            );

            const content = (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.logo}
                alt={item.name}
                className={cn(
                  "max-h-5.5 w-auto max-w-28 object-contain opacity-80 transition-all duration-200 group-hover:scale-105 group-hover:opacity-100",
                  item.logoClassName,
                )}
              />
            );

            const card = item.href ? (
              <Link
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className={containerClasses}
              >
                {content}
              </Link>
            ) : (
              <div className={containerClasses}>{content}</div>
            );

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{card}</TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{item.name}</span>
                    {item.category && (
                      <>
                        <span className="opacity-40">·</span>
                        <span className="text-muted-foreground font-normal">{item.category}</span>
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </section>
  );
}
