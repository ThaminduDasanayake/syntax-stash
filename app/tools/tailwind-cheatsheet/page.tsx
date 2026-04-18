"use client";

import { Wind } from "lucide-react";
import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Input } from "@/components/ui/input";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { CATEGORIES, TAILWIND_CLASSES } from "./data";

const CATEGORY_COLORS: Record<string, string> = {
  Spacing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Typography: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Sizing: "bg-green-500/10 text-green-400 border-green-500/20",
  Flexbox: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Grid: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Layout: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Borders: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Effects: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Transitions: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function TailwindCheatsheetPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TAILWIND_CLASSES.filter((entry) => {
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesSearch =
        !q || entry.className.toLowerCase().includes(q) || entry.css.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const { copiedItem, copy } = useCopyToClipboard();

  return (
    <ToolLayout
      icon={Wind}
      title="Tailwind CSS"
      highlight="Cheatsheet"
      description="A searchable, filterable reference of the most-used Tailwind utility classes. Click any class to copy it."
      maxWidth="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Search + filter */}
        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes or CSS (e.g. flex, border-radius, gap)…"
            className="h-11"
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
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
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
          {TAILWIND_CLASSES.length} classes
        </p>

        {/* Table */}
        <div className="border-border overflow-hidden rounded-xl border">
          {/* Header */}
          <div className="border-border bg-muted/50 grid grid-cols-[1fr_2fr_auto] border-b px-4 py-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Class
            </span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              CSS Output
            </span>
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Category
            </span>
          </div>

          {/* Rows */}
          <div className="divide-border divide-y">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center text-sm">
                No classes found for &ldquo;{search}&rdquo;
              </div>
            ) : (
              filtered.map((entry) => (
                <button
                  key={entry.className}
                  onClick={() => copy(entry.className, entry.className)}
                  className="hover:bg-muted/30 grid w-full grid-cols-[1fr_2fr_auto] items-center gap-4 px-4 py-2.5 text-left transition-colors"
                >
                  <span
                    className={`font-mono text-sm font-semibold transition-colors ${
                      copiedItem === entry.className ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {copiedItem === entry.className ? "Copied!" : entry.className}
                  </span>
                  <span className="text-muted-foreground truncate font-mono text-xs">
                    {entry.css}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                      CATEGORY_COLORS[entry.category] ?? "border-border text-muted-foreground"
                    }`}
                  >
                    {entry.category}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <p className="text-muted-foreground text-xs">
          Click any row to copy the class name to your clipboard. CSS values are approximate — see{" "}
          <span className="text-primary">tailwindcss.com/docs</span> for full reference.
        </p>
      </div>
    </ToolLayout>
  );
}
