import { ShieldWarningIcon } from "@phosphor-icons/react/ssr";
import { count, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

import { AdminNav } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { author, category, resource, submission, tag } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin Suite — Syntax Stash",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
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
          The admin suite is restricted to authorized administrators only.
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

  // Pre-fetch count badges for the persistent AdminNav header
  let pendingSubmissionsCount = 0;
  let totalResourcesCount = 0;
  let categoriesCount = 0;
  let tagsCount = 0;
  let authorsCount = 0;

  try {
    const pendingRows = await db
      .select({ val: count() })
      .from(submission)
      .where(eq(submission.status, "pending"));

    const resourceRows = await db.select({ val: count() }).from(resource);
    const categoryRows = await db.select({ val: count() }).from(category);
    const tagRows = await db.select({ val: count() }).from(tag);
    const authorRows = await db.select({ val: count() }).from(author);

    pendingSubmissionsCount = pendingRows[0]?.val || 0;
    totalResourcesCount = resourceRows[0]?.val || 0;
    categoriesCount = categoryRows[0]?.val || 0;
    tagsCount = tagRows[0]?.val || 0;
    authorsCount = authorRows[0]?.val || 0;
  } catch (err) {
    console.error("Failed to load admin layout counts:", err);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <AdminNav
        authorsCount={authorsCount}
        categoriesCount={categoriesCount}
        pendingSubmissionsCount={pendingSubmissionsCount}
        tagsCount={tagsCount}
        totalResourcesCount={totalResourcesCount}
        userEmail={userEmail}
      />
      {children}
    </div>
  );
}
