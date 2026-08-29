import { Skeleton } from "@/components/ui/skeleton";

export function ToolCardSkeleton() {
  return (
    <div className="card border-border/80 bg-card border-2" aria-hidden="true">
      <div className="card-inner">
        <div className="card-face">
          {/* Header */}
          <div className="card-header">
            <Skeleton className="bg-ink/10 h-3 w-20" />
            <Skeleton className="border-border/20 bg-ink/10 size-11 border" />
          </div>

          {/* Title & Subtitle */}
          <div className="mt-1 flex flex-col gap-2">
            <Skeleton className="bg-ink/15 h-6 w-4/5" />
            <Skeleton className="bg-ink/10 h-3.5 w-1/2" />
          </div>

          {/* Description lines */}
          <div className="mt-2.5 space-y-2">
            <Skeleton className="bg-ink/10 h-3 w-full" />
            <Skeleton className="bg-ink/10 h-3 w-11/12" />
            <Skeleton className="bg-ink/10 h-3 w-4/5" />
          </div>

          {/* Footer */}
          <div className="card-footer">
            <Skeleton className="bg-ink/10 h-3 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="bg-ink/10 size-5 rounded-none" />
              <Skeleton className="bg-ink/10 size-5 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
