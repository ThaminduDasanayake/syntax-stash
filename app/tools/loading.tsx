export default function ToolLoadingSkeleton() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Back link skeleton */}
      <div className="bg-accent mb-8 h-5 w-16 animate-pulse rounded-md"></div>

      {/* Heading Skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <div className="bg-accent size-9 animate-pulse rounded-md"></div>
          {/* Title skeleton */}
          <div className="bg-accent h-10 w-64 animate-pulse rounded-md md:h-12 md:w-80"></div>
        </div>
        {/* Description skeleton - two lines */}
        <div className="bg-accent mt-2 h-5 w-full max-w-2xl animate-pulse rounded-md"></div>
        <div className="bg-accent h-5 w-3/4 max-w-xl animate-pulse rounded-md"></div>
      </div>

      {/* Content Area Skeleton */}
      <div className="bg-accent/50 border-border h-100 w-full animate-pulse rounded-xl border"></div>
    </div>
  );
}
