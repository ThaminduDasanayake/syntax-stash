import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";

export default function ResourcesLoading() {
  return (
    <div className="lib-page">
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>
          <h1 className="lib-headline">
            THE RESOURCES
            <br />
            <em>stash.</em>
          </h1>
          <p className="lib-sub">
            {resourceLinks.length} curated links across {resourceCategories.length} categories.
          </p>
        </div>
      </header>

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
