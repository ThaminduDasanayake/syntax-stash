"use client";

import {
  ArrowsCounterClockwiseIcon,
  ArrowSquareOutIcon,
  BookmarkSimpleIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { COLOR_PALETTES } from "@/app/tools/color-studio/palette-data";
import { PaletteCard } from "@/components/color-studio/palette-card";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePaletteBookmarks } from "@/hooks/use-palette-bookmarks";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const COLOR_COUNTS = [2, 3, 4, 5, 6] as const;

export default function ColorStudioPage() {
  const tool = internalTools.find((t) => t.slug === "color-studio");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorCount, setSelectedColorCount] = useState<number | "all">("all");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { copiedItem, copy } = useCopyToClipboard();
  const { count: savedCount, isBookmarked, toggleBookmark } = usePaletteBookmarks();

  // Focus search input with '/' keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute distribution of color counts across all palettes
  const countDistribution = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of COLOR_PALETTES) {
      const len = p.colors.length;
      map[len] = (map[len] || 0) + 1;
    }
    return map;
  }, []);

  // Filter palettes by color count, search query (name and hex), and saved status
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const cleanHexQuery = normalizedQuery.startsWith("#")
    ? normalizedQuery.slice(1)
    : normalizedQuery;

  const filteredPalettes = useMemo(() => {
    return COLOR_PALETTES.filter((palette) => {
      // 1. Filter by saved status
      if (showSavedOnly && !isBookmarked(palette.name)) {
        return false;
      }

      // 2. Filter by color count
      if (selectedColorCount !== "all" && palette.colors.length !== selectedColorCount) {
        return false;
      }

      // 3. Filter by search query (name and hex)
      if (!normalizedQuery) {
        return true;
      }

      // Check palette name match
      if (palette.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Check individual color names and hex values
      return palette.colors.some((color) => {
        const nameMatch = color.name.toLowerCase().includes(normalizedQuery);
        const hexClean = color.hex.toLowerCase().replace("#", "");
        const hexMatch =
          color.hex.toLowerCase().includes(normalizedQuery) ||
          (cleanHexQuery.length > 0 && hexClean.includes(cleanHexQuery));

        return nameMatch || hexMatch;
      });
    });
  }, [cleanHexQuery, isBookmarked, normalizedQuery, selectedColorCount, showSavedOnly]);

  const isFiltered = searchQuery.trim().length > 0 || selectedColorCount !== "all" || showSavedOnly;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedColorCount("all");
    setShowSavedOnly(false);
    searchInputRef.current?.focus();
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Search & Filter Controls */}
        <div className="border-border bg-card/60 flex flex-col gap-4 border-2 p-4 sm:p-5">
          {/* Search Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-lg">
              <SearchInput
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search by palette name, color name, or hex (e.g. #FF6044)..."
                shortcut="/"
                className="font-mono text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs sm:justify-end">
              <span className="text-muted-foreground">
                Showing <strong className="text-foreground">{filteredPalettes.length}</strong> of{" "}
                {COLOR_PALETTES.length} palettes
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

          {/* Color Count Filter Pills + Saved Toggle */}
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <div className="flex flex-wrap items-center gap-2">
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
                All ({COLOR_PALETTES.length})
              </button>

              {COLOR_COUNTS.map((count) => {
                const isSelected = selectedColorCount === count;
                const countTotal = countDistribution[count] || 0;

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
                    {count} Colors ({countTotal})
                  </button>
                );
              })}
            </div>

            {/* Saved Palettes Toggle & Link to Saved Page */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSavedOnly((prev) => !prev)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-2 px-3 py-1 font-mono text-xs font-bold uppercase transition-all",
                  showSavedOnly
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/60 hover:text-foreground",
                )}
              >
                <BookmarkSimpleIcon weight={showSavedOnly ? "fill" : "bold"} className="size-3.5" />
                <span>Saved ({savedCount})</span>
              </button>

              {savedCount > 0 && (
                <Link
                  href="/saved?tab=collections&collection=color-palettes"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-mono text-xs font-bold transition-colors hover:underline"
                  title="View your saved Color Palettes collection in Saved"
                >
                  <span className="hidden sm:inline">View in Saved</span>
                  <ArrowSquareOutIcon weight="bold" className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredPalettes.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<PaletteIcon weight="duotone" className="size-6" />}
            title={showSavedOnly ? "No saved palettes match" : "No palettes found"}
            description={
              showSavedOnly
                ? savedCount === 0
                  ? "You haven't bookmarked any color palettes yet. Click 'Save' on any palette card to add it to your collection."
                  : "None of your saved palettes match the current search or size filter."
                : searchQuery
                  ? `No palettes matching "${searchQuery}"${
                      selectedColorCount !== "all" ? ` with ${selectedColorCount} colors` : ""
                    }. Try adjusting your search term or color filter.`
                  : `No palettes found with ${selectedColorCount} colors.`
            }
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
          /* Palette Gallery Grid */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPalettes.map((palette) => (
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
    </ToolLayout>
  );
}
