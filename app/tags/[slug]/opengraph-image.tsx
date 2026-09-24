import { ImageResponse } from "next/og";

import { getAllCategories } from "@/lib/categories";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";
import { getTagBySlug, normalizeTag } from "@/lib/tags";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = normalizeTag(slug);

  const [categories, allResources, fonts, matchedTag] = await Promise.all([
    getAllCategories(),
    getAllResources(),
    getOgFonts(),
    getTagBySlug(cleanSlug),
  ]);

  const tagName = matchedTag?.name || slug;

  const matchingCount = allResources.filter((r) => {
    if (!r.tags) return false;
    const tagList = Array.isArray(r.tags) ? r.tags : (r.tags as string).split(",");
    return tagList.some((t) => normalizeTag(t) === cleanSlug);
  }).length;

  return new ImageResponse(
    <OgTemplate
      badgeText={`${siteConfig.url.replace(/^https?:\/\//, "")}/tags/${cleanSlug}`}
      description={`Curated developer tools, open-source libraries, and design assets tagged with #${tagName}.`}
      stat1={{
        color: "#10b981",
        label: "MATCHING TOOLS",
        subtext: `Tagged with #${tagName}`,
        value: matchingCount,
      }}
      stat2={{
        color: "#e8a52b",
        label: "TOTAL IN STASH",
        subtext: "Across All Collections",
        value: allResources.length,
      }}
      stat3={{
        color: "#a855f7",
        label: "CATEGORIES",
        subtext: "Full Taxonomy",
        value: categories.length,
      }}
      title={
        <div
          style={{
            color: "#10b981",
            display: "flex",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "56px",
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.08,
            maxWidth: "1000px",
          }}
        >
          {`#${tagName}`}
        </div>
      }
    />,
    {
      ...size,
      fonts,
    },
  );
}
