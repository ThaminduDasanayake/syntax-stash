"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import CodeCopyButton from "@/app/tools/code-stash/components/code-copy-button";
import FilenameCopyButton from "@/app/tools/code-stash/components/filename-copy-button";
import SetupCopyButton from "@/app/tools/code-stash/components/setup-copy-button";
import { LANG_COLORS } from "@/app/tools/code-stash/constants";
import { Snippet } from "@/app/tools/code-stash/types";
import ToolLayout from "@/components/layout/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { developmentTools } from "@/lib/tools-data.ts";
import { cn } from "@/lib/utils";

export default function CodeStashUi({ initialSnippets }: { initialSnippets: Snippet[] }) {
  const [activeId, setActiveId] = useState(initialSnippets[0]?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const languages = useMemo(
    () => ["All", ...Array.from(new Set(initialSnippets.flatMap((s) => s.languages)))],
    [initialSnippets],
  );

  // 1. Setup Fuse.js for fuzzy searching
  const fuse = useFuzzySearch(initialSnippets, ["title", "description", "languages"]);

  // 2. Filter logic combining Fuse and Category tabs
  const filteredSnippets = useMemo(() => {
    let results = searchQuery ? fuse.search(searchQuery).map((res) => res.item) : initialSnippets;

    if (activeFilter !== "All") {
      results = results.filter((s) => s.languages.includes(activeFilter));
    }
    return results;
  }, [searchQuery, activeFilter, fuse, initialSnippets]);

  const activeSnippet = initialSnippets.find((s) => s.id === activeId);

  const tool = developmentTools.find((t) => t.url === "/tools/code-stash");

  return (
    <ToolLayout tool={tool}>
      {/* Split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Directory */}
        <div className="flex flex-col lg:col-span-1 lg:max-h-[70vh]">
          {/* Sticky header: search + filters */}
          <div className="sticky top-0 z-10 space-y-3 pb-3">
            {/* Search bar */}
            <div className="relative">
              <MagnifyingGlassIcon
                weight="duotone"
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets…"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30 h-9 pl-9 text-sm focus-visible:ring-1"
              />
            </div>

            {/* Language filter pills */}
            <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-2">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={activeFilter === lang ? "default" : "outline"}
                  size="xs"
                  className={cn(
                    "shrink-0 font-mono text-[11px] transition-colors",
                    activeFilter === lang ? "" : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveFilter(lang)}
                >
                  {lang}
                </Button>
              ))}
            </div>

            {/* Separator */}
            <div className="border-border border-t" />
          </div>

          {/* Scrollable snippet list */}
          <div className="flex-1 space-y-0.5 overflow-y-auto pr-2">
            {filteredSnippets.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No snippets match your search.
              </p>
            ) : (
              filteredSnippets.map((snippet) => {
                const isActive = snippet.id === activeId;
                return (
                  <button
                    key={snippet.id}
                    type="button"
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                      isActive
                        ? "bg-muted border-primary border-l-2"
                        : "hover:bg-muted/50 border-l-2 border-transparent",
                    )}
                    onClick={() => setActiveId(snippet.id)}
                  >
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        isActive ? "text-primary" : "text-foreground",
                      )}
                    >
                      {snippet.title}
                    </span>
                    <div className="flex shrink-0 gap-1.5">
                      {snippet.languages.map((lang) => (
                        <Badge
                          key={lang}
                          variant="outline"
                          className={cn(
                            "shrink-0 border px-1.5 py-0 font-mono text-[9px] tracking-wider",
                            LANG_COLORS[lang.toLowerCase()] ??
                              "bg-muted text-muted-foreground border-border",
                          )}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-2">
          {activeSnippet ? (
            <div className="relative">
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {activeSnippet.description}
              </p>

              {activeSnippet.instructions && activeSnippet.instructions.length > 0 && (
                <div className="mb-6 rounded-lg border border-sky-500/20 bg-sky-500/10 p-4 text-xs">
                  <h4 className="mb-2.5 flex items-center gap-2 font-bold tracking-wider text-sky-400 uppercase">
                    Instructions
                  </h4>
                  <div className="space-y-3 text-sky-200/80">
                    {activeSnippet.instructions.map(({ text, code }, idx) => (
                      <div key={idx}>
                        <p>{text}</p>

                        {code && (
                          <ul className="ml-5 rounded-md px-3 py-2 font-mono">
                            {code.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSnippet.setup && (
                <div className="bg-background mb-6 flex items-center justify-between rounded-lg border px-4 py-2.5">
                  <code className="font-mono text-sm text-teal-500">
                    <span className="text-muted-foreground/50 mr-3 select-none">$</span>
                    {activeSnippet.setup}
                  </code>
                  <SetupCopyButton text={activeSnippet.setup} />
                </div>
              )}

              <div className="space-y-6">
                {activeSnippet.files.map((file) => (
                  <div
                    key={file.filename}
                    className="border-border bg-muted overflow-hidden rounded-xl border shadow-2xl"
                  >
                    {/* Title bar */}
                    <div className="border-accent bg-muted flex items-center justify-between border-b px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="mr-2 flex gap-1.5">
                          <span className="h-3 w-3 rounded-full bg-red-500/60" />
                          <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                          <span className="h-3 w-3 rounded-full bg-green-500/60" />
                        </div>

                        <FilenameCopyButton filename={file.filename} />
                      </div>

                      {/* Copy Code Button */}
                      <CodeCopyButton code={file.code} />
                    </div>

                    <div
                      className="overflow-x-auto p-4 text-sm [&>pre]:m-0! [&>pre]:bg-transparent! [&>pre]:p-0!"
                      dangerouslySetInnerHTML={{ __html: file.html }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
              Select a snippet to view its code.
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
