"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface FilterBarSkeletonProps {
  searchPlaceholder?: string;
}

export function FilterBarSkeleton(_props: FilterBarSkeletonProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center">
      <div className="flex items-center gap-1.5 rounded-full border-[1.5px] border-white/12 bg-[#0e0e11]/95 p-1.5 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.75),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl sm:gap-2 sm:p-2">
        {/* Search button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-9 rounded-full sm:w-64" />

        <div className="bg-border/60 mx-0.5 h-5 w-[1px]" />

        {/* Category button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-32 rounded-full sm:w-56 md:w-60" />

        {/* Tags button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-20 rounded-full sm:w-24" />

        {/* Saved button skeleton */}
        <Skeleton className="bg-foreground/10 h-9 w-9 rounded-full" />

        <div className="bg-border/60 mx-0.5 hidden h-5 w-[1px] md:block" />

        {/* Counter skeleton */}
        <div className="hidden items-center px-2 md:flex">
          <Skeleton className="bg-foreground/10 h-4 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}
