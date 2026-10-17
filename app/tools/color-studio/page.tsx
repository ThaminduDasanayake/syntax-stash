"use client";

import {
  ArrowsCounterClockwiseIcon,
  BracketsCurlyIcon,
  CheckIcon,
  CopyIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { COLOR_PALETTES } from "@/app/tools/color-studio/palette-data";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { internalTools } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const COLOR_COUNTS = [2, 3, 4, 5, 6] as const;

export default function ColorStudioPage() {
  const tool = internalTools.find((t) => t.slug === "color-studio");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColorCount, setSelectedColorCount] = useState<number | "all">("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { copiedItem, copy } = useCopyToClipboard();

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

  // Filter palettes by color count and search query (name and hex)
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const cleanHexQuery = normalizedQuery.startsWith("#")
    ? normalizedQuery.slice(1)
    : normalizedQuery;

  const filteredPalettes = useMemo(() => {
    return COLOR_PALETTES.filter((palette) => {
      // 1. Filter by color count
      if (selectedColorCount !== "all" && palette.colors.length !== selectedColorCount) {
        return false;
      }

      // 2. Filter by search query (name and hex)
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
  }, [cleanHexQuery, normalizedQuery, selectedColorCount]);

  const isFiltered = searchQuery.trim().length > 0 || selectedColorCount !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedColorCount("all");
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

            <div className="flex items-center justify-between gap-3 font-mono text-xs sm:justify-end">
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

          {/* Color Count Filter Pills */}
          <div className="border-border/60 flex flex-wrap items-center gap-2 border-t pt-3">
            <span className="text-muted-foreground mr-1 font-mono text-xs font-bold tracking-wider uppercase">
              Palette Size:
            </span>

            <button
              type="button"
              onClick={() => setSelectedColorCount("all")}
              className={cn(
                "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-bold transition-all uppercase",
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
                    "cursor-pointer border-2 px-3 py-1 font-mono text-xs font-bold transition-all uppercase",
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
        </div>

        {/* Empty State */}
        {filteredPalettes.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<PaletteIcon weight="duotone" className="size-6" />}
            title="No palettes found"
            description={
              searchQuery
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
            {filteredPalettes.map((palette) => {
              const cssLines = palette.colors
                .map((c) => `  --${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
                .join("\n");

              const tailwindLines = palette.colors
                .map((c) => `  --color-${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
                .join("\n");

              const combinedCode = `:root {\n${cssLines}\n}\n\n@theme inline {\n${tailwindLines}\n}`;

              return (
                <Card
                  key={palette.name}
                  className="hover:ring-muted-foreground transform ring-2 duration-200 hover:-translate-y-1 hover:scale-100"
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-lg font-bold tracking-tight">{palette.name}</h3>
                      <span className="text-muted-foreground font-mono text-xs font-semibold">
                        {palette.colors.length} colors
                      </span>
                    </div>

                    {/* Export Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="font-bold">
                          <BracketsCurlyIcon weight="bold" />
                          Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle className="text-mono-sm">
                            Palette name: &quot;{palette.name}&quot;
                          </DialogTitle>
                        </DialogHeader>
                        <div className="bg-card overflow-hidden border-2">
                          <div className="bg-muted/30 flex items-center justify-between border-b-2 px-4 py-2">
                            <h4 className="text-mono-xs">{"//"} Combined CSS Properties</h4>
                            <CopyButton iconOnly textToCopy={combinedCode} />
                          </div>
                          <div className="max-h-[50vh] overflow-x-auto p-4">
                            <pre className="text-foreground font-mono text-xs leading-relaxed">
                              <code>{combinedCode}</code>
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>

                  {/* Dynamic Bento Box Layout inside the Card */}
                  <CardContent className="grid flex-1 grid-cols-3 grid-rows-3 gap-1.5">
                    {palette.colors.map((color, i) => {
                      const swatchKey = `${palette.name}-${color.hex}-${i}`;
                      const isCopied = copiedItem === swatchKey;

                      return (
                        <div
                          key={i}
                          onClick={() => copy(color.hex, swatchKey)}
                          title={`Click to copy ${color.hex}`}
                          className={cn(
                            "border-border/30 group/swatch relative flex min-h-24 cursor-pointer flex-col justify-between rounded-none border-[1.5px] p-3 font-mono transition-all duration-100 select-none hover:brightness-105 active:scale-[0.99]",
                            color.textColor === "black" ? "text-black" : "text-white",
                            color.colSpan,
                          )}
                          style={{
                            backgroundColor: color.hex,
                          }}
                        >
                          <div className="text-sm font-bold tracking-tight">{color.name}</div>
                          <div className="mt-6 flex items-center justify-between font-mono text-xs font-bold opacity-80 group-hover/swatch:opacity-100">
                            <span>{isCopied ? "Copied!" : color.hex}</span>
                            {isCopied ? (
                              <CheckIcon weight="bold" className="size-3.5" />
                            ) : (
                              <CopyIcon
                                weight="bold"
                                className="size-3 opacity-0 transition-opacity group-hover/swatch:opacity-80"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
