import { asc, count, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { resourceTag, tag } from "@/lib/db/schema";
import { normalizeTag } from "@/lib/utils";
import { Resource } from "@/types";

export interface TagItem {
  id?: string;
  count: number;
  isFeatured?: boolean;
  name: string;
  slug: string;
}

// Backward compatibility alias
export type TagInfo = TagItem;

export { normalizeTag };

/**
 * Derives tags in-memory from a resource list (fallback / helper mode).
 */
export function getTagsFromResources(list: Resource[]): TagItem[] {
  const tagCounts = new Map<string, { count: number; name: string }>();

  for (const item of list) {
    if (!item.tags) continue;
    const tagsArray = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
        ? (item.tags as string).split(",")
        : [];

    for (const rawTag of tagsArray) {
      const normalized = normalizeTag(rawTag);
      if (!normalized) continue;
      const existing = tagCounts.get(normalized);
      if (existing) {
        existing.count += 1;
      } else {
        tagCounts.set(normalized, { count: 1, name: rawTag.trim() });
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([slug, { count, name }]) => ({
      count,
      name,
      slug,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Fetches all canonical tags from Neon Postgres with resource counts.
 * Cached at Next.js edge and revalidated on tag "tags".
 */
export const getAllTags = cache(
  unstable_cache(
    async (customResources?: Resource[]): Promise<TagItem[]> => {
      if (customResources && customResources.length > 0) {
        return getTagsFromResources(customResources);
      }

      try {
        const rows = await db
          .select({
            id: tag.id,
            count: count(resourceTag.resourceId),
            isFeatured: tag.isFeatured,
            name: tag.name,
            slug: tag.slug,
          })
          .from(tag)
          .leftJoin(resourceTag, eq(tag.id, resourceTag.tagId))
          .groupBy(tag.id)
          .orderBy(asc(tag.name));

        return rows.map((r) => ({
          id: r.id,
          count: Number(r.count) || 0,
          isFeatured: Boolean(r.isFeatured),
          name: r.name,
          slug: r.slug,
        }));
      } catch (error) {
        console.error("Database query failed in getAllTags():", error);
        return [];
      }
    },
    ["all-tags"],
    { revalidate: 3600, tags: ["tags"] },
  ),
);

/**
 * Retrieves a tag by its slug or name.
 */
export async function getTagBySlug(slug: string): Promise<TagItem | null> {
  const tags = await getAllTags();
  const clean = normalizeTag(slug);
  return tags.find((t) => t.slug === clean || normalizeTag(t.name) === clean) || null;
}

/**
 * Retrieves a tag by exact name.
 */
export async function getTagByName(name: string): Promise<TagItem | null> {
  const tags = await getAllTags();
  const clean = normalizeTag(name);
  return tags.find((t) => normalizeTag(t.name) === clean || t.slug === clean) || null;
}

/**
 * Helper to revalidate the cached tags.
 */
export function invalidateTagCache() {
  try {
    revalidateTag("tags", { expire: 0 });
  } catch {
    // Ignore outside request context
  }
}
