import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import { author, category, resource, resourceTag, submission, tag } from "@/lib/db/schema";
import { normalizeTag } from "@/lib/tags";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const statusParam = request.nextUrl.searchParams.get("status") || "pending";

    // Fetch all submissions to compute status counts
    const allSubmissions = await db.select().from(submission).orderBy(desc(submission.createdAt));

    const counts = {
      all: allSubmissions.length,
      approved: allSubmissions.filter((s) => s.status === "approved").length,
      pending: allSubmissions.filter((s) => s.status === "pending").length,
      rejected: allSubmissions.filter((s) => s.status === "rejected").length,
    };

    const filtered =
      statusParam === "all"
        ? allSubmissions
        : allSubmissions.filter((s) => s.status === statusParam);

    return NextResponse.json({ counts, submissions: filtered });
  } catch (error) {
    console.error("GET /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to load submissions." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    const updatedData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.status) {
      updatedData.status = updates.status;
      updatedData.reviewedAt = new Date();
    }
    if (updates.title !== undefined) updatedData.title = updates.title;
    if (updates.subtitle !== undefined) updatedData.subtitle = updates.subtitle;
    if (updates.url !== undefined) updatedData.url = updates.url;
    if (updates.description !== undefined) updatedData.description = updates.description;
    if (updates.category !== undefined) updatedData.category = updates.category;
    if (updates.author !== undefined) updatedData.author = updates.author;
    if (updates.authorWebsite !== undefined) updatedData.authorWebsite = updates.authorWebsite;
    if (updates.authorTwitter !== undefined) updatedData.authorTwitter = updates.authorTwitter;
    if (updates.authorGitHub !== undefined) updatedData.authorGitHub = updates.authorGitHub;
    if (updates.authorYouTube !== undefined) updatedData.authorYouTube = updates.authorYouTube;
    if (updates.authorLinkedIn !== undefined) updatedData.authorLinkedIn = updates.authorLinkedIn;
    if (updates.github !== undefined) updatedData.github = updates.github;
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon;
    if (updates.iconBg !== undefined) updatedData.iconBg = updates.iconBg;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage;
    if (updates.pricing !== undefined) updatedData.pricing = updates.pricing;
    if (updates.tags !== undefined) updatedData.tags = updates.tags;
    if (updates.adminNotes !== undefined) updatedData.adminNotes = updates.adminNotes;

    await db.update(submission).set(updatedData).where(eq(submission.id, id));

    // Fetch the updated full submission record
    const [sub] = await db.select().from(submission).where(eq(submission.id, id));

    if (sub) {
      if (sub.status === "approved") {
        // 1. Resolve or Create Author(s)
        let authorRecordId: string | null = null;
        if (sub.author && sub.author.trim()) {
          const authorName = sub.author.trim();
          const authorSlug = slugifyAuthor(authorName);

          // Ensure every individual author exists in author table
          const splitAuthors = authorName.includes(",")
            ? authorName
                .split(",")
                .map((a: string) => a.trim())
                .filter(Boolean)
            : [authorName];

          for (const singleName of splitAuthors) {
            const singleSlug = slugifyAuthor(singleName);
            if (!singleSlug) continue;
            const [singleExisting] = await db
              .select()
              .from(author)
              .where(eq(author.slug, singleSlug));
            if (!singleExisting) {
              await db.insert(author).values({
                id: crypto.randomUUID(),
                name: singleName,
                slug: singleSlug,
              });
            }
          }

          const [existingAuthor] = await db
            .select()
            .from(author)
            .where(eq(author.slug, authorSlug));

          if (existingAuthor) {
            authorRecordId = existingAuthor.id;
            // Optionally backfill missing links on existing author
            await db
              .update(author)
              .set({
                github: existingAuthor.github || sub.authorGitHub || null,
                linkedin: existingAuthor.linkedin || sub.authorLinkedIn || null,
                twitter: existingAuthor.twitter || sub.authorTwitter || null,
                updatedAt: new Date(),
                website: existingAuthor.website || sub.authorWebsite || null,
                youtube: existingAuthor.youtube || sub.authorYouTube || null,
              })
              .where(eq(author.id, existingAuthor.id));
          } else {
            authorRecordId = crypto.randomUUID();
            await db.insert(author).values({
              id: authorRecordId,
              github: sub.authorGitHub || null,
              linkedin: sub.authorLinkedIn || null,
              name: authorName,
              slug: authorSlug,
              twitter: sub.authorTwitter || null,
              website: sub.authorWebsite || null,
              youtube: sub.authorYouTube || null,
            });
          }
        }

        // 2. Resolve Category ID
        let categoryRecordId: string;
        const catQuery = sub.category ? sub.category.trim() : "Developer Tools & Utilities";
        const [foundCat] = await db
          .select()
          .from(category)
          .where(or(ilike(category.name, catQuery), ilike(category.slug, catQuery)));

        if (foundCat) {
          categoryRecordId = foundCat.id;
        } else {
          categoryRecordId = crypto.randomUUID();
          await db.insert(category).values({
            id: categoryRecordId,
            name: catQuery,
            slug: slugifyAuthor(catQuery),
          });
        }

        // 3. Insert or Update in Live Resource Catalog
        const [existingResource] = await db
          .select()
          .from(resource)
          .where(eq(resource.url, sub.url));

        let liveResourceId: string;

        if (existingResource) {
          liveResourceId = existingResource.id;
          await db
            .update(resource)
            .set({
              title: sub.title,
              authorId: authorRecordId,
              categoryId: categoryRecordId,
              description: sub.description,
              favicon: sub.favicon || null,
              github: sub.github || null,
              iconBg: sub.iconBg || "dark",
              ogImage: sub.ogImage || null,
              subtitle: sub.subtitle || null,
              updatedAt: new Date(),
            })
            .where(eq(resource.id, existingResource.id));
        } else {
          liveResourceId = crypto.randomUUID();
          await db.insert(resource).values({
            id: liveResourceId,
            title: sub.title,
            authorId: authorRecordId,
            categoryId: categoryRecordId,
            description: sub.description,
            favicon: sub.favicon || null,
            github: sub.github || null,
            iconBg: sub.iconBg || "dark",
            ogImage: sub.ogImage || null,
            subtitle: sub.subtitle || null,
            url: sub.url,
          });
        }

        // 4. Update tags in resourceTag junction table
        if (sub.tags && typeof sub.tags === "string" && sub.tags.trim()) {
          await db.delete(resourceTag).where(eq(resourceTag.resourceId, liveResourceId));

          const rawTags = sub.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          for (const rawTag of rawTags) {
            const tagSlug = normalizeTag(rawTag);
            if (!tagSlug) continue;

            let tagRecordId: string;
            const [existingTag] = await db.select().from(tag).where(eq(tag.slug, tagSlug));
            if (!existingTag) {
              const newTagId = crypto.randomUUID();
              await db.insert(tag).values({
                id: newTagId,
                name: rawTag,
                slug: tagSlug,
              });
              tagRecordId = newTagId;
            } else {
              tagRecordId = existingTag.id;
            }

            await db
              .insert(resourceTag)
              .values({
                resourceId: liveResourceId,
                tagId: tagRecordId,
              })
              .onConflictDoNothing();
          }
        }

        // 5. Purge Next.js Edge Data Cache for instant live update
        revalidateTag("resources", "max");
        revalidateTag("categories", "max");
        revalidateTag("tags", "max");
        revalidateTag("authors", "max");
        revalidatePath("/");
        revalidatePath("/resources");
        revalidatePath("/authors");
        revalidatePath("/tags");
      } else {
        // If status was changed to rejected or pending, remove from live catalog if present
        await db.delete(resource).where(eq(resource.url, sub.url));
        revalidateTag("resources", "max");
        revalidateTag("categories", "max");
        revalidateTag("tags", "max");
        revalidateTag("authors", "max");
        revalidatePath("/");
        revalidatePath("/resources");
        revalidatePath("/authors");
        revalidatePath("/tags");
      }
    }

    return NextResponse.json({
      message: "Submission updated and synchronized successfully.",
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to update submission." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing submission ID." }, { status: 400 });
    }

    // Check if the submission was published to resource table
    const [sub] = await db.select().from(submission).where(eq(submission.id, id));
    if (sub?.url) {
      await db.delete(resource).where(eq(resource.url, sub.url));
      revalidateTag("resources", "max");
      revalidateTag("categories", "max");
      revalidateTag("tags", "max");
      revalidateTag("authors", "max");
      revalidatePath("/");
      revalidatePath("/resources");
      revalidatePath("/authors");
      revalidatePath("/tags");
    }

    await db.delete(submission).where(eq(submission.id, id));

    return NextResponse.json({ message: "Submission deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
