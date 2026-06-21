"use client";

import { FlaskIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { CATEGORY_COLORS, REGEX_CATEGORIES } from "@/app/tools/regex-studio/constants";
import { REGEX_PATTERNS } from "@/app/tools/regex-studio/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { SearchInput } from "@/components/ui/search-input";

interface PatternLibraryProps {
  onUsePatternAction: (pattern: string, flags: string, testString: string) => void;
}

export function PatternLibrary({ onUsePatternAction }: PatternLibraryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredLibrary = useMemo(() => {
    const q = search.toLowerCase();
    return REGEX_PATTERNS.filter((entry) => {
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesSearch =
        !q ||
        entry.name.toLowerCase().includes(q) ||
        entry.pattern.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function handleUsePattern(entry: (typeof REGEX_PATTERNS)[0]) {
    // Preload the test string with both valid and invalid examples to demonstrate how it works
    const exampleText = `--- Valid Matches ---\n${entry.examples.match.join(
      "\n",
    )}\n\n--- Invalid Matches ---\n${entry.examples.noMatch.join("\n")}`;
    onUsePatternAction(entry.pattern, entry.flags, exampleText);
  }

  return (
    <div className="mt-0 space-y-6">
      <div className="space-y-4">
        <SearchInput
          placeholder="Search patterns (e.g. email, UUID, date)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {REGEX_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? "default" : "outline"}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Showing <span className="text-foreground font-semibold">{filteredLibrary.length}</span> of{" "}
        {REGEX_PATTERNS.length} patterns
      </p>

      {filteredLibrary.length === 0 ? (
        <div className="text-muted-foreground border-border rounded-xl border border-dashed py-12 text-center text-sm">
          No patterns found for &ldquo;{search}&rdquo;
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredLibrary.map((entry) => {
            return (
              <Card key={entry.name} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-foreground leading-snug font-semibold">{entry.name}</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 rounded-full ${CATEGORY_COLORS[entry.category]}`}
                      >
                        {entry.category}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <CopyButton iconOnly variant="outline" textToCopy={entry.pattern} />

                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => handleUsePattern(entry)}
                        title="Use in Tester"
                      >
                        <FlaskIcon weight="duotone" />
                      </Button>
                    </div>
                  </div>

                  <div
                    className="bg-muted/40 border-border cursor-pointer overflow-x-auto rounded-lg border px-3 py-2"
                    onClick={() => navigator.clipboard.writeText(entry.pattern)}
                    title="Click to copy"
                  >
                    <code className="text-primary font-mono text-xs break-all">
                      /{entry.pattern}/{entry.flags}
                    </code>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {entry.description}
                  </p>

                  <div className="border-border mt-auto space-y-1.5 border-t pt-3">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Examples
                    </p>
                    <div className="space-y-1">
                      {entry.examples.match.map((ex) => (
                        <div key={ex} className="flex items-center gap-2">
                          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500/70" />
                          <span className="font-mono text-xs break-all text-green-400">{ex}</span>
                        </div>
                      ))}
                      {entry.examples.noMatch.slice(0, 2).map((ex) => (
                        <div key={ex} className="flex items-center gap-2">
                          <span className="bg-destructive/80 mt-0.5 h-2 w-2 shrink-0 rounded-full" />
                          <span className="text-muted-foreground font-mono text-xs break-all">
                            {ex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
