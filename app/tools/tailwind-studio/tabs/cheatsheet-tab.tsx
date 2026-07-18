"use client";

import { useMemo, useState } from "react";

import { CATEGORIES, TAILWIND_CLASSES } from "@/app/tools/tailwind-studio/cheatsheet-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const CATEGORY_COLORS: Record<string, string> = {
  Borders: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Effects: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Flexbox: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Grid: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Layout: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Sizing: "bg-green-500/10 text-green-400 border-green-500/20",
  Spacing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Transitions: "bg-red-500/10 text-red-400 border-red-500/20",
  Typography: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function CheatsheetTab() {
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
  }, [activeCategory, search]);

  const { copiedItem, copy } = useCopyToClipboard();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchInput
          placeholder="Search classes or CSS (e.g. flex, border-radius, gap)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              key={cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
        {TAILWIND_CLASSES.length} classes
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>CSS Output</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-muted-foreground py-8 text-center text-sm whitespace-normal"
              >
                No classes found for &ldquo;{search}&rdquo;
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((entry) => (
              <TableRow
                key={entry.className}
                onClick={() => copy(entry.className, entry.className)}
                className="cursor-pointer"
              >
                <TableCell className="font-mono text-sm font-semibold">
                  <span
                    className={copiedItem === entry.className ? "text-primary" : "text-foreground"}
                  >
                    {copiedItem === entry.className ? "Copied!" : entry.className}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs whitespace-normal">
                  {entry.css}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`rounded-full ${CATEGORY_COLORS[entry.category] ?? "border-border text-muted-foreground"}`}
                  >
                    {entry.category}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <p className="text-muted-foreground text-xs">
        Click any row to copy the class name to your clipboard. CSS values are approximate — see{" "}
        <span className="text-primary">tailwindcss.com/docs</span> for full reference.
      </p>
    </div>
  );
}
