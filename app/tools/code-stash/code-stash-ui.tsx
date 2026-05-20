"use client";

import { useMemo, useState } from "react";

import { LANG_COLORS } from "@/app/tools/code-stash/constants";
import { FileCard } from "@/app/tools/code-stash/file-card";
import { InstructionCard } from "@/app/tools/code-stash/instruction-card";
import { SetupCard } from "@/app/tools/code-stash/setup-card";
import { Snippet } from "@/app/tools/code-stash/types";
import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { useFuzzySearch } from "@/hooks/use-fuzzy-search";
import { internalTools } from "@/lib/tools-data";
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

  const tool = internalTools.find((t) => t.slug === "code-stash");

  return (
    <ToolLayout tool={tool}>
      {/* Split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Directory */}
        <div className="flex flex-col lg:col-span-1 lg:max-h-[70vh]">
          <div className="space-y-3 pb-3">
            {/* Search bar */}
            <SearchInput
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

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
          <div className="flex-1 space-y-1 overflow-y-auto pr-2">
            {filteredSnippets.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No snippets match your search.
              </p>
            ) : (
              filteredSnippets.map((snippet) => {
                const isActive = snippet.id === activeId;
                return (
                  <Button
                    key={snippet.id}
                    variant="ghost"
                    className={cn(
                      "h-auto w-full justify-between gap-3 rounded-lg border-l-6 px-3 py-2.5 text-left transition-colors duration-150",
                      isActive
                        ? "border-primary bg-muted"
                        : "hover:bg-muted/50 hover:text-foreground border-transparent",
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
                  </Button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-2">
          {activeSnippet ? (
            <div className="flex flex-col space-y-6">
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                {activeSnippet.description}
              </p>

              {activeSnippet.instructions && activeSnippet.instructions.length > 0 && (
                <InstructionCard instructions={activeSnippet.instructions} />
              )}

              {activeSnippet.setup && <SetupCard setup={activeSnippet.setup} />}

              <div className="space-y-6">
                {activeSnippet.files.map((file) => (
                  <FileCard file={file} key={file.filename} />
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
