import { Skeleton } from "@/components/ui/skeleton";

export function ToolCardSkeleton() {
  return (
    <div className="card border-border/80 bg-card border-2" aria-hidden="true">
      <div className="card-inner">
        <div className="card-face">
          {/* Header */}
          <div className="card-header">
            <Skeleton className="h-3 w-20 bg-ink/10" />
            <Skeleton className="size-11 border border-border/20 bg-ink/10" />
          </div>

          {/* Title & Subtitle */}
          <div className="mt-1 flex flex-col gap-2">
            <Skeleton className="h-6 w-4/5 bg-ink/15" />
            <Skeleton className="h-3.5 w-1/2 bg-ink/10" />
          </div>

          {/* Description lines */}
          <div className="mt-2.5 space-y-2">
            <Skeleton className="h-3 w-full bg-ink/10" />
            <Skeleton className="h-3 w-11/12 bg-ink/10" />
            <Skeleton className="h-3 w-4/5 bg-ink/10" />
          </div>

          {/* Footer */}
          <div className="card-footer">
            <Skeleton className="h-3 w-16 bg-ink/10" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-5 rounded-none bg-ink/10" />
              <Skeleton className="size-5 rounded-none bg-ink/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
