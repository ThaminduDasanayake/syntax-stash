import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { parseAuthors, slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import {
  author,
  category,
  resource,
  resourceAuthor,
  resourceHealth,
  resourceTag,
  tag,
} from "@/lib/db/schema";
import { normalizeTag } from "@/lib/tags";
import { normalizeUrl } from "@/lib/url-utils";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

interface AdminResourceRecord {
  authorBlog: string | null;
  authorGithub: string | null;
  authorId: string | null;
  authorLinkedin: string | null;
  authorName: string | null;
  authorSlug: string | null;
  authorTwitter: string | null;
  authorWebsite: string | null;
  authorYoutube: string | null;
  authors: string[];
  category: string;
  categoryId: string;
  categoryName: string | null;
  categorySlug: string | null;
  createdAt: string;
  description: string;
  favicon: string | null;
  github: string | null;
  healthErrorMessage?: string | null;
  healthLastCheckedAt?: string | null;
  healthRedirectUrl?: string | null;
  healthStatus?: import("@/components/admin/shared/types").HealthStatus | null;
  healthStatusCode?: number | null;
  iconBg: string | null;
  id: string;
  ogImage: string | null;
  subtitle: string | null;
  tags: string[];
  title: string;
  updatedAt: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const query = db
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
        healthErrorMessage: resourceHealth.errorMessage,
        healthLastCheckedAt: resourceHealth.lastCheckedAt,
        healthRedirectUrl: resourceHealth.redirectUrl,
        healthStatus: resourceHealth.status,
        healthStatusCode: resourceHealth.statusCode,
        iconBg: resource.iconBg,
        ogImage: resource.ogImage,
        subtitle: resource.subtitle,
        tagName: tag.name,
        updatedAt: resource.updatedAt,
        url: resource.url,
      })
      .from(resource)
      .leftJoin(resourceAuthor, eq(resource.id, resourceAuthor.resourceId))
      .leftJoin(author, eq(resourceAuthor.authorId, author.id))
      .leftJoin(category, eq(resource.categoryId, category.id))
      .leftJoin(resourceTag, eq(resource.id, resourceTag.resourceId))
      .leftJoin(tag, eq(resourceTag.tagId, tag.id))
      .leftJoin(resourceHealth, eq(resource.id, resourceHealth.resourceId));

    const rows = categoryId
      ? await query.where(eq(resource.categoryId, categoryId)).orderBy(desc(resource.createdAt))
      : await query.orderBy(desc(resource.createdAt));

    const categoryCounts: Record<string, number> = {};
    const resourceMap = new Map<string, AdminResourceRecord>();

    for (const r of rows) {
      const catName = r.categoryName || "Generators";
      let entry = resourceMap.get(r.id);
      if (!entry) {
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        entry = {
          id: r.id,
          title: r.title,
          authorBlog: r.authorBlog,
          authorGithub: r.authorGithub,
          authorId: r.authorId,
          authorLinkedin: r.authorLinkedin,
          authorName: r.authorName,
          authors: r.authorName ? [r.authorName] : [],
          authorSlug: r.authorSlug,
          authorTwitter: r.authorTwitter,
          authorWebsite: r.authorWebsite,
          authorYoutube: r.authorYoutube,
          category: catName,
          categoryId: r.categoryId,
          categoryName: r.categoryName,
          categorySlug: r.categorySlug,
          createdAt: r.createdAt.toISOString(),
          description: r.description,
          favicon: r.favicon,
          github: r.github,
          healthErrorMessage: r.healthErrorMessage,
          healthLastCheckedAt: r.healthLastCheckedAt ? r.healthLastCheckedAt.toISOString() : null,
          healthRedirectUrl: r.healthRedirectUrl,
          healthStatus:
            (r.healthStatus as import("@/components/admin/shared/types").HealthStatus) || null,
          healthStatusCode: r.healthStatusCode,
          iconBg: r.iconBg || "dark",
          ogImage: r.ogImage,
          subtitle: r.subtitle,
          tags: r.tagName ? [r.tagName] : [],
          updatedAt: r.updatedAt.toISOString(),
          url: r.url,
        };
        resourceMap.set(r.id, entry);
      } else {
        if (r.authorName && !entry.authors.includes(r.authorName)) {
          entry.authors.push(r.authorName);
        }
        if (r.tagName && !entry.tags.includes(r.tagName)) {
          entry.tags.push(r.tagName);
        }
      }
    }

    const resources = Array.from(resourceMap.values()).map((r) => ({
      ...r,
      authorName: r.authors.length > 0 ? r.authors.join(", ") : r.authorName || null,
      tags: r.tags.join(", "),
    }));

    return NextResponse.json({
      categoryCounts,
      resources,
      total: resources.length,
    });
  } catch (error) {
    console.error("GET /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to load resources." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      authorBlog,
      authorGithub,
      authorId,
      authorLinkedin,
      authorName,
      authorTwitter,
      authorWebsite,
      authorYoutube,
      category: categoryInput,
      description,
      favicon,
      github,
      iconBg,
      ogImage,
      subtitle,
      tags,
      url,
    } = body;

    if (!title || !url || !categoryInput || !description) {
      return NextResponse.json(
        { error: "Title, URL, category, and description are required." },
        { status: 400 },
      );
    }

    // Check if URL already exists
    const normalizedInputUrl = normalizeUrl(url);
    const existingResources = await db
      .select({ id: resource.id, title: resource.title, url: resource.url })
      .from(resource);
    const existing = existingResources.find((r) => normalizeUrl(r.url) === normalizedInputUrl);
    if (existing) {
      return NextResponse.json(
        { error: `A resource with this URL already exists: "${existing.title}"` },
        { status: 409 },
      );
    }

    // 1. Resolve Authors (Properly parses multi-authors and creates individual author entities)
    const resolvedAuthorIds: string[] = [];
    if (authorName && typeof authorName === "string" && authorName.trim()) {
      const parsed = parseAuthors(authorName);
      for (const singleName of parsed) {
        const cleanName = singleName.trim();
        if (!cleanName) continue;
        const slug = slugifyAuthor(cleanName);
        const [existingAuthor] = await db
          .select()
          .from(author)
          .where(or(eq(author.slug, slug), ilike(author.name, cleanName)));

        if (existingAuthor) {
          resolvedAuthorIds.push(existingAuthor.id);
        } else {
          const newAuthorId = crypto.randomUUID();
          await db.insert(author).values({
            id: newAuthorId,
            blog: parsed.length === 1 ? authorBlog || null : null,
            github: parsed.length === 1 ? authorGithub || null : null,
            linkedin: parsed.length === 1 ? authorLinkedin || null : null,
            name: cleanName,
            slug,
            twitter: parsed.length === 1 ? authorTwitter || null : null,
            website: parsed.length === 1 ? authorWebsite || null : null,
            youtube: parsed.length === 1 ? authorYoutube || null : null,
          });
          resolvedAuthorIds.push(newAuthorId);
        }
      }
    } else if (authorId && typeof authorId === "string" && authorId.trim()) {
      const [existingAuthor] = await db.select().from(author).where(eq(author.id, authorId.trim()));
      if (existingAuthor) {
        resolvedAuthorIds.push(existingAuthor.id);
      }
    }

    const primaryAuthorId = resolvedAuthorIds[0] || null;

    // 2. Resolve Category ID
    let categoryRecordId: string;
    const catQuery = categoryInput.trim();
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
        slug: normalizeTag(catQuery),
      });
    }

    // 3. Insert into resource table
    const resourceId = crypto.randomUUID();
    await db.insert(resource).values({
      id: resourceId,
      title: title.trim(),
      authorId: primaryAuthorId,
      categoryId: categoryRecordId,
      description: description.trim(),
      favicon: favicon?.trim() || null,
      github: github?.trim() || null,
      iconBg: iconBg || "dark",
      ogImage: ogImage?.trim() || null,
      subtitle: subtitle?.trim() || null,
      url: url.trim(),
    });

    // 4. Link all authors in resourceAuthor junction table
    for (const aId of resolvedAuthorIds) {
      await db
        .insert(resourceAuthor)
        .values({
          authorId: aId,
          resourceId,
        })
        .onConflictDoNothing();
    }

    // 5. Resolve and insert tags into resourceTag junction table
    if (tags && typeof tags === "string" && tags.trim()) {
      const rawTags = tags
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
            resourceId,
            tagId: tagRecordId,
          })
          .onConflictDoNothing();
      }
    }

    // 6. Purge edge cache
    revalidateTag("resources", "max");
    revalidateTag("categories", "max");
    revalidateTag("tags", "max");
    revalidateTag("authors", "max");
    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/authors");

    return NextResponse.json({
      id: resourceId,
      message: "Resource created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to create resource." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, authorId, authorName, tags, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Resource ID is required." }, { status: 400 });
    }

    const [existingResource] = await db.select().from(resource).where(eq(resource.id, id));
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    // 1. Resolve author(s)
    let shouldSyncAuthors = false;
    let newAuthorIds: string[] = [];
    let primaryAuthorId = existingResource.authorId;

    if (authorName !== undefined) {
      shouldSyncAuthors = true;
      if (authorName && typeof authorName === "string" && authorName.trim()) {
        const parsed = parseAuthors(authorName);
        for (const singleName of parsed) {
          const cleanName = singleName.trim();
          if (!cleanName) continue;
          const slug = slugifyAuthor(cleanName);
          const [existingAuthor] = await db
            .select()
            .from(author)
            .where(or(eq(author.slug, slug), ilike(author.name, cleanName)));

          if (existingAuthor) {
            newAuthorIds.push(existingAuthor.id);
          } else {
            const newAuthorId = crypto.randomUUID();
            await db.insert(author).values({
              id: newAuthorId,
              blog: parsed.length === 1 ? updates.authorBlog || null : null,
              github: parsed.length === 1 ? updates.authorGithub || null : null,
              linkedin: parsed.length === 1 ? updates.authorLinkedin || null : null,
              name: cleanName,
              slug,
              twitter: parsed.length === 1 ? updates.authorTwitter || null : null,
              website: parsed.length === 1 ? updates.authorWebsite || null : null,
              youtube: parsed.length === 1 ? updates.authorYoutube || null : null,
            });
            newAuthorIds.push(newAuthorId);
          }
        }
        primaryAuthorId = newAuthorIds[0] || null;
      } else {
        primaryAuthorId = null;
        newAuthorIds = [];
      }
    } else if (authorId !== undefined) {
      shouldSyncAuthors = true;
      if (authorId && typeof authorId === "string" && authorId.trim()) {
        const [existingAuthor] = await db
          .select()
          .from(author)
          .where(eq(author.id, authorId.trim()));
        if (existingAuthor) {
          primaryAuthorId = existingAuthor.id;
          newAuthorIds = [existingAuthor.id];
        } else {
          primaryAuthorId = null;
          newAuthorIds = [];
        }
      } else {
        primaryAuthorId = null;
        newAuthorIds = [];
      }
    }

    // 2. Update resource record
    const updatedData: Record<string, unknown> = {
      authorId: primaryAuthorId,
      updatedAt: new Date(),
    };

    if (updates.category !== undefined) {
      const catQuery = updates.category.trim();
      const [foundCat] = await db
        .select()
        .from(category)
        .where(or(ilike(category.name, catQuery), ilike(category.slug, catQuery)));
      if (foundCat) {
        updatedData.categoryId = foundCat.id;
      }
    }

    if (updates.title !== undefined) updatedData.title = updates.title.trim();
    if (updates.subtitle !== undefined) updatedData.subtitle = updates.subtitle?.trim() || null;
    if (updates.description !== undefined) updatedData.description = updates.description.trim();
    if (updates.url !== undefined) {
      const normalizedNew = normalizeUrl(updates.url);
      const allResources = await db
        .select({ id: resource.id, title: resource.title, url: resource.url })
        .from(resource);
      const conflict = allResources.find(
        (r) => r.id !== id && normalizeUrl(r.url) === normalizedNew,
      );
      if (conflict) {
        return NextResponse.json(
          { error: `A resource with this URL already exists: "${conflict.title}"` },
          { status: 409 },
        );
      }
      updatedData.url = updates.url.trim();
    }
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon?.trim() || null;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage?.trim() || null;
    if (updates.github !== undefined) updatedData.github = updates.github?.trim() || null;
    if (updates.iconBg !== undefined) updatedData.iconBg = updates.iconBg || "dark";

    await db.update(resource).set(updatedData).where(eq(resource.id, id));

    // 3. Sync resourceAuthor junction table if authors changed
    if (shouldSyncAuthors) {
      await db.delete(resourceAuthor).where(eq(resourceAuthor.resourceId, id));
      for (const aId of newAuthorIds) {
        await db
          .insert(resourceAuthor)
          .values({
            authorId: aId,
            resourceId: id,
          })
          .onConflictDoNothing();
      }
    }

    // 4. Update tags if provided
    if (tags !== undefined) {
      await db.delete(resourceTag).where(eq(resourceTag.resourceId, id));

      if (typeof tags === "string" && tags.trim()) {
        const rawTags = tags
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
              resourceId: id,
              tagId: tagRecordId,
            })
            .onConflictDoNothing();
        }
      }
    }

    // 4. Purge edge cache
    revalidateTag("resources", { expire: 0 });
    revalidateTag("categories", { expire: 0 });
    revalidateTag("tags", { expire: 0 });
    revalidateTag("authors", { expire: 0 });
    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/authors");

    return NextResponse.json({ message: "Resource updated successfully.", success: true });
  } catch (error) {
    console.error("PATCH /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to update resource." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing resource ID." }, { status: 400 });
    }

    await db.delete(resource).where(eq(resource.id, id));

    revalidateTag("resources", { expire: 0 });
    revalidateTag("categories", { expire: 0 });
    revalidateTag("tags", { expire: 0 });
    revalidateTag("authors", { expire: 0 });
    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/authors");

    return NextResponse.json({ message: "Resource deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to delete resource." }, { status: 500 });
  }
}
