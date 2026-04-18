import { notFound } from "next/navigation";

import ToolCard from "@/components/tool-card";
import { resourceCategories, resourceLinks } from "@/lib/resources-data";
import { slugify } from "@/lib/utils";

// Tell Next.js which slugs are valid at build time
export function generateStaticParams() {
  return resourceCategories.map((cat) => ({ slug: slugify(cat) }));
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;

  // Resolve slug → category label
  const category = resourceCategories.find((c) => slugify(c) === slug);
  if (!category) notFound();

  const links = resourceLinks.filter((t) => t.category === category);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">{category}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {links.length} curated resource{links.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Resource grid */}
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {links.map((tool) => (
          <ToolCard key={tool.url} tool={tool} />
        ))}
      </div>
    </div>
  );
}
