"use client";

import {
  ArrowsCounterClockwiseIcon,
  BookmarkSimpleIcon,
  CaretUpIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { TagOption } from "./tag-filter-popover";

export interface CategoryOption {
  count?: number;
  name: string;
}

export interface FloatingFilterDockProps {
  activeCategory: string | null;
  availableTags: TagOption[];
  categories: string[];
  categoryTotals: Map<string, number>;
  filteredCount: number;
  initialCategory?: string;
  itemLabel?: string;
  matchMode: "any" | "all";
  onCategoryChange: (category: string | null) => void;
  onClearSearch: () => void;
  onClearTags: () => void;
  onMatchModeChange: (mode: "any" | "all") => void;
  onResetAll: () => void;
  onSavedToggle?: () => void;
  onSearchChange: (query: string) => void;
  onToggleTag: (tag: string) => void;
  savedCount?: number;
  savedOnly?: boolean;
  searchPlaceholder?: string;
  searchQuery: string;
  selectedTags: string[];
  totalCount: number;
}

function CategoryPickerContent({
  activeCategory,
  categories,
  categoryTotals,
  onSelectCategory,
  totalCount,
}: {
  activeCategory: string | null;
  categories: string[];
  categoryTotals: Map<string, number>;
  onSelectCategory: (cat: string | null) => void;
  totalCount: number;
}) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, search]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-border bg-popover flex items-center justify-between rounded-t-2xl border-b-[1.5px] px-4 py-3 sm:px-3 sm:py-2.5">
        <div className="flex items-center gap-2">
          <SquaresFourIcon weight="bold" className="text-primary size-4" />
          <span className="text-mono-xs font-bold tracking-wider uppercase">Filter by Category</span>
        </div>
        {activeCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="text-ink-mute hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-xs underline underline-offset-2 transition-colors sm:text-[11px]"
          >
            <XIcon weight="bold" className="size-3.5" />
            <span>Show All</span>
          </button>
        )}
      </div>

      <Command className="bg-popover rounded-t-none rounded-b-2xl border-none">
        <CommandInput
          placeholder="Search categories..."
          value={search}
          onValueChange={setSearch}
          className="text-mono-xs h-10 border-none py-2.5 sm:h-9 sm:py-2"
        />

        <CommandList className="no-scrollbar max-h-72 overflow-y-auto p-1.5 sm:max-h-60">
          <CommandEmpty className="text-muted-foreground py-6 text-center font-mono text-xs">
            No category found.
          </CommandEmpty>

          <CommandGroup>
            {/* All Categories Option */}
            <CommandItem
              value="all_categories_option"
              onSelect={() => onSelectCategory(null)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-mono text-xs transition-colors sm:px-2.5 sm:py-1.5",
                !activeCategory
                  ? "bg-primary/10 text-foreground font-bold"
                  : "hover:bg-muted/60 text-foreground/80",
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex size-4 items-center justify-center rounded-md border-[1.5px] transition-colors sm:size-3.5",
                    !activeCategory ? "border-foreground bg-foreground text-paper" : "border-border bg-card",
                  )}
                >
                  {!activeCategory && <CheckIcon weight="bold" className="size-3 sm:size-2.5" />}
                </div>
                <span>All Categories</span>
              </div>
              <span className="text-muted-foreground ml-2 font-mono text-xs tabular-nums sm:text-[10px]">
                ({totalCount})
              </span>
            </CommandItem>

            {/* Individual Categories */}
            {filteredCategories.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = categoryTotals.get(cat) ?? 0;

              return (
                <CommandItem
                  key={cat}
                  value={cat}
                  onSelect={() => onSelectCategory(cat)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-mono text-xs transition-colors sm:px-2.5 sm:py-1.5",
                    isSelected
                      ? "bg-primary/10 text-foreground font-bold"
                      : "hover:bg-muted/60 text-foreground/80",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-md border-[1.5px] transition-colors sm:size-3.5",
                        isSelected ? "border-foreground bg-foreground text-paper" : "border-border bg-card",
                      )}
                    >
                      {isSelected && <CheckIcon weight="bold" className="size-3 sm:size-2.5" />}
                    </div>
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className="text-muted-foreground ml-2 font-mono text-xs tabular-nums sm:text-[10px]">
                    ({count})
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export function FloatingFilterDock({
  activeCategory,
  availableTags,
  categories,
  categoryTotals,
  filteredCount,
  initialCategory,
  itemLabel = "Resources",
  matchMode,
  onCategoryChange,
  onClearSearch,
  onClearTags,
  onMatchModeChange,
  onResetAll,
  onSavedToggle,
  onSearchChange,
  onToggleTag,
  savedOnly = false,
  searchPlaceholder = "Search resources...",
  searchQuery,
  selectedTags,
  totalCount,
}: FloatingFilterDockProps) {
  const isMobile = useIsMobile();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  const hasSearch = Boolean(searchQuery.trim());
  const hasCategory = Boolean(activeCategory && !initialCategory);
  const hasTags = selectedTags.length > 0;
  const hasActiveFilters = hasSearch || hasCategory || hasTags || savedOnly;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto border-white/12 bg-[#121214]/90 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex max-w-full items-center gap-1.5 rounded-2xl border-[1.5px] p-1.5 font-mono text-xs backdrop-blur-2xl transition-all sm:gap-2 sm:p-2">
        {/* 1. Interactive Search Box */}
        <div className="border-white/10 bg-white/4 focus-within:border-primary/50 focus-within:bg-white/8 relative flex h-9 w-32 items-center rounded-xl border-[1.5px] px-2.5 transition-all duration-200 sm:h-9.5 sm:w-56 md:focus-within:w-64">
          <MagnifyingGlassIcon
            weight="bold"
            className="text-muted-foreground mr-1.5 size-3.5 shrink-0"
          />
          <input
            type="text"
            placeholder={isMobile ? "Search..." : searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-foreground placeholder:text-muted-foreground/70 h-full w-full bg-transparent text-xs outline-none"
          />
          {hasSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-muted-foreground hover:text-foreground ml-1 shrink-0 p-0.5"
              aria-label="Clear search"
            >
              <XIcon weight="bold" className="size-3.5" />
            </button>
          )}
        </div>

        {/* 2. Category Selector (Popover / Sheet) */}
        {!initialCategory && (
          <>
            {isMobile ? (
              <Sheet open={categoryOpen} onOpenChange={setCategoryOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 rounded-xl border-[1.5px] px-2.5 font-mono text-xs font-semibold sm:h-9.5 sm:px-3",
                      hasCategory
                        ? "border-primary/50 bg-primary/10 text-primary font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <SquaresFourIcon weight="bold" className="size-4 shrink-0" />
                    <span className="max-w-20 truncate sm:max-w-32">
                      {activeCategory || "Categories"}
                    </span>
                    <CaretUpIcon weight="bold" className="size-3 opacity-60" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="border-border bg-popover z-70 max-h-[85vh] rounded-t-3xl border-t p-0 font-mono text-xs"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Categories</SheetTitle>
                    <SheetDescription>Filter by category</SheetDescription>
                  </SheetHeader>
                  <CategoryPickerContent
                    activeCategory={activeCategory}
                    categories={categories}
                    categoryTotals={categoryTotals}
                    onSelectCategory={(cat) => {
                      onCategoryChange(cat);
                      setCategoryOpen(false);
                    }}
                    totalCount={totalCount}
                  />
                </SheetContent>
              </Sheet>
            ) : (
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9.5 gap-1.5 rounded-xl border-[1.5px] px-3 font-mono text-xs font-semibold transition-all",
                      hasCategory
                        ? "border-primary/50 bg-primary/10 text-primary font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <SquaresFourIcon weight="bold" className="size-4 shrink-0" />
                    <span className="max-w-36 truncate">
                      {activeCategory || "All Categories"}
                    </span>
                    <CaretUpIcon weight="bold" className="size-3 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="border-border bg-popover text-popover-foreground z-70 w-80 rounded-2xl border-[1.5px] p-0 font-mono text-xs shadow-2xl"
                >
                  <CategoryPickerContent
                    activeCategory={activeCategory}
                    categories={categories}
                    categoryTotals={categoryTotals}
                    onSelectCategory={(cat) => {
                      onCategoryChange(cat);
                      setCategoryOpen(false);
                    }}
                    totalCount={totalCount}
                  />
                </PopoverContent>
              </Popover>
            )}
          </>
        )}

        {/* 3. Tags Filter Button & Popover */}
        {availableTags.length > 0 && (
          <>
            {isMobile ? (
              <Sheet open={tagsOpen} onOpenChange={setTagsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 gap-1.5 rounded-xl border-[1.5px] px-2.5 font-mono text-xs font-semibold sm:h-9.5 sm:px-3",
                      hasTags
                        ? "border-brand-purple/50 bg-brand-purple/15 text-brand-purple font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <TagIcon weight={hasTags ? "fill" : "bold"} className="size-3.5 shrink-0" />
                    <span className="hidden sm:inline">Tags</span>
                    {hasTags && (
                      <span className="bg-brand-purple text-paper flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="border-border bg-popover z-70 max-h-[85vh] rounded-t-3xl border-t p-0 font-mono text-xs"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Filter by Tags</SheetTitle>
                    <SheetDescription>Select tags to filter</SheetDescription>
                  </SheetHeader>
                  <div className="p-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold">Match Mode</span>
                      <div className="flex gap-1">
                        <Button
                          size="xs"
                          variant={matchMode === "any" ? "default" : "outline"}
                          onClick={() => onMatchModeChange("any")}
                        >
                          Any
                        </Button>
                        <Button
                          size="xs"
                          variant={matchMode === "all" ? "default" : "outline"}
                          onClick={() => onMatchModeChange("all")}
                        >
                          All
                        </Button>
                      </div>
                    </div>
                    <div className="no-scrollbar mt-2 max-h-60 overflow-y-auto space-y-1">
                      {availableTags.map((tag) => {
                        const isChecked = selectedTags.includes(tag.name);
                        return (
                          <button
                            key={tag.name}
                            type="button"
                            onClick={() => onToggleTag(tag.name)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg p-2 text-xs",
                              isChecked ? "bg-primary/20 font-bold" : "hover:bg-muted",
                            )}
                          >
                            <span>#{tag.name}</span>
                            <span className="text-muted-foreground">({tag.count})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9.5 gap-1.5 rounded-xl border-[1.5px] px-3 font-mono text-xs font-semibold transition-all",
                      hasTags
                        ? "border-brand-purple/50 bg-brand-purple/15 text-brand-purple font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <TagIcon weight={hasTags ? "fill" : "bold"} className="size-4 shrink-0" />
                    <span>Tags</span>
                    {hasTags && (
                      <span className="bg-brand-purple text-paper flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="border-border bg-popover text-popover-foreground z-70 w-80 rounded-2xl border-[1.5px] p-0 font-mono text-xs shadow-2xl"
                >
                  <div className="flex flex-col">
                    <div className="border-border bg-popover flex items-center justify-between rounded-t-2xl border-b-[1.5px] px-4 py-3 sm:px-3 sm:py-2.5">
                      <div className="flex items-center gap-2">
                        <TagIcon weight="bold" className="text-primary size-4" />
                        <span className="text-mono-xs font-bold tracking-wider uppercase">
                          Filter by Tags
                        </span>
                      </div>
                      {hasTags && (
                        <button
                          type="button"
                          onClick={onClearTags}
                          className="text-ink-mute hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-xs underline underline-offset-2 transition-colors sm:text-[11px]"
                        >
                          <XIcon weight="bold" className="size-3.5" />
                          <span>Clear ({selectedTags.length})</span>
                        </button>
                      )}
                    </div>

                    <div className="border-border/60 bg-muted/40 flex items-center justify-between border-b-[1.5px] px-4 py-2 sm:px-3 sm:py-1.5">
                      <span className="text-muted-foreground font-mono text-[11px]">Match:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onMatchModeChange("any")}
                          className={cn(
                            "cursor-pointer rounded-full border-[1.5px] px-2.5 py-0.5 font-mono text-[10px] uppercase transition-all",
                            matchMode === "any"
                              ? "border-primary bg-primary text-primary-foreground font-bold"
                              : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          Any (OR)
                        </button>
                        <button
                          type="button"
                          onClick={() => onMatchModeChange("all")}
                          className={cn(
                            "cursor-pointer rounded-full border-[1.5px] px-2.5 py-0.5 font-mono text-[10px] uppercase transition-all",
                            matchMode === "all"
                              ? "border-primary bg-primary text-primary-foreground font-bold"
                              : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          All (AND)
                        </button>
                      </div>
                    </div>

                    <Command className="bg-popover rounded-t-none rounded-b-2xl border-none">
                      <CommandInput
                        placeholder="Search tags..."
                        className="text-mono-xs h-9 border-none py-2"
                      />
                      <CommandList className="no-scrollbar max-h-60 overflow-y-auto p-1.5">
                        <CommandEmpty className="text-muted-foreground py-6 text-center font-mono text-xs">
                          No tags found.
                        </CommandEmpty>
                        <CommandGroup>
                          {availableTags.map((tag) => {
                            const isChecked = selectedTags.includes(tag.name);
                            return (
                              <CommandItem
                                key={tag.name}
                                value={tag.name}
                                onSelect={() => onToggleTag(tag.name)}
                                className={cn(
                                  "flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-1.5 font-mono text-xs transition-colors",
                                  isChecked
                                    ? "bg-primary/10 text-foreground font-bold"
                                    : "hover:bg-muted/60 text-foreground/80",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "flex size-3.5 items-center justify-center rounded-md border-[1.5px] transition-colors",
                                      isChecked
                                        ? "border-foreground bg-foreground text-paper"
                                        : "border-border bg-card",
                                    )}
                                  >
                                    {isChecked && <CheckIcon weight="bold" className="size-2.5" />}
                                  </div>
                                  <span>#{tag.name}</span>
                                </div>
                                <span className="text-muted-foreground ml-2 font-mono text-[10px] tabular-nums">
                                  ({tag.count})
                                </span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}

        {/* 4. Saved Bookmarks Toggle */}
        {onSavedToggle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSavedToggle}
                className={cn(
                  "size-9 rounded-xl border-[1.5px] p-0 font-mono transition-all sm:size-9.5",
                  savedOnly
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                )}
                aria-label={savedOnly ? "Show all items" : "Show saved items only"}
              >
                <BookmarkSimpleIcon weight={savedOnly ? "fill" : "bold"} className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={10}>
              <p className="font-mono text-xs">
                {savedOnly ? "Viewing saved bookmarks" : "Filter by saved bookmarks"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* 5. Item Count & Reset Action */}
        <div className="border-white/10 hidden items-center gap-1.5 border-l pl-2 text-zinc-400 sm:flex">
          <span className="text-foreground font-bold tabular-nums">{filteredCount}</span>
          <span className="text-[11px] text-zinc-500">
            {hasActiveFilters ? `of ${totalCount}` : itemLabel.toLowerCase()}
          </span>

          {hasActiveFilters && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-muted-foreground ml-1 flex size-6 cursor-pointer items-center justify-center rounded-lg border border-transparent transition-all active:scale-95"
                  aria-label="Reset all filters"
                >
                  <ArrowsCounterClockwiseIcon weight="bold" className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={10}>
                <p className="font-mono text-xs">Reset all filters</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
