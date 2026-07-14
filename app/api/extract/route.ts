import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { NextRequest, NextResponse } from "next/server";

export interface MetaTag {
  charset?: string;
  content?: string;
  httpEquiv?: string;
  itemprop?: string;
  name?: string;
  property?: string;
}

export interface ExtractedData {
  anchors: string[];
  author: string;
  canonicalUrl: string;
  charset: string;
  description: string;
  generator: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  jsonLd: unknown[];
  keywords: string[];
  language: string;
  links: {
    alternates: string[];
    appleTouchIcons: string[];
    canonical: string;
    dnsPrefetch: string[];
    icons: string[];
    manifests: string[];
    maskIcons: string[];
    modulepreloads: string[];
    preconnects: string[];
    preloads: string[];
  };
  meta: MetaTag[];
  openGraph: {
    description: string;
    image: string;
    siteName: string;
    title: string;
    type: string;
    url: string;
  };
  rawHead: string;
  robots: {
    bingbot: string;
    googlebot: string;
    robots: string;
  };
  scripts: {
    async: boolean;
    defer: boolean;
    nomodule: boolean;
    src?: string;
    type?: string;
  }[];
  themeColor: {
    colorScheme: string;
    themeColor: string;
  };
  title: string;
  twitter: {
    card: string;
    creator: string;
    description: string;
    image: string;
    site: string;
    title: string;
  };
  url: string;
  verification: {
    bing: string;
    facebook: string;
    google: string;
    pinterest: string;
    yandex: string;
  };
  viewport: string;
}

/** Resolve a potentially relative href against the page origin. */
function resolveHref(href: string, base: string): string | null {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

/** Resolve relative metadata URLs (OpenGraph image, Twitter image, etc.). */
function resolveMetaUrl(urlStr: string, base: string): string {
  if (!urlStr) return "";
  return resolveHref(urlStr, base) ?? urlStr;
}

/** Clean and normalize multiple whitespace and carriage returns to a single space. */
function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Collect non-empty text from all matched elements. */
function texts($: cheerio.Cheerio<AnyNode>, selector: string): string[] {
  const results: string[] = [];
  $.find(selector).each((_, el) => {
    const text = cleanText(cheerio.load(el).text());
    if (text) results.push(text);
  });
  return results;
}

/** Read a <meta> tag's content, matching by name, property, or itemprop attribute case-insensitively using key fallbacks. */
function getMeta($: cheerio.Cheerio<AnyNode>, keys: string[]): string {
  for (const key of keys) {
    const escapedKey = key.replace(/"/g, '\\"');
    const content =
      $.find(`meta[name="${escapedKey}" i]`).attr("content") ??
      $.find(`meta[property="${escapedKey}" i]`).attr("content") ??
      $.find(`meta[itemprop="${escapedKey}" i]`).attr("content");
    if (content !== undefined) {
      return cleanText(content);
    }
  }
  return "";
}

/** Deduplicate a string array. */
function deduplicate(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

/** Fetch with retry logic for transient failures, respecting Retry-After header for rate limits. */
async function fetchWithRetry(
  url: string,
  options: Omit<RequestInit, "signal">,
  retries = 2,
  delay = 1000
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const attemptSignal = AbortSignal.timeout(10_000);
      const response = await fetch(url, {
        ...options,
        signal: attemptSignal,
      });

      if (response.ok) {
        return response;
      }

      const status = response.status;
      if (status === 429 || status === 503 || status === 504) {
        if (i === retries) {
          return response;
        }

        let retryAfterDelay = delay * Math.pow(2, i);
        if (status === 429) {
          const retryAfterHeader = response.headers.get("retry-after");
          if (retryAfterHeader) {
            const seconds = parseInt(retryAfterHeader, 10);
            if (!isNaN(seconds)) {
              retryAfterDelay = seconds * 1000;
            } else {
              const dateMs = Date.parse(retryAfterHeader);
              if (!isNaN(dateMs)) {
                retryAfterDelay = Math.max(0, dateMs - Date.now());
              }
            }
          }
        }

        // Cap delay to a maximum of 5 seconds to avoid blocking serverless runtimes
        retryAfterDelay = Math.min(retryAfterDelay, 5000);
        await new Promise((resolve) => setTimeout(resolve, retryAfterDelay));
        continue;
      }

      return response;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (i === retries) {
        throw lastError;
      }
      const retryAfterDelay = Math.min(delay * Math.pow(2, i), 5000);
      await new Promise((resolve) => setTimeout(resolve, retryAfterDelay));
    }
  }

  throw lastError ?? new Error("Fetch failed");
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const rawUrl = searchParams.get("url")?.trim();

  // Validate the URL parameter

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing required query parameter: url" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
    if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
      throw new Error("Only http and https are supported.");
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Invalid URL: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 },
    );
  }

  // Fetch the target page

  let html: string;
  try {
    const response = await fetchWithRetry(targetUrl.href, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Ch-Ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      const size = Number(contentLength);
      if (!isNaN(size) && size > 10_000_000) {
        return NextResponse.json({ error: "Response size exceeds the 10 MB limit." }, { status: 413 });
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Remote server returned ${response.status} ${response.statusText}`,
        },
        { status: 502 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: `Expected HTML but received content-type: ${contentType}` },
        { status: 422 },
      );
    }

    html = await response.text();
    if (html.length > 10_000_000) {
      return NextResponse.json({ error: "Response content exceeds the 10 MB limit." }, { status: 413 });
    }
  } catch (e) {
    const message =
      e instanceof Error
        ? e.name === "AbortError" || e.name === "TimeoutError"
          ? "Request timed out after 10 seconds."
          : e.message
        : "Unknown fetch error.";

    return NextResponse.json({ error: `Fetch failed: ${message}` }, { status: 500 });
  }

  // Parse with Cheerio focusing queries on the head element

  const $ = cheerio.load(html);
  const base = targetUrl.href;

  const head = $("head");
  const body = $("body");

  // Title & Description & Author & Language & Charset
  const title = cleanText(head.find("title").first().text()) || getMeta(head, ["og:title"]) || "";
  const description = getMeta(head, ["description", "og:description"]) || "";
  const author = getMeta(head, [
    "article:author",
    "author",
    "og:article:author",
    "twitter:creator",
  ]);
  const language = cleanText($("html").attr("lang") ?? "");
  const charset = cleanText(head.find("meta[charset]").attr("charset") ?? "");

  // Keywords
  const rawKeywords = getMeta(head, ["keyword", "keywords"]);
  const keywords = rawKeywords
    ? rawKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    : [];

  // Generic metadata extraction
  const meta: MetaTag[] = [];
  head.find("meta").each((_, el) => {
    if (el.type === "tag") {
      const attribs = el.attribs;
      if (Object.keys(attribs).length > 0) {
        meta.push({
          charset: attribs.charset ? cleanText(attribs.charset) : undefined,
          content: attribs.content ? cleanText(attribs.content) : undefined,
          httpEquiv: attribs["http-equiv"] ? cleanText(attribs["http-equiv"]) : undefined,
          itemprop: attribs.itemprop ? cleanText(attribs.itemprop) : undefined,
          name: attribs.name ? cleanText(attribs.name) : undefined,
          property: attribs.property ? cleanText(attribs.property) : undefined,
        });
      }
    }
  });

  // JSON-LD parsing (flatten arrays if found)
  const jsonLd: unknown[] = [];
  head.find('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).text().trim();
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          jsonLd.push(...parsed);
        } else {
          jsonLd.push(parsed);
        }
      }
    } catch {
      // Ignore malformed JSON-LD
    }
  });

  // Link Classification & Deduplication
  const canonicalHref = head.find('link[rel="canonical" i]').attr("href");
  const canonical = canonicalHref ? resolveMetaUrl(canonicalHref, base) : base;

  const alternates: string[] = [];
  const appleTouchIcons: string[] = [];
  const dnsPrefetch: string[] = [];
  const icons: string[] = [];
  const manifests: string[] = [];
  const maskIcons: string[] = [];
  const modulepreloads: string[] = [];
  const preconnects: string[] = [];
  const preloads: string[] = [];

  head.find("link[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    const resolved = resolveHref(href, base) ?? href;
    const rel = ($(el).attr("rel") ?? "").toLowerCase().trim();

    if (rel === "apple-touch-icon") {
      appleTouchIcons.push(resolved);
    } else if (rel === "mask-icon") {
      maskIcons.push(resolved);
    } else if (rel.includes("icon")) {
      icons.push(resolved);
    } else if (rel === "preload") {
      preloads.push(resolved);
    } else if (rel === "preconnect") {
      preconnects.push(resolved);
    } else if (rel === "dns-prefetch") {
      dnsPrefetch.push(resolved);
    } else if (rel === "modulepreload") {
      modulepreloads.push(resolved);
    } else if (rel === "manifest") {
      manifests.push(resolved);
    } else if (rel.includes("alternate")) {
      alternates.push(resolved);
    }
  });

  const links = {
    alternates: deduplicate(alternates),
    appleTouchIcons: deduplicate(appleTouchIcons),
    canonical,
    dnsPrefetch: deduplicate(dnsPrefetch),
    icons: deduplicate(icons),
    manifests: deduplicate(manifests),
    maskIcons: deduplicate(maskIcons),
    modulepreloads: deduplicate(modulepreloads),
    preconnects: deduplicate(preconnects),
    preloads: deduplicate(preloads),
  };

  // Scripts collection (excluding content, deduplicated by src)
  const rawScripts: {
    async: boolean;
    defer: boolean;
    nomodule: boolean;
    src?: string;
    type?: string;
  }[] = [];

  head.find("script").each((_, el) => {
    const src = $(el).attr("src") ?? undefined;
    const type = $(el).attr("type") ?? undefined;

    if (type === "application/ld+json") return;

    rawScripts.push({
      async: $(el).attr("async") !== undefined,
      defer: $(el).attr("defer") !== undefined,
      nomodule: $(el).attr("nomodule") !== undefined,
      src: src ? (resolveHref(src, base) ?? src) : undefined,
      type,
    });
  });

  const seenScripts = new Set<string>();
  const scripts: typeof rawScripts = [];
  for (const s of rawScripts) {
    if (s.src) {
      if (!seenScripts.has(s.src)) {
        seenScripts.add(s.src);
        scripts.push(s);
      }
    } else {
      scripts.push(s);
    }
  }

  // Headings & Anchors (Body Elements)
  const headings = {
    h1: texts(body, "h1"),
    h2: texts(body, "h2"),
    h3: texts(body, "h3"),
  };

  const seenAnchors = new Set<string>();
  const anchors: string[] = [];
  body.find("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const resolved = resolveHref(href, base);
    if (resolved && !seenAnchors.has(resolved)) {
      seenAnchors.add(resolved);
      anchors.push(resolved);
    }
  });

  // Open Graph
  const openGraph = {
    description: getMeta(head, ["og:description"]),
    image: resolveMetaUrl(getMeta(head, ["og:image"]), base),
    siteName: getMeta(head, ["og:site_name"]),
    title: getMeta(head, ["og:title"]),
    type: getMeta(head, ["og:type"]),
    url: resolveMetaUrl(getMeta(head, ["og:url"]), base),
  };

  // Twitter cards
  const twitter = {
    card: getMeta(head, ["twitter:card"]),
    creator: getMeta(head, ["twitter:creator"]),
    description: getMeta(head, ["twitter:description"]),
    image: resolveMetaUrl(getMeta(head, ["twitter:image"]), base),
    site: getMeta(head, ["twitter:site"]),
    title: getMeta(head, ["twitter:title"]),
  };

  // Robots
  const robots = {
    bingbot: getMeta(head, ["bingbot"]),
    googlebot: getMeta(head, ["googlebot"]),
    robots: getMeta(head, ["robots"]),
  };

  // Generator & Viewport
  const generator = getMeta(head, ["generator"]);
  const viewport = getMeta(head, ["viewport"]);

  // Theme Color
  const themeColor = {
    colorScheme: getMeta(head, ["color-scheme"]),
    themeColor: getMeta(head, ["theme-color"]),
  };

  // Verification
  const verification = {
    bing: getMeta(head, ["msvalidate.01"]),
    facebook: getMeta(head, ["facebook-domain-verification"]),
    google: getMeta(head, ["google-site-verification"]),
    pinterest: getMeta(head, ["p:domain_verify"]),
    yandex: getMeta(head, ["yandex-verification"]),
  };

  const rawHead = head.html() ?? "";

  // Return structured result

  const payload: ExtractedData = {
    anchors,
    author,
    canonicalUrl: canonical,
    charset,
    description,
    generator,
    headings,
    jsonLd,
    keywords,
    language,
    links,
    meta,
    openGraph,
    rawHead,
    robots,
    scripts,
    themeColor,
    title,
    twitter,
    url: targetUrl.href,
    verification,
    viewport,
  };

  return NextResponse.json(payload, {
    headers: {
      // Allow the client-side tool to call this from the browser
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}
