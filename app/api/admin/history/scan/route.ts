import * as cheerio from "cheerio";
import { asc } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/db/audit";
import { resource, resourceHealth } from "@/lib/db/schema";
import { isBotChallengeUrl } from "@/lib/url-utils";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

const BROWSER_HEADERS = {
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
};

const TITLE_DELIMITERS = [" - ", " – ", " — ", " : ", ": ", " · ", " • ", " | "];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanExtractedTitle(rawTitle: string, existingTitle: string): string {
  const normRaw = normalizeText(rawTitle);
  const normExisting = normalizeText(existingTitle);

  if (normRaw === normExisting || normRaw.includes(normExisting)) {
    return rawTitle.trim();
  }

  for (const delimiter of TITLE_DELIMITERS) {
    if (rawTitle.includes(delimiter)) {
      const parts = rawTitle
        .split(delimiter)
        .map((p) => p.trim())
        .filter(Boolean);

      const match = parts.find((part) => {
        const normPart = normalizeText(part);
        return normPart === normExisting || normPart.includes(normExisting);
      });

      if (match) {
        return match;
      }
    }
  }

  return rawTitle.trim();
}

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p as unknown as R);

    const e: Promise<void> = p.then(() => {
      const idx = executing.indexOf(e);
      if (idx !== -1) executing.splice(idx, 1);
    });
    executing.push(e);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;

    const resources = await db
      .select({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        url: resource.url,
      })
      .from(resource)
      .orderBy(asc(resource.createdAt))
      .limit(limit);

    let driftCount = 0;
    let brokenCount = 0;
    let redirectCount = 0;

    await runPool(resources, 5, async (r) => {
      const targetUrl = r.url;
      let statusCode = 200;
      let healthStatus = "healthy";
      let redirectUrl: string | null = null;
      let errorMessage: string | null = null;
      const diffs: Array<{ field: string; label: string; newValue: unknown; oldValue: unknown }> = [];

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const res = await fetch(targetUrl, {
          headers: BROWSER_HEADERS,
          redirect: "manual",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        statusCode = res.status;

        // Check redirects
        if ([301, 302, 307, 308].includes(res.status)) {
          const location = res.headers.get("location");
          if (location) {
            try {
              redirectUrl = new URL(location, targetUrl).href;
            } catch {
              redirectUrl = location;
            }

            if (isBotChallengeUrl(location) || (redirectUrl && isBotChallengeUrl(redirectUrl))) {
              healthStatus = "blocked";
            } else {
              healthStatus = "redirect";
              redirectCount++;
              diffs.push({
                field: "url",
                label: "URL Redirect",
                newValue: redirectUrl,
                oldValue: r.url,
              });
            }
          }
        } else if (res.status === 404 || res.status >= 500) {
          healthStatus = "broken";
          errorMessage = `HTTP ${res.status}`;
          brokenCount++;
          diffs.push({
            field: "status",
            label: "Link Health Alert",
            newValue: `HTTP ${res.status} Broken`,
            oldValue: "Healthy",
          });
        } else if (res.status === 403 || res.status === 429) {
          healthStatus = "blocked";
        } else if (res.ok) {
          // Parse HTML metadata
          const html = await res.text();
          const $ = cheerio.load(html);

          const rawTitle = $("title").first().text().trim();
          const metaDesc = (
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            ""
          ).trim();

          if (rawTitle) {
            const cleanedLiveTitle = cleanExtractedTitle(rawTitle, r.title);
            const normCleaned = normalizeText(cleanedLiveTitle);
            const normStored = normalizeText(r.title);

            if (normCleaned && normStored && normCleaned !== normStored && !normCleaned.includes(normStored)) {
              diffs.push({
                field: "title",
                label: "Remote Title Changed",
                newValue: cleanedLiveTitle,
                oldValue: r.title,
              });
            }
          }

          if (metaDesc && r.description) {
            const normLiveDesc = normalizeText(metaDesc);
            const normStoredDesc = normalizeText(r.description);

            if (
              normLiveDesc &&
              normStoredDesc &&
              normLiveDesc !== normStoredDesc &&
              !normLiveDesc.includes(normStoredDesc) &&
              !normStoredDesc.includes(normLiveDesc)
            ) {
              diffs.push({
                field: "description",
                label: "Remote Description Changed",
                newValue: metaDesc.slice(0, 300),
                oldValue: r.description.slice(0, 300),
              });
            }
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        healthStatus = "broken";
        errorMessage = msg;
        brokenCount++;
      }

      // Upsert health record
      try {
        await db
          .insert(resourceHealth)
          .values({
            id: crypto.randomUUID(),
            errorMessage,
            lastCheckedAt: new Date(),
            redirectUrl,
            resourceId: r.id,
            status: healthStatus,
            statusCode,
          })
          .onConflictDoUpdate({
            set: {
              errorMessage,
              lastCheckedAt: new Date(),
              redirectUrl,
              status: healthStatus,
              statusCode,
            },
            target: resourceHealth.resourceId,
          });
      } catch (healthErr) {
        console.error("Failed to update resource health:", healthErr);
      }

      // If diffs found, record in activity log
      if (diffs.length > 0) {
        driftCount++;
        await logActivity({
          action: "updated",
          actorEmail: "scanner@system",
          diff: diffs,
          entityId: r.id,
          entityTitle: r.title,
          entityType: "resource",
          metadata: {
            issue: healthStatus === "broken" ? "Broken Link" : "Remote Metadata Drift",
            redirectUrl,
            statusCode,
          },
        });
      }
    });

    return NextResponse.json({
      broken: brokenCount,
      drifts: driftCount,
      redirects: redirectCount,
      scanned: resources.length,
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/history/scan error:", error);
    return NextResponse.json({ error: "Failed to run metadata scan." }, { status: 500 });
  }
}
