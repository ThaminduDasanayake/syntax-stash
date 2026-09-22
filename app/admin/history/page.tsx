import { desc, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminHistoryClient } from "@/components/admin/admin-history-client";
import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Resource Change Monitor — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminHistoryPage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/sign-in?callbackUrl=/admin/history");
  }

  const [initialRows, [totalCountRow]] = await Promise.all([
    db
      .select()
      .from(activityLog)
      .orderBy(desc(activityLog.createdAt))
      .limit(50),
    db.select({ count: sql<number>`count(*)` }).from(activityLog),
  ]);

  const items = initialRows.map((r) => ({
    ...r,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));

  return (
    <AdminHistoryClient
      initialItems={items as import("@/components/admin/admin-history-client").ActivityLogItem[]}
      initialTotal={Number(totalCountRow?.count) || 0}
    />
  );
}
