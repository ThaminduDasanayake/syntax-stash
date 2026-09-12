import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { category, resource, submission } from "@/lib/db/schema";
import { normalizeUrl } from "@/lib/url-utils";

export async function GET(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get("url");
    const excludeId = request.nextUrl.searchParams.get("excludeId");

    if (!urlParam || !urlParam.trim()) {
      return NextResponse.json({ exists: false });
    }

    const normalizedInputUrl = normalizeUrl(urlParam);
    if (!normalizedInputUrl) {
      return NextResponse.json({ exists: false });
    }

    // 1. Check live resources catalog
    const liveRows = await db
      .select({
        id: resource.id,
        title: resource.title,
        category: category.name,
        url: resource.url,
      })
      .from(resource)
      .leftJoin(category, eq(resource.categoryId, category.id));

    const matchedResource = liveRows.find(
      (r) => r.id !== excludeId && normalizeUrl(r.url) === normalizedInputUrl,
    );

    if (matchedResource) {
      return NextResponse.json({
        exists: true,
        item: {
          id: matchedResource.id,
          title: matchedResource.title,
          category: matchedResource.category || "General",
          url: matchedResource.url,
        },
        type: "resource",
      });
    }

    // 2. Check submissions table
    const submissionRows = await db
      .select({
        id: submission.id,
        title: submission.title,
        status: submission.status,
        url: submission.url,
      })
      .from(submission);

    const matchedSubmission = submissionRows.find(
      (s) => normalizeUrl(s.url) === normalizedInputUrl,
    );

    if (matchedSubmission) {
      return NextResponse.json({
        exists: true,
        item: {
          id: matchedSubmission.id,
          title: matchedSubmission.title,
          status: matchedSubmission.status,
          url: matchedSubmission.url,
        },
        type: "submission",
      });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error("GET /api/resources/check-url error:", error);
    return NextResponse.json({ error: "Failed to check URL", exists: false }, { status: 500 });
  }
}
