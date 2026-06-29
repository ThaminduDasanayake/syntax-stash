import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-wordmark-link">
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

        {/* Library Links */}
        <div>
          <span className="footer-nav-heading">LIBRARY</span>
          <Link href="/tools" className="footer-nav-link">
            All Tools
          </Link>
          <Link href="/resources" className="footer-nav-link">
            All Resources
          </Link>
          <Link href="/tools" className="footer-nav-link">
            Generators
          </Link>
          <Link href="/tools" className="footer-nav-link">
            Calculators
          </Link>
        </div>

        {/* Explore Links */}
        <div>
          <span className="footer-nav-heading">EXPLORE</span>
          <Link href="/" className="footer-nav-link">
            Home
          </Link>
          <Link href="/about" className="footer-nav-link">
            About
          </Link>
          <Link href="#" className="footer-nav-link">
            Contribute
          </Link>
          <Link href="#" className="footer-nav-link">
            Changelog
          </Link>
        </div>

        {/* Stay Current */}
        <div>
          <span className="footer-nav-heading">STAY CURRENT.</span>
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
