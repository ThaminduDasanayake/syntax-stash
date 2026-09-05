import { Skeleton } from "@/components/ui/skeleton";

export function AdminSubmissionCardSkeleton() {
  return (
    <div
      className="border-line/70 bg-surface/40 rounded border p-5 font-mono text-xs"
      aria-hidden="true"
    >
      {/* Status & Submitter meta header */}
      <div className="border-line/40 mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
        <div className="flex items-center gap-2">
          <Skeleton className="bg-ink/15 h-5 w-16 rounded" />
          <Skeleton className="bg-ink/10 h-3.5 w-24 rounded" />
        </div>
        <Skeleton className="bg-ink/10 h-3.5 w-36 rounded" />
      </div>

      {/* Main Card Content */}
      <div className="flex items-start gap-4">
        {/* Favicon Box */}
        <Skeleton className="bg-ink/15 size-11 shrink-0 rounded" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="bg-ink/15 h-5 w-44 rounded" />
            <Skeleton className="bg-ink/10 h-4 w-28 rounded" />
            <Skeleton className="bg-ink/10 h-4 w-20 rounded" />
          </div>

          <Skeleton className="bg-ink/10 h-3.5 w-60 rounded" />

          <div className="space-y-1.5 pt-1">
            <Skeleton className="bg-ink/10 h-3 w-full rounded" />
            <Skeleton className="bg-ink/10 h-3 w-4/5 rounded" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <Skeleton className="bg-ink/10 h-4 w-16 rounded" />
            <Skeleton className="bg-ink/10 h-4 w-14 rounded" />
            <Skeleton className="bg-ink/10 h-4 w-20 rounded" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="bg-ink/10 h-3.5 w-28 rounded" />
            <Skeleton className="bg-ink/10 h-3.5 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="border-line/40 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
        <div className="flex items-center gap-2">
          <Skeleton className="bg-ink/15 h-8 w-32 rounded" />
          <Skeleton className="bg-ink/10 h-8 w-16 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="bg-ink/15 h-8 w-20 rounded" />
          <Skeleton className="bg-ink/10 h-8 w-18 rounded" />
          <Skeleton className="bg-ink/10 size-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export function AdminSubmissionsCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <AdminSubmissionCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AdminSubmissionsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* Top Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 border-b pb-2 sm:border-b-0 sm:pb-0">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="bg-ink/10 h-8 w-24 rounded" />
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Skeleton className="bg-ink/10 h-9 w-full rounded" />
        </div>
      </div>

      {/* Cards List */}
      <AdminSubmissionsCardsSkeleton count={3} />
    </div>
  );
}
