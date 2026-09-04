import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

import { resourceCategories } from "@/lib/resource-data";

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

function resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch {
    return relativeOrAbsolute;
  }
}

function suggestCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const cat of resourceCategories) {
    if (lower.includes(cat.toLowerCase())) {
      return cat;
    }
  }
  if (lower.includes("color") || lower.includes("palette") || lower.includes("gradient")) return "Colors";
  if (lower.includes("font") || lower.includes("type") || lower.includes("typography")) return "Typography";
  if (lower.includes("icon") || lower.includes("svg") || lower.includes("symbol")) return "Icons";
  if (lower.includes("animation") || lower.includes("motion") || lower.includes("transition")) return "Animations";
  if (lower.includes("component") || lower.includes("ui") || lower.includes("design system")) return "Components";
  if (lower.includes("illustrat") || lower.includes("draw") || lower.includes("art")) return "Illustrations";
  if (lower.includes("background") || lower.includes("pattern") || lower.includes("mesh")) return "Backgrounds";

  return "Other";
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "Only HTTP and HTTPS URLs are supported" }, { status: 400 });
  }

  if (isPrivateIp(parsedUrl.hostname)) {
    return NextResponse.json({ error: "Forbidden destination host" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(parsedUrl.href, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Website returned status ${res.status}` },
        { status: 502 },
      );
    }

    const html = await res.text();
    const finalUrl = res.url || parsedUrl.href;
    const $ = cheerio.load(html);

    // Title
    const docTitle = $("title").first().text().trim();
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
    const twitterTitle = $('meta[name="twitter:title"]').attr("content")?.trim();
    const h1Title = $("h1").first().text().trim();
    const title = (ogTitle || twitterTitle || docTitle || h1Title || parsedUrl.hostname).replace(/\s+/g, " ");

    // Description (prioritize meta description for concise SEO copy)
    const metaDesc = $('meta[name="description"]').attr("content")?.trim();
    const ogDesc = $('meta[property="og:description"]').attr("content")?.trim();
    const twitterDesc = $('meta[name="twitter:description"]').attr("content")?.trim();
    const firstP = $("main p, article p, body p").first().text().trim();
    const description = metaDesc || ogDesc || twitterDesc || (firstP.length > 20 && firstP.length < 300 ? firstP : "");

    // Author
    let author =
      $('meta[name="author"]').attr("content")?.trim() ||
      $('meta[name="twitter:creator"]').attr("content")?.trim() ||
      $('meta[property="article:author"]').attr("content")?.trim() ||
      "";

    // Scan og:description for "Built by X"
    if (!author && ogDesc) {
      const match = ogDesc.match(/(?:built|made|created)\s+by\s+([^,.;]+)/i);
      if (match && match[1]) {
        author = match[1].trim();
      }
    }

    if (author.startsWith("@vercel") || author.startsWith("@nextjs")) {
      author = "";
    }

    // Favicon
    const iconSelectors = [
      'link[rel="apple-touch-icon"]',
      'link[rel="icon"]',
      'link[rel="icon"][type="image/png"]',
      'link[rel="icon"][type="image/svg+xml"]',
      'link[rel="shortcut icon"]',
    ];

    let favicon = "";
    for (const sel of iconSelectors) {
      const href = $(sel).attr("href");
      if (href) {
        favicon = resolveUrl(href, finalUrl);
        break;
      }
    }

    if (!favicon) {
      try {
        const u = new URL(finalUrl);
        favicon = `${u.origin}/favicon.ico`;
      } catch {
        // ignore
      }
    }

    // OG Image
    const rawOgImg =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="og:image:url"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image:src"]').attr("content");

    const ogImage = rawOgImg ? resolveUrl(rawOgImg.trim(), finalUrl) : undefined;

    // GitHub Link discovery
    let gitHubLink: string | undefined;
    $('a[href*="github.com"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href && !gitHubLink) {
        try {
          const gh = new URL(href);
          if (gh.hostname.includes("github.com")) {
            const parts = gh.pathname.split("/").filter(Boolean);
            if (
              parts.length >= 2 &&
              !["explore", "features", "login", "marketplace", "pricing", "signup", "topics", "trending"].includes(parts[0])
            ) {
              gitHubLink = `https://github.com/${parts[0]}/${parts[1]}`;
            }
          }
        } catch {
          // ignore
        }
      }
    });

    const suggestedCategory = suggestCategory(`${title} ${description}`);

    return NextResponse.json({
      title,
      author,
      category: suggestedCategory,
      description,
      favicon,
      gitHubLink,
      ogImage,
      url: finalUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch metadata";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
