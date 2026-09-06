import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { resourceTag, tag } from "@/lib/db/schema";
import { getAllResources } from "@/lib/resources";
import { getAllTags } from "@/lib/tags";

export async function GET() {
  try {
    const dbTags = await db
      .select({
        id: tag.id,
        count: count(resourceTag.resourceId),
        isFeatured: tag.isFeatured,
        name: tag.name,
        slug: tag.slug,
      })
      .from(tag)
      .leftJoin(resourceTag, eq(tag.id, resourceTag.tagId))
      .groupBy(tag.id, tag.name, tag.slug, tag.isFeatured)
      .orderBy(desc(count(resourceTag.resourceId)), tag.name);

    if (dbTags && dbTags.length > 0) {
      return NextResponse.json({
        tags: dbTags.map((t) => ({
          id: t.id,
          count: Number(t.count) || 0,
          isFeatured: t.isFeatured,
          name: t.name,
          slug: t.slug,
        })),
        total: dbTags.length,
      });
    }

    const resources = await getAllResources();
    const fallbackTags = getAllTags(resources);

    return NextResponse.json({
      tags: fallbackTags,
      total: fallbackTags.length,
    });
  } catch (error) {
    console.error("GET /api/tags error, using fallback:", error);
    try {
      const resources = await getAllResources();
      const fallbackTags = getAllTags(resources);
      return NextResponse.json({
        tags: fallbackTags,
        total: fallbackTags.length,
      });
    } catch {
      return NextResponse.json({ error: "Failed to fetch tags." }, { status: 500 });
    }
  }
}

