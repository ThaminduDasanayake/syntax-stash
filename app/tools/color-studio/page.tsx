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
import { FluidSearch } from "@/components/ui/fluid-search";
import { SelectBar, type SelectBarItem } from "@/components/ui/select-bar";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { usePaletteBookmarks } from "@/hooks/use-palette-bookmarks";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const COLOR_COUNTS = [2, 3, 4, 5, 6] as const;
const STORAGE_KEY = "syntax_stash_color_palette_size";

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

  // Sync selectedColorCount with URL search param and localStorage across refreshes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sizeParam = params.get("size") || params.get("colors");
      if (sizeParam) {
        if (sizeParam === "all") {
          setSelectedColorCount("all");
          return;
        }
        const num = parseInt(sizeParam, 10);
        if ((COLOR_COUNTS as readonly number[]).includes(num)) {
          setSelectedColorCount(num);
          return;
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        if (saved === "all") {
          setSelectedColorCount("all");
        } else {
          const num = parseInt(saved, 10);
          if ((COLOR_COUNTS as readonly number[]).includes(num)) {
            setSelectedColorCount(num);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleColorCountChange = (val: string) => {
    const nextVal: number | "all" = val === "all" ? "all" : parseInt(val, 10);
    setSelectedColorCount(nextVal);
    try {
      localStorage.setItem(STORAGE_KEY, val);
      const url = new URL(window.location.href);
      if (val === "all") {
        url.searchParams.delete("size");
        url.searchParams.delete("colors");
      } else {
        url.searchParams.set("size", val);
      }
      window.history.replaceState(null, "", url.toString());
    } catch {
      // Ignore errors
    }
  };

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
    try {
      localStorage.removeItem(STORAGE_KEY);
      const url = new URL(window.location.href);
      url.searchParams.delete("size");
      url.searchParams.delete("colors");
      window.history.replaceState(null, "", url.toString());
    } catch {
      // Ignore errors
    }
  };

  const selectBarItems: SelectBarItem<string>[] = useMemo(
    () => [
      { key: "all", label: `All (${COLOR_PALETTES.length})` },
      ...COLOR_COUNTS.map((count) => ({
        key: String(count),
        label: `${count} Colors (${countDistribution[count] || 0})`,
      })),
    ],
    [countDistribution],
  );

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-8">
        {/* Search & Filter Controls */}
        <div className="border-border/80 bg-card/60 flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:p-5">
          {/* Search Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-lg">
              <FluidSearch
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
                placeholder="Search by palette name, color name, or hex (e.g. #FF6044)..."
                shortcut="/"
                className="font-mono text-xs"
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
                  className="text-muted-foreground hover:text-foreground h-8 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
                >
                  <ArrowsCounterClockwiseIcon weight="bold" className="size-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Color Count Filter Pills + Saved Toggle */}
          <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-muted-foreground mr-1 font-mono text-xs font-bold tracking-wider uppercase">
                Palette Size:
              </span>

              <SelectBar<string>
                items={selectBarItems}
                value={String(selectedColorCount)}
                onChange={handleColorCountChange}
                size="sm"
                className="font-mono text-xs"
              />
            </div>

            {/* Saved Palettes Toggle & Link to Saved Page */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSavedOnly((prev) => !prev)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition-all",
                  showSavedOnly
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground border-white/10 bg-[#252525] hover:border-white/20",
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
