import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export default function FooterOptionC() {
  return (
    <footer className="bg-ink text-paper border-ink border-t-2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-20 pb-10 sm:px-12 lg:px-24">
        {/* Upper Row: Contact / Say Hello & Navigation */}
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          <div className="flex max-w-md flex-col gap-4">
            <span className="text-c-orange font-mono text-xs font-bold tracking-widest uppercase">
              SAY HELLO
            </span>
            <a
              href={siteConfig.links.email}
              className="hover:text-c-orange font-mono text-2xl font-bold break-all underline decoration-current/40 underline-offset-4 transition-all hover:decoration-current sm:break-normal"
            >
              {siteConfig.author.email}
            </a>
            <p className="font-mono text-xs leading-relaxed opacity-75">
              Open source developer toolbelt built for frontend engineers.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 font-mono text-sm sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-c-blue text-xs font-bold tracking-widest uppercase">
                EXPLORE
              </span>
              <Link href="/tools" className="hover:text-c-orange transition-colors">
                Tools
              </Link>
              <Link href="/resources" className="hover:text-c-orange transition-colors">
                Resources
              </Link>
              <Link href="/about" className="hover:text-c-orange transition-colors">
                About
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-c-green text-xs font-bold tracking-widest uppercase">
                COMMUNITY
              </span>
              <Link href="/changelog" className="hover:text-c-orange transition-colors">
                Changelog
              </Link>
              <Link
                href={siteConfig.links.github + "/blob/main/CONTRIBUTING.md"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors"
              >
                Contribute ↗
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors"
              >
                GitHub ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Massive Display Title */}
        <div className="border-paper/20 border-t pt-10 text-center select-none overflow-hidden">
          <h1 className="font-display text-paper text-[11vw] leading-none font-black tracking-tighter uppercase sm:text-[11.5vw]">
            SYNTAX<span className="text-c-orange">.</span>STASH
          </h1>
        </div>

        {/* Bottom Strip */}
        <div className="border-paper/20 flex flex-col items-center justify-between gap-4 border-t pt-6 font-mono text-xs opacity-70 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.author.name}
          </span>
          <div className="flex gap-4">
            <Link href={siteConfig.links.github} target="_blank" className="hover:underline">
              GitHub
            </Link>
            <span>·</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
