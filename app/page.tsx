import { ArrowRightIcon, CompassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroWorkbench } from "@/components/hero-workbench";
import { ToolsCarousel } from "@/components/tools-carousel";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/categories";
import { getAllResources } from "@/lib/resources";
import {
  dataTools,
  developmentTools,
  frontendTools,
  internalTools,
  mediaTools,
  toolCategories,
} from "@/lib/tools-data";
import { cn, getCategoryTheme, slugify, THEME_CONFIG } from "@/lib/utils";

export default async function Home() {
  const [categories, resourceLinks] = await Promise.all([getAllCategories(), getAllResources()]);
  const resourceCategories = categories.map((c) => c.name);
  const topTools = [
    ...dataTools.slice(0, 2),
    ...developmentTools.slice(0, 2),
    ...frontendTools.slice(0, 2),
    ...mediaTools.slice(0, 2),
  ];
  const totalCategories = new Set([...toolCategories, ...resourceCategories]).size;
  const formattedCategories = String(totalCategories).padStart(2, "0");

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner items-center">
          <div className="hero-copy">
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

          {/* Interactive Hero Workbench */}
          <div className="flex w-full max-w-xl justify-center lg:max-w-none">
            <HeroWorkbench />
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
            <h2 className="stat-num flex items-center gap-2">
              <span className="bg-accent inline-block size-2.5 shrink-0 animate-pulse rounded-full" />
              100%
            </h2>
            <p className="stat-label">OPEN SOURCE</p>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="bg-background border-b border-white/[0.08] px-6 py-24 sm:px-12 lg:px-24">
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
              <span className="text-primary font-mono text-base font-extrabold">01</span>
              <p>
                The frontend revolution gave developers a vocabulary for building on the web.{" "}
                <strong>React, Tailwind, TypeScript</strong> — these became the working tools of
                modern engineering. What it did not anticipate was the sheer volume of boilerplate
                and fragmentation that follows.
              </p>
            </div>
            <div className="flex gap-6 border-t border-white/[0.08] pt-12">
              <span className="text-primary font-mono text-base font-extrabold">02</span>
              <p>
                AI assistants now generate the estimate, the summary, the first draft of the code.
                The old patterns haven&apos;t gone; they&apos;ve been{" "}
                <strong>amplified, laundered, and re-shaped</strong> by the fluency of the interface
                that delivers them. But foundational understanding requires tactile interaction.
              </p>
            </div>
            <div className="flex gap-6 border-t border-white/[0.08] pt-12">
              <span className="text-primary font-mono text-base font-extrabold">03</span>
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
      <section className="bg-background border-b border-white/[0.08] px-6 py-24 sm:px-12 lg:px-24">
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

              return (
                <Link
                  key={category}
                  href={`/resources/${slug}`}
                  className="group border-border/60 bg-card hover:border-border relative isolate flex min-h-[120px] flex-col justify-between overflow-hidden rounded-lg border p-4 transition-colors select-none"
                >
                  <div
                    aria-hidden="true"
                    className="from-brand-orange/[0.08] via-brand-purple/[0.04] pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span
                        aria-hidden="true"
                        className={cn("size-1.5 shrink-0 rounded-[1px]", themeConfig.dot)}
                      />
                      <h3 className="text-foreground after:bg-primary relative min-w-0 truncate font-mono text-sm font-semibold after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
                        {category}
                      </h3>
                    </div>
                    <span className="text-muted-foreground/60 font-mono text-[11px] tabular-nums">
                      {count} items
                    </span>
                  </div>

                  <div className="text-muted-foreground/70 group-hover:text-primary mt-4 flex items-center justify-between font-mono text-xs transition-colors">
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

          <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-8">
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
