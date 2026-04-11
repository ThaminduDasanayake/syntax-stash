import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { resourceLinks, resourceCategories } from "@/lib/data";
import { slugify } from "@/lib/utils";
import ToolCard from "@/components/ToolCard";

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
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {category}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {links.length} curated resource{links.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Resource grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {links.map((tool) => (
          <ToolCard key={tool.url} tool={tool} />
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-10 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ExternalLink size={12} />
        All links open in a new tab.
      </p>
    </div>
  );
}
