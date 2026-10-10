import type { Metadata } from "next";

import { FilterSection } from "@/components/filter-section";
import { getAllCategories } from "@/lib/categories";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Syntax Stash — Curated Web Engineering Resources & Tools",
  description:
    "A curated directory of 1,480+ frontend libraries, design systems, animation engines, and developer tools for the modern web.",
};

export default async function Home() {
  const [categoryItems, resourceLinks] = await Promise.all([getAllCategories(), getAllResources()]);
  const categories = categoryItems.map((c) => c.name);

  return (
    <div className="lib-page">
      {/* Clean Technical Header */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="text-primary mb-3 font-mono text-xs font-bold tracking-widest uppercase">
            {"// CURATED DEVELOPER DIRECTORY"}
          </div>
          <h1 className="lib-headline">
            THE CURATED
            <br />
            <em>stash.</em>
          </h1>
          <p className="lib-sub">
            {resourceLinks.length} verified libraries, design systems, animation engines, and
            toolchains across {categories.length} categories.
          </p>
        </div>
      </header>

      <FilterSection
        items={resourceLinks}
        categories={categories}
        searchPlaceholder="Search 1,480+ resources..."
        itemLabel="Resources"
      />
    </div>
  );
}
