import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

import { CategoryItem, getAllCategories } from "@/lib/categories";

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

function cleanAuthorName(raw: string): string {
  if (!raw) return "";

  let name = raw.trim();

  // Strip leading attribution prefix if present
  name = name.replace(
    /^(?:built|made|created|developed|designed|maintained|curated|by|author:?)\s+/i,
    "",
  );

  // Strip trailing action calls, button labels, and noise that get attached when elements are concatenated
  // e.g. "Pixel PointFollow UsWatch Us" -> "Pixel Point"
  // e.g. "Alex BarashkovFollow on Twitter" -> "Alex Barashkov"
  name = name.replace(
    /(?:follow|watch|join|subscribe|star|share|contact|support|sponsor|view on|buy me a coffee|github|twitter|youtube|linkedin|discord|x\.com)\b.*$/i,
    "",
  );

  // Strip trailing conjunctions / locations e.g. "Jane Doe in New York", "John Doe with Next.js"
  name = name.replace(/\s+(?:with|using|in|at|on|for|from|and)\b.*$/i, "");

  // Strip trailing delimiters / noise
  name = name.replace(/[|•·–—-].*$/, "");

  // Clean extra whitespace
  name = name.replace(/\s+/g, " ").trim();

  // Remove quotes
  name = name.replace(/^["'`“”‘’]+|["'`“”‘’]+$/g, "").trim();

  // Validate length and discard generic terms
  const lower = name.toLowerCase();
  const genericBlocked = [
    "a community",
    "admin",
    "ai",
    "author",
    "community",
    "creator",
    "developer",
    "github",
    "nextjs",
    "our team",
    "the",
    "the team",
    "unknown",
    "vercel",
    "wordpress",
  ];

  if (name.length < 2 || name.length > 40 || genericBlocked.includes(lower)) {
    return "";
  }

  return name;
}

function findCategoryByKeywords(
  categories: CategoryItem[],
  slugMatch: string,
  nameFallback: string,
): string {
  const match = categories.find(
    (c) =>
      c.slug.toLowerCase() === slugMatch.toLowerCase() ||
      c.name.toLowerCase().includes(slugMatch.toLowerCase()),
  );
  return match?.name || nameFallback;
}

function suggestCategory(text: string, categories: CategoryItem[]): string {
  const lower = text.toLowerCase();

  // 1. Direct category name or slug match
  for (const cat of categories) {
    if (
      lower.includes(cat.name.toLowerCase()) ||
      (cat.slug && lower.includes(cat.slug.toLowerCase()))
    ) {
      return cat.name;
    }
  }

  // 2. Keyword-based heuristics mapped dynamically to database categories
  if (
    lower.includes("color") ||
    lower.includes("palette") ||
    lower.includes("gradient") ||
    lower.includes("contrast") ||
    lower.includes("hex") ||
    lower.includes("hsl")
  ) {
    return findCategoryByKeywords(categories, "colors", "Color & Gradients");
  }

  if (
    lower.includes("font") ||
    lower.includes("typeface") ||
    lower.includes("typography") ||
    lower.includes("variable font") ||
    lower.includes("glyph")
  ) {
    return findCategoryByKeywords(categories, "typography", "Typography");
  }

  if (
    lower.includes("icon") ||
    lower.includes("svg") ||
    lower.includes("symbol") ||
    lower.includes("illustration") ||
    lower.includes("doodle") ||
    lower.includes("vector")
  ) {
    return findCategoryByKeywords(categories, "icons", "Icons & Illustrations");
  }

  if (
    lower.includes("animation") ||
    lower.includes("motion") ||
    lower.includes("transition") ||
    lower.includes("gsap") ||
    lower.includes("lottie") ||
    lower.includes("framer-motion") ||
    lower.includes("canvas") ||
    lower.includes("three.js") ||
    lower.includes("webgl")
  ) {
    return findCategoryByKeywords(categories, "animation", "Animation & Motion");
  }

  if (
    lower.includes("component") ||
    lower.includes("ui kit") ||
    lower.includes("design system") ||
    lower.includes("radix") ||
    lower.includes("tailwind") ||
    lower.includes("shadcn") ||
    lower.includes("react-aria") ||
    lower.includes("widget")
  ) {
    return findCategoryByKeywords(categories, "ui", "UI Components & Libraries");
  }

  if (
    lower.includes("ai ") ||
    lower.includes("gpt") ||
    lower.includes("llm") ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning") ||
    lower.includes("prompt") ||
    lower.includes("openai") ||
    lower.includes("claude") ||
    lower.includes("gemini")
  ) {
    return findCategoryByKeywords(categories, "ai", "AI & Machine Learning");
  }

  if (
    lower.includes("mockup") ||
    lower.includes("presentation") ||
    lower.includes("device frame") ||
    lower.includes("screenshot") ||
    lower.includes("showcase")
  ) {
    return findCategoryByKeywords(categories, "mockups", "Mockups & Presentations");
  }

  if (
    lower.includes("database") ||
    lower.includes("api") ||
    lower.includes("sql") ||
    lower.includes("graphql") ||
    lower.includes("rest") ||
    lower.includes("schema") ||
    lower.includes("json")
  ) {
    return findCategoryByKeywords(categories, "data", "Data & APIs");
  }

  if (
    lower.includes("backend") ||
    lower.includes("serverless") ||
    lower.includes("infrastructure") ||
    lower.includes("auth") ||
    lower.includes("docker") ||
    lower.includes("deployment") ||
    lower.includes("cloud")
  ) {
    return findCategoryByKeywords(categories, "backend", "Backend & Infrastructure");
  }

  if (
    lower.includes("documentation") ||
    lower.includes("markdown") ||
    lower.includes("docs") ||
    lower.includes("cheat sheet") ||
    lower.includes("reference") ||
    lower.includes("readme")
  ) {
    return findCategoryByKeywords(categories, "docs", "Documentation & Markdown");
  }

  if (
    lower.includes("learn") ||
    lower.includes("tutorial") ||
    lower.includes("course") ||
    lower.includes("education") ||
    lower.includes("community") ||
    lower.includes("handbook")
  ) {
    return findCategoryByKeywords(categories, "education", "Education & Community");
  }

  if (
    lower.includes("inspiration") ||
    lower.includes("gallery") ||
    lower.includes("showcase") ||
    lower.includes("portfolio") ||
    lower.includes("directory")
  ) {
    return findCategoryByKeywords(categories, "inspiration", "Inspiration & Galleries");
  }

  if (
    lower.includes("image") ||
    lower.includes("audio") ||
    lower.includes("video") ||
    lower.includes("texture") ||
    lower.includes("sound") ||
    lower.includes("media")
  ) {
    return findCategoryByKeywords(categories, "media", "Media & Assets");
  }

  if (
    lower.includes("ux") ||
    lower.includes("accessibility") ||
    lower.includes("wireframe") ||
    lower.includes("figma") ||
    lower.includes("design token")
  ) {
    return findCategoryByKeywords(categories, "design", "Design & UX");
  }

  if (
    lower.includes("frontend") ||
    lower.includes("css") ||
    lower.includes("html") ||
    lower.includes("javascript") ||
    lower.includes("typescript") ||
    lower.includes("bundle")
  ) {
    return findCategoryByKeywords(categories, "frontend", "Frontend & UI");
  }

  const devMatch = categories.find(
    (c) => c.slug === "dev" || c.name.toLowerCase().includes("developer"),
  );
  return devMatch?.name || categories[0]?.name || "Developer Tools & Utilities";
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
      return NextResponse.json({ error: `Website returned status ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const finalUrl = res.url || parsedUrl.href;
    const $ = cheerio.load(html);

    // 1. Title & Subtitle Extraction
    const docTitle = $("title").first().text().trim();
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim();
    const ogSiteName = $('meta[property="og:site_name"]').attr("content")?.trim();
    const twitterTitle = $('meta[name="twitter:title"]').attr("content")?.trim();
    const h1Title = $("h1").first().text().trim();

    const rawTitle = (docTitle || ogTitle || twitterTitle || h1Title || parsedUrl.hostname)
      .replace(/\s+/g, " ")
      .trim();

    // Domain name stem for brand matching (e.g. "trendshift" from "trendshift.io" or "www.trendshift.com")
    const domainHost = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();
    const domainStem = domainHost.split(".")[0]?.toLowerCase() || "";

    let title = rawTitle;
    let subtitle = "";

    // Candidate delimiters to split multi-part title strings.
    // ' | ' is intentionally given highest priority as the primary SEO separator between Brand and Tagline.
    // eslint-disable-next-line perfectionist/sort-arrays
    const titleDelimiters = [" | ", " — ", " – ", " - ", " : ", " · ", " • "];
    let titleParts: string[] = [];

    // Find the highest-priority matching delimiter
    for (const delimiter of titleDelimiters) {
      if (rawTitle.includes(delimiter)) {
        const parts = rawTitle
          .split(delimiter)
          .map((p) => p.trim())
          .filter(Boolean);
        if (parts.length >= 2) {
          titleParts = parts;
          break;
        }
      }
    }

    if (titleParts.length >= 2) {
      const firstPart = titleParts[0];
      const lastPart = titleParts[titleParts.length - 1];

      const cleanPart = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
      const cleanStem = cleanPart(domainStem);
      const cleanSiteName = ogSiteName ? cleanPart(ogSiteName) : "";

      const firstClean = cleanPart(firstPart);
      const lastClean = cleanPart(lastPart);

      // Check if candidate matches domain or og:site_name (Exact or high-confidence match)
      const isExactBrand = (clean: string, original: string) => {
        if (!clean) return false;
        if (
          cleanStem.length > 2 &&
          (clean === cleanStem ||
            clean === `${cleanStem}app` ||
            clean === `${cleanStem}io` ||
            clean === `${cleanStem}dev`)
        )
          return true;
        if (
          cleanSiteName.length > 2 &&
          (clean === cleanSiteName || original.toLowerCase() === ogSiteName?.toLowerCase())
        )
          return true;
        return false;
      };

      const lastMatchesBrand = isExactBrand(lastClean, lastPart);
      const firstMatchesBrand = isExactBrand(firstClean, firstPart);

      if (lastMatchesBrand && !firstMatchesBrand) {
        // "Live trending GitHub repositories — daily momentum ranking | Trendshift" -> Title: "Trendshift", Subtitle: "Live trending GitHub repositories — daily momentum ranking"
        title = lastPart;
        subtitle = titleParts.slice(0, -1).join(" — ");
      } else if (firstMatchesBrand && !lastMatchesBrand) {
        // "Trendshift | Live trending GitHub repositories — daily momentum ranking" -> Title: "Trendshift", Subtitle: "Live trending GitHub repositories — daily momentum ranking"
        title = firstPart;
        subtitle = titleParts.slice(1).join(" — ");
      } else {
        // Fallback length heuristics: if last part is very short (< 25 chars) and first part is long (> 30 chars), it's brand-last
        if (lastPart.length <= 25 && firstPart.length > 30) {
          title = lastPart;
          subtitle = titleParts.slice(0, -1).join(" — ");
        } else {
          // Default brand-first
          title = firstPart;
          subtitle = titleParts.slice(1).join(" — ");
        }
      }
    } else if (rawTitle.includes(":")) {
      // Fallback: If title has a colon without outer spaces (e.g., "AgentMemory: Persistent Memory")
      const colonParts = rawTitle
        .split(":")
        .map((p) => p.trim())
        .filter(Boolean);
      if (colonParts.length >= 2 && colonParts[0].length <= 30) {
        title = colonParts[0];
        subtitle = colonParts.slice(1).join(": ");
      }
    }

    // If og:site_name is present and title is very long (> 50 chars), fallback title to og:site_name
    if (ogSiteName && title.length > 50 && ogSiteName.length < 35) {
      subtitle = subtitle || title;
      title = ogSiteName;
    }

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
            } else if (
              data.image &&
              typeof data.image === "object" &&
              typeof data.image.url === "string"
            ) {
              jsonLdImage = data.image.url.trim();
            }
          }
        }
      } catch {
        // ignore malformed JSON-LD
      }
    });

    // 3. Description Extraction (Prioritizing meta description & JSON-LD)
    const metaDesc = $('meta[name="description"]').attr("content")?.trim();
    const ogDesc = $('meta[property="og:description"]').attr("content")?.trim();
    const twitterDesc = $('meta[name="twitter:description"]').attr("content")?.trim();
    const firstP = $("main p, article p, body p").first().text().trim();

    // Standard priority: standard meta description > twitter desc > og desc > jsonLd > first paragraph
    const description =
      metaDesc ||
      twitterDesc ||
      ogDesc ||
      jsonLdDesc ||
      (firstP.length > 20 && firstP.length < 300 ? firstP : "");

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

    let author = cleanAuthorName(metaAuthor || "") || cleanAuthorName(articleAuthor || "");
    let authorWebsite: string | undefined;
    let authorTwitter: string | undefined;
    let authorGitHub: string | undefined;
    let authorYouTube: string | undefined;
    let authorLinkedIn: string | undefined;

    if (
      articleAuthor &&
      (articleAuthor.startsWith("http://") || articleAuthor.startsWith("https://"))
    ) {
      authorWebsite = articleAuthor;
    }

    if (
      twitterCreator &&
      twitterCreator.startsWith("@") &&
      !["@github", "@nextjs", "@vercel"].includes(twitterCreator.toLowerCase())
    ) {
      authorTwitter = `https://x.com/${twitterCreator.replace(/^@/, "")}`;
    }

    // Direct DOM scan for linked creator: e.g. "<p><span>Made by</span> <a href="...">Pixel Point</a></p>"
    if (!author) {
      const attributionKeywords = [
        "built by",
        "crafted by",
        "created by",
        "curated by",
        "designed by",
        "developed by",
        "made by",
        "maintained by",
      ];

      $("p, span, div, li, small, footer, [class*='author'], [class*='byline'], [class*='credit']").each(
        (_, el) => {
          if (author) return;
          const $el = $(el);
          const textContent = $el.text().replace(/\s+/g, " ").trim();

          const hasKeyword = attributionKeywords.some((kw) =>
            textContent.toLowerCase().includes(kw),
          );
          if (!hasKeyword) return;

          // Check if there is an <a> tag inside or adjacent to the attribution keyword
          const $links = $el.find("a");
          if ($links.length > 0) {
            $links.each((_, linkEl) => {
              if (author) return;
              const $link = $(linkEl);
              const linkText = $link.text().replace(/\s+/g, " ").trim();
              const linkHref = $link.attr("href")?.trim();

              // Check if linkText is an action button (like "Follow Us", "Watch Us")
              const isActionButton =
                /^(?:follow|watch|join|subscribe|star|share|contact|support|sponsor|view on|buy me a coffee|github|twitter|youtube|linkedin|discord|x\.com)\b/i.test(
                  linkText,
                );

              if (!isActionButton) {
                const cleaned = cleanAuthorName(linkText);
                if (cleaned) {
                  author = cleaned;
                  if (linkHref) {
                    const resolved = resolveUrl(linkHref, finalUrl);
                    if (resolved.includes("twitter.com") || resolved.includes("x.com")) {
                      authorTwitter = resolved;
                    } else if (resolved.includes("github.com")) {
                      authorGitHub = resolved;
                    } else if (resolved.includes("youtube.com")) {
                      authorYouTube = resolved;
                    } else if (resolved.includes("linkedin.com")) {
                      authorLinkedIn = resolved;
                    } else if (resolved.startsWith("http")) {
                      authorWebsite = resolved;
                    }
                  }
                }
              }
            });
          }

          // If no link, check for text right after "made by" / "created by" in this specific element
          if (!author) {
            const match = textContent.match(
              /(?:built|made|created|developed|designed|maintained|curated|crafted)\s+by\s+([^,.;|•·–—]+)/i,
            );
            if (match && match[1]) {
              const cleaned = cleanAuthorName(match[1]);
              if (cleaned) {
                author = cleaned;
              }
            }
          }
        },
      );
    }

    // Fallback: OpenGraph description match
    if (!author && ogDesc) {
      const match = ogDesc.match(/(?:built|made|created|developed|designed|crafted|curated)\s+by\s+([^,.;|•·–—]+)/i);
      if (match && match[1]) {
        author = cleanAuthorName(match[1]);
      }
    }

    if (author.startsWith("@vercel") || author.startsWith("@nextjs")) {
      author = "";
    }

    // Scan page links for social profiles with relevance scoring
    const twitterCandidates: { score: number; url: string }[] = [];
    const githubUserCandidates: { score: number; url: string }[] = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        // Mailto extraction for personal portfolio domains (e.g. hello@theshiva.xyz -> https://theshiva.xyz)
        if (href.startsWith("mailto:")) {
          const email = href
            .replace(/^mailto:/i, "")
            .split("?")[0]
            .trim();
          const emailParts = email.split("@");
          if (emailParts.length === 2) {
            const domain = emailParts[1]?.toLowerCase();
            const genericDomains = [
              "gmail.com",
              "hotmail.com",
              "icloud.com",
              "live.com",
              "mail.com",
              "me.com",
              "outlook.com",
              "proton.me",
              "protonmail.com",
              "yahoo.com",
            ];
            if (
              domain &&
              !genericDomains.includes(domain) &&
              !finalUrl.toLowerCase().includes(domain)
            ) {
              if (!authorWebsite) {
                authorWebsite = `https://${domain}`;
              }
            }
          }
          return;
        }

        const fullHref = resolveUrl(href, finalUrl);
        const linkUrl = new URL(fullHref);
        const host = linkUrl.hostname.toLowerCase();
        const pathname = linkUrl.pathname;
        const parts = pathname.split("/").filter(Boolean);
        const text = $(el).text().trim().toLowerCase();
        const aria = ($(el).attr("aria-label") || "").toLowerCase();
        const isFooterOrNav =
          $(el).closest("footer, nav, header, [class*='footer'], [class*='social'], [class*='nav']")
            .length > 0;

        // Twitter / X (Targeting user profile, excluding tweets, status, share links)
        if (
          host.includes("twitter.com") ||
          host.includes("x.com") ||
          host === "t.co" ||
          aria.includes("twitter") ||
          aria.includes("x logo")
        ) {
          const isStatusOrIntent =
            pathname.includes("/status/") ||
            pathname.includes("/i/") ||
            pathname.includes("/intent/") ||
            pathname.includes("/share") ||
            pathname.includes("/search") ||
            pathname.includes("/hashtag/");

          if (!isStatusOrIntent && parts.length === 1) {
            const username = parts[0].replace(/^@/, "");
            if (
              ![
                "explore",
                "home",
                "i",
                "intent",
                "messages",
                "notifications",
                "privacy",
                "search",
                "settings",
                "share",
                "tos",
              ].includes(username.toLowerCase())
            ) {
              let score = 10;
              if (isFooterOrNav) score += 50;
              if (
                text.includes("twitter") ||
                text.includes("x") ||
                aria.includes("twitter") ||
                aria.includes("x")
              )
                score += 30;
              twitterCandidates.push({ score, url: `https://x.com/${username}` });
            }
          }
        }

        // GitHub User Profile (Including shorteners like git.new, git.io, hub.new)
        const isGithubHost =
          host.includes("github.com") ||
          host === "git.new" ||
          host === "git.io" ||
          host === "hub.new";
        if (isGithubHost && parts.length === 1) {
          const username = parts[0];
          if (
            ![
              "about",
              "explore",
              "features",
              "login",
              "marketplace",
              "orgs",
              "pricing",
              "signup",
              "site",
              "sponsors",
              "topics",
              "trending",
              "users",
            ].includes(username.toLowerCase())
          ) {
            let score = 10;
            if (isFooterOrNav) score += 50;
            if (text.includes("github") || aria.includes("github")) score += 30;
            githubUserCandidates.push({ score, url: `https://github.com/${username}` });
          }
        }

        // YouTube
        if (!authorYouTube && (host.includes("youtube.com") || host.includes("youtu.be"))) {
          if (
            pathname.includes("/@") ||
            pathname.includes("/channel/") ||
            pathname.includes("/c/")
          ) {
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

    twitterCandidates.sort((a, b) => b.score - a.score);
    githubUserCandidates.sort((a, b) => b.score - a.score);

    if (!authorTwitter && twitterCandidates.length > 0) {
      authorTwitter = twitterCandidates[0].url;
    }
    if (!authorGitHub && githubUserCandidates.length > 0) {
      authorGitHub = githubUserCandidates[0].url;
    }

    // 7. GitHub Repository Discovery (High-Confidence Heuristic Matching)
    let github: string | undefined;
    const repoCandidates: { repoUrl: string; score: number }[] = [];
    const domainClean = domainStem.toLowerCase().replace(/[^a-z0-9]/g, "");
    const titleClean = title.toLowerCase().replace(/[^a-z0-9]/g, "");

    $(
      'a[href*="github.com"], a[href*="git.new"], a[href*="git.io"], a[href*="hub.new"], a[aria-label*="github" i], a[title*="github" i]',
    ).each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;
      try {
        const fullHref = resolveUrl(href, finalUrl);
        const gh = new URL(fullHref);
        const isGh =
          gh.hostname.includes("github.com") ||
          gh.hostname === "git.new" ||
          gh.hostname === "git.io" ||
          gh.hostname === "hub.new";
        if (!isGh) return;

        const parts = gh.pathname.split("/").filter(Boolean);
        if (parts.length === 0) return;

        let repoUrl = "";
        let owner = "";
        let repo = "";

        if (gh.hostname !== "github.com" && parts.length === 1) {
          // e.g. https://git.new/Tokokino
          repoUrl = fullHref;
          owner = parts[0];
          repo = parts[0];
        } else if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1];
          repoUrl = `https://github.com/${owner}/${repo}`;
        } else {
          return;
        }

        if (
          [
            "about",
            "explore",
            "features",
            "login",
            "marketplace",
            "orgs",
            "pricing",
            "signup",
            "site",
            "sponsors",
            "topics",
            "trending",
            "users",
          ].includes(owner.toLowerCase())
        ) {
          return;
        }

        const repoClean = repo.toLowerCase().replace(/[^a-z0-9]/g, "");
        const ownerClean = owner.toLowerCase().replace(/[^a-z0-9]/g, "");

        const text = $(el).text().trim().toLowerCase();
        const aria = ($(el).attr("aria-label") || "").toLowerCase();
        const titleAttr = ($(el).attr("title") || "").toLowerCase();

        const isSponsorOrAd =
          $(el).closest(
            "[class*='sponsor'], [class*='ad'], [class*='featured'], [class*='partner']",
          ).length > 0;
        const isFeedOrList =
          $(el).closest(
            "[class*='feed'], [class*='mention'], [class*='item'], [class*='row'], [class*='card']",
          ).length > 0;
        const isNavOrHeader =
          $(el).closest("header, nav, [class*='header'], [class*='nav'], [class*='hero']").length >
          0;

        let score = 0;

        // Brand & domain matching (High confidence)
        if (repoClean === domainClean || repoClean === titleClean) {
          score += 100;
        } else if (repoClean.includes(domainClean) || repoClean.includes(titleClean)) {
          score += 70;
        } else if (ownerClean === domainClean || ownerClean === titleClean) {
          score += 60;
        }

        // Context phrases indicating source code repository
        if (
          text.includes("source") ||
          text.includes("github") ||
          text.includes("star") ||
          text.includes("repo") ||
          aria.includes("github") ||
          aria.includes("source") ||
          titleAttr.includes("github")
        ) {
          score += 25;
        }

        if (repoClean === domainClean || ownerClean === domainClean) score += 50;
        if (titleClean.includes(repoClean) || repoClean.includes(titleClean)) score += 40;
        if (domainClean.includes(repoClean) || repoClean.includes(domainClean)) score += 30;

        if (isNavOrHeader) score += 15;
        if (isSponsorOrAd) score -= 40;
        if (isFeedOrList) score -= 30;

        repoCandidates.push({ repoUrl, score });
      } catch {
        // ignore
      }
    });

    repoCandidates.sort((a, b) => b.score - a.score);
    // Only accept if positive confidence score
    if (repoCandidates.length > 0 && repoCandidates[0].score > 20) {
      github = repoCandidates[0].repoUrl;
    }

    const categories = await getAllCategories();
    const suggestedCategory = suggestCategory(`${title} ${description}`, categories);

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
      github,
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
