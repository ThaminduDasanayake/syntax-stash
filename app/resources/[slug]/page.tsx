import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return resourceCategories.map((cat) => ({ slug: slugify(cat) }));
}

export default async function ResourceCategoryPage(props: PageProps<"/resources/[slug]">) {
  const { slug } = await props.params;

  const category = resourceCategories.find((c) => slugify(c) === slug);
  if (!category) notFound();

  return (
    <div className="res-page">
      {/* Header */}
      <header className="res-header">
        <div className="section-inner">
          <h1 className="res-headline">{category}</h1>
          <p className="res-sub">Curated resources for {category.toLowerCase()}.</p>
        </div>
      </header>

      <FilterSection
        initialCategory={category}
        items={resourceLinks}
        categories={resourceCategories}
        searchPlaceholder="Search resources..."
        itemLabel="Resources"
      />
    </div>
  );
}
