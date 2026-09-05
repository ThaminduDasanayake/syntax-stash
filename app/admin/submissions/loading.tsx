import { AdminSubmissionsSkeleton } from "@/components/admin-submissions-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSubmissionsLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12" aria-busy="true">
      {/* Admin Header Skeleton */}
      <div className="border-line/60 mb-8 border-b pb-6 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Skeleton className="bg-primary size-2 rounded-full" />
              <Skeleton className="bg-ink/15 h-3.5 w-24 rounded" />
            </div>
            <Skeleton className="bg-ink/15 mt-2 h-8 w-72 rounded" />
            <Skeleton className="bg-ink/10 mt-2 h-3.5 w-80 rounded" />
          </div>

          <div className="text-right">
            <Skeleton className="bg-ink/10 h-4 w-44 rounded" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <AdminSubmissionsSkeleton />
    </div>
  );
}
