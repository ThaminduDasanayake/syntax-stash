import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

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
          <div className="lib-sub">
            <Skeleton className="h-5 w-64 bg-ink/10" />
          </div>
        </div>
      </header>

      <div className="card-body">
        <div className="section-inner">
          <div className="mb-8 flex w-full items-center gap-3">
            <Skeleton className="h-4 w-32 bg-ink/10" />
            <span className="h-0.5 flex-1 bg-primary/20" />
          </div>
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
