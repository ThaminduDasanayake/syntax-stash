"use client";

import Link from "next/link";
import { useState } from "react";

import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.author.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <footer className="bg-ink text-paper border-ink selection:bg-c-orange selection:text-ink relative border-t-2 pt-16 pb-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-12 lg:px-16">
        {/* Top Utility & Callout Grid */}
        <div className="grid grid-cols-1 gap-10 pb-16 md:grid-cols-12 md:gap-8">
          {/* Column 1: Say Hello & Interactive Email Copy */}
          <div className="flex flex-col gap-3 md:col-span-6">
            <div className="text-c-orange flex items-center gap-2 font-mono text-xs font-bold tracking-widest uppercase">
              <span>[ 01 ]</span>
              <span>GET IN TOUCH</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={handleCopyEmail}
                className="group text-paper hover:text-c-orange flex items-center gap-3 font-mono text-xl font-bold tracking-tight transition-colors sm:text-2xl"
              >
                <span>{siteConfig.author.email}</span>
                <span className="bg-paper/10 text-paper/70 group-hover:bg-c-orange group-hover:text-ink rounded px-2 py-0.5 text-xs font-normal">
                  {copied ? "COPIED!" : "COPY"}
                </span>
              </button>
              <p className="text-paper/60 max-w-md font-mono text-xs leading-relaxed">
                Curated reference for frontend engineers. Built with open source utilities.
              </p>
            </div>
          </div>

          {/* Column 2: System Telemetry & Quick Utilities */}
          <div className="flex flex-col justify-between gap-6 font-mono text-xs md:col-span-6 md:items-end md:text-right">
            {/* Live System Telemetry */}
            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-c-green flex items-center gap-2">
                <span className="bg-c-green h-2 w-2 animate-pulse rounded-full" />
                <span className="font-bold tracking-wider uppercase">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <span className="text-paper/50">BUILD: v2.4.0 · NEXT.JS 15 · TAILWIND v4</span>
            </div>

            {/* Back To Top Action */}
            <button
              onClick={scrollToTop}
              className="border-paper/30 text-paper hover:border-c-orange hover:bg-c-orange hover:text-ink flex w-fit items-center gap-2 border px-3 py-1.5 font-bold transition-all"
            >
              <span>[ BACK TO TOP ]</span>
              <span>↑</span>
            </button>
          </div>
        </div>

        {/* Bracketed Action Strip (Inspired by Image 5) */}
        <div className="border-paper/20 border-y-2 py-4 font-mono text-xs font-bold tracking-wider uppercase">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors"
              >
                [ GitHub Repository ↗ ]
              </a>
              <a
                href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-green transition-colors"
              >
                [ Contribute Tool ↗ ]
              </a>
              <Link href="/changelog" className="hover:text-c-blue transition-colors">
                [ Changelog ]
              </Link>
            </div>

            <span className="text-paper/40">EST. 2026</span>
          </div>
        </div>
      </div>

      {/* Massive Display Branding (Image 1, 3 & 4 style) */}
      <div className="my-6 w-full overflow-hidden leading-none select-none">
        <h1 className="font-display text-paper w-full text-center text-[14.5vw] font-black tracking-tighter whitespace-nowrap uppercase sm:text-[14vw] lg:text-[13.5vw]">
          SYNTAX<span className="text-c-orange">.</span>STASH
        </h1>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="border-paper/15 text-paper/60 mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t px-6 pt-6 font-mono text-[11px] sm:flex-row sm:px-12 lg:px-16">
        <span>
          © {new Date().getFullYear()} {siteConfig.author.name}. MIT LICENSE.
        </span>
        <div className="flex gap-4">
          <span>HOSTED ON VERCEL</span>
          <span>·</span>
          <span>CURATED FOR DEVELOPERS</span>
        </div>
      </div>
    </footer>
  );
}

// import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
// import Link from "next/link";
//
// import { siteConfig } from "@/lib/site-config";
//
// export default function FooterOptionB() {
//   return (
//     <footer className="border-border bg-background relative overflow-hidden border-t-2">
//       <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-16 pb-8 sm:px-12 lg:px-24">
//         {/* Top Header Row */}
//         <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
//           <div>
//             <span className="font-mono text-xs font-bold tracking-widest text-c-blue uppercase">
//               NO TRACKERS · NO ADS · 100% OPEN SOURCE
//             </span>
//             <h2 className="font-display mt-2 text-4xl font-black uppercase sm:text-5xl">
//               BUILT FOR SPEED & SIMPLICITY.
//             </h2>
//           </div>
//
//           <Link
//             href={siteConfig.links.email}
//             className="group flex items-center gap-2 font-mono text-sm font-bold underline decoration-2 underline-offset-4 hover:text-c-orange"
//           >
//             SAY HELLO <ArrowUpRightIcon weight="bold" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
//           </Link>
//         </div>
//
//         {/* Links Strip */}
//
//
//         {/* Muted Giant Background Typography */}
//         <div className="relative py-4 text-center select-none">
//           <h1 className="font-display font-black text-[13vw] leading-none tracking-tighter text-current opacity-10 uppercase">
//             GOOD.SYNTAX
//           </h1>
//         </div>
//
//         {/* Bottom Strip */}
//         <div className="flex flex-col items-center justify-between gap-4 font-mono text-xs opacity-75 sm:flex-row">
//           <span>© {new Date().getFullYear()} {siteConfig.author.name}</span>
//           <span>Syntax Stash v1.2.0</span>
//         </div>
//       </div>
//     </footer>
//   );
// }
