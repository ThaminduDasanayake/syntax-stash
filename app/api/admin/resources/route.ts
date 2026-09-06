import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { slugifyAuthor } from "@/lib/authors";
import { db } from "@/lib/db";
import { author, category, resource } from "@/lib/db/schema";

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
        tags: resource.tags,
        updatedAt: resource.updatedAt,
        url: resource.url,
      })
      .from(resource)
      .leftJoin(author, eq(resource.authorId, author.id))
      .leftJoin(category, eq(resource.categoryId, category.id))
      .orderBy(desc(resource.createdAt));

    const categoryCounts: Record<string, number> = {};
    const resources = rows.map((r) => {
      const catName = r.categoryName || r.category;
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      return {
        ...r,
        category: catName,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      categoryCounts,
      resources,
      total: rows.length,
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

    // 1. Resolve or Create Author
    let authorRecordId: string | null = null;
    if (authorName && authorName.trim()) {
      const name = authorName.trim();
      const slug = slugifyAuthor(name);

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
    let categoryRecordId: string | null = null;
    let canonicalCategoryName = categoryInput.trim();
    const [foundCat] = await db
      .select()
      .from(category)
      .where(or(ilike(category.name, canonicalCategoryName), ilike(category.slug, canonicalCategoryName)));
    if (foundCat) {
      categoryRecordId = foundCat.id;
      canonicalCategoryName = foundCat.name;
    }

    // 3. Insert into resource table
    const resourceId = crypto.randomUUID();
    await db.insert(resource).values({
      id: resourceId,
      title: title.trim(),
      authorId: authorRecordId,
      category: canonicalCategoryName,
      categoryId: categoryRecordId,
      description: description.trim(),
      favicon: favicon?.trim() || null,
      github: github?.trim() || null,
      ogImage: ogImage?.trim() || null,
      subtitle: subtitle?.trim() || null,
      tags: tags?.trim() || null,
      url: url.trim(),
    });

    // 4. Purge edge cache
    revalidateTag("resources", "max");
    revalidatePath("/");
    revalidatePath("/resources");

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
    const { id, authorBlog, authorGithub, authorLinkedin, authorName, authorTwitter, authorWebsite, authorYoutube, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Resource ID is required." }, { status: 400 });
    }

    const [existingResource] = await db.select().from(resource).where(eq(resource.id, id));
    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    // 1. Resolve or update author if author fields are modified
    let authorRecordId = existingResource.authorId;
    if (authorName !== undefined) {
      if (authorName && authorName.trim()) {
        const name = authorName.trim();
        const slug = slugifyAuthor(name);

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
        updatedData.category = foundCat.name;
      } else {
        updatedData.category = updates.category;
      }
    }

    if (updates.title !== undefined) updatedData.title = updates.title.trim();
    if (updates.subtitle !== undefined) updatedData.subtitle = updates.subtitle?.trim() || null;
    if (updates.description !== undefined) updatedData.description = updates.description.trim();
    if (updates.url !== undefined) updatedData.url = updates.url.trim();
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon?.trim() || null;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage?.trim() || null;
    if (updates.github !== undefined) updatedData.github = updates.github?.trim() || null;
    if (updates.tags !== undefined) updatedData.tags = updates.tags?.trim() || null;

    await db.update(resource).set(updatedData).where(eq(resource.id, id));

    // 3. Purge edge cache
    revalidateTag("resources", "max");
    revalidatePath("/");
    revalidatePath("/resources");

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
    revalidatePath("/");
    revalidatePath("/resources");

    return NextResponse.json({ message: "Resource deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/resources error:", error);
    return NextResponse.json({ error: "Failed to delete resource." }, { status: 500 });
  }
}
