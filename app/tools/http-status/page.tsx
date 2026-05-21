"use client";

import { useMemo, useState } from "react";

import { ToolLayout } from "@/components/tool-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { SearchInput } from "@/components/ui/search-input";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

import {
  CATEGORY_STYLES,
  HTTP_STATUS_CODES,
  STATUS_CATEGORIES,
  STATUS_CATEGORY_LABELS,
  StatusCategory,
} from "./data";

export default function HttpStatusPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return HTTP_STATUS_CODES.filter((entry) => {
      const matchesCategory = activeCategory === "All" || entry.category === activeCategory;
      const matchesSearch =
        !q ||
        String(entry.code).includes(q) ||
        entry.name.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.useCase.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const tool = internalTools.find((t) => t.slug === "http-status");

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Search + filter */}
        <div className="space-y-4">
          <SearchInput
            placeholder="Search by code, name, or description (e.g. 404, redirect, rate limit)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_CATEGORIES.map((cat) => {
              const isAll = cat === "All";
              const label = isAll ? "All" : STATUS_CATEGORY_LABELS[cat as StatusCategory];
              const isActive = activeCategory === cat;
              return (
                <Button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  variant={isActive ? "default" : "secondary"}
                  className="px-3 text-xs"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="text-muted-foreground text-xs">
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of{" "}
          {HTTP_STATUS_CODES.length} codes
        </p>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            No codes found for &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((entry) => {
              const styles = CATEGORY_STYLES[entry.category];
              return (
                <Card
                  key={entry.code}
                  className={cn(
                    "flex h-full flex-col text-left transition-all hover:shadow-sm",
                    styles.card,
                  )}
                >
                  {/* Code + badge */}
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("font-mono text-2xl font-bold tabular-nums", styles.code)}
                      >
                        {entry.code}
                      </span>
                      <Badge variant="outline" className={styles.badge}>
                        {entry.category}
                      </Badge>
                    </div>
                    <CopyButton iconOnly textToCopy={String(entry.code)} />
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-foreground mb-1 text-sm leading-snug font-semibold">
                      {entry.name}
                    </p>
                    <p className="text-muted-foreground mb-3 line-clamp-4 text-xs leading-relaxed">
                      {entry.description}
                    </p>
                  </CardContent>

                  <CardFooter>
                    <p className="text-muted-foreground/70 line-clamp-2 text-xs leading-relaxed">
                      {entry.useCase}
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        <p className="text-muted-foreground text-xs">
          Descriptions based on RFC 7231 and related standards.
        </p>
      </div>
    </ToolLayout>
  );
}
