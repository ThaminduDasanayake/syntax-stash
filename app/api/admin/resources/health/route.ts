import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { isAdmin } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resource, resourceHealth } from "@/lib/db/schema";
import { normalizeUrl } from "@/lib/url-utils";

async function verifyAdmin() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }
  return session.user;
}

interface ProbeResult {
  errorMessage: string | null;
  redirectUrl: string | null;
  status: "blocked" | "broken" | "healthy" | "redirect";
  statusCode: number | null;
}

export async function probeUrl(targetUrl: string): Promise<ProbeResult> {
  const userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (SyntaxStash/1.0 HealthBot)";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    let res = await fetch(targetUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": userAgent,
      },
      method: "HEAD",
      redirect: "manual",
      signal: controller.signal,
    });

    // If server disallows HEAD (405 Method Not Allowed), retry with GET
    if (res.status === 405) {
      res = await fetch(targetUrl, {
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": userAgent,
        },
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
      });
    }

    clearTimeout(timeoutId);

    // 1. Check for Redirects (301, 302, 307, 308)
    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      let resolvedRedirect: string | null = null;
      if (location) {
        try {
          resolvedRedirect = new URL(location, targetUrl).href;
        } catch {
          resolvedRedirect = location;
        }
      }

      // Check if redirect is just a trailing slash change
      const cleanOld = targetUrl.replace(/\/$/, "");
      const cleanNew = (resolvedRedirect || "").replace(/\/$/, "");

      if (cleanOld !== cleanNew && resolvedRedirect) {
        return {
          errorMessage: null,
          redirectUrl: resolvedRedirect,
          status: "redirect",
          statusCode: res.status,
        };
      }

      return {
        errorMessage: null,
        redirectUrl: null,
        status: "healthy",
        statusCode: res.status,
      };
    }

    // 2. Anti-bot / Cloudflare protection
    if (res.status === 403 || res.status === 429) {
      return {
        errorMessage: `HTTP ${res.status} (Protected / Cloudflare)`,
        redirectUrl: null,
        status: "blocked",
        statusCode: res.status,
      };
    }

    // 3. Broken / Dead (404, 410, 500+)
    if (res.status >= 400) {
      return {
        errorMessage: `HTTP ${res.status} ${res.statusText || "Error"}`,
        redirectUrl: null,
        status: "broken",
        statusCode: res.status,
      };
    }

    // 4. Healthy (200..399)
    return {
      errorMessage: null,
      redirectUrl: null,
      status: "healthy",
      statusCode: res.status,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("abort") || message.includes("timeout")) {
      return {
        errorMessage: "Connection timed out after 8.5s",
        redirectUrl: null,
        status: "broken",
        statusCode: null,
      };
    }

    if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED")) {
      return {
        errorMessage: `DNS / Connection failed (${message})`,
        redirectUrl: null,
        status: "broken",
        statusCode: null,
      };
    }

    return {
      errorMessage: `Request failed: ${message}`,
      redirectUrl: null,
      status: "broken",
      statusCode: null,
    };
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await verifyAdmin();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const { applyRedirect, resourceId, url: customUrl } = body;

    if (!resourceId && !customUrl) {
      return NextResponse.json(
        { error: "Either resourceId or url is required." },
        { status: 400 },
      );
    }

    let targetUrl = customUrl;
    const targetResourceId = resourceId;
    let updatedUrl: string | null = null;

    if (targetResourceId) {
      const [existingResource] = await db
        .select()
        .from(resource)
        .where(eq(resource.id, targetResourceId));

      if (!existingResource) {
        return NextResponse.json({ error: "Resource not found." }, { status: 404 });
      }

      // If applying a suggested redirect URL
      if (applyRedirect) {
        const [healthRecord] = await db
          .select()
          .from(resourceHealth)
          .where(eq(resourceHealth.resourceId, targetResourceId));

        if (healthRecord?.redirectUrl) {
          const normalizedNew = normalizeUrl(healthRecord.redirectUrl);
          const allResources = await db
            .select({ id: resource.id, title: resource.title, url: resource.url })
            .from(resource);

          const conflict = allResources.find(
            (r) => r.id !== targetResourceId && normalizeUrl(r.url) === normalizedNew,
          );

          if (conflict) {
            return NextResponse.json(
              { error: `Cannot apply redirect: URL is already used by "${conflict.title}"` },
              { status: 409 },
            );
          }

          await db
            .update(resource)
            .set({ updatedAt: new Date(), url: healthRecord.redirectUrl.trim() })
            .where(eq(resource.id, targetResourceId));

          targetUrl = healthRecord.redirectUrl.trim();
          updatedUrl = targetUrl;
        } else {
          targetUrl = existingResource.url;
        }
      } else {
        targetUrl = existingResource.url;
      }
    }

    // Run the health probe
    const probe = await probeUrl(targetUrl);
    const now = new Date();

    if (targetResourceId) {
      const healthId = crypto.randomUUID();
      await db
        .insert(resourceHealth)
        .values({
          id: healthId,
          errorMessage: probe.errorMessage,
          lastCheckedAt: now,
          redirectUrl: probe.redirectUrl,
          resourceId: targetResourceId,
          status: probe.status,
          statusCode: probe.statusCode,
        })
        .onConflictDoUpdate({
          set: {
            errorMessage: probe.errorMessage,
            lastCheckedAt: now,
            redirectUrl: probe.redirectUrl,
            status: probe.status,
            statusCode: probe.statusCode,
          },
          target: resourceHealth.resourceId,
        });

      // Purge edge caches if URL changed
      if (updatedUrl) {
        revalidateTag("resources", { expire: 0 });
        revalidatePath("/");
        revalidatePath("/resources");
      }
    }

    return NextResponse.json({
      health: {
        errorMessage: probe.errorMessage,
        lastCheckedAt: now.toISOString(),
        redirectUrl: probe.redirectUrl,
        resourceId: targetResourceId,
        status: probe.status,
        statusCode: probe.statusCode,
      },
      success: true,
      updatedUrl,
    });
  } catch (error) {
    console.error("POST /api/admin/resources/health error:", error);
    return NextResponse.json({ error: "Failed to perform health check." }, { status: 500 });
  }
}
