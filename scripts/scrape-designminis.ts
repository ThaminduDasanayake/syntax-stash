import * as fs from "node:fs/promises";
import * as path from "node:path";

import * as cheerio from "cheerio";

interface ScrapedLiveMeta {
  description?: string;
  favicon?: string;
  gitHubLink?: string;
  ogImage?: string;
  title?: string;
}

interface ExtractedTool {
  addedDate?: string;
  author?: {
    name: string;
    url?: string;
  };
  categories: string[];
  description: string;
  designMinisSlug: string;
  designMinisUrl: string;
  favicon?: string;
  gitHubLink?: string;
  isHostedOnDesignMinis: boolean;
  ogImage?: string;
  platforms?: string;
  pricing: string;
  screenshot?: string;
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

async function fetchHtml(url: string, timeoutMs = 9000): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function scrapeLiveMetadata(toolUrl: string): Promise<ScrapedLiveMeta> {
  const html = await fetchHtml(toolUrl, 9000);
  if (!html) return {};

  const $ = cheerio.load(html);

  // Title
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const twitterTitle = $('meta[name="twitter:title"]').attr("content");
  const docTitle = $("title").first().text().trim();
  const title = ogTitle || twitterTitle || docTitle || undefined;

  // Description
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const metaDesc = $('meta[name="description"]').attr("content");
  const twitterDesc = $('meta[name="twitter:description"]').attr("content");
  const description = (ogDesc || metaDesc || twitterDesc || "").trim() || undefined;

  // OG Image
  const rawOgImage =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $('meta[name="twitter:image:src"]').attr("content");
  const ogImage = rawOgImage ? resolveUrl(rawOgImage, toolUrl) : undefined;

  // Favicon
  const faviconEl =
    $('link[rel="icon"]').last().attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");
  let favicon = faviconEl ? resolveUrl(faviconEl, toolUrl) : undefined;
  if (!favicon) {
    try {
      const u = new URL(toolUrl);
      favicon = `${u.origin}/favicon.ico`;
    } catch {
      // ignore
    }
  }

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
            !["explore", "features", "marketplace", "pricing", "topics", "trending"].includes(
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

  return { title, description, favicon, gitHubLink, ogImage };
}

async function scrapeDesignMinisToolPage(detailUrl: string): Promise<{
  addedDate?: string;
  author?: { name: string; url?: string };
  categories?: string[];
  description?: string;
  platforms?: string;
  pricing?: string;
}> {
  const html = await fetchHtml(detailUrl, 8000);
  if (!html) return {};

  const $ = cheerio.load(html);

  // Intro description in main container
  let description: string | undefined;
  const descEl = $("main p").first();
  if (descEl.length > 0) {
    description = descEl.text().trim();
  }

  // Parse definition list (<dl>)
  let authorName: string | undefined;
  let authorUrl: string | undefined;
  let categories: string[] | undefined;
  let platforms: string | undefined;
  let pricing: string | undefined;
  let addedDate: string | undefined;

  $("dl div").each((_, div) => {
    const dt = $(div).find("dt").text().trim().toLowerCase();
    const dd = $(div).find("dd");

    if (dt.includes("made by")) {
      authorName = dd.text().trim();
      const link = dd.find("a").attr("href");
      if (link) {
        authorUrl = cleanUrl(link);
      }
    } else if (dt.includes("categories")) {
      const catText = dd.text().trim();
      categories = catText
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    } else if (dt.includes("platforms")) {
      platforms = dd.text().trim();
    } else if (dt.includes("pricing")) {
      pricing = dd.text().trim();
    } else if (dt.includes("added")) {
      addedDate = dd.text().trim();
    }
  });

  return {
    addedDate,
    author: authorName ? { name: authorName, url: authorUrl } : undefined,
    categories,
    description,
    platforms,
    pricing,
  };
}

async function main() {
  console.log("🚀 Fetching Design Minis homepage...");
  const homeHtml = await fetchHtml("https://www.designminis.com/", 10000);

  if (!homeHtml) {
    console.error("❌ Failed to fetch Design Minis homepage");
    process.exit(1);
  }

  const $ = cheerio.load(homeHtml);
  const toolsRaw: Array<{
    category: string;
    designMinisSlug: string;
    designMinisUrl: string;
    liveUrl: string;
    pricing: string;
    screenshot?: string;
    title: string;
  }> = [];

  // Parse all list items on the homepage
  $("li.group").each((_, el) => {
    const item = $(el);

    // Skip sponsored items
    const isSponsored = item.text().toLowerCase().includes("sponsored");
    if (isSponsored) return;

    // Title & Slug
    const titleLink = item.find('h3 a[href*="/tools/"]').first();
    const title = titleLink.text().trim();
    const detailHref = titleLink.attr("href");

    if (!title || !detailHref) return;

    const slug = detailHref.replace(/^\/tools\//, "");
    const designMinisUrl = `https://www.designminis.com/tools/${slug}`;

    // Screenshot
    const screenshot = item.find("img").attr("src");

    // Category & Pricing from card
    const metaText = item.find("p.text-muted").text().trim();
    const [category = "General", pricing = "Free"] = metaText.split("·").map((s) => s.trim());

    // Live URL
    let liveUrl =
      item.find('a[aria-label^="Open"]').attr("href") ||
      item.find('a[target="_blank"]').attr("href");

    if (!liveUrl) {
      liveUrl = designMinisUrl;
    }

    if (liveUrl.startsWith("/")) {
      liveUrl = `https://www.designminis.com${liveUrl}`;
    }

    toolsRaw.push({
      title,
      category,
      designMinisSlug: slug,
      designMinisUrl,
      liveUrl: cleanUrl(liveUrl),
      pricing,
      screenshot,
    });
  });

  console.log(`📦 Found ${toolsRaw.length} tools on Design Minis!`);
  console.log("🔍 Extracting rich metadata and live details for each...\n");

  const results: ExtractedTool[] = [];
  const CONCURRENCY = 4;

  for (let i = 0; i < toolsRaw.length; i += CONCURRENCY) {
    const batch = toolsRaw.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map(async (tool) => {
        console.log(`  [${tool.title}] -> ${tool.liveUrl}`);

        const isHostedOnDesignMinis = tool.liveUrl.includes("designminis.com");

        // 1. Fetch detail page from designminis for author, categories, description, and metadata
        const dmDetail = await scrapeDesignMinisToolPage(tool.designMinisUrl);

        // 2. Fetch live tool website metadata
        const liveMeta = await scrapeLiveMetadata(tool.liveUrl);

        const finalDescription =
          dmDetail.description ||
          liveMeta.description ||
          `${tool.title} is a ${tool.category.toLowerCase()} tool for designers and developers.`;

        const finalCategories =
          dmDetail.categories && dmDetail.categories.length > 0
            ? dmDetail.categories
            : [tool.category];

        const extracted: ExtractedTool = {
          title: tool.title,
          addedDate: dmDetail.addedDate,
          author:
            dmDetail.author ||
            (isHostedOnDesignMinis
              ? { name: "Kosta Motresku", url: "https://x.com/MotreskuKosta" }
              : undefined),
          categories: finalCategories,
          description: finalDescription,
          designMinisSlug: tool.designMinisSlug,
          designMinisUrl: tool.designMinisUrl,
          favicon: liveMeta.favicon,
          gitHubLink: liveMeta.gitHubLink,
          isHostedOnDesignMinis,
          ogImage: liveMeta.ogImage || tool.screenshot,
          platforms: dmDetail.platforms || "Web",
          pricing: dmDetail.pricing || tool.pricing,
          screenshot: tool.screenshot,
          url: tool.liveUrl,
        };

        return extracted;
      }),
    );

    results.push(...batchResults);
  }

  // Ensure output directory exists
  const outDir = path.resolve(process.cwd(), "data");
  await fs.mkdir(outDir, { recursive: true });

  const outPath = path.join(outDir, "designminis-tools.json");
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf-8");

  console.log(`\n🎉 Successfully extracted ${results.length} tools!`);
  console.log(`📁 Saved to: ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
