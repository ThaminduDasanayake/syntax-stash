import { desc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import { author, resource, submission } from "@/lib/db/schema";

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
    if (updates.authorLink !== undefined) updatedData.authorLink = updates.authorLink;
    if (updates.authorWebsite !== undefined) updatedData.authorWebsite = updates.authorWebsite;
    if (updates.authorTwitter !== undefined) updatedData.authorTwitter = updates.authorTwitter;
    if (updates.authorGitHub !== undefined) updatedData.authorGitHub = updates.authorGitHub;
    if (updates.authorYouTube !== undefined) updatedData.authorYouTube = updates.authorYouTube;
    if (updates.authorLinkedIn !== undefined) updatedData.authorLinkedIn = updates.authorLinkedIn;
    if (updates.gitHubLink !== undefined) updatedData.gitHubLink = updates.gitHubLink;
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage;
    if (updates.pricing !== undefined) updatedData.pricing = updates.pricing;
    if (updates.tags !== undefined) updatedData.tags = updates.tags;
    if (updates.adminNotes !== undefined) updatedData.adminNotes = updates.adminNotes;

    await db.update(submission).set(updatedData).where(eq(submission.id, id));

    // Fetch the updated full submission record
    const [sub] = await db.select().from(submission).where(eq(submission.id, id));

    if (sub) {
      if (sub.status === "approved") {
        // 1. Resolve or Create Author
        let authorRecordId: string | null = null;
        if (sub.author && sub.author.trim()) {
          const authorName = sub.author.trim();
          const authorSlug = slugifyAuthor(authorName);

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
                website: existingAuthor.website || sub.authorWebsite || sub.authorLink || null,
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
              website: sub.authorWebsite || sub.authorLink || null,
              youtube: sub.authorYouTube || null,
            });
          }
        }

        // 2. Insert or Update in Live Resource Catalog
        const [existingResource] = await db
          .select()
          .from(resource)
          .where(eq(resource.url, sub.url));

        if (existingResource) {
          await db
            .update(resource)
            .set({
              title: sub.title,
              authorId: authorRecordId,
              category: sub.category,
              description: sub.description,
              favicon: sub.favicon || null,
              github: sub.gitHubLink || null, // Renamed github column
              ogImage: sub.ogImage || null,
              subtitle: sub.subtitle || null,
              tags: sub.tags || null,
              updatedAt: new Date(),
            })
            .where(eq(resource.id, existingResource.id));
        } else {
          await db.insert(resource).values({
            id: crypto.randomUUID(),
            title: sub.title,
            authorId: authorRecordId,
            category: sub.category,
            description: sub.description,
            favicon: sub.favicon || null,
            github: sub.gitHubLink || null, // Renamed github column
            ogImage: sub.ogImage || null,
            subtitle: sub.subtitle || null,
            tags: sub.tags || null,
            url: sub.url,
          });
        }

        // 3. Purge Next.js Edge Data Cache for instant live update
        revalidateTag("resources", "max");
        revalidatePath("/");
        revalidatePath("/resources");
      } else {
        // If status was changed to rejected or pending, remove from live catalog if present
        await db.delete(resource).where(eq(resource.url, sub.url));
        revalidateTag("resources", "max");
        revalidatePath("/");
        revalidatePath("/resources");
      }
    }

    return NextResponse.json({ message: "Submission updated and synchronized successfully.", success: true });
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
      revalidatePath("/");
      revalidatePath("/resources");
    }

    await db.delete(submission).where(eq(submission.id, id));

    return NextResponse.json({ message: "Submission deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
