import { ImageResponse } from "next/og";

import { getAuthorBySlug } from "@/lib/authors";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [resources, authorData, fonts] = await Promise.all([
    getAllResources(),
    getAuthorBySlug(slug),
    getOgFonts(),
  ]);

  const authorName = authorData?.name || "Author Profile";
  const resourceCount = authorData?.count || 0;

  return new ImageResponse(
    <OgTemplate
      description={`Curated developer tools, open-source libraries, and utilities built or maintained by ${authorName}.`}
      eyebrow="Creator Spotlight"
      statsText={`${resourceCount} Tools Curated · ${resources.length} Total in Catalog`}
      title={authorName}
    />,
    {
      ...size,
      fonts,
    },
  );
}
