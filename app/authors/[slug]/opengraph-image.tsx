import { ImageResponse } from "next/og";

import { getAuthorBySlug } from "@/lib/authors";
import { getAllCategories } from "@/lib/categories";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [categories, resources, authorData, fonts] = await Promise.all([
    getAllCategories(),
    getAllResources(),
    getAuthorBySlug(slug),
    getOgFonts(),
  ]);

  const authorName = authorData?.name || "Author Profile";
  const resourceCount = authorData?.count || 0;

  return new ImageResponse(
    <OgTemplate
      badgeText={`${siteConfig.url.replace(/^https?:\/\//, "")}/authors/${slug}`}
      description={`Curated developer tools, open-source libraries, and utilities built or maintained by ${authorName}.`}
      stat1={{
        color: "#a855f7",
        label: "CURATED TOOLS",
        subtext: `By ${authorName}`,
        value: resourceCount,
      }}
      stat2={{
        color: "#e8a52b",
        label: "TOTAL IN STASH",
        subtext: "Across All Collections",
        value: resources.length,
      }}
      stat3={{
        color: "#10b981",
        label: "CATEGORIES",
        subtext: "Full Catalog",
        value: categories.length,
      }}
      title={authorName}
    />,
    {
      ...size,
      fonts,
    },
  );
}
