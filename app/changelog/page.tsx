import type { Metadata } from "next";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
  description: "Recent updates, tool additions, and feature releases for syntax-stash.",
};

const changelogEntries = [
  {
    title: "Expanded Tool Suite & Dynamic Categories",
    date: "June 2026",
    highlights: [
      "Added Regex Studio, Diff Viewer, Cron Studio, and SQL Formatter to the in-browser toolbelt.",
      "Implemented client-side category filtering with live search and category counters.",
      "Optimized image rendering performance and lazy loading across tool cards.",
    ],
    version: "v1.1.0",
  },
  {
    title: "Initial Launch of Syntax Stash",
    date: "May 2026",
    highlights: [
      "Built high-contrast brutalist UI design system with customizable light/dark themes.",
      "Launched open-source developer resource stash featuring 100+ curated developer links.",
      "Released core developer utilities running 100% client-side for maximum privacy and zero latency.",
    ],
    version: "v1.0.0",
  },
  {
    title: "Metadata, SEO Architecture & Theme Color Consistency",
    date: "July 2026",
    highlights: [
      "Added dynamic `/sitemap.xml`, `/robots.txt`, and web app manifest `/manifest.webmanifest`.",
      "Added dynamic Open Graph banner generation (`app/opengraph-image.tsx`) for high-res social cards.",
      "Centralized site configuration in `lib/site-config.ts` for unified URL and metadata management.",
      "Enhanced Category DotButton themes with deep border colors and hover state contrast.",
    ],
    version: "v1.2.0",
  },
];

export default function ChangelogPage() {
  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow mb-4">
            <HeroEyebrowDots />
            RELEASE NOTES & UPDATES
          </div>
          <h1 className="lib-headline">
            THE PROJECT
            <br />
            <em>changelog.</em>
          </h1>
          <p className="lib-sub">
            Track new tools, features, and platform updates as {siteConfig.name} evolves.
          </p>
        </div>
      </header>

      {/* Timeline List */}
      <section className="bg-background border-border border-b-2 px-6 py-16 sm:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
          {changelogEntries.map((entry) => (
            <div
              key={entry.version}
              className="border-border bg-card flex flex-col gap-6 border-2 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current/20 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-c-blue text-paper px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider">
                    {entry.version}
                  </span>
                  <h2 className="text-display-md font-bold">{entry.title}</h2>
                </div>
                <span className="font-mono text-xs font-bold opacity-70">{entry.date}</span>
              </div>

              <ul className="flex flex-col gap-3 font-mono text-sm leading-relaxed opacity-90">
                {entry.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-c-orange font-bold">→</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
