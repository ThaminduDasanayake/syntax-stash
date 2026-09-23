import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import {
  author,
  category,
  resource,
  resourceAuthor,
  resourceHealth,
  resourceTag,
  tag,
} from "@/lib/db/schema";
import { Resource } from "@/types";

/**
 * Fetches all live catalog resources from Neon Postgres, cached at the Next.js Edge.
 * Cache Tag: "resources"
 * Revalidated on-demand when an admin approves/edits/deletes a tool.
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
            categoryId: resource.categoryId,
            categoryName: category.name,
            categorySlug: category.slug,
            createdAt: resource.createdAt,
            description: resource.description,
            favicon: resource.favicon,
            github: resource.github,
            iconBg: resource.iconBg,
            ogImage: resource.ogImage,
            subtitle: resource.subtitle,
            tagName: tag.name,
            updatedAt: resource.updatedAt,
            url: resource.url,
          })
          .from(resource)
          .leftJoin(resourceAuthor, eq(resource.id, resourceAuthor.resourceId))
          .leftJoin(author, eq(resourceAuthor.authorId, author.id))
          .leftJoin(category, eq(resource.categoryId, category.id))
          .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
          .leftJoin(tag, eq(resourceTag.tagId, tag.id))
          .orderBy(asc(category.name), asc(resource.title));

        if (!rows || rows.length === 0) {
          return [];
        }

        const resourceMap = new Map<
          string,
          {
            id: string;
            authors: string[];
            category: string;
            createdAt?: string;
            description?: string;
            favicon?: string;
            github?: string;
            iconBg?: "dark" | "light" | "invert" | string | null;
            ogImage?: string;
            subtitle?: string;
            tags: string[];
            title: string;
            updatedAt?: string;
            url: string;
          }
        >();

        for (const r of rows) {
          const catName = r.categoryName || "Generators";
          let entry = resourceMap.get(r.id);
          if (!entry) {
            entry = {
              id: r.id,
              title: r.title,
              authors: r.authorName ? [r.authorName] : [],
              category: catName,
              createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined,
              description: r.description || undefined,
              favicon: r.favicon || undefined,
              github: r.github || undefined,
              iconBg: r.iconBg || "dark",
              ogImage: r.ogImage || undefined,
              subtitle: r.subtitle || undefined,
              tags: r.tagName ? [r.tagName] : [],
              updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
              url: r.url,
            };
            resourceMap.set(r.id, entry);
          } else {
            if (r.authorName && !entry.authors.includes(r.authorName)) {
              entry.authors.push(r.authorName);
            }
            if (r.tagName && !entry.tags.includes(r.tagName)) {
              entry.tags.push(r.tagName);
            }
          }
        }

        const mapped: Resource[] = Array.from(resourceMap.values()).map((r) => ({
          ...r,
          author: r.authors.length > 0 ? r.authors.join(", ") : undefined,
          tags: r.tags.length > 0 ? r.tags : undefined,
        }));

        // Ensure resources are strictly sorted by category alphabetical order (A → Z), then title (A → Z)
        return mapped.sort(
          (a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
        );
      } catch (err) {
        console.error("Database query failed in getAllResources():", err);
        return [];
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
    resources: import("@/components/admin/shared/types").AdminResourceItem[];
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
          categoryId: resource.categoryId,
          categoryName: category.name,
          categorySlug: category.slug,
          createdAt: resource.createdAt,
          description: resource.description,
          favicon: resource.favicon,
          github: resource.github,
          healthErrorMessage: resourceHealth.errorMessage,
          healthLastCheckedAt: resourceHealth.lastCheckedAt,
          healthRedirectUrl: resourceHealth.redirectUrl,
          healthStatus: resourceHealth.status,
          healthStatusCode: resourceHealth.statusCode,
          iconBg: resource.iconBg,
          ogImage: resource.ogImage,
          subtitle: resource.subtitle,
          tagName: tag.name,
          updatedAt: resource.updatedAt,
          url: resource.url,
        })
        .from(resource)
        .leftJoin(resourceAuthor, eq(resource.id, resourceAuthor.resourceId))
        .leftJoin(author, eq(resourceAuthor.authorId, author.id))
        .leftJoin(category, eq(resource.categoryId, category.id))
        .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
        .leftJoin(tag, eq(resourceTag.tagId, tag.id))
        .leftJoin(resourceHealth, eq(resource.id, resourceHealth.resourceId))
        .orderBy(desc(resource.createdAt));

      const categoryCounts: Record<string, number> = {};
      const resourceMap = new Map<
        string,
        Omit<import("@/components/admin/shared/types").AdminResourceItem, "tags"> & {
          authors: string[];
          tags: string[];
        }
      >();

      for (const r of rows) {
        const catName = r.categoryName || "Generators";
        let entry = resourceMap.get(r.id);
        if (!entry) {
          categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
          entry = {
            id: r.id,
            title: r.title,
            authorBlog: r.authorBlog,
            authorGithub: r.authorGithub,
            authorId: r.authorId,
            authorLinkedin: r.authorLinkedin,
            authorName: r.authorName,
            authors: r.authorName ? [r.authorName] : [],
            authorSlug: r.authorSlug,
            authorTwitter: r.authorTwitter,
            authorWebsite: r.authorWebsite,
            authorYoutube: r.authorYoutube,
            category: catName,
            createdAt: r.createdAt.toISOString(),
            description: r.description,
            favicon: r.favicon,
            github: r.github,
            healthErrorMessage: r.healthErrorMessage,
            healthLastCheckedAt: r.healthLastCheckedAt ? r.healthLastCheckedAt.toISOString() : null,
            healthRedirectUrl: r.healthRedirectUrl,
            healthStatus:
              (r.healthStatus as import("@/components/admin/shared/types").HealthStatus) || null,
            healthStatusCode: r.healthStatusCode,
            iconBg: r.iconBg || "dark",
            ogImage: r.ogImage,
            subtitle: r.subtitle,
            tags: r.tagName ? [r.tagName] : [],
            updatedAt: r.updatedAt.toISOString(),
            url: r.url,
          };
          resourceMap.set(r.id, entry);
        } else {
          if (r.authorName && !entry.authors.includes(r.authorName)) {
            entry.authors.push(r.authorName);
          }
          if (r.tagName && !entry.tags.includes(r.tagName)) {
            entry.tags.push(r.tagName);
          }
        }
      }

      const resources = Array.from(resourceMap.values()).map((r) => ({
        ...r,
        authorName: r.authors.length > 0 ? r.authors.join(", ") : r.authorName || null,
        tags: r.tags.join(", "),
      }));

      return { categoryCounts, resources };
    } catch (err) {
      console.error("Database query failed in getAllAdminResources():", err);
      return { categoryCounts: {}, resources: [] };
    }
  },
);
