import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export default function FooterOptionB() {
  return (
    <footer className="border-border bg-background relative overflow-hidden border-t-2">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-16 pb-8 sm:px-12 lg:px-24">
        {/* Top Header Row */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest text-c-blue uppercase">
              NO TRACKERS · NO ADS · 100% OPEN SOURCE
            </span>
            <h2 className="font-display mt-2 text-4xl font-black uppercase sm:text-5xl">
              BUILT FOR SPEED & SIMPLICITY.
            </h2>
          </div>

          <Link
            href={siteConfig.links.email}
            className="group flex items-center gap-2 font-mono text-sm font-bold underline decoration-2 underline-offset-4 hover:text-c-orange"
          >
            SAY HELLO <ArrowUpRightIcon weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Links Strip */}
        <div className="border-border border-t-2 border-b-2 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6 font-mono text-sm font-bold">
            <div className="flex flex-wrap gap-6">
              <Link href="/tools" className="hover:text-c-blue transition-colors">
                [01] Tools
              </Link>
              <Link href="/resources" className="hover:text-c-blue transition-colors">
                [02] Resources
              </Link>
              <Link href="/about" className="hover:text-c-blue transition-colors">
                [03] About
              </Link>
              <Link href="/changelog" className="hover:text-c-orange transition-colors">
                [04] Changelog
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              <Link
                href={siteConfig.links.github + "/blob/main/CONTRIBUTING.md"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-green transition-colors"
              >
                Contribute ↗
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-green transition-colors"
              >
                GitHub ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Muted Giant Background Typography */}
        <div className="relative py-4 text-center select-none">
          <h1 className="font-display font-black text-[13vw] leading-none tracking-tighter text-current opacity-10 uppercase">
            GOOD.SYNTAX
          </h1>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-xs opacity-75 sm:flex-row">
          <span>© {new Date().getFullYear()} {siteConfig.author.name}</span>
          <span>Syntax Stash v1.2.0</span>
        </div>
      </div>
    </footer>
  );
}
