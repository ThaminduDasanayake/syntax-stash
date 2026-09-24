import { desc } from "drizzle-orm";
import type { Metadata } from "next";

import { SubmissionsView } from "@/components/admin/submissions/submissions-view";
import { db } from "@/lib/db";
import { Submission, submission } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin Moderation Queue — Syntax Stash",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function SubmissionsPage() {
  let initialSubmissions: Submission[] = [];

  try {
    initialSubmissions = await db.select().from(submission).orderBy(desc(submission.createdAt));
  } catch (err) {
    console.error("Failed to preload submissions in server component:", err);
  }

  return <SubmissionsView initialSubmissions={initialSubmissions} />;
}
