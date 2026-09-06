import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { author, category, resource } from "@/lib/db/schema";
import { resourceLinks as STATIC_FALLBACK_RESOURCES } from "@/lib/resource-data";
import { Resource } from "@/types";

/**
 * Fetches all live catalog resources from Neon Postgres, cached at the Next.js Edge.
 * Cache Tag: "resources"
 * Revalidated on-demand when an admin approves/edits/delete a tool.
 * Gracefully falls back to bundled static data if the database is temporarily unreachable.
 */
export const getAllResources = cache(
  unstable_cache(
    async (): Promise<Resource[]> => {
      try {
        const rows = await db
          .select({
            id: resource.id,
            title: resource.title,
            authorBlog: author.blog,
            authorGithub: author.github,
            authorId: resource.authorId,
            authorLinkedin: author.linkedin,
            authorName: author.name,
            authorSlug: author.slug,
            authorTwitter: author.twitter,
            authorWebsite: author.website,
            authorYoutube: author.youtube,
            category: resource.category,
            categoryIcon: category.icon,
            categoryId: resource.categoryId,
            categoryName: category.name,
            categorySlug: category.slug,
            createdAt: resource.createdAt,
            description: resource.description,
            favicon: resource.favicon,
            github: resource.github,
            ogImage: resource.ogImage,
            subtitle: resource.subtitle,
            tags: resource.tags,
            url: resource.url,
          })
          .from(resource)
          .leftJoin(author, eq(resource.authorId, author.id))
          .leftJoin(category, eq(resource.categoryId, category.id))
          .orderBy(desc(resource.createdAt));

        if (!rows || rows.length === 0) {
          return STATIC_FALLBACK_RESOURCES;
        }

        return rows.map((r) => {
          return {
            title: r.title,
            author: r.authorName || undefined,
            category: r.categoryName || r.category,
            description: r.description || undefined,
            favicon: r.favicon || undefined,
            github: r.github || undefined,
            ogImage: r.ogImage || undefined,
            subtitle: r.subtitle || undefined,
            tags: r.tags
              ? r.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : undefined,
            url: r.url,
          };
        });
      } catch (err) {
        console.error("Database query failed in getAllResources(), serving static fallback:", err);
        return STATIC_FALLBACK_RESOURCES;
      }
    },
    ["all-resources-cache"],
    {
      revalidate: 86400, // 24 hours fallback TTL
      tags: ["resources"],
    },
  ),
);

/**
 * Fetches all live catalog resources for Admin management, cached at the Next.js Edge.
 * Cache Tag: "resources"
 */
export const getAllAdminResources = cache(
  unstable_cache(
    async (): Promise<{
      categoryCounts: Record<string, number>;
      resources: import("@/components/admin/types").AdminResourceItem[];
    }> => {
      try {
        const rows = await db
          .select({
            id: resource.id,
            title: resource.title,
            authorBlog: author.blog,
            authorGithub: author.github,
            authorId: resource.authorId,
            authorLinkedin: author.linkedin,
            authorName: author.name,
            authorSlug: author.slug,
            authorTwitter: author.twitter,
            authorWebsite: author.website,
            authorYoutube: author.youtube,
            category: resource.category,
            categoryIcon: category.icon,
            categoryId: resource.categoryId,
            categoryName: category.name,
            categorySlug: category.slug,
            createdAt: resource.createdAt,
            description: resource.description,
            favicon: resource.favicon,
            github: resource.github,
            ogImage: resource.ogImage,
            subtitle: resource.subtitle,
            tags: resource.tags,
            updatedAt: resource.updatedAt,
            url: resource.url,
          })
          .from(resource)
          .leftJoin(author, eq(resource.authorId, author.id))
          .leftJoin(category, eq(resource.categoryId, category.id))
          .orderBy(desc(resource.createdAt));

        const categoryCounts: Record<string, number> = {};
        const resources = rows.map((r) => {
          const catName = r.categoryName || r.category;
          categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
          return {
            ...r,
            category: catName,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
          };
        });

        return { categoryCounts, resources };
      } catch (err) {
        console.error("Database query failed in getAllAdminResources():", err);
        return { categoryCounts: {}, resources: [] };
      }
    },
    ["admin-all-resources-cache"],
    {
      revalidate: 86400,
      tags: ["resources"],
    },
  ),
);
