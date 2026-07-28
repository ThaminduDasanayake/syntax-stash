import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";
import { slugify } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return resourceCategories.map((cat) => ({ slug: slugify(cat) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const category = resourceCategories.find((c) => slugify(c) === slug);
  if (!category) return {};

  return {
    title: category,
    alternates: { canonical: `/resources/${slug}` },
    description: `Curated web development resources, tools, and documentation for ${category}.`,
    openGraph: {
      title: `${category} Resources — syntax-stash`,
      description: `Curated web development resources, tools, and documentation for ${category}.`,
      url: `/resources/${slug}`,
    },
  };
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
