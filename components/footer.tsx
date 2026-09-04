"use client";

import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { isAdmin } from "@/lib/admin";
import { useSession } from "@/lib/auth-client";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const { data: session } = useSession();
  const isUserAdmin = isAdmin(session?.user?.email);

  const scrollToTop = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <footer className="bg-ink text-paper border-ink selection:bg-c-orange selection:text-ink relative border-t-2 pt-16 pb-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 sm:px-12 lg:px-16">
        <div className="pb-12">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-paper font-mono text-xl font-bold tracking-tight sm:text-2xl">
                OPEN SOURCE DEVELOPER UTILITIES.
              </h3>
              <p className="text-ink-faint font-mono text-xs leading-relaxed">
                {siteConfig.description}
              </p>
              <span className="mt-1 font-mono text-[11px] font-bold tracking-widest uppercase">
                NO TRACKERS · NO ADS · 100% OPEN SOURCE
              </span>
            </div>
          </div>
        </div>

        <div className="border-ink-mute border-y-2 py-4 font-mono text-xs font-bold tracking-wider uppercase">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-1 transition-colors"
              >
                [ GitHub
                <span className="transition-transform group-hover:-translate-y-0.5">
                  <ArrowUpRightIcon weight="bold" />
                </span>
                ]
              </a>
              <a
                href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-1 transition-colors"
              >
                [ Contribute
                <span className="transition-transform group-hover:-translate-y-0.5">
                  <ArrowUpRightIcon weight="bold" />
                </span>
                ]
              </a>
              <Link
                href="/submit"
                className="after:bg-paper relative inline-block transition-colors duration-200 ease-out after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:delay-150 after:duration-300 after:ease-out hover:after:scale-x-100"
              >
                [ Submit Resource ]
              </Link>
              <Link
                href="/about"
                className="after:bg-paper relative inline-block transition-colors duration-200 ease-out after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:delay-150 after:duration-300 after:ease-out hover:after:scale-x-100"
              >
                [ About ]
              </Link>
              <Link
                href="/authors"
                className="after:bg-paper relative inline-block transition-colors duration-200 ease-out after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:delay-150 after:duration-300 after:ease-out hover:after:scale-x-100"
              >
                [ Authors ]
              </Link>
              <Link
                href="/changelog"
                className="after:bg-paper relative inline-block transition-colors duration-200 ease-out after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:delay-150 after:duration-300 after:ease-out hover:after:scale-x-100"
              >
                [ Changelog ]
              </Link>
              {isUserAdmin && (
                <Link
                  href="/admin/submissions"
                  className="text-c-orange after:bg-c-orange relative inline-block transition-colors duration-200 ease-out after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-center after:scale-x-0 after:transition-transform after:delay-150 after:duration-300 after:ease-out hover:after:scale-x-100"
                >
                  [ Admin ]
                </Link>
              )}
            </div>

            <button
              onClick={scrollToTop}
              className="group flex cursor-pointer items-center gap-1.5 transition-colors"
            >
              <span>[ BACK TO TOP</span>
              <span className="transition-transform group-hover:-translate-y-0.5">
                <ArrowUpIcon weight="bold" />
              </span>
              ]
            </button>
          </div>
        </div>
      </div>

      <div className="my-6 w-full overflow-hidden leading-none select-none">
        <h1 className="font-display text-paper w-full text-center text-[14.5vw] font-black tracking-tighter whitespace-nowrap uppercase sm:text-[14vw] lg:text-[13.5vw]">
          SYNTAX<span className="text-c-orange">.</span>STASH
        </h1>
      </div>

      <div className="border-ink-mute text-paper/60 mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t px-6 pt-6 font-mono text-[11px] uppercase sm:flex-row sm:px-12 lg:px-16">
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-center sm:justify-start sm:text-left">
          <span>© {new Date().getFullYear()} SYNTAX STASH</span>
          <span className="opacity-40">·</span>
          <span>BUILT BY</span>
          <a
            href={siteConfig.links.authorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper hover:text-c-orange underline underline-offset-2 transition-colors"
          >
            {siteConfig.author.name}
          </a>
        </div>
        <span>LAST UPDATE {process.env.NEXT_PUBLIC_LAST_UPDATE || "2026"}</span>
      </div>
    </footer>
  );
}
