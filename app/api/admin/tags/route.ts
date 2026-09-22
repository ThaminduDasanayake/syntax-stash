import { count, desc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeDiffs, logActivity } from "@/lib/db/audit";
import { resourceTag, tag } from "@/lib/db/schema";
import { normalizeTag } from "@/lib/tags";

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
        id: tag.id,
        createdAt: tag.createdAt,
        name: tag.name,
        slug: tag.slug,
        toolCount: count(resourceTag.resourceId),
        updatedAt: tag.updatedAt,
      })
      .from(tag)
      .leftJoin(resourceTag, eq(tag.id, resourceTag.tagId))
      .groupBy(tag.id)
      .orderBy(desc(count(resourceTag.resourceId)), tag.name);

    const result = rows.map((r) => ({
      ...r,
      toolCount: Number(r.toolCount) || 0,
    }));

    return NextResponse.json({
      tags: result,
      total: result.length,
    });
  } catch (error) {
    console.error("GET /api/admin/tags error:", error);
    return NextResponse.json({ error: "Failed to load tags." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Tag name is required." }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanSlug = slug?.trim() ? normalizeTag(slug.trim()) : normalizeTag(cleanName);

    // Check for existing tag
    const [existing] = await db.select().from(tag).where(eq(tag.slug, cleanSlug));
    if (existing) {
      return NextResponse.json(
        { error: `Tag with slug "${cleanSlug}" already exists.` },
        { status: 409 },
      );
    }

    const tagId = crypto.randomUUID();
    await db.insert(tag).values({
      id: tagId,
      createdAt: new Date(),
      name: cleanName,
      slug: cleanSlug,
      updatedAt: new Date(),
    });

    revalidateTag("resources", { expire: 0 });
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/admin/tags");
    revalidatePath("/tags");

    await logActivity({
      action: "created",
      actorEmail: adminUser.email,
      entityId: tagId,
      entityTitle: `#${cleanName}`,
      entityType: "tag",
      metadata: { slug: cleanSlug },
    });

    return NextResponse.json({
      id: tagId,
      message: "Tag created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/tags error:", error);
    return NextResponse.json({ error: "Failed to create tag." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, slug } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Tag ID is required." }, { status: 400 });
    }

    const [existing] = await db.select().from(tag).where(eq(tag.id, id));
    if (!existing) {
      return NextResponse.json({ error: "Tag not found." }, { status: 404 });
    }

    const updates: Partial<typeof tag.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined && name.trim()) {
      updates.name = name.trim();
    }
    if (slug !== undefined && slug.trim()) {
      updates.slug = normalizeTag(slug.trim());
    }

    await db.update(tag).set(updates).where(eq(tag.id, id));

    revalidateTag("resources", { expire: 0 });
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/admin/tags");
    revalidatePath("/tags");

    const diffs = computeDiffs(
      existing as Record<string, unknown>,
      updates,
      { name: "Tag Name", slug: "Tag Slug" },
    );

    await logActivity({
      action: "updated",
      actorEmail: adminUser.email,
      diff: diffs,
      entityId: id,
      entityTitle: `#${updates.name || existing.name}`,
      entityType: "tag",
    });

    return NextResponse.json({
      message: "Tag updated successfully.",
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/admin/tags error:", error);
    return NextResponse.json({ error: "Failed to update tag." }, { status: 500 });
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
      return NextResponse.json({ error: "Missing tag ID." }, { status: 400 });
    }

    const [targetTag] = await db.select().from(tag).where(eq(tag.id, id));

    await db.delete(tag).where(eq(tag.id, id));

    revalidateTag("resources", { expire: 0 });
    revalidateTag("tags", { expire: 0 });
    revalidatePath("/admin/tags");
    revalidatePath("/tags");

    if (targetTag) {
      await logActivity({
        action: "deleted",
        actorEmail: adminUser.email,
        entityId: id,
        entityTitle: `#${targetTag.name}`,
        entityType: "tag",
      });
    }

    return NextResponse.json({
      message: "Tag deleted.",
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/admin/tags error:", error);
    return NextResponse.json({ error: "Failed to delete tag." }, { status: 500 });
  }
}
