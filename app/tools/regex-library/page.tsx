"use client";

import { BookOpen, Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { REGEX_CATEGORIES, REGEX_PATTERNS, RegexCategory } from "./data";

const CATEGORY_COLORS: Record<RegexCategory, string> = {
  Validation: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Formats: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Code: "bg-green-500/10 text-green-400 border-green-500/20",
  Numbers: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function RegexLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedPattern, setCopiedPattern] = useState<string | null>(null);

  const filtered = useMemo(() => {
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

  function copyPattern(pattern: string) {
    navigator.clipboard.writeText(pattern);
    setCopiedPattern(pattern);
    setTimeout(() => setCopiedPattern(null), 1500);
  }

  return (
    <ToolLayout
      icon={BookOpen}
      title="Regex Pattern"
      highlight="Library"
      description="A curated library of 30+ production-ready regex patterns. Click any pattern to copy it, or open it in the Regex Tester."
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Search + Category filter */}
        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patterns (e.g. email, UUID, date)…"
            className="h-11"
          />
          <div className="flex flex-wrap gap-2">
            {REGEX_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <p className="text-muted-foreground text-xs">
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {REGEX_PATTERNS.length} patterns
        </p>

        {/* Pattern cards */}
        {filtered.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            No patterns found for &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((entry) => {
              const isCopied = copiedPattern === entry.pattern;
              return (
                <Card key={entry.name} className="flex flex-col">
                  <CardContent className="flex flex-1 flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-foreground font-semibold leading-snug">{entry.name}</p>
                        <span
                          className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[entry.category]}`}
                        >
                          {entry.category}
                        </span>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => copyPattern(entry.pattern)}
                          title="Copy pattern"
                          className="border-border text-muted-foreground hover:border-primary hover:text-foreground rounded-lg border p-1.5 transition-colors"
                        >
                          {isCopied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                        </button>
                        <Link
                          href={`/tools/regex-tester?pattern=${encodeURIComponent(entry.pattern)}`}
                          title="Open in Regex Tester"
                          className="border-border text-muted-foreground hover:border-primary hover:text-foreground rounded-lg border p-1.5 transition-colors"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>

                    {/* Pattern */}
                    <div
                      className="bg-muted/40 border-border cursor-pointer overflow-x-auto rounded-lg border px-3 py-2"
                      onClick={() => copyPattern(entry.pattern)}
                      title="Click to copy"
                    >
                      <code className="text-primary font-mono text-xs break-all">
                        /{entry.pattern}/{entry.flags}
                      </code>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-xs leading-relaxed">{entry.description}</p>

                    {/* Examples */}
                    <div className="mt-auto space-y-1.5 border-t border-border pt-3">
                      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Examples</p>
                      <div className="space-y-1">
                        {entry.examples.match.map((ex) => (
                          <div key={ex} className="flex items-center gap-2">
                            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-green-500/70" />
                            <span className="font-mono text-xs text-green-400 break-all">{ex}</span>
                          </div>
                        ))}
                        {entry.examples.noMatch.slice(0, 2).map((ex) => (
                          <div key={ex} className="flex items-center gap-2">
                            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500/70" />
                            <span className="text-muted-foreground font-mono text-xs break-all">{ex}</span>
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

        <p className="text-muted-foreground text-xs">
          Click a pattern or the copy button to copy. Use{" "}
          <ExternalLink size={11} className="inline" /> to open a pattern in the Regex Tester.
        </p>
      </div>
    </ToolLayout>
  );
}
