import { ImageResponse } from "next/og";

import { getAllCategories } from "@/lib/categories";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { slugify } from "@/lib/utils";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [categories, resources, fonts] = await Promise.all([
    getAllCategories(),
    getAllResources(),
    getOgFonts(),
  ]);

  const category = categories.find((c) => c.slug === slug || slugify(c.name) === slug);
  const categoryName = category?.name || "Resources";
  const categoryResources = resources.filter((r) => r.category === categoryName);
  const resourceCount = categoryResources.length;

  return new ImageResponse(
    <OgTemplate
      description={`Curated developer tools, libraries, generators, and assets for ${categoryName.toLowerCase()}.`}
      eyebrow="Syntax Stash"
      statsText={`${resourceCount} Resources in this Category · ${resources.length} Total in Catalog`}
      title={categoryName}
    />,
    {
      ...size,
      fonts,
    },
  );
}
