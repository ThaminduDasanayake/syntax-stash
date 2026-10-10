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
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <SquaresFourIcon weight="bold" className="size-4 text-primary" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
            Categories
          </span>
        </div>
        {activeCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="flex cursor-pointer items-center gap-1 font-mono text-[11px] text-zinc-400 underline underline-offset-2 transition-colors hover:text-destructive"
          >
            <XIcon weight="bold" className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Minimalist Search Input */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.02] px-3 py-2">
        <MagnifyingGlassIcon weight="bold" className="size-3.5 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-6 w-full bg-transparent text-xs text-foreground placeholder:text-zinc-500 outline-none"
          autoFocus
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-zinc-500 hover:text-foreground p-0.5 cursor-pointer"
            aria-label="Clear category search"
          >
            <XIcon weight="bold" className="size-3" />
          </button>
        )}
      </div>

      {/* Category Items List */}
      <div className="no-scrollbar max-h-64 overflow-y-auto p-1.5 space-y-0.5 sm:max-h-72">
        {filteredCategories.length === 0 ? (
          <div className="py-6 text-center font-mono text-xs text-zinc-500">
            No categories found
          </div>
        ) : (
          <>
            {/* All Categories Option */}
            {(!search || "all categories".includes(search.toLowerCase())) && (
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                  !activeCategory
                    ? "bg-primary/15 font-semibold text-primary"
                    : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span>All Categories</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      !activeCategory ? "text-primary/80" : "text-zinc-500",
                    )}
                  >
                    {totalCount}
                  </span>
                  {!activeCategory && <CheckIcon weight="bold" className="size-3.5 text-primary" />}
                </div>
              </button>
            )}

            {/* Individual Categories */}
            {filteredCategories.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = categoryTotals.get(cat) ?? 0;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? null : cat)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-primary/15 font-semibold text-primary"
                      : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  <span className="truncate">{cat}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span
                      className={cn(
                        "font-mono text-[11px] tabular-nums",
                        isSelected ? "text-primary/80" : "text-zinc-500",
                      )}
                    >
                      {count}
                    </span>
                    {isSelected && <CheckIcon weight="bold" className="size-3.5 text-primary" />}
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function TagPickerContent({
  availableTags,
  matchMode,
  onClearTags,
  onMatchModeChange,
  onToggleTag,
  selectedTags,
}: {
  availableTags: TagOption[];
  matchMode: "any" | "all";
  onClearTags: () => void;
  onMatchModeChange: (mode: "any" | "all") => void;
  onToggleTag: (tag: string) => void;
  selectedTags: string[];
}) {
  const [search, setSearch] = useState("");

  const filteredTags = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return availableTags;
    return availableTags.filter((t) => t.name.toLowerCase().includes(q));
  }, [availableTags, search]);

  const hasTags = selectedTags.length > 0;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <TagIcon weight="bold" className="size-4 text-brand-purple" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
            Tags
          </span>
          {hasTags && (
            <span className="bg-brand-purple text-paper flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold">
              {selectedTags.length}
            </span>
          )}
        </div>
        {hasTags && (
          <button
            type="button"
            onClick={onClearTags}
            className="flex cursor-pointer items-center gap-1 font-mono text-[11px] text-zinc-400 underline underline-offset-2 transition-colors hover:text-destructive"
          >
            <XIcon weight="bold" className="size-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Match Mode Toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5">
        <span className="font-mono text-[11px] text-zinc-400">Match mode:</span>
        <div className="flex rounded-lg bg-white/[0.06] p-0.5">
          <button
            type="button"
            onClick={() => onMatchModeChange("any")}
            className={cn(
              "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] uppercase font-semibold transition-all",
              matchMode === "any"
                ? "bg-brand-purple text-paper shadow-sm"
                : "text-zinc-400 hover:text-white",
            )}
          >
            Any (OR)
          </button>
          <button
            type="button"
            onClick={() => onMatchModeChange("all")}
            className={cn(
              "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] uppercase font-semibold transition-all",
              matchMode === "all"
                ? "bg-brand-purple text-paper shadow-sm"
                : "text-zinc-400 hover:text-white",
            )}
          >
            All (AND)
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.02] px-3 py-2">
        <MagnifyingGlassIcon weight="bold" className="size-3.5 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-6 w-full bg-transparent text-xs text-foreground placeholder:text-zinc-500 outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-zinc-500 hover:text-foreground p-0.5 cursor-pointer"
            aria-label="Clear tags search"
          >
            <XIcon weight="bold" className="size-3" />
          </button>
        )}
      </div>

      {/* Tags List */}
      <div className="no-scrollbar max-h-60 overflow-y-auto p-1.5 space-y-0.5">
        {filteredTags.length === 0 ? (
          <div className="py-6 text-center font-mono text-xs text-zinc-500">
            No tags found
          </div>
        ) : (
          filteredTags.map((tag) => {
            const isChecked = selectedTags.includes(tag.name);

            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => onToggleTag(tag.name)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                  isChecked
                    ? "bg-brand-purple/20 font-semibold text-brand-purple"
                    : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span className="truncate">#{tag.name}</span>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      isChecked ? "text-brand-purple/80" : "text-zinc-500",
                    )}
                  >
                    {tag.count}
                  </span>
                  {isChecked && (
                    <CheckIcon weight="bold" className="size-3.5 text-brand-purple" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
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
        <div className="border-white/10 bg-white/4 focus-within:border-primary/50 focus-within:bg-white/8 relative flex h-9 w-32 items-center rounded-xl border-[1.5px] px-2.5 transition-all duration-200 sm:h-9.5 sm:w-64 md:focus-within:w-72">
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
              className="text-muted-foreground hover:text-foreground ml-1 shrink-0 p-0.5 cursor-pointer"
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
                      "h-9 w-32 sm:w-44 justify-between gap-1.5 rounded-xl border-[1.5px] px-2.5 font-mono text-xs font-semibold sm:h-9.5 sm:px-3",
                      hasCategory
                        ? "border-primary/50 bg-primary/10 text-primary font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                      <SquaresFourIcon weight="bold" className="size-4 shrink-0" />
                      <span className="truncate">
                        {activeCategory || "Categories"}
                      </span>
                    </div>
                    <CaretUpIcon weight="bold" className="size-3 shrink-0 opacity-60" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="border-white/10 bg-[#141416] z-70 max-h-[85vh] rounded-t-3xl border-t p-0 font-mono text-xs overflow-hidden"
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
                      "h-9.5 w-52 sm:w-56 md:w-60 justify-between gap-1.5 rounded-xl border-[1.5px] px-3 font-mono text-xs font-semibold transition-all",
                      hasCategory
                        ? "border-primary/50 bg-primary/10 text-primary font-bold"
                        : "border-white/10 bg-white/4 text-zinc-300 hover:border-white/20 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                      <SquaresFourIcon weight="bold" className="size-4 shrink-0" />
                      <span className="truncate">
                        {activeCategory || "All Categories"}
                      </span>
                    </div>
                    <CaretUpIcon weight="bold" className="size-3 shrink-0 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="border-white/10 bg-[#141416]/95 backdrop-blur-2xl text-popover-foreground z-70 w-72 sm:w-80 rounded-2xl border-[1.5px] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
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
                  className="border-white/10 bg-[#141416] z-70 max-h-[85vh] rounded-t-3xl border-t p-0 font-mono text-xs overflow-hidden"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Filter by Tags</SheetTitle>
                    <SheetDescription>Select tags to filter</SheetDescription>
                  </SheetHeader>
                  <TagPickerContent
                    availableTags={availableTags}
                    matchMode={matchMode}
                    onClearTags={onClearTags}
                    onMatchModeChange={onMatchModeChange}
                    onToggleTag={onToggleTag}
                    selectedTags={selectedTags}
                  />
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
                  className="border-white/10 bg-[#141416]/95 backdrop-blur-2xl text-popover-foreground z-70 w-72 sm:w-80 rounded-2xl border-[1.5px] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  <TagPickerContent
                    availableTags={availableTags}
                    matchMode={matchMode}
                    onClearTags={onClearTags}
                    onMatchModeChange={onMatchModeChange}
                    onToggleTag={onToggleTag}
                    selectedTags={selectedTags}
                  />
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
