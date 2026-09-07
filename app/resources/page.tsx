import type { Metadata } from "next";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { resourceCategories } from "@/lib/categories";
import { getAllResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  alternates: { canonical: "/resources" },
  description: "A curated list of developer resources — frameworks, tools, and references.",
};

export default async function ResourcesPage() {
  const resourceLinks = await getAllResources();

  return (
    <div className="lib-page">
      {/* Header */}
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

      <FilterSection
        items={resourceLinks}
        categories={resourceCategories}
        searchPlaceholder="Search resources..."
        itemLabel="Resources"
      />
    </div>
  );
}
