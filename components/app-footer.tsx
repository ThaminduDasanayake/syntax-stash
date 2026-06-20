import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-border bg-secondary mt-24 w-full border-t-2 px-6 pt-16 pb-8 md:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-24 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="col-span-1 flex flex-col gap-6 md:col-span-1">
            <Link
              href="/"
              className="text-foreground flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <div className="bg-foreground text-background font-display flex h-8 w-8 items-center justify-center text-xl leading-none font-black tracking-tighter">
                S
              </div>
              <span className="font-display text-2xl font-black tracking-tight uppercase">
                SYNTAX<span className="font-serif tracking-normal lowercase italic">.stash</span>
              </span>
            </Link>
            <div>
              <h3 className="font-display text-xl font-black tracking-tight uppercase">
                TOOLS, RESOURCES, &<br />
                FRONTEND KNOWLEDGE.
              </h3>
              <p className="mt-4 font-mono text-xs leading-relaxed opacity-70">
                A curated command center for modern web development. Tools and resources built to
                scale. Updated as the ecosystem evolves.
              </p>
            </div>
          </div>

          {/* Library Links */}
          <div className="col-span-1 flex flex-col gap-6 md:col-span-1">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">LIBRARY</h4>
            <nav className="flex flex-col gap-3 font-mono text-sm opacity-80">
              <Link href="/tools" className="hover:text-c-bias underline-offset-4 hover:underline">
                All Tools
              </Link>
              <Link
                href="/resources"
                className="hover:text-c-heur underline-offset-4 hover:underline"
              >
                All Resources
              </Link>
              <Link href="/tools" className="hover:text-c-nudge underline-offset-4 hover:underline">
                Generators
              </Link>
              <Link href="/tools" className="hover:text-c-ai underline-offset-4 hover:underline">
                Calculators
              </Link>
            </nav>
          </div>

          {/* Explore Links */}
          <div className="col-span-1 flex flex-col gap-6 md:col-span-1">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">EXPLORE</h4>
            <nav className="flex flex-col gap-3 font-mono text-sm opacity-80">
              <Link href="/" className="hover:text-primary underline-offset-4 hover:underline">
                Home
              </Link>
              <Link href="/about" className="hover:text-primary underline-offset-4 hover:underline">
                About
              </Link>
              <Link href="#" className="hover:text-primary underline-offset-4 hover:underline">
                Contribute
              </Link>
              <Link href="#" className="hover:text-primary underline-offset-4 hover:underline">
                Changelog
              </Link>
            </nav>
          </div>

          {/* Stay Current */}
          <div className="col-span-1 flex flex-col gap-6 md:col-span-1">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">
              STAY CURRENT.
            </h4>
            <p className="font-mono text-sm opacity-80">
              Save cards across visits and get an email when the library grows. No tracking ever.
            </p>
            <div className="mt-2 flex w-full">
              <input
                type="email"
                placeholder="your@email.com"
                className="border-primary bg-background focus:bg-primary/5 flex-1 border-2 border-r-0 px-4 py-2 font-mono text-sm outline-none"
              />
              <button className="border-primary bg-primary text-primary-foreground hover:bg-foreground/80 flex items-center justify-center border-2 px-4 py-2 transition-colors">
                <ArrowRightIcon weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border flex flex-col items-center justify-between border-t-2 pt-8 font-mono text-xs opacity-60 md:flex-row">
          <p>© {new Date().getFullYear()} SYNTAX.stash</p>
          <p className="mt-2 md:mt-0">Last update June 2026</p>
        </div>
      </div>
    </footer>
  );
}
