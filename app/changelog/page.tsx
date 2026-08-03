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
          {changelogEntries.length === 0 ? (
            <div className="border-border bg-card border-2 p-8 text-center font-mono text-sm">
              No release notes found in CHANGELOG.md.
            </div>
          ) : (
            changelogEntries.map((entry) => (
              <div
                key={entry.version}
                className="border-border bg-card flex flex-col gap-6 border-2 p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-c-blue text-paper px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase">
                      {entry.version}
                    </span>
                    <h2 className="text-display-md font-bold">Release Notes</h2>
                  </div>
                  <span className="font-mono text-xs font-bold opacity-70">{entry.date}</span>
                </div>

                <div className="flex flex-col gap-6">
                  {entry.sections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-3">
                      <h3 className="text-c-green font-mono text-xs font-bold tracking-wider uppercase">
                        {section.title}
                      </h3>
                      <ul className="flex flex-col gap-3 font-mono text-sm leading-relaxed opacity-90">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-c-green font-bold">→</span>
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
            ))
          )}
        </div>
      </section>
    </div>
  );
}
