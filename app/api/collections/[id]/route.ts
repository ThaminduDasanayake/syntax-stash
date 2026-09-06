import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { collection, collectionItem, resource } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    const [col] = await db.select().from(collection).where(eq(collection.id, id));
    if (!col) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    // Access check: must be owner or public
    const isOwner = session?.user?.id === col.userId;
    if (!col.isPublic && !isOwner) {
      return NextResponse.json({ error: "Unauthorized access to collection." }, { status: 403 });
    }

    // Fetch items with joined resources
    const items = await db
      .select({
        id: collectionItem.id,
        addedAt: collectionItem.addedAt,
        note: collectionItem.note,
        order: collectionItem.order,
        resource: {
          id: resource.id,
          title: resource.title,
          category: resource.category,
          description: resource.description,
          favicon: resource.favicon,
          github: resource.github,
          ogImage: resource.ogImage,
          subtitle: resource.subtitle,
          tags: resource.tags,
          url: resource.url,
        },
        resourceId: collectionItem.resourceId,
      })
      .from(collectionItem)
      .leftJoin(resource, eq(collectionItem.resourceId, resource.id))
      .where(eq(collectionItem.collectionId, id))
      .orderBy(asc(collectionItem.order), asc(collectionItem.addedAt));

    return NextResponse.json({
      collection: col,
      isOwner,
      items,
      totalItems: items.length,
    });
  } catch (error) {
    console.error("GET /api/collections/[id] error:", error);
    return NextResponse.json({ error: "Failed to load collection." }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [col] = await db.select().from(collection).where(eq(collection.id, id));
    if (!col) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    if (col.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden. You are not the owner." }, { status: 403 });
    }

    const body = await req.json();
    const { description, isPublic, name } = body;

    const updates: Partial<typeof collection.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name !== undefined && name.trim()) {
      updates.name = name.trim();
      updates.slug = slugify(name.trim());
    }
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }
    if (isPublic !== undefined) {
      updates.isPublic = Boolean(isPublic);
    }

    await db.update(collection).set(updates).where(eq(collection.id, id));

    const [updated] = await db.select().from(collection).where(eq(collection.id, id));

    return NextResponse.json({
      collection: updated,
      message: "Collection updated.",
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/collections/[id] error:", error);
    return NextResponse.json({ error: "Failed to update collection." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const [col] = await db.select().from(collection).where(eq(collection.id, id));
    if (!col) {
      return NextResponse.json({ error: "Collection not found." }, { status: 404 });
    }

    if (col.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden. You are not the owner." }, { status: 403 });
    }

    await db.delete(collection).where(eq(collection.id, id));

    return NextResponse.json({
      message: "Collection deleted.",
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/collections/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete collection." }, { status: 500 });
  }
}
