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

function resolveUrl(relative: string | undefined | null, base: string): string {
  if (!relative) return "";
  try {
    return new URL(relative.trim(), base).href;
  } catch {
    return relative.trim();
  }
}

function extractFavicon($: cheerio.CheerioAPI, baseUrl: string): string {
  const candidates: { url: string; weight: number }[] = [];

  const add = (href: string | undefined, weight: number) => {
    if (!href) return;
    const resolved = resolveUrl(href, baseUrl);
    if (
      resolved &&
      (resolved.startsWith("http://") ||
        resolved.startsWith("https://") ||
        resolved.startsWith("data:"))
    ) {
      candidates.push({ url: resolved, weight });
    }
  };

  // 1. Vector SVG (priority 100)
  $('link[rel="icon"][type="image/svg+xml"], link[rel="icon"][href*=".svg"]').each((_, el) => {
    add($(el).attr("href"), 100);
  });
  // 2. Apple Touch Icon (priority 85)
  $('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]').each((_, el) => {
    add($(el).attr("href"), 85);
  });
  // 3. PNG Favicon (priority 75)
  $('link[rel="icon"][type="image/png"]').each((_, el) => {
    add($(el).attr("href"), 75);
  });
  // 4. Standard Favicon (priority 60)
  $('link[rel="icon"]').each((_, el) => {
    add($(el).attr("href"), 60);
  });
  // 5. Shortcut Icon (priority 40)
  $('link[rel="shortcut icon"]').each((_, el) => {
    add($(el).attr("href"), 40);
  });

  if (candidates.length === 0) {
    return "";
  }
  candidates.sort((a, b) => b.weight - a.weight);
  return candidates[0].url;
}

function extractOgImage($: cheerio.CheerioAPI, baseUrl: string): string {
  const candidates: { url: string; weight: number }[] = [];

  const add = (href: string | undefined, weight: number) => {
    if (!href) return;
    const resolved = resolveUrl(href, baseUrl);
    if (resolved && (resolved.startsWith("http://") || resolved.startsWith("https://"))) {
      candidates.push({ url: resolved, weight });
    }
  };

  // Twitter image (priority 95)
  const twImg =
    $('meta[name="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image:src"]').attr("content");
  add(twImg, 95);

  // OG image (priority 90)
  const ogImg =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[property="og:image:secure_url"]').attr("content");
  add(ogImg, 90);

  // Large OG image (priority 85)
  const ogLarge = $('meta[property="og:image:large"]').attr("content");
  add(ogLarge, 85);

  if (candidates.length === 0) {
    return "";
  }
  candidates.sort((a, b) => b.weight - a.weight);
  return candidates[0].url;
}

function compareAssetUrl(
  storedUrl: string | null | undefined,
  liveUrl: string | null | undefined,
  assetName: "Favicon" | "OG Image",
): { field: string; label: string; newValue: unknown; oldValue: unknown } | null {
  const stored = storedUrl?.trim() || "";
  const live = liveUrl?.trim() || "";

  if (!live) return null;

  if (!stored) {
    return {
      field: assetName === "Favicon" ? "favicon" : "ogImage",
      label: `Remote ${assetName} Discovered`,
      newValue: live,
      oldValue: "— (None)",
    };
  }

  if (stored === live) return null;

  const [storedBase, storedQuery] = stored.split("?");
  const [liveBase, liveQuery] = live.split("?");

  if (storedBase === liveBase) {
    if (liveQuery && !storedQuery) {
      return {
        field: assetName === "Favicon" ? "favicon" : "ogImage",
        label: `${assetName} Query String Missing (?${liveQuery.slice(0, 45)}${liveQuery.length > 45 ? "..." : ""})`,
        newValue: live,
        oldValue: stored,
      };
    }
    if (storedQuery && liveQuery && storedQuery !== liveQuery) {
      return {
        field: assetName === "Favicon" ? "favicon" : "ogImage",
        label: `${assetName} Query/Version Updated`,
        newValue: live,
        oldValue: stored,
      };
    }
  }

  return {
    field: assetName === "Favicon" ? "favicon" : "ogImage",
    label: `Remote ${assetName} Changed`,
    newValue: live,
    oldValue: stored,
  };
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
        favicon: resource.favicon,
        ogImage: resource.ogImage,
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
      const diffs: Array<{ field: string; label: string; newValue: unknown; oldValue: unknown }> =
        [];

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

          // 1. Title Drift Check
          const rawTitle = $("title").first().text().trim();
          if (rawTitle) {
            const cleanedLiveTitle = cleanExtractedTitle(rawTitle, r.title);
            const normCleaned = normalizeText(cleanedLiveTitle);
            const normStored = normalizeText(r.title);

            if (
              normCleaned &&
              normStored &&
              normCleaned !== normStored &&
              !normCleaned.includes(normStored)
            ) {
              diffs.push({
                field: "title",
                label: "Remote Title Changed",
                newValue: cleanedLiveTitle,
                oldValue: r.title,
              });
            }
          }

          // 2. Description Drift Check
          const metaDesc = (
            $('meta[name="description"]').attr("content") ||
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            ""
          ).trim();

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

          // 3. Favicon Drift & Stripped Query String Check
          const liveFavicon = extractFavicon($, targetUrl);
          const faviconDiff = compareAssetUrl(r.favicon, liveFavicon, "Favicon");
          if (faviconDiff) {
            diffs.push(faviconDiff);
          }

          // 4. OG Image Drift & Stripped Query String Check
          const liveOgImage = extractOgImage($, targetUrl);
          const ogImageDiff = compareAssetUrl(r.ogImage, liveOgImage, "OG Image");
          if (ogImageDiff) {
            diffs.push(ogImageDiff);
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

      // If diffs found, record in activity log as an observation alert
      if (diffs.length > 0) {
        driftCount++;
        const alertAction =
          healthStatus === "broken"
            ? "health_alert"
            : healthStatus === "redirect"
              ? "redirect_detected"
              : "drift_detected";

        await logActivity({
          action: alertAction,
          actorEmail: "scanner@system",
          diff: diffs,
          entityId: r.id,
          entityTitle: r.title,
          entityType: "resource",
          metadata: {
            note: "Observed from live website. Catalog resource was NOT modified.",
            redirectUrl,
            source: "Live Web Crawler",
            statusCode,
            url: r.url,
          },
        });
      }
    });

    return NextResponse.json({
      broken: brokenCount,
      drifts: driftCount,
      message: "Catalog scan finished. No catalog resources were modified.",
      redirects: redirectCount,
      scanned: resources.length,
      success: true,
    });
  } catch (error) {
    console.error("POST /api/admin/history/scan error:", error);
    return NextResponse.json({ error: "Failed to run metadata scan." }, { status: 500 });
  }
}
