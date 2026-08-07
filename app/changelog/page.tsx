import type { Metadata } from "next";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { formatInlineMarkdown, getChangelog } from "@/lib/changelog";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Changelog",
  alternates: { canonical: "/changelog" },
  description: "Recent updates, tool additions, and feature releases for syntax-stash.",
};

export default function ChangelogPage() {
  const changelogEntries = getChangelog();
  const latestVersion = changelogEntries.length > 0 ? changelogEntries[0].version : null;

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

          {/* Quick Version Navigation Bar */}
          {changelogEntries.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold uppercase opacity-60">Releases:</span>
              {changelogEntries.map((entry) => {
                const isLatest = entry.version === latestVersion;
                return (
                  <a
                    key={entry.version}
                    href={`#${entry.version}`}
                    className={`border-border flex items-center gap-1.5 border-2 px-3 py-1 font-mono text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                      isLatest ? "bg-c-blue text-paper" : "bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{entry.version}</span>
                    {isLatest && (
                      <span className="bg-paper/20 text-paper ml-1 rounded px-1.5 py-0.5 text-[10px] uppercase">
                        Latest
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Timeline List Section */}
      <section className="bg-background border-border border-b-2 px-6 py-16 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl">
          {changelogEntries.length === 0 ? (
            <div className="border-border bg-card border-2 p-8 text-center font-mono text-sm">
              No release notes found in CHANGELOG.md.
            </div>
          ) : (
            <div className="relative flex flex-col gap-10 pl-4 sm:pl-8">
              {/* Vertical Timeline Line */}
              <div className="border-border absolute top-4 bottom-4 left-2 w-1 border-l-2 border-dashed sm:left-4" />

              {changelogEntries.map((entry) => {
                const isLatest = entry.version === latestVersion;

                return (
                  <div
                    key={entry.version}
                    id={entry.version}
                    className="group relative scroll-mt-24"
                  >
                    {/* Timeline Node Indicator */}
                    <div
                      className={`border-border absolute top-8 -left-6 h-4 w-4 rounded-full border-2 sm:-left-10 ${
                        isLatest
                          ? "bg-c-blue shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "bg-muted-foreground/30"
                      } transition-transform group-hover:scale-125`}
                    />

                    {/* Changelog Entry Card */}
                    <div
                      className={`border-border bg-card flex flex-col gap-6 border-2 p-6 transition-all sm:p-8 ${
                        isLatest
                          ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.9)]"
                          : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current/15 pb-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="bg-c-blue text-paper border-border border px-3.5 py-1 font-mono text-sm font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {entry.version}
                          </span>
                          {isLatest && (
                            <span className="border-border bg-c-orange text-ink border px-2.5 py-1 font-mono text-xs font-extrabold tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              ★ LATEST RELEASE
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold opacity-70">{entry.date}</span>
                      </div>

                      {/* Card Sections */}
                      <div className="flex flex-col gap-6">
                        {entry.sections.map((section) => (
                          <div key={section.title} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <span className="border-border bg-muted/60 text-foreground border px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wider uppercase">
                                {section.title}
                              </span>
                            </div>
                            <ul className="flex flex-col gap-2.5 font-mono text-sm leading-relaxed opacity-90">
                              {section.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-3">
                                  <span className="text-c-blue font-bold select-none">→</span>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: formatInlineMarkdown(item),
                                    }}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
