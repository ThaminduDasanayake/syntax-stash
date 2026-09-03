import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";

interface InputTool {
  addedDate?: string;
  author?: {
    name: string;
    url?: string;
  };
  categories?: string[];
  description?: string;
  designMinisSlug?: string;
  designMinisUrl?: string;
  favicon?: string;
  gitHubLink?: string;
  isHostedOnDesignMinis?: boolean;
  ogImage?: string;
  platforms?: string;
  pricing?: string;
  screenshot?: string;
  title: string;
  url: string;
}

export interface ExtractedIcon {
  href: string;
  rel: string;
  sizes?: string;
  type?: string;
}

export interface WebMetadata {
  headings: {
    h1: string[];
    h2: string[];
  };
  icons: ExtractedIcon[];
  jsonLd: unknown[];
  meta: Record<string, string>;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
}

export interface CompleteScrapedTool {
  author: string;
  authorUrl?: string;
  categories?: string[];
  description: string;
  favicon: string;
  gitHubLink?: string;
  metadata: WebMetadata;
  ogImage?: string;
  originalTitle: string;
  pricing?: string;
  title: string;
  url: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function cleanUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete("ref");
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("fpr");
    return parsed.href;
  } catch {
    return rawUrl;
  }
}

function resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
  try {
    return new URL(relativeOrAbsolute, baseUrl).href;
  } catch {
    return relativeOrAbsolute;
  }
}

async function fetchHtml(url: string, timeoutMs = 12000): Promise<{ finalUrl: string; html: string } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const html = await res.text();
    return { finalUrl: res.url || url, html };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractFullMetadata(html: string, targetUrl: string, fallbackTool: InputTool): CompleteScrapedTool {
  const $ = cheerio.load(html);

  const meta: Record<string, string> = {};
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  const icons: ExtractedIcon[] = [];
  const jsonLd: unknown[] = [];

  // 1. Extract Document Title
  const docTitle = $("title").first().text().trim();
  if (docTitle) {
    meta.title = docTitle;
  }

  // 2. Extract Canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) {
    meta.canonical = resolveUrl(canonical, targetUrl);
  }

  // 3. Extract All Meta Tags
  $("meta").each((_, el) => {
    const name = $(el).attr("name")?.trim();
    const property = $(el).attr("property")?.trim();
    const content = $(el).attr("content")?.trim();
    const itemProp = $(el).attr("itemprop")?.trim();

    if (!content) return;

    if (property && property.startsWith("og:")) {
      openGraph[property] = content;
    } else if ((name && name.startsWith("twitter:")) || (property && property.startsWith("twitter:"))) {
      const key = name || property || "";
      twitter[key] = content;
    } else if (name) {
      meta[name] = content;
    } else if (itemProp) {
      meta[itemProp] = content;
    } else if (property) {
      meta[property] = content;
    }
  });

  // 4. Extract All Icons
  $('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').each((_, el) => {
    const rel = $(el).attr("rel") || "icon";
    const href = $(el).attr("href");
    const sizes = $(el).attr("sizes");
    const type = $(el).attr("type");

    if (href) {
      icons.push({
        href: resolveUrl(href, targetUrl),
        rel,
        ...(sizes ? { sizes } : {}),
        ...(type ? { type } : {}),
      });
    }
  });

  // Add default favicon.ico if no icons were declared
  if (icons.length === 0) {
    try {
      const u = new URL(targetUrl);
      icons.push({
        href: `${u.origin}/favicon.ico`,
        rel: "icon",
      });
    } catch {
      // ignore
    }
  }

  // 5. Extract JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        jsonLd.push(JSON.parse(content));
      }
    } catch {
      // ignore JSON parse errors
    }
  });

  // 6. Extract Headings
  const h1: string[] = [];
  $("h1").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !h1.includes(text)) h1.push(text);
  });

  const h2: string[] = [];
  $("h2").each((_, el) => {
    const text = $(el).text().trim();
    if (text && !h2.includes(text) && h2.length < 5) h2.push(text);
  });

  // 7. GitHub Link discovery
  let gitHubLink = fallbackTool.gitHubLink;
  if (!gitHubLink) {
    $('a[href*="github.com"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href && !gitHubLink) {
        try {
          const gh = new URL(href);
          if (gh.hostname.includes("github.com")) {
            const parts = gh.pathname.split("/").filter(Boolean);
            if (
              parts.length >= 2 &&
              !["topics", "features", "explore", "trending", "pricing", "marketplace", "login", "signup"].includes(parts[0])
            ) {
              gitHubLink = `https://github.com/${parts[0]}/${parts[1]}`;
            }
          }
        } catch {
          // ignore
        }
      }
    });
  }

  // === SYNTHESIZE CLEAN HIGH-PRIORITY FIELDS ===

  // DESCRIPTION: Prioritize meta[name="description"] first, fallback to og:description, twitter:description, or first paragraph
  let description =
    meta.description ||
    meta["twitter:description"] ||
    openGraph["og:description"] ||
    twitter["twitter:description"] ||
    meta["og:description"] ||
    "";

  if (!description) {
    const firstP = $("main p, article p, body p").first().text().trim();
    if (firstP && firstP.length > 20 && firstP.length < 300) {
      description = firstP;
    } else {
      description = fallbackTool.description || "";
    }
  }

  // TITLE: Prioritize docTitle / og:title / twitter:title / h1
  const rawTitle =
    docTitle ||
    openGraph["og:title"] ||
    twitter["twitter:title"] ||
    (h1.length > 0 ? h1[0] : undefined) ||
    fallbackTool.title;

  let title = rawTitle.replace(/\s+/g, " ").trim();
  if (title.length > 85 && fallbackTool.title) {
    title = fallbackTool.title;
  }

  // AUTHOR: Check meta.author, twitter:creator, JSON-LD, or scan og:description
  let author = meta.author || twitter["twitter:creator"] || openGraph["article:author"] || "";

  if (!author && jsonLd.length > 0) {
    for (const item of jsonLd) {
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        if (typeof obj.author === "string") author = obj.author;
        else if (typeof obj.author === "object" && obj.author !== null) {
          const aObj = obj.author as Record<string, unknown>;
          if (typeof aObj.name === "string") author = aObj.name;
        }
      }
    }
  }

  // Check og:description for author patterns (e.g. "Built by Dinesh", "by @username")
  const ogDesc = openGraph["og:description"] || "";
  if (!author && ogDesc) {
    const builtByMatch = ogDesc.match(/(?:built|made|created)\s+by\s+([^,.;]+)/i);
    if (builtByMatch && builtByMatch[1]) {
      author = builtByMatch[1].trim();
    }
  }

  if (!author || author.startsWith("@vercel") || author.startsWith("@nextjs")) {
    author = fallbackTool.author?.name || "Unknown";
  }

  let authorUrl = fallbackTool.author?.url;
  if (!authorUrl && twitter["twitter:creator"]?.startsWith("@")) {
    authorUrl = `https://x.com/${twitter["twitter:creator"].replace(/^@/, "")}`;
  }

  // FAVICON: Pick best available icon (prefer SVG or Apple Touch Icon or PNG)
  let favicon = "";
  const svgIcon = icons.find((i) => i.type === "image/svg+xml" || i.href.endsWith(".svg"));
  const appleIcon = icons.find((i) => i.rel.includes("apple-touch-icon"));
  const pngIcon = icons.find((i) => i.type === "image/png" || i.href.endsWith(".png"));

  if (svgIcon) favicon = svgIcon.href;
  else if (appleIcon) favicon = appleIcon.href;
  else if (pngIcon) favicon = pngIcon.href;
  else if (icons.length > 0) favicon = icons[0].href;
  else favicon = fallbackTool.favicon || "";

  // OG IMAGE
  let ogImage: string | undefined;
  const rawOgImg =
    openGraph["og:image"] ||
    openGraph["og:image:url"] ||
    twitter["twitter:image"] ||
    twitter["twitter:image:src"] ||
    meta["og:image"];

  if (rawOgImg) {
    ogImage = resolveUrl(rawOgImg.trim(), targetUrl);
  } else {
    ogImage = fallbackTool.ogImage || fallbackTool.screenshot;
  }

  return {
    author,
    authorUrl,
    categories: fallbackTool.categories,
    description,
    favicon,
    gitHubLink,
    metadata: {
      headings: { h1, h2 },
      icons,
      jsonLd,
      meta,
      openGraph,
      twitter,
    },
    ogImage,
    originalTitle: fallbackTool.title,
    pricing: fallbackTool.pricing,
    title,
    url: cleanUrl(targetUrl),
  };
}

async function main() {
  const inputPath = path.resolve(process.cwd(), "data/designminis-tools.json");
  const rawData = await fs.readFile(inputPath, "utf-8");
  const tools: InputTool[] = JSON.parse(rawData);

  console.log(`🚀 Loaded ${tools.length} tool URLs from data/designminis-tools.json`);
  console.log("🌐 Extracting full Meta, OpenGraph, Twitter, and Icon metadata from each tool URL...\n");

  const results: CompleteScrapedTool[] = [];
  const CONCURRENCY = 5;

  for (let i = 0; i < tools.length; i += CONCURRENCY) {
    const batch = tools.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map(async (tool) => {
        const targetUrl = cleanUrl(tool.url);
        console.log(`  Scraping [${tool.title}] -> ${targetUrl}`);

        const fetchResult = await fetchHtml(targetUrl, 12000);

        if (!fetchResult) {
          console.warn(`  ⚠️ Failed to fetch live HTML for ${targetUrl}, generating fallback structure.`);
          return {
            author: tool.author?.name || "Unknown",
            authorUrl: tool.author?.url,
            categories: tool.categories,
            description: tool.description || "",
            favicon: tool.favicon || "",
            gitHubLink: tool.gitHubLink,
            metadata: {
              headings: { h1: [tool.title], h2: [] },
              icons: tool.favicon ? [{ href: tool.favicon, rel: "icon" }] : [],
              jsonLd: [],
              meta: { description: tool.description || "", title: tool.title },
              openGraph: tool.ogImage ? { "og:image": tool.ogImage, "og:title": tool.title } : {},
              twitter: {},
            },
            ogImage: tool.ogImage || tool.screenshot,
            originalTitle: tool.title,
            pricing: tool.pricing,
            title: tool.title,
            url: targetUrl,
          };
        }

        const metadata = extractFullMetadata(fetchResult.html, fetchResult.finalUrl, tool);
        return metadata;
      })
    );

    results.push(...batchResults);
  }

  const outPath = path.resolve(process.cwd(), "data/designminis-full-web-metadata.json");
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\n🎉 Successfully extracted full Web Extractor metadata for ${results.length} websites!`);
  console.log(`📁 Saved to: ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
