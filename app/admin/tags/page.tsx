import { count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { TagsManager } from "@/components/admin/tags/tags-manager";
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

  return <TagsManager initialTags={tags} />;
}
