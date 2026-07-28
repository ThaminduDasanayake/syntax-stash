import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: siteConfig.backgroundColor,
    description: siteConfig.description,
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    name: siteConfig.title,
    short_name: siteConfig.shortName,
    start_url: "/",
    theme_color: siteConfig.themeColor,
  };
}
