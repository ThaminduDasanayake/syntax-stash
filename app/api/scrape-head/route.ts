import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

const BROWSER_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
};

async function fetchDirect(targetUrl: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Direct fetch returned status code ${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml") &&
      !contentType.includes("text/plain")
    ) {
      throw new Error(`Expected HTML content but received ${contentType}`);
    }

    return await res.text();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function fetchScrapingBee(targetUrl: string, apiKey: string): Promise<string> {
  const scrapingBeeUrl = new URL("https://app.scrapingbee.com/api/v1/");
  scrapingBeeUrl.searchParams.append("api_key", apiKey);
  scrapingBeeUrl.searchParams.append("url", targetUrl);
  scrapingBeeUrl.searchParams.append("render_js", "true");
  scrapingBeeUrl.searchParams.append("wait", "3000");

  const extractRules = {
    head: {
      output: "html",
      selector: "head",
    },
  };
  scrapingBeeUrl.searchParams.append("extract_rules", JSON.stringify(extractRules));

  const response = await fetch(scrapingBeeUrl.toString());
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `ScrapingBee returned status code ${response.status}`);
  }

  return data.head ?? "";
}

export async function POST(req: NextRequest) {
  try {
    const { targetUrl } = await req.json();

    // Validate targetUrl presence
    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ error: "A valid targetUrl string is required" }, { status: 400 });
    }

    // Validate URL structure, protocol, and private destination
    try {
      const parsedUrl = new URL(targetUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only http and https protocols are supported");
      }
      const host = parsedUrl.hostname.toLowerCase().trim();
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "0.0.0.0" ||
        host === "::1" ||
        host.endsWith(".local") ||
        host.endsWith(".internal") ||
        /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(host)
      ) {
        return NextResponse.json(
          { error: "Requests to local or private network destinations are not allowed" },
          { status: 400 },
        );
      }
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Invalid targetUrl provided" },
        { status: 400 },
      );
    }

    let rawHtml = "";
    let extractionSource: "direct" | "scrapingbee" = "direct";
    let directError: Error | null = null;

    // 1. Try Direct Fetch first (Free, 0 credits, ~300ms)
    try {
      rawHtml = await fetchDirect(targetUrl);
    } catch (err) {
      directError = err instanceof Error ? err : new Error(String(err));
    }

    // 2. If Direct Fetch failed, try ScrapingBee fallback if API key is configured
    if (!rawHtml) {
      const apiKey = process.env.SCRAPINGBEE_API_KEY;
      if (apiKey) {
        try {
          rawHtml = await fetchScrapingBee(targetUrl, apiKey);
          extractionSource = "scrapingbee";
        } catch (sbErr) {
          const sbMessage = sbErr instanceof Error ? sbErr.message : "ScrapingBee error";
          return NextResponse.json(
            {
              error: `Direct fetch failed (${directError?.message ?? "unknown"}) and ScrapingBee fallback failed (${sbMessage}). You can paste the raw <head> HTML in the 'Paste HTML' tab instead.`,
            },
            { status: 502 },
          );
        }
      } else {
        return NextResponse.json(
          {
            error: `Failed to fetch URL directly: ${directError?.message ?? "Network error"}. You can paste the raw <head> HTML in the 'Paste HTML' tab to extract metadata offline.`,
          },
          { status: 502 },
        );
      }
    }

    const $ = cheerio.load(rawHtml);

    function absoluteUrl(value: string | null | undefined, base: string) {
      if (!value) return null;
      try {
        return new URL(value, base).href;
      } catch {
        return null;
      }
    }

    function getMeta(names: string[]): string | null {
      for (const name of names) {
        const lower = name.toLowerCase();
        const selectors = [
          `meta[itemprop="${lower}"]`,
          `meta[itemprop="${name}"]`,
          `meta[name="${lower}"]`,
          `meta[name="${name}"]`,
          `meta[property="${lower}"]`,
          `meta[property="${name}"]`,
        ];
        for (const sel of selectors) {
          const el = $(sel).first();
          if (el.length > 0) {
            const content = el.attr("content")?.trim() || el.attr("value")?.trim();
            if (content) return content;
          }
        }
      }
      return null;
    }

    const baseUrl = targetUrl;

    const icons = {
      appleTouchIcon: $('link[rel="apple-touch-icon"]').first().attr("href") || null,
      favicon:
        $('link[rel="icon"][type="image/png"]').first().attr("href") ||
        $('link[rel="icon"]').first().attr("href") ||
        null,
      faviconSvg: $('link[rel="icon"][type="image/svg+xml"]').first().attr("href") || null,
    };

    function extractJsonLdLogo($: cheerio.CheerioAPI): string | null {
      let logo: string | null = null;

      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).text());
          const items = Array.isArray(json)
            ? json
            : json["@graph"] && Array.isArray(json["@graph"])
              ? json["@graph"]
              : [json];

          for (const item of items) {
            if (item.logo) {
              if (typeof item.logo === "string") {
                logo = item.logo;
              } else if (typeof item.logo === "object" && item.logo?.url) {
                logo = item.logo.url;
              }
            }
          }
        } catch {
          // Ignore JSON parse errors
        }
      });

      return logo;
    }

    const jsonLdLogo = extractJsonLdLogo($);

    const rawOgImage = getMeta(["og:image", "og:image:secure_url", "og:image:url"]);
    const rawTwitterImage = getMeta([
      "twitter:image",
      "twitter:image:secure_url",
      "twitter:image:src",
      "twitter:image:url",
    ]);

    const screenshots = $('link[rel="preload"][as="image"]')
      .map((_, el) => $(el).attr("href"))
      .get()
      .map((href) => absoluteUrl(href, baseUrl))
      .filter((url): url is string => Boolean(url));

    const localeAlternate = $(
      'meta[property="og:locale:alternate"], meta[name="og:locale:alternate"], meta[property="og:locale:alternate:locale"], meta[name="og:locale:alternate:locale"]',
    )
      .map((_, el) => $(el).attr("content")?.trim() || $(el).attr("value")?.trim())
      .get()
      .filter((content): content is string => Boolean(content));

    const headInner = $("head").html();
    const headHtml = headInner ? `<head>${headInner}</head>` : rawHtml.slice(0, 30000);

    const metadata = {
      title: $("title").first().text().trim() || null,
      assets: {
        appleTouchIcon: absoluteUrl(icons.appleTouchIcon, baseUrl),
        favicon: absoluteUrl(icons.favicon, baseUrl),
        faviconSvg: absoluteUrl(icons.faviconSvg, baseUrl),
        logo: absoluteUrl(jsonLdLogo, baseUrl),
        ogImage: absoluteUrl(rawOgImage, baseUrl),
        screenshots,
        twitterImage: absoluteUrl(rawTwitterImage, baseUrl),
      },
      author: getMeta(["article:author", "author", "creator"]),
      canonicalUrl: $('link[rel="canonical"]').attr("href")?.trim() || null,
      charset: $("meta[charset]").attr("charset") || null,
      description: getMeta(["description"]),
      generator: getMeta(["generator"]),
      keywords:
        getMeta(["keywords"])
          ?.split(",")
          .map((k) => k.trim())
          .filter(Boolean) ?? [],
      language: $("html").attr("lang") || null,

      openGraph: {
        title: getMeta(["og:title"]),
        description: getMeta(["og:description"]),
        image: absoluteUrl(rawOgImage, baseUrl),
        locale: getMeta(["og:locale"]),
        localeAlternate,
        siteName: getMeta(["og:site_name", "og:sitename"]),
        type: getMeta(["og:type"]),
        url: absoluteUrl(getMeta(["og:url"]), baseUrl),
      },
      robots: {
        bingbot: getMeta(["bingbot"]),
        googlebot: getMeta(["googlebot"]),
        robots: getMeta(["robots"]),
      },

      securityHeaders: {
        contentSecurityPolicy:
          $('meta[http-equiv="Content-Security-Policy"]').attr("content")?.trim() || null,
        refresh: $('meta[http-equiv="refresh"]').attr("content")?.trim() || null,
        xUaCompatible: $('meta[http-equiv="X-UA-Compatible"]').attr("content")?.trim() || null,
      },

      themeColor: {
        colorScheme: getMeta(["color-scheme"]),
        themeColor: getMeta(["theme-color"]),
      },

      twitter: {
        title: getMeta(["twitter:title"]),
        card: getMeta(["twitter:card"]),
        creator: getMeta(["twitter:creator"]),
        description: getMeta(["twitter:description"]),
        image: absoluteUrl(rawTwitterImage, baseUrl),
        site: getMeta(["twitter:site"]),
      },

      url: targetUrl,

      verification: {
        bing: getMeta(["msvalidate.01"]),
        facebook: getMeta(["facebook-domain-verification"]),
        google: getMeta(["google-site-verification"]),
        pinterest: getMeta(["p:domain_verify"]),
        yandex: getMeta(["yandex-verification"]),
      },

      viewport: getMeta(["viewport"]),
    };

    return NextResponse.json({
      head: headHtml,
      metadata,
      source: extractionSource,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
