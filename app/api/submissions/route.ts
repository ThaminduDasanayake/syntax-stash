import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submission } from "@/lib/db/schema";
import { resourceLinks } from "@/lib/resource-data";
import { normalizeUrl } from "@/lib/url-utils";

export async function POST(req: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({ headers: reqHeaders });

    const body = await req.json();

    // 1. Honeypot check (anti-bot trap)
    if (body.website_trap || body.honey) {
      console.warn("Spam bot detected via honeypot field. Discarding submission.");
      return NextResponse.json({ message: "Submission received.", success: true });
    }

    const {
      title,
      author,
      authorGitHub,
      authorLink,
      authorLinkedIn,
      authorTwitter,
      authorWebsite,
      authorYouTube,
      category,
      description,
      favicon,
      gitHubLink,
      notes,
      ogImage,
      pricing = "Free",
      subtitle,
      tags,
      url,
    } = body;

    // 2. Validate required fields
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Tool title is required." }, { status: 400 });
    }

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "Tool URL is required." }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Tool description is required." }, { status: 400 });
    }

    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }

    // Validate URL protocol
    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return NextResponse.json({ error: "Invalid URL protocol. Use HTTP or HTTPS." }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const normalizedInputUrl = normalizeUrl(url);
    const resolvedAuthorWebsite = authorWebsite || authorLink;

    // 3. Duplicate Check A: Live Catalog resources
    const catalogMatch = resourceLinks.find((r) => normalizeUrl(r.url) === normalizedInputUrl);
    if (catalogMatch) {
      return NextResponse.json(
        {
          title: catalogMatch.title,
          code: "ALREADY_EXISTS",
          error: `"${catalogMatch.title}" is already listed in Syntax Stash!`,
          message: `"${catalogMatch.title}" is already live in the Syntax Stash catalog.`,
        },
        { status: 409 },
      );
    }

    // 4. Duplicate Check B: Existing Submissions database
    const allSubmissions = await db.select().from(submission);
    const dbMatch = allSubmissions.find(
      (s) => normalizeUrl(s.url) === normalizedInputUrl,
    );

    if (dbMatch) {
      if (dbMatch.status === "approved") {
        return NextResponse.json(
          {
            title: dbMatch.title,
            code: "ALREADY_EXISTS",
            error: `"${dbMatch.title}" has already been approved and listed in Syntax Stash!`,
            message: `"${dbMatch.title}" has already been approved and added to the directory.`,
          },
          { status: 409 },
        );
      }

      if (dbMatch.status === "pending") {
        // Update existing pending submission in-place
        await db
          .update(submission)
          .set({
            title: String(title).trim(),
            author: author ? String(author).trim() : null,
            authorGitHub: authorGitHub ? String(authorGitHub).trim() : null,
            authorLink: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
            authorLinkedIn: authorLinkedIn ? String(authorLinkedIn).trim() : null,
            authorTwitter: authorTwitter ? String(authorTwitter).trim() : null,
            authorWebsite: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
            authorYouTube: authorYouTube ? String(authorYouTube).trim() : null,
            category: String(category).trim(),
            description: String(description).trim(),
            favicon: favicon ? String(favicon).trim() : null,
            gitHubLink: gitHubLink ? String(gitHubLink).trim() : null,
            notes: notes ? String(notes).trim() : dbMatch.notes,
            ogImage: ogImage ? String(ogImage).trim() : null,
            pricing: pricing ? String(pricing).trim() : "Free",
            submitterEmail: session?.user?.email || dbMatch.submitterEmail,
            submitterName: session?.user?.name || dbMatch.submitterName,
            subtitle: subtitle ? String(subtitle).trim() : null,
            tags: tags ? (Array.isArray(tags) ? tags.join(", ") : String(tags).trim()) : null,
            updatedAt: new Date(),
            url: normalizedInputUrl,
            userId: session?.user?.id || dbMatch.userId,
          })
          .where(eq(submission.id, dbMatch.id));

        return NextResponse.json({
          id: dbMatch.id,
          isUpdate: true,
          message: "Pending submission updated with latest changes.",
          success: true,
        });
      }

      if (dbMatch.status === "rejected") {
        // Reopen rejected submission with updated data
        await db
          .update(submission)
          .set({
            title: String(title).trim(),
            author: author ? String(author).trim() : null,
            authorGitHub: authorGitHub ? String(authorGitHub).trim() : null,
            authorLink: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
            authorLinkedIn: authorLinkedIn ? String(authorLinkedIn).trim() : null,
            authorTwitter: authorTwitter ? String(authorTwitter).trim() : null,
            authorWebsite: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
            authorYouTube: authorYouTube ? String(authorYouTube).trim() : null,
            category: String(category).trim(),
            description: String(description).trim(),
            favicon: favicon ? String(favicon).trim() : null,
            gitHubLink: gitHubLink ? String(gitHubLink).trim() : null,
            notes: notes ? String(notes).trim() : dbMatch.notes,
            ogImage: ogImage ? String(ogImage).trim() : null,
            pricing: pricing ? String(pricing).trim() : "Free",
            reviewedAt: null,
            status: "pending",
            submitterEmail: session?.user?.email || dbMatch.submitterEmail,
            submitterName: session?.user?.name || dbMatch.submitterName,
            subtitle: subtitle ? String(subtitle).trim() : null,
            tags: tags ? (Array.isArray(tags) ? tags.join(", ") : String(tags).trim()) : null,
            updatedAt: new Date(),
            url: normalizedInputUrl,
            userId: session?.user?.id || dbMatch.userId,
          })
          .where(eq(submission.id, dbMatch.id));

        return NextResponse.json({
          id: dbMatch.id,
          isResubmission: true,
          message: "Submission updated and sent for review.",
          success: true,
        });
      }
    }

    // 5. Fresh Submission Insert
    const submissionId = randomUUID();

    await db.insert(submission).values({
      id: submissionId,
      title: String(title).trim(),
      author: author ? String(author).trim() : null,
      authorGitHub: authorGitHub ? String(authorGitHub).trim() : null,
      authorLink: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
      authorLinkedIn: authorLinkedIn ? String(authorLinkedIn).trim() : null,
      authorTwitter: authorTwitter ? String(authorTwitter).trim() : null,
      authorWebsite: resolvedAuthorWebsite ? String(resolvedAuthorWebsite).trim() : null,
      authorYouTube: authorYouTube ? String(authorYouTube).trim() : null,
      category: String(category).trim(),
      description: String(description).trim(),
      favicon: favicon ? String(favicon).trim() : null,
      gitHubLink: gitHubLink ? String(gitHubLink).trim() : null,
      notes: notes ? String(notes).trim() : null,
      ogImage: ogImage ? String(ogImage).trim() : null,
      pricing: pricing ? String(pricing).trim() : "Free",
      status: "pending",
      submitterEmail: session?.user?.email || null,
      submitterName: session?.user?.name || null,
      subtitle: subtitle ? String(subtitle).trim() : null,
      tags: tags ? (Array.isArray(tags) ? tags.join(", ") : String(tags).trim()) : null,
      url: normalizedInputUrl,
      userId: session?.user?.id || null,
    });

    return NextResponse.json({
      id: submissionId,
      message: "Tool submitted for review!",
      success: true,
    });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json({ error: "Failed to submit tool. Please try again." }, { status: 500 });
  }
}
