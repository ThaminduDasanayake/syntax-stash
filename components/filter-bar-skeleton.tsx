"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface FilterBarSkeletonProps {
  searchPlaceholder?: string;
}

export function FilterBarSkeleton(_props: FilterBarSkeletonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center">
      <div className="border-border/80 bg-card/90 flex items-center gap-1.5 rounded-2xl border-[1.5px] p-1.5 shadow-2xl backdrop-blur-xl sm:gap-2 sm:p-2">
        {/* Search button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-9 rounded-xl sm:w-44" />

        <div className="bg-border/60 mx-0.5 h-5 w-[1px]" />

        {/* Category button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-32 rounded-xl sm:w-48" />

        {/* Tags button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-20 rounded-xl sm:w-24" />

        {/* Saved button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-9 rounded-xl" />

        <div className="bg-border/60 mx-0.5 hidden h-5 w-[1px] md:block" />

        {/* Counter skeleton */}
        <div className="hidden items-center px-2 md:flex">
          <Skeleton className="bg-foreground/10 h-4 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}

