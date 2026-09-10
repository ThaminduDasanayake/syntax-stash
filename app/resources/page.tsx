import type { Metadata } from "next";

import { FilterSection } from "@/components/filter-section";
import { getAllCategories } from "@/lib/categories";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  alternates: { canonical: "/resources" },
  description: "A curated list of developer resources — frameworks, tools, and references.",
};

export default async function ResourcesPage() {
  const [categoryItems, resourceLinks] = await Promise.all([getAllCategories(), getAllResources()]);
  const categories = categoryItems.map((c) => c.name);

  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <h1 className="lib-headline">
            THE RESOURCES
            <br />
            <em>stash.</em>
          </h1>
          <p className="lib-sub">
            {resourceLinks.length} curated links across {categories.length} categories.
          </p>
        </div>
      </header>

      <FilterSection
        items={resourceLinks}
        categories={categories}
        searchPlaceholder="Search resources..."
        itemLabel="Resources"
      />
    </div>
  );
}
