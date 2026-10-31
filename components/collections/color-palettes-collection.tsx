"use client";

import {
  ArrowLeftIcon,
  ArrowsCounterClockwiseIcon,
  PaintBrushIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

import { COLOR_PALETTES } from "@/app/tools/color-studio/palette-data";
import { PaletteCard } from "@/components/color-studio/palette-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePaletteBookmarks } from "@/hooks/use-palette-bookmarks";
import { cn } from "@/lib/utils";

const COLOR_COUNTS = [2, 3, 4, 5, 6] as const;

export function ColorPalettesCollection({ onBackAction }: { onBackAction: () => void }) {
  const { bookmarkedSet, isBookmarked, toggleBookmark } = usePaletteBookmarks();
  const { copiedItem, copy } = useCopyToClipboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorCount, setSelectedColorCount] = useState<number | "all">("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // All bookmarked palettes from COLOR_PALETTES
  const savedPalettes = useMemo(() => {
    return COLOR_PALETTES.filter((p) => bookmarkedSet.has(p.name));
  }, [bookmarkedSet]);

  // Distribution of color counts among the saved palettes
  const savedCountDistribution = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of savedPalettes) {
      const len = p.colors.length;
      map[len] = (map[len] || 0) + 1;
    }
    return map;
  }, [savedPalettes]);

  // Filter saved palettes by count and search query
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const cleanHexQuery = normalizedQuery.startsWith("#")
    ? normalizedQuery.slice(1)
    : normalizedQuery;

  const filteredSavedPalettes = useMemo(() => {
    return savedPalettes.filter((palette) => {
      if (selectedColorCount !== "all" && palette.colors.length !== selectedColorCount) {
        return false;
      }
      if (!normalizedQuery) return true;
      if (palette.name.toLowerCase().includes(normalizedQuery)) return true;
      return palette.colors.some((color) => {
        const nameMatch = color.name.toLowerCase().includes(normalizedQuery);
        const hexClean = color.hex.toLowerCase().replace("#", "");
        const hexMatch =
          color.hex.toLowerCase().includes(normalizedQuery) ||
          (cleanHexQuery.length > 0 && hexClean.includes(cleanHexQuery));
        return nameMatch || hexMatch;
      });
    });
  }, [cleanHexQuery, normalizedQuery, savedPalettes, selectedColorCount]);

  const isFiltered = searchQuery.trim().length > 0 || selectedColorCount !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedColorCount("all");
    searchInputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-line flex flex-col gap-3 border-b-[1.5px] pb-4 font-mono sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onBackAction}
            className="border-line hover:bg-surface h-7 gap-1 px-2.5 text-xs font-bold uppercase"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>All Collections</span>
          </Button>
          <h2 className="text-foreground flex items-center gap-2 pt-1 text-xl font-bold tracking-tight uppercase">
            <PaletteIcon className="text-primary size-5" />
            <span>Color Palettes</span>
          </h2>
          <p className="text-muted-foreground font-sans text-xs">
            Your saved color palettes from Color Studio for quick design reference and CSS export.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="border-line bg-surface text-muted-foreground flex items-center gap-1 rounded border-[1.5px] px-2 py-0.5 text-[10px] font-bold uppercase">
            <PaintBrushIcon className="size-3" /> Studio Collection
          </span>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-line hover:bg-surface h-7 gap-1 px-2.5 font-mono text-[11px] font-bold uppercase"
          >
            <Link href="/tools/color-studio">
              <span>Explore Studio</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {savedPalettes.length === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<PaletteIcon className="size-6" />}
          title="No color palettes saved yet"
          description="You haven't bookmarked any color palettes yet. Visit Color Studio to browse 100+ curated palettes and save your favorites."
          action={
            <Button asChild size="sm" className="h-8 gap-1.5 font-mono text-xs font-bold uppercase">
              <Link href="/tools/color-studio">
                <PaintBrushIcon className="size-3.5" />
                <span>Explore Color Studio</span>
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="border-border bg-card/60 flex flex-col gap-4 border-2 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full max-w-lg">
                <SearchInput
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery("")}
                  placeholder="Search saved palettes by name, color, or hex..."
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-3 font-mono text-xs sm:justify-end">
                <span className="text-muted-foreground">
                  Showing{" "}
                  <strong className="text-foreground">{filteredSavedPalettes.length}</strong> of{" "}
                  {savedPalettes.length} saved palettes
                </span>
                {isFiltered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-muted-foreground hover:text-foreground h-8 cursor-pointer gap-1.5 px-2.5 text-xs font-bold"
                  >
                    <ArrowsCounterClockwiseIcon weight="bold" className="size-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Color Count Filter Pills */}
            <div className="border-border/60 flex flex-wrap items-center gap-2 border-t pt-3">
              <span className="text-muted-foreground mr-1 font-mono text-xs font-bold tracking-wider uppercase">
                Palette Size:
              </span>

              <button
                type="button"
                onClick={() => setSelectedColorCount("all")}
                className={cn(
                  "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-bold uppercase transition-all",
                  selectedColorCount === "all"
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground",
                )}
              >
                All ({savedPalettes.length})
              </button>

              {COLOR_COUNTS.map((count) => {
                const totalInCount = savedCountDistribution[count] || 0;
                if (totalInCount === 0) return null;

                const isSelected = selectedColorCount === count;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedColorCount(isSelected ? "all" : count)}
                    className={cn(
                      "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-bold uppercase transition-all",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground",
                    )}
                  >
                    {count} Colors ({totalInCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid or Filtered Empty State */}
          {filteredSavedPalettes.length === 0 ? (
            <EmptyState
              variant="dashed"
              icon={<PaletteIcon className="size-6" />}
              title="No matching saved palettes"
              description={`No saved palettes match your search "${searchQuery}".`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="font-mono text-xs font-bold uppercase"
                >
                  <ArrowsCounterClockwiseIcon weight="bold" className="mr-1.5 size-3.5" />
                  Reset filters
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSavedPalettes.map((palette) => (
                <PaletteCard
                  key={palette.name}
                  palette={palette}
                  isBookmarked={isBookmarked(palette.name)}
                  onToggleBookmark={() => toggleBookmark(palette.name)}
                  copiedItem={copiedItem}
                  onCopySwatch={copy}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
