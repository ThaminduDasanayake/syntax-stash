import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

export default function AppFooter() {
  return (
    <footer className="border-t-2 border-border bg-background pt-16 pb-8 px-6 md:px-12 w-full mt-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80">
              <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center font-display font-black text-xl leading-none tracking-tighter">
                S
              </div>
              <span className="font-display text-2xl font-black uppercase tracking-tight">
                SYNTAX<span className="font-serif italic lowercase tracking-normal">.stash</span>
              </span>
            </Link>
            <div>
              <h3 className="font-display font-black uppercase text-xl tracking-tight">TOOLS, RESOURCES, &<br/>FRONTEND KNOWLEDGE.</h3>
              <p className="mt-4 font-mono text-xs opacity-70 leading-relaxed">
                A curated command center for modern web development. Tools and resources built to scale. Updated as the ecosystem evolves.
              </p>
            </div>
          </div>

          {/* Library Links */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">LIBRARY</h4>
            <nav className="flex flex-col gap-3 font-mono text-sm opacity-80">
              <Link href="/tools" className="hover:text-c-bias hover:underline underline-offset-4">All Tools</Link>
              <Link href="/resources" className="hover:text-c-heur hover:underline underline-offset-4">All Resources</Link>
              <Link href="/tools" className="hover:text-c-nudge hover:underline underline-offset-4">Generators</Link>
              <Link href="/tools" className="hover:text-c-ai hover:underline underline-offset-4">Calculators</Link>
            </nav>
          </div>

          {/* Explore Links */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">EXPLORE</h4>
            <nav className="flex flex-col gap-3 font-mono text-sm opacity-80">
              <Link href="/" className="hover:text-primary hover:underline underline-offset-4">Home</Link>
              <Link href="/about" className="hover:text-primary hover:underline underline-offset-4">About</Link>
              <Link href="#" className="hover:text-primary hover:underline underline-offset-4">Contribute</Link>
              <Link href="#" className="hover:text-primary hover:underline underline-offset-4">Changelog</Link>
            </nav>
          </div>

          {/* Stay Current */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
            <h4 className="font-mono text-[10px] font-bold tracking-widest uppercase">STAY CURRENT.</h4>
            <p className="font-mono text-sm opacity-80">
              Save cards across visits and get an email when the library grows. No tracking ever.
            </p>
            <div className="flex w-full mt-2">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 border-2 border-r-0 border-primary bg-background px-4 py-2 font-mono text-sm outline-none focus:bg-primary/5"
              />
              <button className="flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground px-4 py-2 transition-colors hover:bg-foreground/80">
                <ArrowRightIcon weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t-2 border-border pt-8 font-mono text-xs opacity-60">
          <p>© {new Date().getFullYear()} SYNTAX.stash</p>
          <p className="mt-2 md:mt-0">Last update June 2026</p>
        </div>
      </div>
    </footer>
  );
}
