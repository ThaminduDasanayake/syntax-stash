import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { collection, collectionItem } from "@/lib/db/schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
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
    const { note, resourceId } = body;

    if (!resourceId || typeof resourceId !== "string") {
      return NextResponse.json({ error: "resourceId is required." }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(collectionItem)
      .where(and(eq(collectionItem.collectionId, id), eq(collectionItem.resourceId, resourceId)));

    if (existing) {
      // If already in collection, toggle remove
      await db.delete(collectionItem).where(eq(collectionItem.id, existing.id));
      return NextResponse.json({
        action: "removed",
        inCollection: false,
        message: "Tool removed from collection.",
        success: true,
      });
    }

    const newItemId = crypto.randomUUID();
    await db.insert(collectionItem).values({
      id: newItemId,
      addedAt: new Date(),
      collectionId: id,
      note: note?.trim() || null,
      order: 0,
      resourceId,
    });

    return NextResponse.json({
      id: newItemId,
      action: "added",
      inCollection: true,
      message: "Tool added to collection.",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/collections/[id]/items error:", error);
    return NextResponse.json({ error: "Failed to update collection item." }, { status: 500 });
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

    const resourceId = request.nextUrl.searchParams.get("resourceId");
    if (!resourceId) {
      return NextResponse.json({ error: "Missing resourceId parameter." }, { status: 400 });
    }

    await db
      .delete(collectionItem)
      .where(and(eq(collectionItem.collectionId, id), eq(collectionItem.resourceId, resourceId)));

    return NextResponse.json({
      message: "Item removed from collection.",
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/collections/[id]/items error:", error);
    return NextResponse.json({ error: "Failed to remove item." }, { status: 500 });
  }
}
