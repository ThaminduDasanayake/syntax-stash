import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import { resourceLinks } from "@/lib/resource-data";

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
    <div className="flex w-full flex-col">
      {/* Mini-Hero */}
      <div className="border-border bg-background relative w-full border-b-2 px-6 py-12 md:px-12">
        <h1 className="flex flex-col gap-1 text-4xl tracking-tighter sm:text-5xl">
          <span className="font-display font-black uppercase">THE RESOURCES</span>
          <span className="font-serif tracking-normal lowercase italic">stash.</span>
        </h1>
        <p className="text-muted-foreground mt-4 font-mono text-sm leading-relaxed tracking-wider uppercase opacity-80">
          {resourceLinks.length} curated links across {Object.keys(groupedResources).length}{" "}
          categories.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
        <div className="space-y-12 pb-8">
          {Object.entries(groupedResources).map(([category, items]) => (
            <div key={category} className="space-y-6">
              <h2 className="text-primary flex items-center gap-4 font-mono text-sm font-semibold tracking-wider uppercase">
                {category}
                <span className="bg-primary h-px flex-1" />
                <span>{items.length} Resources</span>
              </h2>
              <div className="card-grid">
                {items.map((resource) => (
                  <ToolCard key={resource.url} tool={resource} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
