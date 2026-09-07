import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { getAllCategories } from "@/lib/categories";
import { getAllResources } from "@/lib/resources";
import { slugify } from "@/lib/utils";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ slug: cat.slug || slugify(cat.name) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug || slugify(c.name) === slug);
  if (!category) return {};

  return {
    title: category.name,
    alternates: { canonical: `/resources/${slug}` },
    description:
      category.description ||
      `Curated web development resources, tools, and documentation for ${category.name}.`,
    openGraph: {
      title: `${category.name} Resources — syntax-stash`,
      description:
        category.description ||
        `Curated web development resources, tools, and documentation for ${category.name}.`,
      url: `/resources/${slug}`,
    },
  };
}

export default async function ResourceCategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug || slugify(c.name) === slug);
  if (!category) notFound();

  const resourceLinks = await getAllResources();
  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="res-page">
      {/* Header */}
      <header className="res-header">
        <div className="section-inner">
          <h1 className="res-headline">{category.name}</h1>
          <p className="res-sub">
            {category.description || `Curated resources for ${category.name.toLowerCase()}.`}
          </p>
        </div>
      </header>

      <FilterSection
        initialCategory={category.name}
        items={resourceLinks}
        categories={categoryNames}
        searchPlaceholder="Search resources..."
        itemLabel="Resources"
      />
    </div>
  );
}
