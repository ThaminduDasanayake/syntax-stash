import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const statusParam = request.nextUrl.searchParams.get("status") || "pending";

    // Fetch all submissions to compute status counts
    const allSubmissions = await db.select().from(submission).orderBy(desc(submission.createdAt));

    const counts = {
      all: allSubmissions.length,
      approved: allSubmissions.filter((s) => s.status === "approved").length,
      pending: allSubmissions.filter((s) => s.status === "pending").length,
      rejected: allSubmissions.filter((s) => s.status === "rejected").length,
    };

    const filtered =
      statusParam === "all"
        ? allSubmissions
        : allSubmissions.filter((s) => s.status === statusParam);

    return NextResponse.json({ counts, submissions: filtered });
  } catch (error) {
    console.error("GET /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to load submissions." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
    }

    const updatedData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.status) {
      updatedData.status = updates.status;
      updatedData.reviewedAt = new Date();
    }
    if (updates.title !== undefined) updatedData.title = updates.title;
    if (updates.subtitle !== undefined) updatedData.subtitle = updates.subtitle;
    if (updates.url !== undefined) updatedData.url = updates.url;
    if (updates.description !== undefined) updatedData.description = updates.description;
    if (updates.category !== undefined) updatedData.category = updates.category;
    if (updates.author !== undefined) updatedData.author = updates.author;
    if (updates.authorLink !== undefined) updatedData.authorLink = updates.authorLink;
    if (updates.authorWebsite !== undefined) updatedData.authorWebsite = updates.authorWebsite;
    if (updates.authorTwitter !== undefined) updatedData.authorTwitter = updates.authorTwitter;
    if (updates.authorGitHub !== undefined) updatedData.authorGitHub = updates.authorGitHub;
    if (updates.authorYouTube !== undefined) updatedData.authorYouTube = updates.authorYouTube;
    if (updates.authorLinkedIn !== undefined) updatedData.authorLinkedIn = updates.authorLinkedIn;
    if (updates.gitHubLink !== undefined) updatedData.gitHubLink = updates.gitHubLink;
    if (updates.favicon !== undefined) updatedData.favicon = updates.favicon;
    if (updates.ogImage !== undefined) updatedData.ogImage = updates.ogImage;
    if (updates.pricing !== undefined) updatedData.pricing = updates.pricing;
    if (updates.tags !== undefined) updatedData.tags = updates.tags;
    if (updates.adminNotes !== undefined) updatedData.adminNotes = updates.adminNotes;

    await db.update(submission).set(updatedData).where(eq(submission.id, id));

    return NextResponse.json({ message: "Submission updated successfully.", success: true });
  } catch (error) {
    console.error("PATCH /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to update submission." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing submission ID." }, { status: 400 });
    }

    await db.delete(submission).where(eq(submission.id, id));

    return NextResponse.json({ message: "Submission deleted.", success: true });
  } catch (error) {
    console.error("DELETE /api/admin/submissions error:", error);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
