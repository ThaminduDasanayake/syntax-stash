import { ArrowRightIcon, CompassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import ToolCard from "@/components/tool-card";
import { ToolsCarousel } from "@/components/tools-carousel";
import { Button } from "@/components/ui/button";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";
import {
  dataTools,
  developmentTools,
  frontendTools,
  internalTools,
  mediaTools,
  toolCategories,
} from "@/lib/tools-data";
import { cn, getCategoryTheme, slugify, type Theme, THEME_CONFIG } from "@/lib/utils";

const THEME_HOVER_MAP: Record<
  Theme,
  {
    card: string;
    dot: string;
    footer: string;
    text: string;
  }
> = {
  orange: {
    card: "hover:bg-c-orange hover:border-orange-deep hover:text-ink",
    dot: "group-hover:bg-ink group-hover:border-ink",
    footer: "group-hover:border-ink/20 group-hover:text-ink/80",
    text: "group-hover:text-ink",
  },
  blue: {
    card: "hover:bg-c-blue hover:border-blue-deep hover:text-paper",
    dot: "group-hover:bg-paper group-hover:border-paper",
    footer: "group-hover:border-paper/25 group-hover:text-paper/85",
    text: "group-hover:text-paper",
  },
  pink: {
    card: "hover:bg-c-pink hover:border-pink-deep hover:text-ink",
    dot: "group-hover:bg-ink group-hover:border-ink",
    footer: "group-hover:border-ink/20 group-hover:text-ink/80",
    text: "group-hover:text-ink",
  },
  green: {
    card: "hover:bg-c-green hover:border-green-deep hover:text-ink",
    dot: "group-hover:bg-ink group-hover:border-ink",
    footer: "group-hover:border-ink/20 group-hover:text-ink/80",
    text: "group-hover:text-ink",
  },
};

export default function Home() {
  const topTools = [
    ...dataTools.slice(0, 2),
    ...developmentTools.slice(0, 2),
    ...frontendTools.slice(0, 2),
    ...mediaTools.slice(0, 2),
  ];
  const totalCategories = new Set([...toolCategories, ...resourceCategories]).size;
  const formattedCategories = String(totalCategories).padStart(2, "0");

  const heroTool1 = internalTools.find((t) => t.slug === "curl-builder") || internalTools[3];
  const heroTool2 = internalTools.find((t) => t.slug === "gitignore-generator") || internalTools[2];
  const heroTool3 = internalTools.find((t) => t.slug === "regex-studio") || internalTools[1];
  const heroTool4 = internalTools.find((t) => t.slug === "qr-generator") || internalTools[0];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <HeroEyebrowDots />A REFERENCE &amp; WORKBENCH FOR MODERN WEB DEVELOPMENT
            </div>

            <h1 className="hero-headline">
              Architecture, craft & utilities
              <br />
              <em>for the modern web stack</em>.
            </h1>

            <p className="hero-sub">
              {resourceLinks.length} curated resources across sixteen categories, paired with{" "}
              {internalTools.length} interactive browser tools. A reference manual to browse, and a
              workbench you can build with.
            </p>

            <div className="hero-cta-row">
              <Button asChild size="lg" variant="default">
                <Link href="/resources" className="text-display-sm">
                  BROWSE RESOURCES
                  <ArrowRightIcon weight="bold" className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tools" className="text-display-sm">
                  EXPLORE TOOLS
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Stack */}
          <div className="hero-stack">
            <div className="hero-card">
              <div className="hero-card-wrap">
                <ToolCard tool={heroTool1} />
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-wrap">
                <ToolCard tool={heroTool2} />
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-wrap">
                <ToolCard tool={heroTool3} />
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-wrap">
                <ToolCard tool={heroTool4} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <h2 className="stat-num">{formattedCategories}</h2>
            <p className="stat-label">CATEGORIES</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num">{internalTools.length}</h2>
            <p className="stat-label">INBUILT TOOLS</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num">{resourceLinks.length}</h2>
            <p className="stat-label">CURATED RESOURCES</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num">100%</h2>
            <p className="stat-label">OPEN SOURCE</p>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="border-border bg-background border-b-2 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="flex flex-col gap-0 text-6xl tracking-tighter sm:text-7xl">
              <span className="font-display font-black uppercase">WHY THIS</span>
              <span className="font-serif tracking-normal lowercase italic">stash</span>
              <span className="font-display font-black uppercase">MATTERS.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-12 font-mono text-sm leading-relaxed opacity-90">
            <div className="flex gap-6">
              <span className="font-bold">01</span>
              <p>
                The frontend revolution gave developers a vocabulary for building on the web.{" "}
                <strong>React, Tailwind, TypeScript</strong> — these became the working tools of
                modern engineering. What it did not anticipate was the sheer volume of boilerplate
                and fragmentation that follows.
              </p>
            </div>
            <div className="border-border/50 flex gap-6 border-t-2 pt-12">
              <span className="font-bold">02</span>
              <p>
                AI assistants now generate the estimate, the summary, the first draft of the code.
                The old patterns haven&apos;t gone; they&apos;ve been{" "}
                <strong>amplified, laundered, and re-shaped</strong> by the fluency of the interface
                that delivers them. But foundational understanding requires tactile interaction.
              </p>
            </div>
            <div className="border-border/50 flex gap-6 border-t-2 pt-12">
              <span className="font-bold">03</span>
              <p>
                What follows is a working library:{" "}
                <strong>each card teaches by letting you feel the effect</strong>. Not a textbook. A
                field manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Resource Vault Spotlight */}
      <section className="border-border bg-background border-b-2 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-primary mb-2 flex items-center gap-2 font-mono text-xs font-bold tracking-wider uppercase">
                <CompassIcon weight="bold" className="size-4" />
                <span>Curated Knowledge Vault</span>
              </div>
              <h2 className="flex flex-wrap items-baseline gap-3 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
                <span className="font-display font-black uppercase">
                  {resourceCategories.length} CATEGORIES,
                </span>
                <span className="font-serif tracking-normal lowercase italic">handpicked.</span>
              </h2>
            </div>
            <p className="max-w-md font-mono text-xs leading-relaxed opacity-80 md:text-right">
              From animation engines and component libraries to AI toolchains and typography
              foundries.
            </p>
          </div>

          <div className="vault-grid">
            {resourceCategories.map((category) => {
              const slug = slugify(category);
              const count = resourceLinks.filter((r) => r.category === category).length;
              const theme = getCategoryTheme(category);
              const themeConfig = THEME_CONFIG[theme];
              const hoverTheme = THEME_HOVER_MAP[theme];

              return (
                <Link
                  key={category}
                  href={`/resources/${slug}`}
                  className={cn("group vault-card", hoverTheme.card)}
                >
                  <div className="vault-card-header">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn("vault-card-dot", themeConfig.dotInactive, hoverTheme.dot)}
                      />
                    </div>
                    <span className={cn("vault-card-count", hoverTheme.text)}>{count} items</span>
                  </div>
                  <h3 className={cn("vault-card-title", hoverTheme.text)}>{category}</h3>
                  <div className={cn("vault-card-footer", hoverTheme.footer)}>
                    <span>Browse vault</span>
                    <ArrowRightIcon
                      weight="bold"
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="border-border mt-10 flex items-center justify-between border-t-2 pt-8">
            <Button asChild size="sm" variant="default">
              <Link href="/resources" className="text-display-xs">
                EXPLORE ALL {resourceLinks.length} RESOURCES{" "}
                <ArrowRightIcon weight="bold" className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ToolsCarousel tools={topTools} totalCount={internalTools.length} />
    </>
  );
}
