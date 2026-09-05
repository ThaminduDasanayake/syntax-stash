import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submission } from "@/lib/db/schema";

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
      return NextResponse.json({ count: 0, error: "Unauthorized" }, { status: 403 });
    }

    const [result] = await db
      .select({ count: count() })
      .from(submission)
      .where(eq(submission.status, "pending"));

    return NextResponse.json({ count: Number(result?.count || 0) });
  } catch (error) {
    console.error("GET /api/admin/submissions/count error:", error);
    // Return 0 count smoothly if database/table is temporarily inaccessible
    return NextResponse.json({ count: 0 });
  }
}
