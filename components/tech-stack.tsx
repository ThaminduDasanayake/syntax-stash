import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface TechStackItem {
  name: string;
  category?: string;
  href?: string;
  highlight?: "orange" | "purple" | "green";
}

export const DEFAULT_TECH_STACK: TechStackItem[] = [
  {
    category: "Authentication",
    highlight: "green",
    href: "https://better-auth.com",
    name: "Better Auth",
  },
  {
    category: "Components",
    highlight: "orange",
    href: "https://ui.shadcn.com",
    name: "Shadcn UI",
  },
  {
    category: "Framework",
    highlight: "orange",
    href: "https://nextjs.org",
    name: "Next.js",
  },
  {
    category: "Iconography",
    highlight: "purple",
    href: "https://phosphoricons.com",
    name: "Phosphor Icons",
  },
  {
    category: "Serverless DB",
    highlight: "orange",
    href: "https://neon.tech",
    name: "Neon Postgres",
  },
  {
    category: "Styling Engine",
    highlight: "green",
    href: "https://tailwindcss.com",
    name: "Tailwind CSS v4",
  },
  {
    category: "Type-Safe ORM",
    highlight: "purple",
    href: "https://orm.drizzle.team",
    name: "Drizzle ORM",
  },
  {
    category: "UI Library",
    highlight: "purple",
    href: "https://react.dev",
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

        {/* Tech Stack Word Badges / Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {items.map((item) => {
            const cardContent = (
              <div className="flex items-center gap-2">
                <span className="text-foreground group-hover:text-primary font-mono text-xs font-bold tracking-tight transition-colors">
                  {item.name}
                </span>
                {item.href && (
                  <ArrowUpRightIcon
                    weight="bold"
                    className="text-muted-foreground/60 group-hover:text-primary size-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                )}
              </div>
            );

            const containerClasses = cn(
              "group border-line bg-card/60 relative flex items-center justify-center rounded-lg border-[1.5px] px-4 py-2.5 shadow-2xs backdrop-blur-xs transition-all duration-200 select-none",
              "hover:border-primary/50 hover:bg-card hover:-translate-y-0.5 hover:shadow-xs",
            );

            if (item.href) {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={containerClasses}
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <div key={item.name} className={containerClasses}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
