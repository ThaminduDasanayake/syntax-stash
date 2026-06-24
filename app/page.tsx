import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import ToolCard from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";

export default function Home() {
  const topTools = internalTools.slice(0, 4);

  return (
    <div className="bg-background flex w-full flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden border-b-2 px-6 py-20 sm:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-16 lg:flex-row">
          {/* Hero Left: Typography & CTAs */}
          <div className="z-10 w-full flex-1 lg:w-1/2">
            <div className="text-ink-mute mb-8 flex items-center gap-4 font-mono text-xs font-bold tracking-widest">
              <HeroEyebrowDots />A REFERENCE FOR MODERN WEB DEVELOPMENT
            </div>

            <h1 className="mb-8 flex flex-col gap-0 text-6xl leading-[0.9] tracking-tighter sm:text-7xl lg:text-[100px]">
              <span className="font-display font-black uppercase">THE FRONTEND</span>
              <span className="-mt-2 font-serif tracking-normal lowercase italic">stash.</span>
            </h1>

            <p className="mb-10 max-w-md font-mono text-base leading-relaxed opacity-90">
              {internalTools.length} field tools across curated categories. Each one is a working
              utility or reference. The stash is a manual you can play with.
            </p>

            <div className="hero-cta-row">
              <Button asChild size="lg" variant="default">
                <Link href="/tools" className="text-display-sm">
                  EXPLORE TOOLS <ArrowRightIcon weight="bold" className="" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/resources" className="text-display-sm">
                  BROWSE RESOURCES
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Stack */}
          <div className="relative hidden h-150 w-full lg:block">
            <div className="absolute top-10 left-10 z-10 w-75 hover:z-50">
              <div className="h-full w-full origin-center -rotate-3 transition-all duration-300 ease-out hover:-translate-y-4 hover:rotate-0">
                <ToolCard tool={internalTools[52]} />
              </div>
            </div>
            <div className="absolute top-35 left-75 z-20 w-75 hover:z-50">
              <div className="h-full w-full origin-center rotate-6 transition-all duration-300 ease-out hover:-translate-y-4 hover:rotate-0">
                <ToolCard tool={internalTools[38]} />
              </div>
            </div>
            <div className="absolute top-45 left-15 z-30 w-75 hover:z-50">
              <div className="h-full w-full origin-center -rotate-4 transition-all duration-300 ease-out hover:-translate-y-4 hover:rotate-0">
                <ToolCard tool={internalTools[22]} />
              </div>
            </div>
            <div className="absolute top-75 left-50 z-40 w-75 hover:z-50">
              <div className="h-full w-full origin-center rotate-8 transition-all duration-300 ease-out hover:-translate-y-4 hover:rotate-0">
                <ToolCard tool={internalTools[28]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="border-border divide-border bg-background grid grid-cols-2 divide-x-0 divide-y-2 border-b-2 md:grid-cols-4 md:divide-x-2 md:divide-y-0">
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">04</h2>
          <p className="mt-2 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
            CATEGORIES
          </p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">
            {internalTools.length}
          </h2>
          <p className="mt-2 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
            FIELD TOOLS
          </p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">
            {resourceLinks.length}
          </h2>
          <p className="mt-2 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
            CURATED LINKS
          </p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">100%</h2>
          <p className="mt-2 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
            OPEN SOURCE
          </p>
        </div>
      </section>

      {/* 3. Why this matters */}
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

      {/* 4. Top Tools */}
      <section className="bg-background px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <h2 className="flex items-baseline gap-4 text-5xl tracking-tighter sm:text-6xl">
              <span className="font-display font-black uppercase">
                {internalTools.length} TOOLS,
              </span>
              <span className="font-serif text-5xl tracking-normal lowercase italic">
                ready to use.
              </span>
            </h2>
            <p className="max-w-xs font-mono text-sm opacity-80 md:text-right">
              Each card carries a small live demo. Click for the full utility.
            </p>
          </div>

          <div className="mb-12 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {topTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>

          <div className="border-border flex items-center justify-between border-t-2 pt-8">
            <Button asChild size="sm" variant="default">
              <Link href="/tools" className="text-display-xs">
                BROWSE ALL {internalTools.length} TOOLS{" "}
                <ArrowRightIcon weight="bold" className="ml-2" />
              </Link>
            </Button>

            <ButtonGroup className="hidden sm:flex">
              <Button size="icon" variant="secondary" className="h-10 w-10">
                <ArrowLeftIcon weight="bold" />
              </Button>
              <Button size="icon" variant="secondary" className="h-10 w-10">
                <ArrowRightIcon weight="bold" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </section>
    </div>
  );
}
