import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { CATEGORY_DEFINITIONS } from "@/lib/categories";
import { db } from "@/lib/db";
import { category, resource } from "@/lib/db/schema";

export async function GET() {
  try {
    const dbCategories = await db.select().from(category).orderBy(asc(category.order));

    if (!dbCategories || dbCategories.length === 0) {
      // Return fallback definitions
      return NextResponse.json({
        categories: CATEGORY_DEFINITIONS.map((def) => ({
          ...def,
          id: def.slug,
          count: 0,
        })),
        total: CATEGORY_DEFINITIONS.length,
      });
    }

    // Get resource counts per category
    const resources = await db
      .select({
        categoryId: resource.categoryId,
      })
      .from(resource);

    const countMap = new Map<string, number>();
    for (const r of resources) {
      if (r.categoryId) {
        countMap.set(r.categoryId, (countMap.get(r.categoryId) || 0) + 1);
      }
    }

    const result = dbCategories.map((cat) => ({
      ...cat,
      count: countMap.get(cat.id) || 0,
    }));

    return NextResponse.json({
      categories: result,
      total: result.length,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    // Fallback gracefully to in-memory definitions if DB is unavailable
    return NextResponse.json({
      categories: CATEGORY_DEFINITIONS.map((def) => ({
        ...def,
        id: def.slug,
        count: 0,
      })),
      total: CATEGORY_DEFINITIONS.length,
    });
  }
}
