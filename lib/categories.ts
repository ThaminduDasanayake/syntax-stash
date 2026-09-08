import { asc, count, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { category, resource } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  resourceCount?: number;
  slug: string;
}

// Backward compatibility aliases
export type CategoryKey = string;
export type CategoryValue = string;
export const CATEGORIES: Record<string, string> = {};
export const CATEGORY_DEFINITIONS: CategoryItem[] = [];
export const resourceCategories: string[] = [];

/**
 * Fetches all active categories directly from the Neon Postgres category table.
 * Cached at Next.js edge and revalidated on tag "categories".
 */
export const getAllCategories = cache(
  unstable_cache(
    async (): Promise<CategoryItem[]> => {
      try {
        const rows = await db
          .select({
            id: category.id,
            name: category.name,
            resourceCount: count(resource.id),
            slug: category.slug,
          })
          .from(category)
          .leftJoin(resource, eq(category.id, resource.categoryId))
          .groupBy(category.id)
          .orderBy(asc(category.name));

        return rows.map((r) => ({
          id: r.id,
          name: r.name,
          resourceCount: Number(r.resourceCount) || 0,
          slug: r.slug,
        }));
      } catch (error) {
        console.error("Database query failed in getAllCategories():", error);
        return [];
      }
    },
    ["all-categories"],
    { revalidate: 3600, tags: ["categories"] },
  ),
);

/**
 * Retrieves a category by either its slug or formatted name.
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const categories = await getAllCategories();
  const clean = slug.trim().toLowerCase();
  return (
    categories.find(
      (c) => c.slug.toLowerCase() === clean || slugify(c.name).toLowerCase() === clean,
    ) || null
  );
}

/**
 * Retrieves a category by name.
 */
export async function getCategoryByName(name: string): Promise<CategoryItem | null> {
  const categories = await getAllCategories();
  const clean = name.trim().toLowerCase();
  return (
    categories.find((c) => c.name.toLowerCase() === clean || c.slug.toLowerCase() === clean) || null
  );
}

/**
 * Helper to revalidate the cached categories tag.
 */
export function invalidateCategoryCache() {
  try {
    revalidateTag("categories", { expire: 0 });
  } catch {
    // Ignore outside request context
  }
}
