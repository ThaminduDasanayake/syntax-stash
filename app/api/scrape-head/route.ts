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

    const rawOgImage = $('meta[property="og:image"]').attr("content")?.trim() || null;
    const rawTwitterImage =
      $('meta[property="twitter:image"]').attr("content")?.trim() ||
      $('meta[name="twitter:image"]').attr("content")?.trim() ||
      null;

    // Extract preloaded image screenshots if present
    const screenshots = $('link[rel="preload"][as="image"]')
      .map((_, el) => $(el).attr("href"))
      .get()
      .map((href) => absoluteUrl(href, baseUrl))
      .filter((url): url is string => Boolean(url));

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
      author: $('meta[name="author"]').attr("content")?.trim() || null,
      canonicalUrl: $('link[rel="canonical"]').attr("href")?.trim() || null,
      charset: $("meta[charset]").attr("charset") || null,
      description: $('meta[name="description"]').attr("content")?.trim() || null,
      generator: $('meta[name="generator"]').attr("content")?.trim() || null,
      keywords:
        $('meta[name="keywords"]')
          .attr("content")
          ?.split(",")
          .map((k) => k.trim())
          .filter(Boolean) ?? [],
      language: $("html").attr("lang") || null,

      openGraph: {
        title: $('meta[property="og:title"]').attr("content")?.trim() || null,
        description: $('meta[property="og:description"]').attr("content")?.trim() || null,
        image: $('meta[property="og:image"]').attr("content")?.trim() || null,
        locale: $('meta[property="og:locale"]').attr("content")?.trim() || null,
        localeAlternate: $('meta[property="og:locale:alternate"]')
          .map((_, el) => $(el).attr("content")?.trim())
          .get(),
        siteName: $('meta[property="og:site_name"]').attr("content")?.trim() || null,
        type: $('meta[property="og:type"]').attr("content")?.trim() || null,
      },
      robots: {
        bingbot: $('meta[name="bingbot"]').attr("content")?.trim() || null,
        googlebot: $('meta[name="googlebot"]').attr("content")?.trim() || null,
        robots: $('meta[name="robots"]').attr("content")?.trim() || null,
      },

      securityHeaders: {
        contentSecurityPolicy:
          $('meta[http-equiv="Content-Security-Policy"]').attr("content")?.trim() || null,
        refresh: $('meta[http-equiv="refresh"]').attr("content")?.trim() || null,
        xUaCompatible: $('meta[http-equiv="X-UA-Compatible"]').attr("content")?.trim() || null,
      },

      themeColor: {
        colorScheme: $('meta[name="color-scheme"]').attr("content")?.trim() || null,
        themeColor: $('meta[name="theme-color"]').attr("content")?.trim() || null,
      },

      twitter: {
        title:
          $('meta[property="twitter:title"]').attr("content")?.trim() ||
          $('meta[name="twitter:title"]').attr("content")?.trim() ||
          null,
        card: $('meta[name="twitter:card"]').attr("content")?.trim() || null,
        creator:
          $('meta[property="twitter:creator"]').attr("content")?.trim() ||
          $('meta[name="twitter:creator"]').attr("content")?.trim() ||
          null,
        description:
          $('meta[property="twitter:description"]').attr("content")?.trim() ||
          $('meta[name="twitter:description"]').attr("content")?.trim() ||
          null,
        image:
          $('meta[property="twitter:image"]').attr("content")?.trim() ||
          $('meta[name="twitter:image"]').attr("content")?.trim() ||
          null,
        site: $('meta[property="twitter:site"]').attr("content")?.trim() || null,
      },

      url: targetUrl,

      verification: {
        bing: $('meta[name="msvalidate.01"]').attr("content")?.trim() || null,
        facebook: $('meta[name="facebook-domain-verification"]').attr("content")?.trim() || null,
        google: $('meta[name="google-site-verification"]').attr("content")?.trim() || null,
        pinterest: $('meta[name="p:domain_verify"]').attr("content")?.trim() || null,
        yandex: $('meta[name="yandex-verification"]').attr("content")?.trim() || null,
      },

      viewport: $('meta[name="viewport"]').attr("content")?.trim() || null,
    };

    return NextResponse.json({ head: headHtml, metadata });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
