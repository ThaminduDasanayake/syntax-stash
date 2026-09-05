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

export interface CandidateOption {
  label: string;
  type: string;
  url: string;
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

    // 1. Title Extraction & Candidates
    const docTitle = $("title").first().text().trim();
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
    const twitterTitle = $('meta[name="twitter:title"]').attr("content")?.trim();
    const h1Title = $("h1").first().text().trim();
    const title = (ogTitle || twitterTitle || docTitle || h1Title || parsedUrl.hostname)
      .replace(/\s+/g, " ")
      .trim();

    // 2. JSON-LD Extraction
    let jsonLdDesc = "";
    let jsonLdImage = "";
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const parsed = JSON.parse($(el).text().trim());
        const data = Array.isArray(parsed) ? parsed[0] : parsed;
        if (data && typeof data === "object") {
          if (!jsonLdDesc && typeof data.description === "string") {
            jsonLdDesc = data.description.trim();
          }
          if (!jsonLdImage) {
            if (typeof data.image === "string") {
              jsonLdImage = data.image.trim();
            } else if (Array.isArray(data.image) && typeof data.image[0] === "string") {
              jsonLdImage = data.image[0].trim();
            } else if (data.image && typeof data.image === "object" && typeof data.image.url === "string") {
              jsonLdImage = data.image.url.trim();
            }
          }
        }
      } catch {
        // ignore malformed JSON-LD
      }
    });

    // 3. Description & Subtitle Extraction
    const metaDesc = $('meta[name="description"]').attr("content")?.trim();
    const ogDesc = $('meta[property="og:description"]').attr("content")?.trim();
    const twitterDesc = $('meta[name="twitter:description"]').attr("content")?.trim();
    const firstP = $("main p, article p, body p").first().text().trim();

    const description =
      ogDesc ||
      metaDesc ||
      twitterDesc ||
      jsonLdDesc ||
      (firstP.length > 20 && firstP.length < 300 ? firstP : "");

    // Subtitle / Tagline heuristic:
    // If twitterDesc is short (< 100 chars) and different from description, or h2 tagline
    let subtitle = "";
    if (twitterDesc && twitterDesc !== description && twitterDesc.length < 120) {
      subtitle = twitterDesc;
    } else if (metaDesc && metaDesc !== description && metaDesc.length < 120) {
      subtitle = metaDesc;
    }

    // 4. Favicons Multi-Discovery & Quality Ranking
    const faviconCandidates: { label: string; type: string; url: string; weight: number }[] = [];
    const seenFavicons = new Set<string>();

    const addFavicon = (href: string | undefined, label: string, type: string, weight: number) => {
      if (!href) return;
      const full = resolveUrl(href.trim(), finalUrl);
      if (full && !seenFavicons.has(full)) {
        seenFavicons.add(full);
        faviconCandidates.push({ label, type, url: full, weight });
      }
    };

    // Vector SVG icons (highest priority)
    $('link[rel="icon"][type="image/svg+xml"], link[rel="icon"][href*=".svg"]').each((_, el) => {
      addFavicon($(el).attr("href"), "Vector SVG (Sharpest)", "SVG", 100);
    });

    // Apple touch icon (high resolution PNG)
    $('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]').each((_, el) => {
      const sizes = $(el).attr("sizes") || "180x180";
      addFavicon($(el).attr("href"), `Apple Touch Icon (${sizes})`, "PNG", 85);
    });

    // High-res PNG icons
    $('link[rel="icon"][type="image/png"]').each((_, el) => {
      const sizes = $(el).attr("sizes") || "PNG";
      addFavicon($(el).attr("href"), `PNG Favicon (${sizes})`, "PNG", 75);
    });

    // Standard icons
    $('link[rel="icon"]').each((_, el) => {
      const href = $(el).attr("href");
      const isIco = href?.toLowerCase().endsWith(".ico");
      addFavicon(
        href,
        isIco ? "Standard Favicon (.ico)" : "Standard Favicon",
        isIco ? "ICO" : "Icon",
        isIco ? 40 : 60,
      );
    });

    // Shortcut icons
    $('link[rel="shortcut icon"]').each((_, el) => {
      addFavicon($(el).attr("href"), "Shortcut Icon", "ICO", 35);
    });

    // Fallback origin favicon.ico
    try {
      const u = new URL(finalUrl);
      addFavicon(`${u.origin}/favicon.ico`, "Default /favicon.ico", "ICO", 20);
    } catch {
      // ignore
    }

    faviconCandidates.sort((a, b) => b.weight - a.weight);
    const faviconOptions: CandidateOption[] = faviconCandidates.map(({ label, type, url }) => ({
      label,
      type,
      url,
    }));
    const favicon = faviconOptions[0]?.url || "";

    // 5. OG Image Multi-Discovery & Quality Ranking
    const ogImageCandidates: { label: string; type: string; url: string; weight: number }[] = [];
    const seenOgImages = new Set<string>();

    const addOgImage = (href: string | undefined, label: string, type: string, weight: number) => {
      if (!href) return;
      const full = resolveUrl(href.trim(), finalUrl);
      if (full && !seenOgImages.has(full)) {
        seenOgImages.add(full);
        ogImageCandidates.push({ label, type, url: full, weight });
      }
    };

    // Twitter image (typically 1200x630 summary card)
    const twImg =
      $('meta[name="twitter:image"]').attr("content") ||
      $('meta[name="twitter:image:src"]').attr("content");
    addOgImage(twImg, "Twitter Summary Card (1200x630 HD)", "Twitter", 95);

    // OpenGraph image
    const ogImg =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[property="og:image:url"]').attr("content") ||
      $('meta[property="og:image:secure_url"]').attr("content");
    addOgImage(ogImg, "OpenGraph Banner Image", "OpenGraph", 90);

    // Large format OG Image
    const ogImgLarge = $('meta[property="og:image:large"]').attr("content");
    addOgImage(ogImgLarge, "Large Banner Image", "High-Res", 85);

    // JSON-LD Image
    addOgImage(jsonLdImage, "Structured Data (JSON-LD) Image", "JSON-LD", 75);

    // Thumbnail / Logo
    const thumbImg = $('meta[name="thumbnail"]').attr("content");
    addOgImage(thumbImg, "Site Thumbnail", "Thumbnail", 60);

    ogImageCandidates.sort((a, b) => b.weight - a.weight);
    const ogImageOptions: CandidateOption[] = ogImageCandidates.map(({ label, type, url }) => ({
      label,
      type,
      url,
    }));
    const ogImage = ogImageOptions[0]?.url || "";

    // 6. Creator Attribution & Social Links
    const twitterCreator = $('meta[name="twitter:creator"]').attr("content")?.trim();
    const articleAuthor = $('meta[property="article:author"]').attr("content")?.trim();
    const metaAuthor = $('meta[name="author"]').attr("content")?.trim();

    let author = metaAuthor || twitterCreator || articleAuthor || "";

    if (!author && ogDesc) {
      const match = ogDesc.match(/(?:built|made|created)\s+by\s+([^,.;]+)/i);
      if (match && match[1]) {
        author = match[1].trim();
      }
    }

    if (author.startsWith("@vercel") || author.startsWith("@nextjs")) {
      author = "";
    }

    let authorTwitter: string | undefined;
    let authorGitHub: string | undefined;
    let authorYouTube: string | undefined;
    let authorLinkedIn: string | undefined;
    let authorWebsite: string | undefined;

    if (
      twitterCreator &&
      twitterCreator.startsWith("@") &&
      !["@github", "@nextjs", "@vercel"].includes(twitterCreator.toLowerCase())
    ) {
      authorTwitter = `https://x.com/${twitterCreator.replace(/^@/, "")}`;
    }

    // Scan page links for social profiles
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        const fullHref = resolveUrl(href, finalUrl);
        const linkUrl = new URL(fullHref);
        const host = linkUrl.hostname.toLowerCase();
        const pathname = linkUrl.pathname;

        // Twitter / X
        if (!authorTwitter && (host.includes("twitter.com") || host.includes("x.com"))) {
          if (!pathname.includes("/intent/") && !pathname.includes("/share") && pathname.length > 1) {
            authorTwitter = fullHref;
          }
        }

        // GitHub
        if (host.includes("github.com")) {
          const parts = pathname.split("/").filter(Boolean);
          if (
            parts.length === 1 &&
            !["about", "explore", "features", "login", "marketplace", "pricing", "signup", "topics", "trending"].includes(
              parts[0],
            )
          ) {
            if (!authorGitHub) authorGitHub = `https://github.com/${parts[0]}`;
          }
        }

        // YouTube
        if (!authorYouTube && (host.includes("youtube.com") || host.includes("youtu.be"))) {
          if (pathname.includes("/@") || pathname.includes("/channel/") || pathname.includes("/c/")) {
            authorYouTube = fullHref;
          }
        }

        // LinkedIn
        if (!authorLinkedIn && host.includes("linkedin.com")) {
          if (pathname.includes("/in/") || pathname.includes("/company/")) {
            authorLinkedIn = fullHref;
          }
        }
      } catch {
        // ignore invalid urls
      }
    });

    if (
      articleAuthor &&
      (articleAuthor.startsWith("http://") || articleAuthor.startsWith("https://"))
    ) {
      authorWebsite = articleAuthor;
    }

    // 7. GitHub Repository Discovery
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
              !["explore", "features", "login", "marketplace", "pricing", "signup", "topics", "trending"].includes(
                parts[0],
              )
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
      authorGitHub,
      authorLinkedIn,
      authorTwitter,
      authorWebsite,
      authorYouTube,
      category: suggestedCategory,
      description,
      favicon,
      faviconOptions,
      gitHubLink,
      ogImage,
      ogImageOptions,
      subtitle: subtitle || undefined,
      url: finalUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch metadata";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
