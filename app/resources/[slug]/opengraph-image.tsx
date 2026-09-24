import { ImageResponse } from "next/og";

import { getAllCategories } from "@/lib/categories";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";
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
      badgeText={`${siteConfig.url.replace(/^https?:\/\//, "")}/resources/${slug}`}
      description={`Curated developer tools, libraries, generators, and assets for ${categoryName.toLowerCase()}.`}
      stat1={{
        color: "#e8a52b",
        label: "IN THIS CATEGORY",
        subtext: `${categoryName} Resources`,
        value: resourceCount,
      }}
      stat2={{
        color: "#a855f7",
        label: "TOTAL IN STASH",
        subtext: "Across All Collections",
        value: resources.length,
      }}
      stat3={{
        color: "#10b981",
        label: "CATEGORIES",
        subtext: "Full Taxonomy",
        value: categories.length,
      }}
      title={categoryName}
    />,
    {
      ...size,
      fonts,
    },
  );
}
