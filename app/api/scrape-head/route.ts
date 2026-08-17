import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetUrl } = await req.json();

    // Validate targetUrl presence
    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ error: "A valid targetUrl string is required" }, { status: 400 });
    }

    // Validate URL structure and protocol
    try {
      const parsedUrl = new URL(targetUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Only http and https protocols are supported");
      }
    } catch {
      return NextResponse.json({ error: "Invalid targetUrl provided" }, { status: 400 });
    }

    // Ensure API Key is available
    const API_KEY = process.env.SCRAPINGBEE_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Server error: Missing ScrapingBee API key configuration" },
        { status: 500 },
      );
    }

    // Build ScrapingBee API request URL
    const scrapingBeeUrl = new URL("https://app.scrapingbee.com/api/v1/");
    scrapingBeeUrl.searchParams.append("api_key", API_KEY);
    scrapingBeeUrl.searchParams.append("url", targetUrl);
    scrapingBeeUrl.searchParams.append("render_js", "true");
    scrapingBeeUrl.searchParams.append("wait", "3000");

    // Set extract_rules to fetch only the inner/outer HTML of the <head> tag
    const extractRules = {
      head: {
        output: "html",
        selector: "head",
      },
    };
    scrapingBeeUrl.searchParams.append("extract_rules", JSON.stringify(extractRules));

    // Send request to ScrapingBee
    const response = await fetch(scrapingBeeUrl.toString());

    // Parse response and handle ScrapingBee-specific errors
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.message || `ScrapingBee returned status code ${response.status}`,
        },
        { status: response.status },
      );
    }

    const headHtml = data.head ?? "";
    const $ = cheerio.load(headHtml);

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
          // Ignore JSON parse errors for malformed script tags
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

    // Extract preloaded image screenshots if present
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

    // Extract structured metadata mapping directly to your MetaRow controls
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

    return NextResponse.json({ head: headHtml, metadata });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
