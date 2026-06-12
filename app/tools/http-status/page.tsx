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
      <div className="w-full min-w-0 space-y-8">
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
                  variant={isActive ? "default" : "outline"}
                  size="xs"
                  className="font-mono font-bold tracking-wider"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Result count */}
        <p className="text-muted-foreground text-console">
          {"//"} SHOWING {filtered.length} OF {HTTP_STATUS_CODES.length} CODES AVAILABLE
        </p>
        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="border-border text-muted-foreground border-2 border-dashed py-16 text-center font-mono text-xs">
            &gt; SYSTEM WARNING: ZERO REGISTRY ENTRIES MATCHING &ldquo;{search}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((entry) => {
              const styles = CATEGORY_STYLES[entry.category];
              return (
                <Card
                  key={entry.code}
                  className={cn(
                    "bg-blueprint-card flex h-full flex-col border-2 text-left transition-all duration-150",
                    styles.card,
                  )}
                >
                  {/* Code + badge */}
                  <CardHeader className="bg-background/40 flex flex-row items-center justify-between border-b-2 border-inherit py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-2xl font-bold tracking-tighter tabular-nums",
                          styles.code,
                        )}
                      >
                        {entry.code}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("px-1.5 font-mono text-[10px] font-bold", styles.badge)}
                      >
                        {entry.category}
                      </Badge>
                    </div>
                    <CopyButton iconOnly textToCopy={String(entry.code)} />
                  </CardHeader>

                  <CardContent className="flex-1 p-4">
                    <p className="text-foreground mb-1.5 text-sm font-bold tracking-tight">
                      {entry.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-4 font-mono text-xs leading-relaxed">
                      {entry.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex flex-col items-start">
                    <p className="text-muted-foreground/70 font-mono text-[11px] leading-normal">
                      <span className="text-foreground/40 font-bold">&gt; USE CASE: </span>
                      <span>{entry.useCase}</span>
                    </p>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        <p className="text-muted-foreground/50 text-telemetry pt-4 text-center">
          {"//"} Reference standard source core engine derived from RFC 7231 specifications.
        </p>
      </div>
    </ToolLayout>
  );
}
