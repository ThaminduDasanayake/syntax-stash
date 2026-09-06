import { desc } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminSubmissionsClient } from "@/components/admin-submissions-client";
import { db } from "@/lib/db";
import { Submission, submission } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin Moderation Queue — Syntax Stash",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminSubmissionsPage() {
  let initialSubmissions: Submission[] = [];
  let initialCounts = { all: 0, approved: 0, pending: 0, rejected: 0 };

  try {
    const all = await db.select().from(submission).orderBy(desc(submission.createdAt));
    initialCounts = {
      all: all.length,
      approved: all.filter((s) => s.status === "approved").length,
      pending: all.filter((s) => s.status === "pending").length,
      rejected: all.filter((s) => s.status === "rejected").length,
    };
    initialSubmissions = all;
  } catch (err) {
    console.error("Failed to preload submissions in server component:", err);
  }

  return (
    <AdminSubmissionsClient
      initialSubmissions={initialSubmissions}
      initialCounts={initialCounts}
    />
  );
}


