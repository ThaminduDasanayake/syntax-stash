import type { Metadata } from "next";

import { ResourceFilterSection } from "@/components/resource-filter-section";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  description: "A curated list of developer resources — frameworks, tools, and references.",
  title: "Resources",
};

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
            {resourceLinks.length} curated links across {resourceCategories.length} categories.
          </p>
        </div>
      </header>

      <ResourceFilterSection
        resourceLinks={resourceLinks}
        resourceCategories={resourceCategories}
      />
    </div>
  );
}
