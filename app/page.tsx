import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import ToolCard from "@/components/tool-card";
import { internalTools } from "@/lib/tools-data";
import { resourceLinks } from "@/lib/resource-data";

export default function Home() {
  const topTools = internalTools.slice(0, 4);

  return (
    <div className="flex w-full flex-col bg-background">
      
      {/* 1. Hero Section */}
      <section className="relative w-full border-b-2 border-border py-20 px-6 sm:px-12 lg:px-24 overflow-hidden min-h-[80vh] flex items-center">
        <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Hero Left: Typography & CTAs */}
          <div className="flex-1 z-10 w-full lg:w-1/2">
            <div className="font-mono text-xs font-bold tracking-widest flex items-center gap-4 mb-8">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-c-heur border-2 border-ink"></span>
                <span className="w-4 h-4 bg-c-bias border-2 border-ink border-l-0"></span>
                <span className="w-4 h-4 bg-c-nudge border-2 border-ink border-l-0"></span>
                <span className="w-4 h-4 bg-c-ai border-2 border-ink border-l-0"></span>
              </span>
              A REFERENCE FOR MODERN WEB DEVELOPMENT
            </div>
            
            <h1 className="text-6xl tracking-tighter sm:text-7xl lg:text-[100px] leading-[0.9] flex flex-col gap-0 mb-8">
              <span className="font-display font-black uppercase">THE FRONTEND</span>
              <span className="font-serif italic lowercase tracking-normal -mt-2">stash.</span>
            </h1>
            
            <p className="max-w-md font-mono text-base leading-relaxed opacity-90 mb-10">
              {internalTools.length} field tools across curated categories. Each one is a working utility or reference. The stash is a manual you can play with.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tools" className="flex items-center justify-center border-2 border-ink bg-ink text-background px-8 py-4 font-mono text-xs font-bold tracking-widest uppercase hover:bg-ink/80 transition-colors">
                EXPLORE TOOLS <ArrowRightIcon weight="bold" className="ml-2" />
              </Link>
              <Link href="/resources" className="flex items-center justify-center border-2 border-ink bg-background text-foreground px-8 py-4 font-mono text-xs font-bold tracking-widest uppercase hover:bg-ink/5 transition-colors">
                BROWSE RESOURCES
              </Link>
            </div>
          </div>

          {/* Hero Right: The Fan */}
          <div className="flex-1 relative w-full h-[500px] hidden lg:block">
            {/* We position 3 ToolCards absolutely, rotated */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] rotate-[-8deg] origin-bottom shadow-[12px_12px_0px_0px_var(--ink)] z-10 transition-transform duration-500 hover:rotate-0 hover:-translate-y-10">
              <div className="pointer-events-none">
                <ToolCard tool={internalTools[0]} index={0} />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] rotate-[5deg] origin-bottom shadow-[12px_12px_0px_0px_var(--ink)] z-20 translate-x-12 -translate-y-4 transition-transform duration-500 hover:rotate-0 hover:-translate-y-14">
              <div className="pointer-events-none">
                <ToolCard tool={internalTools[1]} index={1} />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] rotate-[18deg] origin-bottom shadow-[12px_12px_0px_0px_var(--ink)] z-30 translate-x-24 translate-y-8 transition-transform duration-500 hover:rotate-0 hover:-translate-y-16">
              <div className="pointer-events-none">
                <ToolCard tool={internalTools[2]} index={2} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="border-b-2 border-border grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x-2 divide-y-2 md:divide-y-0 divide-border bg-background">
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">04</h2>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">CATEGORIES</p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">{internalTools.length}</h2>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">FIELD TOOLS</p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">{resourceLinks.length}</h2>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">CURATED LINKS</p>
        </div>
        <div className="p-8 lg:p-12">
          <h2 className="font-display text-5xl font-black tracking-tighter">100%</h2>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">OPEN SOURCE</p>
        </div>
      </section>

      {/* 3. Why this matters */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 border-b-2 border-border bg-background">
        <div className="mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-6xl tracking-tighter sm:text-7xl flex flex-col gap-0">
              <span className="font-display font-black uppercase">WHY THIS</span>
              <span className="font-serif italic lowercase tracking-normal">stash</span>
              <span className="font-display font-black uppercase">MATTERS.</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-12 font-mono text-sm leading-relaxed opacity-90">
            <div className="flex gap-6">
              <span className="font-bold">01</span>
              <p>
                The frontend revolution gave developers a vocabulary for building on the web. <strong>React, Tailwind, TypeScript</strong> — these became the working tools of modern engineering. What it did not anticipate was the sheer volume of boilerplate and fragmentation that follows.
              </p>
            </div>
            <div className="flex gap-6 border-t-2 border-border/50 pt-12">
              <span className="font-bold">02</span>
              <p>
                AI assistants now generate the estimate, the summary, the first draft of the code. The old patterns haven't gone; they've been <strong>amplified, laundered, and re-shaped</strong> by the fluency of the interface that delivers them. But foundational understanding requires tactile interaction.
              </p>
            </div>
            <div className="flex gap-6 border-t-2 border-border/50 pt-12">
              <span className="font-bold">03</span>
              <p>
                What follows is a working library: <strong>each card teaches by letting you feel the effect</strong>. Not a textbook. A field manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Tools */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-background">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <h2 className="text-5xl tracking-tighter sm:text-6xl flex items-baseline gap-4">
              <span className="font-display font-black uppercase">{internalTools.length} TOOLS,</span>
              <span className="font-serif italic lowercase tracking-normal text-5xl">ready to use.</span>
            </h2>
            <p className="font-mono text-sm opacity-80 max-w-xs md:text-right">
              Each card carries a small live demo. Click for the full utility.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {topTools.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>

          <div className="border-t-2 border-border pt-8 flex items-center justify-between">
            <Link href="/tools" className="flex items-center justify-center border-2 border-ink bg-ink text-background px-6 py-3 font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-ink/80 transition-colors">
              BROWSE ALL {internalTools.length} TOOLS <ArrowRightIcon weight="bold" className="ml-2" />
            </Link>
            
            <div className="hidden sm:flex gap-2">
              <button className="border-2 border-border p-3 hover:bg-border/20 transition-colors">
                <ArrowRightIcon weight="bold" className="rotate-180" />
              </button>
              <button className="border-2 border-ink p-3 hover:bg-border/20 transition-colors">
                <ArrowRightIcon weight="bold" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
