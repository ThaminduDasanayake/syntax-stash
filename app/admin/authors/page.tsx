import { count, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminAuthorsClient } from "@/components/admin/admin-authors-client";
import { db } from "@/lib/db";
import { author, resource } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Authors Manager — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminAuthorsPage() {
  const rows = await db
    .select({
      id: author.id,
      blog: author.blog,
      createdAt: author.createdAt,
      github: author.github,
      linkedin: author.linkedin,
      name: author.name,
      resourceCount: count(resource.id),
      slug: author.slug,
      twitter: author.twitter,
      updatedAt: author.updatedAt,
      website: author.website,
      youtube: author.youtube,
    })
    .from(author)
    .leftJoin(resource, eq(author.id, resource.authorId))
    .groupBy(author.id)
    .orderBy(desc(count(resource.id)), author.name);

  const authors = rows.map((r) => ({
    ...r,
    resourceCount: Number(r.resourceCount) || 0,
  }));

  return <AdminAuthorsClient initialAuthors={authors} />;
}
