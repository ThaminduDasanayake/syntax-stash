import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FilterSection } from "@/components/filter-section";
import { getAllResources } from "@/lib/resources";
import { getAllTags, normalizeTag } from "@/lib/tags";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const allTags = getAllTags();
  return allTags.map((t) => ({ slug: normalizeTag(t.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = normalizeTag(slug);

  const allTags = getAllTags();
  const matchedTag = allTags.find((t) => normalizeTag(t.name) === cleanSlug);
  const tagName = matchedTag?.name || slug;

  return {
    title: `#${tagName} Tools & Resources`,
    alternates: { canonical: `/tags/${cleanSlug}` },
    description: `Curated developer tools, utilities, and resources tagged with #${tagName} on syntax-stash.`,
    openGraph: {
      title: `#${tagName} Tools & Resources — syntax-stash`,
      description: `Curated developer tools, utilities, and resources tagged with #${tagName} on syntax-stash.`,
      url: `/tags/${cleanSlug}`,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cleanSlug = normalizeTag(slug);

  const allResources = await getAllResources();

  // Find all resources that match this tag
  const matchingResources = allResources.filter((r) => {
    if (!r.tags) return false;
    const tagList = Array.isArray(r.tags) ? r.tags : (r.tags as string).split(",");
    return tagList.some((t) => normalizeTag(t) === cleanSlug);
  });

  if (matchingResources.length === 0) {
    notFound();
  }

  const allTags = getAllTags(allResources);
  const matchedTag = allTags.find((t) => normalizeTag(t.name) === cleanSlug);
  const tagName = matchedTag?.name || slug;

  const activeCategories = Array.from(new Set(matchingResources.map((r) => r.category)));

  return (
    <div className="res-page">
      {/* Header */}
      <header className="res-header">
        <div className="section-inner">
          <div className="mb-2">
            <span className="border-line bg-surface-elevated text-primary rounded border px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider">
              Tag Taxonomy
            </span>
          </div>
          <h1 className="res-headline font-mono">#{tagName}</h1>
          <p className="res-sub">
            {matchingResources.length} curated {matchingResources.length === 1 ? "tool" : "tools"}{" "}
            tagged with <strong className="text-foreground">#{tagName}</strong> across syntax-stash.
          </p>
        </div>
      </header>

      <FilterSection
        items={matchingResources}
        categories={activeCategories}
        searchPlaceholder={`Search within #${tagName}...`}
        itemLabel={`#${tagName} Tools`}
      />
    </div>
  );
}
