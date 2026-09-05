import { ShieldWarningIcon } from "@phosphor-icons/react/ssr";
import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { AdminSubmissionsClient } from "@/components/admin-submissions-client";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
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
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  const userEmail = session?.user?.email;
  const isUserAdmin = isAdmin(userEmail);

  if (!session || !isUserAdmin) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center font-mono">
        <div className="bg-destructive/10 text-destructive mb-4 grid size-16 place-items-center rounded-full">
          <ShieldWarningIcon weight="fill" className="size-8" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight uppercase">
          Access Restricted
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md text-xs leading-relaxed">
          The submissions moderation dashboard is restricted to administrators only.
          {session?.user?.email ? (
            <span className="mt-1 block">
              Signed in as: <strong className="text-foreground">{session.user.email}</strong>
            </span>
          ) : (
            <span className="mt-1 block">Please sign in with an authorized admin account.</span>
          )}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="text-xs uppercase">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Pre-fetch initial submissions for instant server-rendered display (no second spinner/loading flicker)
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
    initialSubmissions = all.filter((s) => s.status === "pending");
  } catch (err) {
    console.error("Failed to preload submissions in server component:", err);
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="border-line/60 mb-8 border-b pb-6 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
              <span className="bg-primary size-2 rounded-full" />
              <span>Admin Panel</span>
            </div>
            <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
              Tool Submissions Queue
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              Review, edit, approve, and export community tool submissions.
            </p>
          </div>

          <div className="text-muted-foreground text-right text-xs">
            <span>Admin: </span>
            <strong className="text-foreground">{userEmail}</strong>
          </div>
        </div>
      </div>

      <AdminSubmissionsClient
        initialSubmissions={initialSubmissions}
        initialCounts={initialCounts}
      />
    </div>
  );
}
