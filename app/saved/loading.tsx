import { FilterBarSkeleton } from "@/components/filter-bar-skeleton";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";

export default function SavedLoading() {
  return (
    <div className="lib-page">
      <header className="lib-header">
        <div className="section-inner">
          <h1 className="lib-headline">
            YOUR STASH
            <br />
            <em>saved.</em>
          </h1>
          <p className="lib-sub">Your cloud-synced personal collection.</p>
        </div>
      </header>

      <div className="card-body pb-32">
        <div className="section-inner">
          <div className="card-grid w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <FilterBarSkeleton searchPlaceholder="Search saved stash..." />
    </div>
  );
}
