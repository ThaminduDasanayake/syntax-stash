import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getAllAuthors } from "@/lib/authors";
import { db } from "@/lib/db";
import { author, resource } from "@/lib/db/schema";
import { getAllResources } from "@/lib/resources";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: author.id,
        blog: author.blog,
        github: author.github,
        linkedin: author.linkedin,
        name: author.name,
        resourceCount: count(resource.id),
        slug: author.slug,
        twitter: author.twitter,
        website: author.website,
        youtube: author.youtube,
      })
      .from(author)
      .leftJoin(resource, eq(author.id, resource.authorId))
      .groupBy(author.id)
      .orderBy(desc(count(resource.id)), author.name);

    if (rows && rows.length > 0) {
      const authors = rows.map((r) => ({
        count: Number(r.resourceCount) || 0,
        links: {
          blog: r.blog || undefined,
          github: r.github || undefined,
          linkedin: r.linkedin || undefined,
          twitter: r.twitter || undefined,
          website: r.website || undefined,
          youtube: r.youtube || undefined,
        },
        name: r.name,
        slug: r.slug,
      }));

      return NextResponse.json({
        authors,
        total: authors.length,
      });
    }

    const resources = await getAllResources();
    const authors = getAllAuthors(resources).map((a) => ({
      count: a.count,
      links: a.links || null,
      name: a.name,
      slug: a.slug,
    }));

    return NextResponse.json({
      authors,
      total: authors.length,
    });
  } catch (error) {
    console.error("GET /api/authors error:", error);
    try {
      const resources = await getAllResources();
      const authors = getAllAuthors(resources).map((a) => ({
        count: a.count,
        links: a.links || null,
        name: a.name,
        slug: a.slug,
      }));
      return NextResponse.json({
        authors,
        total: authors.length,
      });
    } catch {
      return NextResponse.json({ error: "Failed to fetch authors." }, { status: 500 });
    }
  }
}

