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

/**
 * Image redirect endpoint.
 * Redirects directly to the target image URL with aggressive edge caching headers.
 * Avoids streaming heavy binary images through Vercel Serverless Compute (Fast Origin Transfer).
 */
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

  return NextResponse.redirect(parsedUrl.href, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
    status: 307,
  });
}
