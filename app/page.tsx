import { BookMarked } from "lucide-react";
import Link from "next/link";

import ToolCard from "@/components/ToolCard";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { internalTools, resourceCategories } from "@/lib/data";
import { slugify } from "@/lib/utils";

function CategoryCard({ category }: { category: string }) {
  const url = `/category/${slugify(category)}`;

  return (
    <Link
      href={url}
      className={
        "hover:shadow-secondary/10 block h-full w-full transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_var(--color-secondary)]"
      }
    >
      <Card className="bg-card text-card-foreground border-border flex h-full w-full flex-col py-4 ring-0 transition-colors">
        <CardHeader className="flex-none">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-secondary/10 border-secondary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
              <BookMarked size={14} className="text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-foreground font-semibold">{category}</CardTitle>
            </div>
          </div>
          <CardDescription className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            Explore curated resources and bookmarks for {category}.
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto p-6">
      <div className="bg-card border-border mb-8 flex w-full flex-col items-center justify-center space-y-4 rounded-xl border p-8 text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight">
          syntax<span className="text-primary">-</span>stash
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          A curated command center for modern web development.
        </p>
        <p className="text-muted-foreground mt-4 font-mono text-xs">
          Built with Next.js · handmade, no tracking.
        </p>
      </div>

      <div className="w-full space-y-10 pb-8">
        {internalTools.length > 0 && (
          <div>
            <h2 className="text-foreground mb-4 font-mono text-lg font-semibold tracking-tight uppercase">
              <span className="text-primary mr-2">/</span> Inbuilt Tools
            </h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {internalTools.map((tool) => (
                <ToolCard key={tool.url} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {resourceCategories.length > 0 && (
          <div>
            <h2 className="text-foreground mb-4 font-mono text-lg font-semibold tracking-tight uppercase">
              <span className="text-secondary mr-2">/</span> Resource Stash
            </h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {resourceCategories.map((category) => (
                <CategoryCard key={category} category={category} />
              ))}
            </div>
          </div>
        )}

        {internalTools.length === 0 && resourceCategories.length === 0 && (
          <div className="text-muted-foreground mt-10 text-center text-sm">
            No tools or resources found.
          </div>
        )}
      </div>
    </div>
  );
}
