"use client";

import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <footer className="bg-ink text-paper border-ink selection:bg-c-orange selection:text-ink relative border-t-2 pt-16 pb-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-12 lg:px-16">
        {/* Top Section: About Manifesto */}
        <div className="pb-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-paper font-mono text-xl font-bold tracking-tight sm:text-2xl">
                OPEN SOURCE DEVELOPER UTILITIES.
              </h3>
              <p className="text-paper/60 font-mono text-xs leading-relaxed">
                {siteConfig.description}
              </p>
              <span className="text-c-blue mt-1 font-mono text-[11px] font-bold tracking-widest uppercase">
                NO TRACKERS · NO ADS · 100% OPEN SOURCE
              </span>
            </div>
          </div>
        </div>

        {/* Bracketed Action Strip (Inspired by Reference Images 2 & 4) */}
        <div className="border-paper/20 border-y-2 py-4 font-mono text-xs font-bold tracking-wider uppercase">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors"
              >
                [ GitHub ↗ ]
              </a>
              <a
                href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-green transition-colors"
              >
                [ Contribute ↗ ]
              </a>
              <Link href="/changelog" className="hover:text-c-blue transition-colors">
                [ Changelog ]
              </Link>
            </div>

            <button
              onClick={scrollToTop}
              className="group hover:text-c-orange flex cursor-pointer items-center gap-1.5 transition-colors"
            >
              <span>[ BACK TO TOP</span>
              <span className="transition-transform group-hover:-translate-y-0.5">↑ ]</span>
            </button>
          </div>
        </div>
      </div>

      {/* Massive Display Branding (Inspired by Reference Images 1, 4 & 5) */}
      <div className="my-6 w-full overflow-hidden leading-none select-none">
        <h1 className="font-display text-paper w-full text-center text-[14.5vw] font-black tracking-tighter whitespace-nowrap uppercase sm:text-[14vw] lg:text-[13.5vw]">
          SYNTAX<span className="text-c-orange">.</span>STASH
        </h1>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="border-paper/15 text-paper/60 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t px-6 pt-6 font-mono text-[11px] sm:flex-row sm:px-12 lg:px-16">
        <span>
          © {new Date().getFullYear()} {siteConfig.author.name}
        </span>
        <span>CURATED FOR DEVELOPERS</span>
      </div>
    </footer>
  );
}
