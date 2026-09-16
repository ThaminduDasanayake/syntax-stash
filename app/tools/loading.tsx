import { Skeleton } from "@/components/ui/skeleton";

export default function ToolLoadingSkeleton() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Back link skeleton */}
      <Skeleton className="bg-foreground/10 mb-8 h-5 w-16 rounded-md" />

      {/* Heading Skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <Skeleton className="bg-foreground/10 size-9 rounded-md" />
          {/* Title skeleton */}
          <Skeleton className="bg-foreground/15 h-10 w-64 rounded-md md:h-12 md:w-80" />
        </div>
        {/* Description skeleton - two lines */}
        <Skeleton className="bg-foreground/10 mt-2 h-5 w-full max-w-2xl rounded-md" />
        <Skeleton className="bg-foreground/10 h-5 w-3/4 max-w-xl rounded-md" />
      </div>

      {/* Content Area Skeleton */}
      <Skeleton className="border-border bg-foreground/5 h-100 w-full rounded-xl border-[1.5px]" />
    </div>
  );
}
