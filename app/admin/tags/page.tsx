import { count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminTagsClient } from "@/components/admin/admin-tags-client";
import { db } from "@/lib/db";
import { resourceTag, tag } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Tags Manager — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminTagsPage() {
  const rows = await db
    .select({
      id: tag.id,
      createdAt: tag.createdAt,
      isFeatured: tag.isFeatured,
      name: tag.name,
      slug: tag.slug,
      toolCount: count(resourceTag.resourceId),
      updatedAt: tag.updatedAt,
    })
    .from(tag)
    .leftJoin(resourceTag, eq(tag.id, resourceTag.tagId))
    .groupBy(tag.id)
    .orderBy(desc(count(resourceTag.resourceId)), tag.name);

  const tags = rows.map((r) => ({
    ...r,
    toolCount: Number(r.toolCount) || 0,
  }));

  return <AdminTagsClient initialTags={tags} />;
}
