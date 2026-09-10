"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterBarSkeletonProps {
  searchPlaceholder?: string;
}

const PILL_WIDTHS = ["w-14", "w-16", "w-18", "w-20", "w-22", "w-24"];

export function FilterBarSkeleton({
  searchPlaceholder = "Search saved stash...",
}: FilterBarSkeletonProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <div className="filter-search-wrap">
          <MagnifyingGlassIcon
            weight="bold"
            className="filter-search-icon text-muted-foreground/50"
          />
          <Input
            className="filter-search cursor-not-allowed opacity-70"
            placeholder={searchPlaceholder}
            disabled
          />
        </div>

        <div className="filter-pills">
          {PILL_WIDTHS.map((width, i) => (
            <div
              key={i}
              className="filter-pill border-border/60 bg-card/60 flex items-center border opacity-60"
            >
              <Skeleton className={`h-2.5 ${width} bg-muted/60`} />
            </div>
          ))}
        </div>

        <div className="filter-count">
          <Skeleton className="bg-muted/60 h-3.5 w-14" />
        </div>
      </div>
    </div>
  );
}
