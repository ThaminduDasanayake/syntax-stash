import { PlusIcon, ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* Brutalist Hero Section */}
      <div className="border-border bg-primary text-primary-foreground relative w-full border-b-2 px-6 py-20 sm:px-12 lg:px-24">
        {/* Corner Accents */}
        <div className="absolute top-6 left-6 font-mono text-xs font-bold tracking-widest">
          {"// HANDMADE"}
          <br />
          {"// NO TRACKING"}
        </div>
        <div className="absolute top-6 right-6 flex items-center font-mono text-xs font-bold tracking-widest">
          V1.0.0
        </div>

        {/* Main Typography */}
        <div className="mx-auto mt-12 max-w-7xl">
          <h1 className="text-6xl tracking-tighter sm:text-7xl lg:text-8xl flex flex-col gap-1">
            <span className="font-display font-black uppercase">THE FRONTEND</span>
            <span className="font-serif italic lowercase tracking-normal">stash.</span>
          </h1>
          <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed tracking-wider uppercase opacity-80">
            A curated command center for modern web development. <br />
            Tools and resources built to scale.
          </p>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="absolute right-6 bottom-6 left-6 flex items-center justify-between font-mono font-bold">
          <PlusIcon weight="bold" />
          <div className="mx-4 h-3 flex-1 bg-[repeating-linear-gradient(60deg,currentColor,currentColor_1.5px,transparent_1.5px,transparent_8px)]" />
          <PlusIcon weight="bold" />
        </div>
      </div>

      {/* Main Content Area (Landing Dashboard) */}
      <div id="directory" className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-12">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {/* Tools Card */}
          <Link href="/tools" className="group relative flex flex-col overflow-hidden border-2 border-primary bg-c-bias text-on-bias p-10 transition-all duration-200 hover:shadow-[8px_8px_0px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">Explore Tools</h2>
            <p className="mt-4 font-mono text-base leading-relaxed opacity-90 max-w-md">
              Curated generators, formatters, and utilities for modern web engineering.
            </p>
            <div className="mt-12 flex justify-end">
              <ArrowRightIcon weight="bold" className="size-8 transition-transform group-hover:translate-x-2" />
            </div>
          </Link>

          {/* Resources Card */}
          <Link href="/resources" className="group relative flex flex-col overflow-hidden border-2 border-primary bg-c-heur text-on-heur p-10 transition-all duration-200 hover:shadow-[8px_8px_0px_0px_var(--ink)] hover:-translate-y-1 hover:-translate-x-1 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">Explore Resources</h2>
            <p className="mt-4 font-mono text-base leading-relaxed opacity-90 max-w-md">
              Essential references, guides, and external links for your stack.
            </p>
            <div className="mt-12 flex justify-end">
              <ArrowRightIcon weight="bold" className="size-8 transition-transform group-hover:translate-x-2" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
