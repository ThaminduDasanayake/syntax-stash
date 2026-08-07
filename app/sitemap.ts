import type { MetadataRoute } from "next";

import { resourceCategories } from "@/lib/resource-data";
import { siteConfig } from "@/lib/site-config";
import { internalTools } from "@/lib/tools-data";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1.0,
      url: baseUrl,
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.5,
      url: `${baseUrl}/about`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.7,
      url: `${baseUrl}/changelog`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/resources`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.9,
      url: `${baseUrl}/tools`,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = internalTools
    .filter((tool) => tool.slug)
    .map((tool) => ({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: `${baseUrl}/tools/${tool.slug}`,
    }));

  const resourceRoutes: MetadataRoute.Sitemap = resourceCategories.map((cat) => ({
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 0.7,
    url: `${baseUrl}/resources/${slugify(cat)}`,
  }));

  return [...staticRoutes, ...toolRoutes, ...resourceRoutes];
}
