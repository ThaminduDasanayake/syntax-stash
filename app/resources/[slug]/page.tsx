import { notFound } from "next/navigation";

import ToolCard from "@/components/tool-card";
import { resourceCategories, resourceLinks } from "@/lib/resource-data";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return resourceCategories.map((cat) => ({ slug: slugify(cat) }));
}

export default async function ResourceCategoryPage(props: PageProps<"/resources/[slug]">) {
  const { slug } = await props.params;

  const category = resourceCategories.find((c) => slugify(c) === slug);
  if (!category) notFound();

  const links = resourceLinks.filter((t) => t.category === category);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">{category}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {links.length} curated resource{links.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Resource grid */}
      <div className="card-grid">
        {links.map((tool, index) => (
          <ToolCard key={tool.url} tool={tool} index={index} />
        ))}
      </div>
    </div>
  );
}
