import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-wordmark-link">
            {/*<Image width={36} height={36} src="/logo.svg" alt="logo" priority />*/}
            <span className="nav-wordmark">
              SYNTAX<em>.stash</em>
            </span>
          </Link>
          <div className="footer-brand">TOOLS, RESOURCES, & FRONTEND KNOWLEDGE.</div>
          <p className="footer-paragraph">
            A curated command center for modern web development. Tools and resources built to scale.
            Updated as the ecosystem evolves.
          </p>
        </div>
        <div>
          {/* Logo & Description */}

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
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">
          © {new Date().getFullYear()} ·{" "}
          <a href="https://github.com/ThaminduDasanayake" className="footer-link">
            Thamindu Dasanayake
          </a>
        </span>
        <span className="footer-copy">Last update June 2026</span>
      </div>
    </footer>
  );
}
