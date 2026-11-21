"use client";

import {
  CaretDownIcon,
  CheckIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useId, useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface CategoryOption {
  count: number;
  name: string;
}

export interface CategoryMegaFilterProps {
  categories: CategoryOption[];
  className?: string;
  disabled?: boolean;
  label?: string;
  onValueChange: (value: string) => void;
  totalResourcesCount: number;
  triggerClassName?: string;
  value: string;
}

export function CategoryMegaFilter({
  categories,
  className,
  disabled = false,
  label = "Category:",
  onValueChange,
  totalResourcesCount,
  triggerClassName,
  value,
}: CategoryMegaFilterProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputId = useId();

  const isAllSelected = value === "all" || !value;

  const currentCategory = useMemo(() => {
    if (isAllSelected) return null;
    return categories.find((c) => c.name === value) || null;
  }, [categories, isAllSelected, value]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const handleSelect = (categoryValue: string) => {
    onValueChange(categoryValue);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <FunnelIcon weight="duotone" className="text-accent size-6 shrink-0" />
      <span className="text-muted-foreground text-[11px] font-bold uppercase">{label}</span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "group flex h-8 min-w-[200px] max-w-[300px] cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background/50 px-2.5 font-mono text-xs shadow-xs transition-all outline-none",
              "hover:bg-surface focus-visible:border-brand-purple/50 focus-visible:ring-1 focus-visible:ring-brand-purple/50",
              open && "border-brand-purple/50 ring-1 ring-brand-purple/50 bg-surface",
              disabled && "cursor-not-allowed opacity-50",
              triggerClassName,
            )}
            aria-expanded={open}
            aria-label="Filter by category"
          >
            <div className="flex min-w-0 items-center gap-1.5 truncate">
              {isAllSelected ? (
                <>
                  <span className="truncate text-foreground font-medium">All Categories</span>
                  <span className="text-muted-foreground text-[10px] tabular-nums font-semibold">
                    ({totalResourcesCount})
                  </span>
                </>
              ) : (
                <>
                  <span className="truncate text-brand-purple font-semibold">
                    {currentCategory?.name || value}
                  </span>
                  {currentCategory && (
                    <span className="text-brand-purple/80 text-[10px] tabular-nums font-semibold">
                      ({currentCategory.count})
                    </span>
                  )}
                </>
              )}
            </div>

            <CaretDownIcon
              weight="bold"
              className={cn(
                "size-3 text-muted-foreground shrink-0 transition-transform duration-200",
                open && "rotate-180 text-foreground",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="z-70 w-[calc(100vw-2rem)] max-w-4xl lg:max-w-5xl rounded-2xl border-[1.5px] border-white/12 bg-[#0e0e11]/98 p-0 font-mono text-xs shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Quick Search */}
            <div className="relative flex-1 max-w-sm">
              <label htmlFor={inputId} className="sr-only">
                Filter categories
              </label>
              <MagnifyingGlassIcon
                weight="bold"
                className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
              />
              <input
                id={inputId}
                type="text"
                placeholder="Search 21 categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-lg border border-white/10 bg-[#161619] pl-8 pr-7 font-sans text-xs text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/60"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
                  aria-label="Clear category search"
                >
                  <XIcon weight="bold" className="size-3" />
                </button>
              )}
            </div>

            {/* All Categories Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs transition-all",
                  isAllSelected
                    ? "border-brand-purple/60 bg-brand-purple text-paper font-bold shadow-[0_0_12px_rgba(192,132,252,0.3)]"
                    : "border-white/10 bg-[#161619] text-zinc-300 hover:border-white/20 hover:bg-[#1f1f25] hover:text-white",
                )}
              >
                <SquaresFourIcon weight={isAllSelected ? "fill" : "bold"} className="size-3.5" />
                <span>All Categories</span>
                <span
                  className={cn(
                    "rounded-sm px-1 text-[10px] tabular-nums font-semibold",
                    isAllSelected ? "bg-black/30 text-white" : "bg-white/5 text-zinc-400",
                  )}
                >
                  {totalResourcesCount}
                </span>
                {isAllSelected && <CheckIcon weight="bold" className="size-3" />}
              </button>

              {!isAllSelected && (
                <button
                  type="button"
                  onClick={() => handleSelect("all")}
                  className="cursor-pointer text-[11px] text-zinc-400 underline-offset-4 hover:text-white hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cloudflare-style Multi-column Mega Grid */}
          <div className="no-scrollbar max-h-[60vh] overflow-y-auto p-4 sm:p-5">
            {filteredCategories.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                <p className="font-sans text-xs">No categories match &ldquo;{search}&rdquo;</p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-2 text-[11px] text-brand-purple underline hover:text-brand-purple/80"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredCategories.map((cat) => {
                  const isSelected = value === cat.name;

                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => handleSelect(isSelected ? "all" : cat.name)}
                      className={cn(
                        "group relative flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all duration-150",
                        isSelected
                          ? "border-brand-purple/60 bg-brand-purple/15 text-white shadow-[0_0_15px_rgba(192,132,252,0.18)] ring-1 ring-brand-purple/60"
                          : "border-white/6 bg-[#141417] text-zinc-300 hover:border-white/15 hover:bg-[#1b1b22] hover:text-white hover:scale-[1.015]",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full transition-colors",
                            isSelected
                              ? "bg-brand-purple"
                              : "bg-zinc-600 group-hover:bg-zinc-400",
                          )}
                        />
                        <span className="truncate font-sans text-xs font-medium">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-colors",
                            isSelected
                              ? "bg-brand-purple text-paper"
                              : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-200",
                          )}
                        >
                          {cat.count}
                        </span>
                        {isSelected && (
                          <CheckIcon weight="bold" className="size-3 text-brand-purple shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.01] px-5 py-2.5 text-[11px] text-zinc-500">
            <span>
              Showing {filteredCategories.length} categories • {totalResourcesCount} resources
            </span>
            <span className="hidden sm:inline text-zinc-600">
              Click any category to filter catalog instantly
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
