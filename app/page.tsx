import { ArrowRightIcon, CompassIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroResourceShowcase } from "@/components/hero-resource-showcase";
import { TechStack } from "@/components/tech-stack";
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

  // Pick top featured resources to pass into the hero preview
  const featuredHeroResources = resourceLinks.slice(0, 16);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner items-center">
          <div className="hero-copy">
            <h1 className="hero-headline">
              THE CURATED STASH
              <br />
              <em>for the modern web stack</em>.
            </h1>

            <p className="hero-sub">
              {resourceLinks.length}+ handpicked developer resources across {resourceCategories.length} categories.
              Design systems, animation engines, AI toolchains, and APIs verified and cloud-synced for rapid discovery.
            </p>

            <div className="hero-cta-row">
              <Button asChild size="lg" variant="default">
                <Link href="/resources" className="text-display-sm">
                  EXPLORE {resourceLinks.length}+ RESOURCES
                  <ArrowRightIcon weight="bold" className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#categories" className="text-display-sm">
                  BROWSE CATEGORIES
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive Hero Resource Showcase */}
          <div className="flex w-full max-w-xl justify-center lg:max-w-none">
            <HeroResourceShowcase featuredResources={featuredHeroResources} />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item">
            <h2 className="stat-num">{resourceLinks.length}+</h2>
            <p className="stat-label">CURATED RESOURCES</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num">{resourceCategories.length}</h2>
            <p className="stat-label">CATEGORIES</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num">100+</h2>
            <p className="stat-label">TAGS & TOPICS</p>
          </div>
          <div className="stat-item">
            <h2 className="stat-num flex items-center gap-2">
              <span className="bg-accent inline-block size-2.5 shrink-0 animate-pulse rounded-full" />
              100%
            </h2>
            <p className="stat-label">FREE & VERIFIED</p>
          </div>
        </div>
      </section>

      {/* Curated Resource Vault Spotlight */}
      <section id="categories" className="bg-background border-b-[1.5px] border-white/8 px-6 py-24 sm:px-12 lg:px-24 scroll-mt-16">
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
                  className="group border-border/60 bg-card hover:border-border relative isolate flex min-h-30 flex-col justify-between overflow-hidden rounded-lg border-[1.5px] p-4 transition-colors select-none"
                >
                  <div
                    aria-hidden="true"
                    className="from-brand-orange/8 via-brand-purple/4 pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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

          <div className="mt-10 flex items-center justify-between border-t border-white/8 pt-8">
            <Button asChild size="sm" variant="default">
              <Link href="/resources" className="text-display-xs">
                EXPLORE ALL {resourceLinks.length} RESOURCES{" "}
                <ArrowRightIcon weight="bold" className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why this matters */}
      <section className="bg-background border-b-[1.5px] border-white/8 px-6 py-24 sm:px-12 lg:px-24">
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
                modern engineering. What it also brought was a relentless flood of boilerplate,
                duplication, and hype.
              </p>
            </div>
            <div className="flex gap-6 border-t border-white/8 pt-12">
              <span className="text-primary font-mono text-base font-extrabold">02</span>
              <p>
                AI assistants now generate code at superhuman speeds, but great engineering requires{" "}
                <strong>curated taste and proven foundations</strong>. Knowing which library is
                well-architected, lightweight, and actively maintained is the real superpower.
              </p>
            </div>
            <div className="flex gap-6 border-t border-white/8 pt-12">
              <span className="text-primary font-mono text-base font-extrabold">03</span>
              <p>
                Syntax Stash is a living reference manual:{" "}
                <strong>hand-curated, tag-filterable, and cloud-synced</strong>. Not an algorithmic
                feed. A field manual you can rely on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Tools Section (Developer Utilities) */}
      <ToolsCarousel tools={topTools} totalCount={internalTools.length} />

      <TechStack />
    </>
  );
}
