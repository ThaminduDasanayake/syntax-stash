import { Skeleton } from "@/components/ui/skeleton";

export function ToolCardSkeleton() {
  return (
    <article
      data-slot="resource-card-skeleton"
      className="group relative flex h-full flex-col select-none"
      aria-hidden="true"
    >
      {/* 1. Visual Stage: clean 16:10 OG image box with single rounded-2xl border */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border-[1.5px] border-white/10 bg-[#18181b]">
        <Skeleton className="h-full w-full rounded-2xl bg-white/5" />
      </div>

      {/* 2. Text Block */}
      <div className="flex flex-col gap-2 px-0.5 pt-3">
        {/* Row 1: Inline favicon + title */}
        <div className="flex min-w-0 items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-lg bg-white/10" />
          <Skeleton className="h-5 flex-1 rounded-md bg-white/10" />
        </div>

        {/* Row 2: Description lines */}
        <div className="mt-1 space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-md bg-white/5" />
          <Skeleton className="h-3.5 w-4/5 rounded-md bg-white/5" />
        </div>

        {/* Row 3: Footer */}
        <div className="mt-1 flex items-center justify-between pt-0.5">
          <Skeleton className="h-3 w-20 rounded-md bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-7 rounded-lg bg-white/5" />
            <Skeleton className="size-7 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    </article>
  );
}
