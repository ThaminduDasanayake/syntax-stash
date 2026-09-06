import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminResourceForm } from "@/components/admin/admin-resource-form";
import { db } from "@/lib/db";
import { author, category, resource, resourceTag, tag } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Edit Tool — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditResourcePage({ params }: EditPageProps) {
  const { id } = await params;

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
      ogImage: resource.ogImage,
      subtitle: resource.subtitle,
      tagName: tag.name,
      updatedAt: resource.updatedAt,
      url: resource.url,
    })
    .from(resource)
    .leftJoin(author, eq(resource.authorId, author.id))
    .leftJoin(category, eq(resource.categoryId, category.id))
    .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
    .leftJoin(tag, eq(resourceTag.tagId, tag.id))
    .where(eq(resource.id, id));

  if (!rows || rows.length === 0) {
    notFound();
  }

  const first = rows[0];
  const tagsList = rows
    .map((r) => r.tagName)
    .filter((t): t is string => Boolean(t));

  const initialData = {
    ...first,
    category: first.categoryName || "Generators",
    createdAt: first.createdAt.toISOString(),
    tags: tagsList.join(", "),
    updatedAt: first.updatedAt.toISOString(),
  };

  return <AdminResourceForm initialData={initialData} mode="edit" />;
}
