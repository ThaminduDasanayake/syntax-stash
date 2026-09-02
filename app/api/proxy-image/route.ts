import { NextRequest, NextResponse } from "next/server";

const BLOCKED_HOSTS = new Set(["0.0.0.0", "127.0.0.1", "::1", "localhost"]);

function isPrivateIp(hostname: string): boolean {
  if (BLOCKED_HOSTS.has(hostname.toLowerCase())) return true;
  const parts = hostname.split(".").map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlParam);
  } catch {
    return new NextResponse("Invalid url parameter", { status: 400 });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return new NextResponse("Only http and https protocols are supported", { status: 400 });
  }

  if (isPrivateIp(parsedUrl.hostname)) {
    return new NextResponse("Forbidden destination host", { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const upstreamHeaders: Record<string, string> = {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    };

    // Forward conditional headers for ETag / 304 validation
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch) {
      upstreamHeaders["If-None-Match"] = ifNoneMatch;
    }

    const ifModifiedSince = request.headers.get("if-modified-since");
    if (ifModifiedSince) {
      upstreamHeaders["If-Modified-Since"] = ifModifiedSince;
    }

    const upstreamRes = await fetch(parsedUrl.href, {
      headers: upstreamHeaders,
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseHeaders: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      "Cross-Origin-Resource-Policy": "cross-origin",
    };

    // Forward upstream validation headers
    const etag = upstreamRes.headers.get("etag");
    if (etag) {
      responseHeaders["ETag"] = etag;
    }

    const lastModified = upstreamRes.headers.get("last-modified");
    if (lastModified) {
      responseHeaders["Last-Modified"] = lastModified;
    }

    // Upstream confirmed image is unchanged
    if (upstreamRes.status === 304) {
      return new NextResponse(null, {
        headers: responseHeaders,
        status: 304,
      });
    }

    if (!upstreamRes.ok) {
      return new NextResponse(`Upstream returned ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/png";
    responseHeaders["Content-Type"] = contentType;

    const imageBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: responseHeaders,
      status: 200,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return new NextResponse(`Failed to fetch image: ${message}`, { status: 502 });
  }
}
