import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";

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

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 100);
    const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
    const entityType = searchParams.get("entityType");
    const action = searchParams.get("action");
    const search = searchParams.get("search")?.trim();

    const conditions = [];

    if (entityType && entityType !== "all") {
      conditions.push(eq(activityLog.entityType, entityType));
    }

    if (action && action !== "all") {
      conditions.push(eq(activityLog.action, action));
    }

    if (search) {
      conditions.push(
        or(
          ilike(activityLog.entityTitle, `%${search}%`),
          ilike(activityLog.actorEmail, `%${search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [totalCountRow]] = await Promise.all([
      db
        .select()
        .from(activityLog)
        .where(whereClause)
        .orderBy(desc(activityLog.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(activityLog)
        .where(whereClause),
    ]);

    return NextResponse.json({
      items,
      limit,
      offset,
      total: Number(totalCountRow?.count) || 0,
    });
  } catch (error) {
    console.error("GET /api/admin/history error:", error);
    return NextResponse.json({ error: "Failed to fetch activity history." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      await db.delete(activityLog);
      return NextResponse.json({ message: "All alerts cleared successfully.", success: true });
    }

    if (!id) {
      return NextResponse.json({ error: "Alert ID or all=true required." }, { status: 400 });
    }

    await db.delete(activityLog).where(eq(activityLog.id, id));
    return NextResponse.json({ message: "Alert dismissed.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/history error:", error);
    return NextResponse.json({ error: "Failed to dismiss alert." }, { status: 500 });
  }
}
