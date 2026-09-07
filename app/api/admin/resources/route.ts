import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import { author, category, resource, resourceTag, tag } from "@/lib/db/schema";
import { normalizeTag } from "@/lib/tags";

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
  category: string;
  categoryIcon: string | null;
  categoryId: string;
  categoryName: string | null;
  categorySlug: string | null;
  createdAt: string;
  description: string;
  favicon: string | null;
  github: string | null;
  id: string;
  ogImage: string | null;
  subtitle: string | null;
  tags: string[];
  title: string;
  updatedAt: string;
  url: string;
}

export async function GET() {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

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
        categoryIcon: category.icon,
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
      .orderBy(desc(resource.createdAt));

    const categoryCounts: Record<string, number> = {};
    const resourceMap = new Map<string, AdminResourceRecord>();

    for (const r of rows) {
      const catName = r.categoryName || "Generators";
      if (!resourceMap.has(r.id)) {
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        resourceMap.set(r.id, {
          id: r.id,
          title: r.title,
          authorBlog: r.authorBlog,
          authorGithub: r.authorGithub,
          authorId: r.authorId,
          authorLinkedin: r.authorLinkedin,
          authorName: r.authorName,
          authorSlug: r.authorSlug,
          authorTwitter: r.authorTwitter,
          authorWebsite: r.authorWebsite,
          authorYoutube: r.authorYoutube,
          category: catName,
          categoryIcon: r.categoryIcon,
          categoryId: r.categoryId,
          categoryName: r.categoryName,
          categorySlug: r.categorySlug,
          createdAt: r.createdAt.toISOString(),
          description: r.description,
          favicon: r.favicon,
          github: r.github,
          ogImage: r.ogImage,
          subtitle: r.subtitle,
          tags: r.tagName ? [r.tagName] : [],
          updatedAt: r.updatedAt.toISOString(),
          url: r.url,
        });
      } else if (r.tagName) {
        const entry = resourceMap.get(r.id);
        if (entry && !entry.tags.includes(r.tagName)) {
          entry.tags.push(r.tagName);
        }
      }
    }

    const resources = Array.from(resourceMap.values()).map((r) => ({
      ...r,
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
      authorLinkedin,
      authorName,
      authorTwitter,
      authorWebsite,
      authorYoutube,
      category: categoryInput,
      description,
      favicon,
      github,
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
    const [existing] = await db.select().from(resource).where(eq(resource.url, url.trim()));
    if (existing) {
      return NextResponse.json(
        { error: `A resource with the URL "${url}" already exists.` },
        { status: 409 },
      );
    }

    // 1. Resolve or Create Author(s)
    let authorRecordId: string | null = null;
    if (authorName && authorName.trim()) {
      const name = authorName.trim();
      const slug = slugifyAuthor(name);

      // Ensure every individual author exists in author table
      const splitAuthors = name.includes(",")
        ? name.split(",").map((a: string) => a.trim()).filter(Boolean)
        : [name];

      for (const singleName of splitAuthors) {
        const singleSlug = slugifyAuthor(singleName);
        if (!singleSlug) continue;
        const [singleExisting] = await db.select().from(author).where(eq(author.slug, singleSlug));
        if (!singleExisting) {
          await db.insert(author).values({
            id: crypto.randomUUID(),
            name: singleName,
            slug: singleSlug,
          });
        }
      }

      const [existingAuthor] = await db.select().from(author).where(eq(author.slug, slug));
      if (existingAuthor) {
        authorRecordId = existingAuthor.id;
        await db
          .update(author)
          .set({
            blog: existingAuthor.blog || authorBlog || null,
            github: existingAuthor.github || authorGithub || null,
            linkedin: existingAuthor.linkedin || authorLinkedin || null,
            twitter: existingAuthor.twitter || authorTwitter || null,
            updatedAt: new Date(),
            website: existingAuthor.website || authorWebsite || null,
            youtube: existingAuthor.youtube || authorYoutube || null,
          })
          .where(eq(author.id, existingAuthor.id));
      } else {
        authorRecordId = crypto.randomUUID();
        await db.insert(author).values({
          id: authorRecordId,
          blog: authorBlog || null,
          github: authorGithub || null,
          linkedin: authorLinkedin || null,
          name,
          slug,
          twitter: authorTwitter || null,
          website: authorWebsite || null,
          youtube: authorYoutube || null,
        });
      }
    }

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
      authorId: authorRecordId,
      categoryId: categoryRecordId,
      description: description.trim(),
      favicon: favicon?.trim() || null,
      github: github?.trim() || null,
      ogImage: ogImage?.trim() || null,
      subtitle: subtitle?.trim() || null,
      url: url.trim(),
    });

    // 4. Resolve and insert tags into resourceTag junction table
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

    // 5. Purge edge cache
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
    const {
      id,
      authorBlog,
      authorGithub,
      authorLinkedin,
      authorName,
      authorTwitter,
      authorWebsite,
      authorYoutube,
      tags,
      ...updates
    } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Resource ID is required." }, { status: 400 });
    }

    const [existingResource] = await db.select().from(resource).where(eq(resource.id, id));
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    // 1. Resolve or update author(s) if author fields are modified
    let authorRecordId = existingResource.authorId;
    if (authorName !== undefined) {
      if (authorName && authorName.trim()) {
        const name = authorName.trim();
        const slug = slugifyAuthor(name);

        // Ensure every individual author exists in author table
        const splitAuthors = name.includes(",")
          ? name.split(",").map((a: string) => a.trim()).filter(Boolean)
          : [name];

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

        const [existingAuthor] = await db.select().from(author).where(eq(author.slug, slug));
        if (existingAuthor) {
          authorRecordId = existingAuthor.id;
          await db
            .update(author)
            .set({
              blog: authorBlog !== undefined ? authorBlog || null : existingAuthor.blog,
              github: authorGithub !== undefined ? authorGithub || null : existingAuthor.github,
              linkedin: authorLinkedin !== undefined ? authorLinkedin || null : existingAuthor.linkedin,
              name,
              twitter: authorTwitter !== undefined ? authorTwitter || null : existingAuthor.twitter,
              updatedAt: new Date(),
              website: authorWebsite !== undefined ? authorWebsite || null : existingAuthor.website,
              youtube: authorYoutube !== undefined ? authorYoutube || null : existingAuthor.youtube,
            })
            .where(eq(author.id, existingAuthor.id));
        } else {
          authorRecordId = crypto.randomUUID();
          await db.insert(author).values({
            id: authorRecordId,
            blog: authorBlog || null,
            github: authorGithub || null,
            linkedin: authorLinkedin || null,
            name,
            slug,
            twitter: authorTwitter || null,
            website: authorWebsite || null,
            youtube: authorYoutube || null,
          });
        }
      } else {
        authorRecordId = null;
      }
    }

    // 2. Update resource record
    const updatedData: Record<string, unknown> = {
      authorId: authorRecordId,
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
    if (updates.url !== undefined) updatedData.url = updates.url.trim();
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon?.trim() || null;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage?.trim() || null;
    if (updates.github !== undefined) updatedData.github = updates.github?.trim() || null;

    await db.update(resource).set(updatedData).where(eq(resource.id, id));

    // 3. Update tags if provided
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
    revalidateTag("resources", "max");
    revalidateTag("categories", "max");
    revalidateTag("tags", "max");
    revalidateTag("authors", "max");
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

    revalidateTag("resources", "max");
    revalidateTag("categories", "max");
    revalidateTag("tags", "max");
    revalidateTag("authors", "max");
    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/authors");

    return NextResponse.json({ message: "Resource deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to delete resource." }, { status: 500 });
  }
}
