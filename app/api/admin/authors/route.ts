import { count, desc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import { computeDiffs, logActivity } from "@/lib/db/audit";
import { author, resourceAuthor } from "@/lib/db/schema";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

export async function GET() {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const rows = await db
      .select({
        id: author.id,
        blog: author.blog,
        createdAt: author.createdAt,
        github: author.github,
        linkedin: author.linkedin,
        name: author.name,
        resourceCount: count(resourceAuthor.resourceId),
        slug: author.slug,
        twitter: author.twitter,
        updatedAt: author.updatedAt,
        website: author.website,
        youtube: author.youtube,
      })
      .from(author)
      .leftJoin(resourceAuthor, eq(author.id, resourceAuthor.authorId))
      .groupBy(author.id)
      .orderBy(desc(count(resourceAuthor.resourceId)), author.name);

    const result = rows.map((r) => ({
      ...r,
      resourceCount: Number(r.resourceCount) || 0,
    }));

    return NextResponse.json({
      authors: result,
      total: result.length,
    });
  } catch (error) {
    console.error("GET /api/admin/authors error:", error);
    return NextResponse.json({ error: "Failed to load authors." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { blog, github, linkedin, name, slug: customSlug, twitter, website, youtube } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Author name is required." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug =
      customSlug && typeof customSlug === "string" && customSlug.trim()
        ? slugifyAuthor(customSlug.trim())
        : slugifyAuthor(cleanName);

    if (!cleanSlug) {
      return NextResponse.json({ error: "Invalid author slug generated." }, { status: 400 });
    }

    const [existing] = await db.select().from(author).where(eq(author.slug, cleanSlug));
    if (existing) {
      return NextResponse.json(
        { error: `An author with slug "${cleanSlug}" already exists.` },
        { status: 409 },
      );
    }

    const newAuthorId = crypto.randomUUID();
    await db.insert(author).values({
      id: newAuthorId,
      blog: blog?.trim() || null,
      github: github?.trim() || null,
      linkedin: linkedin?.trim() || null,
      name: cleanName,
      slug: cleanSlug,
      twitter: twitter?.trim() || null,
      website: website?.trim() || null,
      youtube: youtube?.trim() || null,
    });

    revalidateTag("authors", { expire: 0 });
    revalidatePath("/authors");
    revalidatePath("/admin/authors");

    await logActivity({
      action: "created",
      actorEmail: adminUser.email,
      entityId: newAuthorId,
      entityTitle: cleanName,
      entityType: "author",
      metadata: { slug: cleanSlug },
    });

    return NextResponse.json({
      author: {
        id: newAuthorId,
        blog: blog?.trim() || null,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
        name: cleanName,
        resourceCount: 0,
        slug: cleanSlug,
        twitter: twitter?.trim() || null,
        website: website?.trim() || null,
        youtube: youtube?.trim() || null,
      },
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/authors error:", error);
    return NextResponse.json({ error: "Failed to create author." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, blog, github, linkedin, name, slug: customSlug, twitter, website, youtube } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Author ID is required." }, { status: 400 });
    }

    const [existing] = await db.select().from(author).where(eq(author.id, id));
    if (!existing) {
      return NextResponse.json({ error: "Author not found." }, { status: 404 });
    }

    const updateData: Partial<typeof author.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "Author name cannot be empty." }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (customSlug !== undefined) {
      const cleanSlug = slugifyAuthor(customSlug);
      if (!cleanSlug) {
        return NextResponse.json({ error: "Invalid slug provided." }, { status: 400 });
      }
      if (cleanSlug !== existing.slug) {
        const [slugConflict] = await db.select().from(author).where(eq(author.slug, cleanSlug));
        if (slugConflict && slugConflict.id !== id) {
          return NextResponse.json(
            { error: `Slug "${cleanSlug}" is already taken by another author.` },
            { status: 409 },
          );
        }
        updateData.slug = cleanSlug;
      }
    }

    if (website !== undefined) updateData.website = website ? website.trim() : null;
    if (twitter !== undefined) updateData.twitter = twitter ? twitter.trim() : null;
    if (github !== undefined) updateData.github = github ? github.trim() : null;
    if (youtube !== undefined) updateData.youtube = youtube ? youtube.trim() : null;
    if (linkedin !== undefined) updateData.linkedin = linkedin ? linkedin.trim() : null;
    if (blog !== undefined) updateData.blog = blog ? blog.trim() : null;

    await db.update(author).set(updateData).where(eq(author.id, id));

    revalidateTag("authors", { expire: 0 });
    revalidatePath("/authors");
    revalidatePath(`/authors/${existing.slug}`);
    if (updateData.slug) revalidatePath(`/authors/${updateData.slug}`);
    revalidatePath("/admin/authors");
    revalidatePath("/admin/resources");

    const fieldLabels: Record<string, string> = {
      blog: "Blog",
      github: "GitHub",
      linkedin: "LinkedIn",
      name: "Author Name",
      slug: "Author Slug",
      twitter: "Twitter",
      website: "Website",
      youtube: "YouTube",
    };

    const diffs = computeDiffs(
      existing as Record<string, unknown>,
      updateData,
      fieldLabels,
    );

    await logActivity({
      action: "updated",
      actorEmail: adminUser.email,
      diff: diffs,
      entityId: id,
      entityTitle: updateData.name || existing.name,
      entityType: "author",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/authors error:", error);
    return NextResponse.json({ error: "Failed to update author." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Author ID is required." }, { status: 400 });
    }

    const [existing] = await db.select().from(author).where(eq(author.id, id));
    if (!existing) {
      return NextResponse.json({ error: "Author not found." }, { status: 404 });
    }

    // Check if author has linked resources
    const [resourceCheck] = await db
      .select({ count: count(resourceAuthor.resourceId) })
      .from(resourceAuthor)
      .where(eq(resourceAuthor.authorId, id));

    if (resourceCheck && Number(resourceCheck.count) > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete "${existing.name}". It is assigned to ${resourceCheck.count} resource(s). Reassign or remove these resources first.`,
        },
        { status: 400 },
      );
    }

    await db.delete(author).where(eq(author.id, id));

    revalidateTag("authors", { expire: 0 });
    revalidatePath("/authors");
    revalidatePath("/admin/authors");

    await logActivity({
      action: "deleted",
      actorEmail: adminUser.email,
      entityId: id,
      entityTitle: existing.name,
      entityType: "author",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/authors error:", error);
    return NextResponse.json({ error: "Failed to delete author." }, { status: 500 });
  }
}
