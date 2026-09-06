import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminResourceForm } from "@/components/admin/admin-resource-form";
import { db } from "@/lib/db";
import { author, category, resource } from "@/lib/db/schema";

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

  const [row] = await db
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
      category: resource.category,
      categoryId: resource.categoryId,
      categoryName: category.name,
      categorySlug: category.slug,
      createdAt: resource.createdAt,
      description: resource.description,
      favicon: resource.favicon,
      github: resource.github,
      ogImage: resource.ogImage,
      subtitle: resource.subtitle,
      tags: resource.tags,
      updatedAt: resource.updatedAt,
      url: resource.url,
    })
    .from(resource)
    .leftJoin(author, eq(resource.authorId, author.id))
    .leftJoin(category, eq(resource.categoryId, category.id))
    .where(eq(resource.id, id));

  if (!row) {
    notFound();
  }

  const initialData = {
    ...row,
    category: row.categoryName || row.category,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };

  return <AdminResourceForm initialData={initialData} mode="edit" />;
}
