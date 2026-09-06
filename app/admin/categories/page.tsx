import { asc, count, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminCategoriesClient } from "@/components/admin/admin-categories-client";
import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { db } from "@/lib/db";
import { category, resource } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Category Manager — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminCategoriesPage() {
  const rows = await db
    .select({
      id: category.id,
      createdAt: category.createdAt,
      description: category.description,
      icon: category.icon,
      name: category.name,
      order: category.order,
      slug: category.slug,
      themeColor: category.themeColor,
      toolCount: count(resource.id),
      updatedAt: category.updatedAt,
    })
    .from(category)
    .leftJoin(resource, eq(category.id, resource.categoryId))
    .groupBy(category.id)
    .orderBy(asc(category.order), asc(category.name));

  let categories = rows.map((r) => ({
    ...r,
    toolCount: Number(r.toolCount) || 0,
  }));

  if (categories.length === 0) {
    categories = CATEGORY_DEFINITIONS.map((def) => ({
      ...def,
      id: def.slug,
      createdAt: new Date(),
      toolCount: 0,
      updatedAt: new Date(),
    }));
  }

  return <AdminCategoriesClient initialCategories={categories} />;
}
