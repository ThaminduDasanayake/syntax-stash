import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import { resourceLinks } from "@/lib/resources-data";

export const metadata: Metadata = {
  title: "Resources",
  description: "A curated list of developer resources — frameworks, tools, and references.",
  alternates: { canonical: "/resources" },
};

const groupedResources = resourceLinks.reduce(
  (acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  },
  {} as Record<string, typeof resourceLinks>,
);

export default function ResourcesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {resourceLinks.length} curated links across {Object.keys(groupedResources).length}{" "}
          categories
        </p>
      </div>

      <div className="space-y-12 pb-8">
        {Object.entries(groupedResources).map(([category, items]) => (
          <div key={category} className="space-y-6">
            <h2 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
              {category}
              <span className="bg-primary h-px flex-1" />
            </h2>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((resource) => (
                <ToolCard key={resource.url} tool={resource} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
