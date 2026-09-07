import type { MetadataRoute } from "next";

import { getAllAuthors } from "@/lib/authors";
import { getAllCategories } from "@/lib/categories";
import { siteConfig } from "@/lib/site-config";
import { internalTools } from "@/lib/tools-data";
import { slugify } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
      priority: 0.8,
      url: `${baseUrl}/authors`,
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: `${baseUrl}/submit`,
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

  const categories = await getAllCategories();
  const resourceRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 0.7,
    url: `${baseUrl}/resources/${cat.slug || slugify(cat.name)}`,
  }));

  const authorRoutes: MetadataRoute.Sitemap = getAllAuthors().map((author) => ({
    changeFrequency: "weekly",
    lastModified: new Date(),
    priority: 0.7,
    url: `${baseUrl}/authors/${author.slug}`,
  }));

  return [...staticRoutes, ...toolRoutes, ...resourceRoutes, ...authorRoutes];
}
