import { FilterBarSkeleton } from "@/components/filter-bar-skeleton";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";

export default function ResourcesLoading() {
  return (
    <div className="lib-page">
      <header className="lib-header">
        <div className="section-inner">
          <h1 className="lib-headline">
            THE RESOURCES
            <br />
            <em>stash.</em>
          </h1>
          <p className="lib-sub">Curated links across categories.</p>
        </div>
      </header>

      <FilterBarSkeleton searchPlaceholder="Search resources..." />

      <div className="card-body">
        <div className="section-inner">
          <div className="card-grid w-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
