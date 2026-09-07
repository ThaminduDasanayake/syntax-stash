import { asc, count, eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import { db } from "@/lib/db";
import { category, resource } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export interface CategoryItem {
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
  order: number;
  resourceCount?: number;
  slug: string;
  themeColor: string | null;
}

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
            description: category.description,
            icon: category.icon,
            name: category.name,
            order: category.order,
            resourceCount: count(resource.id),
            slug: category.slug,
            themeColor: category.themeColor,
          })
          .from(category)
          .leftJoin(resource, eq(category.id, resource.categoryId))
          .groupBy(category.id)
          .orderBy(asc(category.order), asc(category.name));

        return rows.map((r) => ({
          id: r.id,
          description: r.description,
          icon: r.icon,
          name: r.name,
          order: r.order,
          resourceCount: Number(r.resourceCount) || 0,
          slug: r.slug,
          themeColor: r.themeColor,
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
    categories.find(
      (c) => c.name.toLowerCase() === clean || c.slug.toLowerCase() === clean,
    ) || null
  );
}

/**
 * Helper to revalidate the cached categories tag.
 */
export function invalidateCategoryCache() {
  try {
    revalidateTag("categories", "max");
  } catch {
    // Ignore outside request context
  }
}
