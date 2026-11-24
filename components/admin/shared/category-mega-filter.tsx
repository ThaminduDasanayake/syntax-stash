"use client";

import { CaretDownIcon, CheckIcon, FunnelIcon, SquaresFourIcon } from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";

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

  const isAllSelected = value === "all" || !value;

  const currentCategory = useMemo(() => {
    if (isAllSelected) return null;
    return categories.find((c) => c.name === value) || null;
  }, [categories, isAllSelected, value]);

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
              "group border-input bg-background/50 flex h-8 max-w-[300px] min-w-[200px] cursor-pointer items-center justify-between gap-2 rounded-md border px-2.5 font-mono text-xs shadow-xs transition-all outline-none",
              "hover:bg-surface focus-visible:border-accent/60 focus-visible:ring-accent/60 focus-visible:ring-1",
              open && "border-accent/60 ring-accent/60 bg-surface ring-1",
              disabled && "cursor-not-allowed opacity-50",
              triggerClassName,
            )}
            aria-expanded={open}
            aria-label="Filter by category"
          >
            <div className="flex min-w-0 items-center gap-1.5 truncate">
              {isAllSelected ? (
                <>
                  <span className="text-foreground truncate font-medium">All Categories</span>
                  <span className="text-muted-foreground text-[10px] font-semibold tabular-nums">
                    ({totalResourcesCount})
                  </span>
                </>
              ) : (
                <>
                  <span className="text-accent truncate font-semibold">
                    {currentCategory?.name || value}
                  </span>
                  {currentCategory && (
                    <span className="text-accent/80 text-[10px] font-semibold tabular-nums">
                      ({currentCategory.count})
                    </span>
                  )}
                </>
              )}
            </div>

            <CaretDownIcon
              weight="bold"
              className={cn(
                "text-muted-foreground size-3 shrink-0 transition-transform duration-200",
                open && "text-foreground rotate-180",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="z-70 w-[calc(100vw-2rem)] max-w-4xl rounded-2xl border-[1.5px] border-white/12 bg-[#0e0e11]/98 p-0 font-mono text-xs shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl lg:max-w-5xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <SquaresFourIcon weight="bold" className="text-accent size-4" />
              <span className="font-sans text-xs font-semibold text-white">Categories</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                {categories.length} Total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs transition-all",
                  isAllSelected
                    ? "border-accent/60 bg-accent/15 ring-accent/60 font-medium text-white shadow-[0_0_15px_rgba(74,222,128,0.18)] ring-1"
                    : "border-white/10 bg-[#161619] text-zinc-300 hover:border-white/20 hover:bg-[#1f1f25] hover:text-white",
                )}
              >
                <SquaresFourIcon
                  weight={isAllSelected ? "fill" : "bold"}
                  className={cn("size-3.5", isAllSelected ? "text-accent" : "text-zinc-400")}
                />
                <span>All Categories</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-colors",
                    isAllSelected
                      ? "bg-accent text-accent-foreground font-bold"
                      : "bg-white/5 text-zinc-400",
                  )}
                >
                  {totalResourcesCount}
                </span>
                {isAllSelected && (
                  <CheckIcon weight="bold" className="text-accent size-3 shrink-0" />
                )}
              </button>

              {!isAllSelected && (
                <button
                  type="button"
                  onClick={() => handleSelect("all")}
                  className="hover:text-accent cursor-pointer text-[11px] text-zinc-400 underline-offset-4 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cloudflare-style Multi-column Mega Grid */}
          <div className="no-scrollbar max-h-[60vh] overflow-y-auto p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat) => {
                const isSelected = value === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleSelect(isSelected ? "all" : cat.name)}
                    className={cn(
                      "group relative flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all duration-150",
                      isSelected
                        ? "border-accent/60 bg-accent/15 ring-accent/60 text-white shadow-[0_0_15px_rgba(74,222,128,0.18)] ring-1"
                        : "hover:border-accent/30 border-white/6 bg-[#141417] text-zinc-300 hover:scale-[1.015] hover:bg-[#1b1b22] hover:text-white",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full transition-colors",
                          isSelected ? "bg-accent" : "bg-zinc-600 group-hover:bg-zinc-400",
                        )}
                      />
                      <span className="truncate font-sans text-xs font-medium">{cat.name}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground font-bold"
                            : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-200",
                        )}
                      >
                        {cat.count}
                      </span>
                      {isSelected && (
                        <CheckIcon weight="bold" className="text-accent size-3 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.01] px-5 py-2.5 text-[11px] text-zinc-500">
            <span>
              Showing {categories.length} categories • {totalResourcesCount} resources
            </span>
            <span className="hidden text-zinc-600 sm:inline">
              Click any category to filter catalog instantly
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
