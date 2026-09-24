import { ImageResponse } from "next/og";

import { getAllCategories } from "@/lib/categories";
import { getOgFonts } from "@/lib/og/fonts";
import { OgTemplate } from "@/lib/og/template";
import { getAllResources } from "@/lib/resources";
import { siteConfig } from "@/lib/site-config";

export const alt = siteConfig.title;
export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  const [categories, resources, fonts] = await Promise.all([
    getAllCategories(),
    getAllResources(),
    getOgFonts(),
  ]);

  return new ImageResponse(
    <OgTemplate
      description={siteConfig.description}
      eyebrow="Syntax Stash"
      statsText={`${resources.length} Resources · ${categories.length} Categories`}
      title="Curated Developer Tools"
    />,
    {
      ...size,
      fonts,
    },
  );
}
