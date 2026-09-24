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
      badgeText={siteConfig.url.replace(/^https?:\/\//, "")}
      description={siteConfig.description}
      stat1={{
        color: "#e8a52b",
        label: "TOTAL RESOURCES",
        subtext: "Handpicked & Verified",
        value: resources.length,
      }}
      stat2={{
        color: "#a855f7",
        label: "CATEGORIES",
        subtext: "Organized Architecture",
        value: categories.length,
      }}
      stat3={{
        color: "#10b981",
        label: "FREE & OPEN",
        subtext: "No Paywalls or Clutter",
        value: "100%",
      }}
      title="Curated Developer Tools & Web Stash"
    />,
    {
      ...size,
      fonts,
    },
  );
}
