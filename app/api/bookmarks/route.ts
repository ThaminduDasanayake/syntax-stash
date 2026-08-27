import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookmark } from "@/lib/db/schema";

export async function GET() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json({ bookmarks: [] });
    }

    const userBookmarks = await db
      .select({ resourceId: bookmark.resourceId })
      .from(bookmark)
      .where(eq(bookmark.userId, session.user.id));

    const bookmarks = userBookmarks.map((b) => b.resourceId);

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to save resources." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { resourceId } = body;

    if (!resourceId || typeof resourceId !== "string") {
      return NextResponse.json({ error: "resourceId is required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(bookmark)
      .where(and(eq(bookmark.userId, session.user.id), eq(bookmark.resourceId, resourceId)))
      .limit(1);

    if (existing) {
      await db.delete(bookmark).where(eq(bookmark.id, existing.id));
    } else {
      await db.insert(bookmark).values({
        id: randomUUID(),
        resourceId,
        userId: session.user.id,
      });
    }

    const updated = await db
      .select({ resourceId: bookmark.resourceId })
      .from(bookmark)
      .where(eq(bookmark.userId, session.user.id));

    const bookmarks = updated.map((b) => b.resourceId);

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("POST /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to save resources." },
        { status: 401 },
      );
    }

    await db.delete(bookmark).where(eq(bookmark.userId, session.user.id));

    return NextResponse.json({ bookmarks: [] });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json({ error: "Failed to clear bookmarks" }, { status: 500 });
  }
}
