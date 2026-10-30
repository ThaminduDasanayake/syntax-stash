"use client";

import {
  ArrowsCounterClockwiseIcon,
  ArrowsDownUpIcon,
  BookmarkSimpleIcon,
  CaretUpIcon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  MagnifyingGlassIcon,
  SortAscendingIcon,
  SortDescendingIcon,
  SquaresFourIcon,
  StarIcon,
  TagIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Seek } from "@/components/ui/seek";
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

export type SortOption = "default" | "newest" | "stars" | "alpha-asc" | "alpha-desc";

export interface SortOptionItem {
  description: string;
  icon: React.ComponentType<{ className?: string; weight?: "bold" | "fill" | "regular" }>;
  label: string;
  shortLabel: string;
  value: SortOption;
}

/* eslint-disable perfectionist/sort-arrays */
export const USER_SORT_OPTIONS: SortOptionItem[] = [
  {
    description: "Curated category grouping",
    icon: CompassIcon,
    label: "Curated (Default)",
    shortLabel: "Curated",
    value: "default",
  },
  {
    description: "Latest resources added",
    icon: ClockIcon,
    label: "Recently Added",
    shortLabel: "Newest",
    value: "newest",
  },
  {
    description: "Highest GitHub stars",
    icon: StarIcon,
    label: "Most Starred",
    shortLabel: "Stars",
    value: "stars",
  },
  {
    description: "Alphabetical ascending",
    icon: SortAscendingIcon,
    label: "Title (A → Z)",
    shortLabel: "A → Z",
    value: "alpha-asc",
  },
  {
    description: "Alphabetical descending",
    icon: SortDescendingIcon,
    label: "Title (Z → A)",
    shortLabel: "Z → A",
    value: "alpha-desc",
  },
];
/* eslint-enable perfectionist/sort-arrays */

export interface FloatingFilterDockProps {
  activeCategory: string | null;
  activeSort?: SortOption;
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
  onSortChange?: (sort: SortOption) => void;
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
          <SquaresFourIcon weight="bold" className="text-primary size-4" />
          <span className="font-mono text-xs font-bold tracking-wider text-zinc-200 uppercase">
            Categories
          </span>
        </div>
        {activeCategory && (
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-[11px] text-zinc-400 underline underline-offset-2 transition-colors"
          >
            <XIcon weight="bold" className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Minimalist Search Input */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.02] px-3 py-2">
        <MagnifyingGlassIcon weight="bold" className="size-3.5 shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-foreground h-6 w-full bg-transparent text-xs outline-none placeholder:text-zinc-500"
          autoFocus
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="hover:text-foreground cursor-pointer p-0.5 text-zinc-500"
            aria-label="Clear category search"
          >
            <XIcon weight="bold" className="size-3" />
          </button>
        )}
      </div>

      {/* Category Items List */}
      <div className="no-scrollbar max-h-64 space-y-0.5 overflow-y-auto p-1.5 sm:max-h-72">
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
                    ? "bg-primary/15 text-primary font-semibold"
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
                  {!activeCategory && <CheckIcon weight="bold" className="text-primary size-3.5" />}
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
                      ? "bg-primary/15 text-primary font-semibold"
                      : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  <span className="truncate">{cat}</span>
                  <div className="ml-2 flex shrink-0 items-center gap-1.5">
                    <span
                      className={cn(
                        "font-mono text-[11px] tabular-nums",
                        isSelected ? "text-primary/80" : "text-zinc-500",
                      )}
                    >
                      {count}
                    </span>
                    {isSelected && <CheckIcon weight="bold" className="text-primary size-3.5" />}
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
          <TagIcon weight="bold" className="text-brand-purple size-4" />
          <span className="font-mono text-xs font-bold tracking-wider text-zinc-200 uppercase">
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
            className="hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-[11px] text-zinc-400 underline underline-offset-2 transition-colors"
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
              "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase transition-all",
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
              "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase transition-all",
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
        <MagnifyingGlassIcon weight="bold" className="size-3.5 shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-foreground h-6 w-full bg-transparent text-xs outline-none placeholder:text-zinc-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="hover:text-foreground cursor-pointer p-0.5 text-zinc-500"
            aria-label="Clear tags search"
          >
            <XIcon weight="bold" className="size-3" />
          </button>
        )}
      </div>

      {/* Tags List */}
      <div className="no-scrollbar max-h-60 space-y-0.5 overflow-y-auto p-1.5">
        {filteredTags.length === 0 ? (
          <div className="py-6 text-center font-mono text-xs text-zinc-500">No tags found</div>
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
                    ? "bg-brand-purple/20 text-brand-purple font-semibold"
                    : "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
                )}
              >
                <span className="truncate">#{tag.name}</span>
                <div className="ml-2 flex shrink-0 items-center gap-1.5">
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      isChecked ? "text-brand-purple/80" : "text-zinc-500",
                    )}
                  >
                    {tag.count}
                  </span>
                  {isChecked && <CheckIcon weight="bold" className="text-brand-purple size-3.5" />}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SortPickerContent({
  activeSort,
  onSelectSort,
}: {
  activeSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <ArrowsDownUpIcon weight="bold" className="text-primary size-4" />
          <span className="font-mono text-xs font-bold tracking-wider text-zinc-200 uppercase">
            Sort Resources
          </span>
        </div>
        {activeSort !== "default" && (
          <button
            type="button"
            onClick={() => onSelectSort("default")}
            className="hover:text-destructive flex cursor-pointer items-center gap-1 font-mono text-[11px] text-zinc-400 underline underline-offset-2 transition-colors"
          >
            <XIcon weight="bold" className="size-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-0.5 p-1.5 font-mono text-xs">
        {USER_SORT_OPTIONS.map((opt) => {
          const isSelected = activeSort === opt.value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectSort(opt.value)}
              className={cn(
                "group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left transition-colors",
                isSelected
                  ? "border-primary/30 bg-primary/10 text-primary border font-bold"
                  : "border border-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                  weight={isSelected ? "fill" : "bold"}
                  className={cn(
                    "size-4 shrink-0",
                    isSelected ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300",
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{opt.label}</span>
                  <span className="text-[10px] leading-tight font-normal text-zinc-500">
                    {opt.description}
                  </span>
                </div>
              </div>

              {isSelected && (
                <CheckIcon weight="bold" className="text-primary ml-2 size-3.5 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FloatingFilterDock({
  activeCategory,
  activeSort = "default",
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
  onSortChange,
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
  const [sortOpen, setSortOpen] = useState(false);

  const hasSearch = Boolean(searchQuery.trim());
  const hasCategory = Boolean(activeCategory && !initialCategory);
  const hasTags = selectedTags.length > 0;
  const hasSort = Boolean(activeSort && activeSort !== "default");
  const hasActiveFilters = hasSearch || hasCategory || hasTags || savedOnly || hasSort;
  const activeSortOption =
    USER_SORT_OPTIONS.find((s) => s.value === activeSort) || USER_SORT_OPTIONS[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 sm:bottom-6">
      <div className="pointer-events-auto flex max-w-full items-center gap-1.5 rounded-full border-[1.5px] border-white/12 bg-[#0e0e11]/95 p-1.5 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.75),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl transition-all sm:gap-2 sm:p-2">
        {/* 1. Animated Seek Search */}
        <Seek
          size={isMobile ? "sm" : "default"}
          theme="dark"
          placeholder={isMobile ? "Search..." : searchPlaceholder}
          value={searchQuery}
          onChange={(val) => {
            onSearchChange(val);
            if (!val) onClearSearch();
          }}
          width={isMobile ? 180 : 260}
          give={50}
          spring={55}
        />

        {/* 2. Category Selector (Popover / Sheet) */}
        {!initialCategory && (
          <>
            {isMobile ? (
              <Sheet open={categoryOpen} onOpenChange={setCategoryOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-between gap-2 rounded-full border-0 outline-none select-none",
                      "h-11 px-3.5 sm:h-14 sm:px-5",
                      "w-auto max-w-[260px] min-w-[140px] sm:max-w-[340px] sm:min-w-[180px]",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "transition-[transform,background-color,color,box-shadow,width,max-width] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "active:scale-[0.96] [@media(hover:hover)]:hover:scale-[1.02]",
                      hasCategory
                        ? "text-primary font-bold shadow-[0_0_0_1.5px_rgba(var(--primary),0.8),0_4px_16px_rgba(var(--primary),0.25)]"
                        : "font-semibold text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <SquaresFourIcon weight="bold" className="size-4.5 shrink-0 sm:size-5" />
                      <span className="truncate font-sans text-xs font-semibold tracking-tight">
                        {activeCategory || "Categories"}
                      </span>
                    </div>
                    <CaretUpIcon weight="bold" className="size-3.5 shrink-0 opacity-60" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="z-70 max-h-[85vh] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#141416] p-0 font-mono text-xs"
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
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-between gap-2.5 rounded-full border-0 outline-none select-none",
                      "h-11 px-3.5 sm:h-14 sm:px-5",
                      "w-auto max-w-[340px] min-w-[180px]",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "transition-[transform,background-color,color,box-shadow,width,max-width] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "active:scale-[0.96] [@media(hover:hover)]:hover:scale-[1.02]",
                      hasCategory
                        ? "text-primary font-bold shadow-[0_0_0_1.5px_rgba(var(--primary),0.8),0_4px_16px_rgba(var(--primary),0.25)]"
                        : "font-semibold text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <SquaresFourIcon weight="bold" className="size-4.5 shrink-0 sm:size-5" />
                      <span className="truncate font-sans text-xs font-semibold tracking-tight">
                        {activeCategory || "All Categories"}
                      </span>
                    </div>
                    <CaretUpIcon weight="bold" className="size-3.5 shrink-0 opacity-60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="text-popover-foreground z-70 w-72 overflow-hidden rounded-[20px] border-[1.5px] border-white/10 bg-[#121214]/98 p-0 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.08)_inset] backdrop-blur-2xl sm:w-80"
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
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                      "size-11 sm:size-14",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "ease-out-soft transition-[transform,background-color,color,box-shadow] duration-220",
                      "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                      hasTags
                        ? "text-brand-purple shadow-[0_0_0_1.5px_rgba(192,132,252,0.8),0_4px_16px_rgba(192,132,252,0.25)]"
                        : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                    aria-label="Filter by tags"
                  >
                    <TagIcon weight={hasTags ? "fill" : "bold"} className="size-5 sm:size-6" />
                    {hasTags && (
                      <span className="bg-brand-purple text-paper absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
                        {selectedTags.length}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="z-70 max-h-[85vh] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#141416] p-0 font-mono text-xs"
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
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                      "size-11 sm:size-14",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "ease-out-soft transition-[transform,background-color,color,box-shadow] duration-220",
                      "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                      hasTags
                        ? "text-brand-purple shadow-[0_0_0_1.5px_rgba(192,132,252,0.8),0_4px_16px_rgba(192,132,252,0.25)]"
                        : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                    aria-label="Filter by tags"
                  >
                    <TagIcon weight={hasTags ? "fill" : "bold"} className="size-5 sm:size-6" />
                    {hasTags && (
                      <span className="bg-brand-purple text-paper absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
                        {selectedTags.length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="text-popover-foreground z-70 w-72 overflow-hidden rounded-[20px] border-[1.5px] border-white/10 bg-[#121214]/98 p-0 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.08)_inset] backdrop-blur-2xl sm:w-80"
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

        {/* 4. Sort Selector (Popover / Sheet) */}
        {onSortChange && (
          <>
            {isMobile ? (
              <Sheet open={sortOpen} onOpenChange={setSortOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                      "size-11 sm:size-14",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "ease-out-soft transition-[transform,background-color,color,box-shadow] duration-220",
                      "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                      hasSort
                        ? "text-primary shadow-[0_0_0_1.5px_rgba(var(--primary),0.8),0_4px_16px_rgba(var(--primary),0.25)]"
                        : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                    aria-label={hasSort ? `Sorted by ${activeSortOption.label}` : "Sort resources"}
                  >
                    <ArrowsDownUpIcon
                      weight={hasSort ? "bold" : "regular"}
                      className="size-5 sm:size-6"
                    />
                    {hasSort && (
                      <span className="bg-primary absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-[#0e0e11]" />
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  showCloseButton={false}
                  className="z-70 max-h-[85vh] overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#141416] p-0 font-mono text-xs"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Sort Resources</SheetTitle>
                    <SheetDescription>Select sorting order</SheetDescription>
                  </SheetHeader>
                  <SortPickerContent
                    activeSort={activeSort}
                    onSelectSort={(sort) => {
                      onSortChange(sort);
                      setSortOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>
            ) : (
              <Popover open={sortOpen} onOpenChange={setSortOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                      "size-11 sm:size-14",
                      "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                      "ease-out-soft transition-[transform,background-color,color,box-shadow] duration-220",
                      "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                      hasSort
                        ? "text-primary shadow-[0_0_0_1.5px_rgba(var(--primary),0.8),0_4px_16px_rgba(var(--primary),0.25)]"
                        : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                    )}
                    aria-label={hasSort ? `Sorted by ${activeSortOption.label}` : "Sort resources"}
                  >
                    <ArrowsDownUpIcon
                      weight={hasSort ? "bold" : "regular"}
                      className="size-5 sm:size-6"
                    />
                    {hasSort && (
                      <span className="bg-primary absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-[#0e0e11]" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  sideOffset={12}
                  className="text-popover-foreground z-70 w-64 overflow-hidden rounded-[20px] border-[1.5px] border-white/10 bg-[#121214]/98 p-0 shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.08)_inset] backdrop-blur-2xl"
                >
                  <SortPickerContent
                    activeSort={activeSort}
                    onSelectSort={(sort) => {
                      onSortChange(sort);
                      setSortOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </>
        )}

        {/* 5. Saved Bookmarks Toggle */}
        {onSavedToggle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onSavedToggle}
                className={cn(
                  "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                  "size-11 sm:size-14",
                  "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                  "ease-out-soft transition-[transform,background-color,color,box-shadow] duration-220",
                  "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                  savedOnly
                    ? "text-primary shadow-[0_0_0_1.5px_rgba(var(--primary),0.8),0_4px_16px_rgba(var(--primary),0.25)]"
                    : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                )}
                aria-label={savedOnly ? "Show all items" : "Show saved items only"}
              >
                <BookmarkSimpleIcon
                  weight={savedOnly ? "fill" : "bold"}
                  className="size-5 sm:size-6"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={10}>
              <p className="font-mono text-xs">
                {savedOnly ? "Viewing saved bookmarks" : "Filter by saved bookmarks"}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* 5. Item Count & Reset Action */}
        <div className="hidden h-11 shrink-0 items-center gap-3 rounded-full bg-[#1a1a1a] px-4 font-mono text-xs shadow-[0_0_0_1px_rgba(255,255,255,0.12)] sm:flex sm:h-14 sm:px-4.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="font-bold text-white tabular-nums">{filteredCount}</span>
            <span className="truncate text-[11px] text-zinc-500 tabular-nums">
              {hasActiveFilters ? `of ${totalCount}` : itemLabel.toLowerCase()}
            </span>
          </div>

          {hasActiveFilters && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="group/reset hover:bg-destructive/15 hover:text-destructive relative flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.3)] active:scale-90 sm:size-8"
                  aria-label="Reset all filters"
                >
                  <ArrowsCounterClockwiseIcon
                    weight="bold"
                    className="size-3.5 transition-transform duration-300 ease-out group-hover/reset:-rotate-180 sm:size-4"
                  />
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

export default FloatingFilterDock;
