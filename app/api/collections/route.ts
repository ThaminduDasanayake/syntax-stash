import { count, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { collection, collectionItem } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json({ collections: [] });
    }

    const rows = await db
      .select({
        id: collection.id,
        createdAt: collection.createdAt,
        description: collection.description,
        isPublic: collection.isPublic,
        itemCount: count(collectionItem.id),
        name: collection.name,
        slug: collection.slug,
        updatedAt: collection.updatedAt,
      })
      .from(collection)
      .leftJoin(collectionItem, eq(collection.id, collectionItem.collectionId))
      .where(eq(collection.userId, session.user.id))
      .groupBy(collection.id)
      .orderBy(desc(collection.createdAt));

    const collections = rows.map((r) => ({
      ...r,
      itemCount: Number(r.itemCount) || 0,
    }));

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("GET /api/collections error:", error);
    return NextResponse.json({ error: "Failed to fetch collections." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to create collections." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { description, isPublic, name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
    }

    const cleanName = name.trim();
    let baseSlug = slugify(cleanName) || "collection";

    // Ensure unique slug per user
    const [existingWithSlug] = await db
      .select()
      .from(collection)
      .where(eq(collection.userId, session.user.id));

    if (existingWithSlug && existingWithSlug.slug === baseSlug) {
      baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newId = crypto.randomUUID();
    await db.insert(collection).values({
      id: newId,
      createdAt: new Date(),
      description: description?.trim() || null,
      isPublic: Boolean(isPublic),
      name: cleanName,
      slug: baseSlug,
      updatedAt: new Date(),
      userId: session.user.id,
    });

    const [created] = await db.select().from(collection).where(eq(collection.id, newId));

    return NextResponse.json({
      collection: {
        ...created,
        itemCount: 0,
      },
      message: "Collection created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/collections error:", error);
    return NextResponse.json({ error: "Failed to create collection." }, { status: 500 });
  }
}
