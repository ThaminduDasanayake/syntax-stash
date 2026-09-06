import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { author, category, resource, resourceTag, tag } from "@/lib/db/schema";
import { resourceLinks as STATIC_FALLBACK_RESOURCES } from "@/lib/resource-data";
import { Resource } from "@/types";

/**
 * Fetches all live catalog resources from Neon Postgres, cached at the Next.js Edge.
 * Cache Tag: "resources"
 * Revalidated on-demand when an admin approves/edits/deletes a tool.
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
            tagName: tag.name,
            url: resource.url,
          })
          .from(resource)
          .leftJoin(author, eq(resource.authorId, author.id))
          .leftJoin(category, eq(resource.categoryId, category.id))
          .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
          .leftJoin(tag, eq(resourceTag.tagId, tag.id))
          .orderBy(asc(category.order), asc(category.name), asc(resource.title));

        if (!rows || rows.length === 0) {
          return STATIC_FALLBACK_RESOURCES;
        }

        const resourceMap = new Map<
          string,
          {
            author?: string;
            category: string;
            description?: string;
            favicon?: string;
            github?: string;
            ogImage?: string;
            subtitle?: string;
            tags: string[];
            title: string;
            url: string;
          }
        >();

        for (const r of rows) {
          const catName = r.categoryName || "Generators";
          if (!resourceMap.has(r.id)) {
            resourceMap.set(r.id, {
              title: r.title,
              author: r.authorName || undefined,
              category: catName,
              description: r.description || undefined,
              favicon: r.favicon || undefined,
              github: r.github || undefined,
              ogImage: r.ogImage || undefined,
              subtitle: r.subtitle || undefined,
              tags: r.tagName ? [r.tagName] : [],
              url: r.url,
            });
          } else if (r.tagName) {
            const entry = resourceMap.get(r.id)!;
            if (!entry.tags.includes(r.tagName)) {
              entry.tags.push(r.tagName);
            }
          }
        }

        const mapped: Resource[] = Array.from(resourceMap.values()).map((r) => ({
          ...r,
          tags: r.tags.length > 0 ? r.tags : undefined,
        }));

        // Ensure resources are strictly sorted by category alphabetical order (A → Z), then title (A → Z)
        return mapped.sort(
          (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
        );
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
 * Fetches all live catalog resources for Admin management directly from Neon Postgres.
 */
export const getAllAdminResources = cache(
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
          tagName: tag.name,
          updatedAt: resource.updatedAt,
          url: resource.url,
        })
        .from(resource)
        .leftJoin(author, eq(resource.authorId, author.id))
        .leftJoin(category, eq(resource.categoryId, category.id))
        .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
        .leftJoin(tag, eq(resourceTag.tagId, tag.id))
        .orderBy(desc(resource.createdAt));

      const categoryCounts: Record<string, number> = {};
      const resourceMap = new Map<
        string,
        Omit<import("@/components/admin/types").AdminResourceItem, "tags"> & { tags: string[] }
      >();

      for (const r of rows) {
        const catName = r.categoryName || "Generators";
        if (!resourceMap.has(r.id)) {
          categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
          resourceMap.set(r.id, {
            id: r.id,
            title: r.title,
            authorBlog: r.authorBlog,
            authorGithub: r.authorGithub,
            authorId: r.authorId,
            authorLinkedin: r.authorLinkedin,
            authorName: r.authorName,
            authorSlug: r.authorSlug,
            authorTwitter: r.authorTwitter,
            authorWebsite: r.authorWebsite,
            authorYoutube: r.authorYoutube,
            category: catName,
            createdAt: r.createdAt.toISOString(),
            description: r.description,
            favicon: r.favicon,
            github: r.github,
            ogImage: r.ogImage,
            subtitle: r.subtitle,
            tags: r.tagName ? [r.tagName] : [],
            updatedAt: r.updatedAt.toISOString(),
            url: r.url,
          });
        } else if (r.tagName) {
          const entry = resourceMap.get(r.id)!;
          if (!entry.tags.includes(r.tagName)) {
            entry.tags.push(r.tagName);
          }
        }
      }

      const resources = Array.from(resourceMap.values()).map((r) => ({
        ...r,
        tags: r.tags.join(", "),
      }));

      return { categoryCounts, resources };
    } catch (err) {
      console.error("Database query failed in getAllAdminResources():", err);
      return { categoryCounts: {}, resources: [] };
    }
  },
);
