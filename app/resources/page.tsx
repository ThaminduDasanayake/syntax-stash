import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import ToolCard from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourceLinks } from "@/lib/resource-data";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  description: "A curated list of developer resources — frameworks, tools, and references.",
  title: "Resources",
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
    <div className="res-page">
      {/* Header */}
      <header className="res-header">
        <div className="section-inner">
          <div>----------Eyebrow---------</div>
          <h1 className="res-headline">
            THE RESOURCES
            <br />
            <em>stash.</em>
          </h1>
          <p className="res-sub">
            {resourceLinks.length} curated links across {Object.keys(groupedResources).length}{" "}
            categories.
          </p>
        </div>
      </header>

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-search-wrap">
            <MagnifyingGlassIcon weight="bold" className="filter-search-icon" />
            <Input className="filter-search" />
          </div>
          <div className="filter-pills">
            <Button className="filter-pill">Cat</Button>
          </div>
        </div>
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
