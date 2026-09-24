import { ImageResponse } from "next/og";

import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { getTagBySlug, normalizeTag } from "@/lib/tags";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = normalizeTag(slug);

  const [allResources, fonts, matchedTag] = await Promise.all([
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
      description={`Curated developer tools, open-source libraries, and design assets tagged with #${tagName}.`}
      eyebrow="Tag Archive"
      statsText={`${matchingCount} Matching Tools · ${allResources.length} Total in Catalog`}
      title={`#${tagName}`}
    />,
    {
      ...size,
      fonts,
    },
  );
}
