import { GithubLogo } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function FooterOptionA() {
  return (
    <footer className="border-border bg-background border-t-2">
      {/* Upper Navigation & Callout */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-16 pb-12 sm:px-12 lg:px-24">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start">
          {/* Brand & Mission */}
          <div className="flex max-w-md flex-col items-start gap-4">
            <div className="hero-eyebrow mb-1">
              <HeroEyebrowDots />
              OPEN SOURCE TOOLBELT
            </div>
            <p className="font-mono text-sm leading-relaxed opacity-85">
              A curated command center for modern web development. Tools, formatters, and resources
              built to scale without tracking or bloat.
            </p>

            <Button asChild variant="default" size="default" className="mt-2">
              <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                VIEW ON GITHUB <GithubLogo weight="bold" className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 gap-12 font-mono text-sm sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="text-display-2xs text-ink-mute uppercase tracking-widest font-extrabold">
                LIBRARY
              </span>
              <Link href="/tools" className="hover:text-c-blue transition-colors font-medium">
                All Tools
              </Link>
              <Link href="/resources" className="hover:text-c-blue transition-colors font-medium">
                All Resources
              </Link>
              <Link href="/about" className="hover:text-c-blue transition-colors font-medium">
                About Story
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-display-2xs text-ink-mute uppercase tracking-widest font-extrabold">
                PROJECT
              </span>
              <Link href="/changelog" className="hover:text-c-orange transition-colors font-medium">
                Changelog
              </Link>
              <Link
                href={siteConfig.links.github + "/blob/main/CONTRIBUTING.md"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors font-medium"
              >
                Contribute ↗
              </Link>
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-c-orange transition-colors font-medium"
              >
                GitHub Repo ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Giant Display Typography */}
        <div className="border-border border-t-2 pt-8 text-center select-none overflow-hidden">
          <h1 className="font-display font-black text-[12vw] sm:text-[11vw] leading-none tracking-tighter text-foreground uppercase">
            SYNTAX<span className="font-serif italic font-normal text-c-orange">.</span>STASH
          </h1>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="border-border/60 flex flex-col items-center justify-between gap-4 border-t-2 pt-6 font-mono text-xs opacity-75 sm:flex-row">
          <span>
            © {new Date().getFullYear()} ·{" "}
            <a
              href={siteConfig.links.authorGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-100 font-bold"
            >
              {siteConfig.author.name}
            </a>
          </span>
          <span>Open Source under MIT License</span>
        </div>
      </div>
    </footer>
  );
}
