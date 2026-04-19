import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExtractedData {
  url: string;
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    siteName: string;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve a potentially relative href against the page origin. */
function resolveHref(href: string, base: string): string | null {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

/** Collect non-empty text from all matched elements. */
function texts($: cheerio.CheerioAPI, selector: string): string[] {
  const results: string[] = [];
  $(selector).each((_, el) => {
    const text = $(el).text().trim();
    if (text) results.push(text);
  });
  return results;
}

/** Read a <meta> tag's content, matching by name or property attribute. */
function meta($: cheerio.CheerioAPI, key: string): string {
  return (
    $(`meta[name="${key}"]`).attr("content") ??
    $(`meta[property="${key}"]`).attr("content") ??
    ""
  );
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const rawUrl = searchParams.get("url")?.trim();

  // ── 1. Validate the URL parameter ────────────────────────────────────────

  if (!rawUrl) {
    return NextResponse.json(
      { error: "Missing required query parameter: url" },
      { status: 400 },
    );
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

  // ── 2. Fetch the target page ──────────────────────────────────────────────

  let html: string;
  try {
    const response = await fetch(targetUrl.href, {
      // Identify as a browser so servers don't reject the request outright
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SyntaxStash/1.0; +https://syntax-stash.dev)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      // Abort after 10 s so slow/stalled pages don't block the runtime
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

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
  } catch (e) {
    const message =
      e instanceof Error
        ? e.name === "AbortError" || e.name === "TimeoutError"
          ? "Request timed out after 10 seconds."
          : e.message
        : "Unknown fetch error.";

    return NextResponse.json({ error: `Fetch failed: ${message}` }, { status: 500 });
  }

  // ── 3. Parse with Cheerio ─────────────────────────────────────────────────

  const $ = cheerio.load(html);
  const base = targetUrl.href;

  // Title
  const title =
    $("title").first().text().trim() ||
    meta($, "og:title") ||
    "";

  // Description
  const description =
    meta($, "description") ||
    meta($, "og:description") ||
    "";

  // Open Graph
  const openGraph = {
    title:       meta($, "og:title"),
    description: meta($, "og:description"),
    image:       meta($, "og:image"),
    url:         meta($, "og:url"),
    type:        meta($, "og:type"),
    siteName:    meta($, "og:site_name"),
  };

  // Headings
  const headings = {
    h1: texts($, "h1"),
    h2: texts($, "h2"),
    h3: texts($, "h3"),
  };

  // Links — resolve to absolute and deduplicate
  const seen = new Set<string>();
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const resolved = resolveHref(href, base);
    if (resolved && !seen.has(resolved)) {
      seen.add(resolved);
      links.push(resolved);
    }
  });

  // ── 4. Return structured result ───────────────────────────────────────────

  const payload: ExtractedData = {
    url: targetUrl.href,
    title,
    description,
    openGraph,
    headings,
    links,
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      // Allow the client-side tool to call this from the browser
      "Access-Control-Allow-Origin": "*",
    },
  });
}
