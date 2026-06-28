import type { Metadata } from "next";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { internalTools, toolCategories } from "@/lib/tools-data";

export const metadata: Metadata = {
  title: "All Tools",
  alternates: { canonical: "/tools" },
  description:
    "Browse all developer tools in syntax-stash — converters, generators, formatters, and more.",
};

export default function ToolsPage() {
  return (
    <div className="lib-page">
      {/* Mini-Hero */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>
          <h1 className="lib-headline">
            THE TOOLS
            <br />
            <em>stash.</em>
          </h1>
          <p className="lib-sub">
            {internalTools.length} curated generators, formatters, and utilities.
          </p>
        </div>
      </header>

      <FilterSection
        items={internalTools}
        categories={toolCategories}
        searchPlaceholder="Search tools..."
        itemLabel="Tools"
      />
    </div>
  );
}
