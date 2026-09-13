import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminSubmissionInspectView } from "@/components/admin/admin-submission-inspect-view";
import { db } from "@/lib/db";
import { submission } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Inspect Submission — Syntax Stash Admin",
  robots: {
    follow: false,
    index: false,
  },
};

interface SubmissionInspectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInspectSubmissionPage({
  params,
}: SubmissionInspectPageProps) {
  const { id } = await params;

  const [sub] = await db.select().from(submission).where(eq(submission.id, id));

  if (!sub) {
    notFound();
  }

  return <AdminSubmissionInspectView submission={sub} />;
}
