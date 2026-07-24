export interface ExtractedMetadata {
  url: string;
  title: string | null;
  description: string | null;
  author: string | null;
  keywords: string[];
  canonicalUrl: string | null;
  charset: string | null;
  language: string | null;
  viewport: string | null;
  generator: string | null;
  assets: {
    appleTouchIcon: string | null;
    favicon: string | null;
    faviconSvg: string | null;
    logo: string | null;
    ogImage: string | null;
    twitterImage: string | null;
    screenshots: string[];
  };
  robots: {
    robots: string | null;
    googlebot: string | null;
    bingbot: string | null;
  };
  themeColor: {
    themeColor: string | null;
    colorScheme: string | null;
  };
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    type: string | null;
    siteName: string | null;
    locale: string | null;
    localeAlternate: string[];
  };
  twitter: {
    title: string | null;
    description: string | null;
    card: string | null;
    image: string | null;
    site: string | null;
    creator: string | null;
  };
  verification: {
    google: string | null;
    bing: string | null;
    pinterest: string | null;
    yandex: string | null;
    facebook: string | null;
  };
  securityHeaders: {
    contentSecurityPolicy: string | null;
    refresh: string | null;
    xUaCompatible: string | null;
  };
}

export function parseHeadHtml(rawHtml: string, baseUrl?: string): ExtractedMetadata {
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    rawHtml.toLowerCase().includes("<head") ? rawHtml : `<head>${rawHtml}</head>`,
    "text/html",
  );

  function absoluteUrl(value: string | null | undefined, base?: string): string | null {
    if (!value) return null;
    if (!base) return value;
    try {
      return new URL(value, base).href;
    } catch {
      return value;
    }
  }

  const effectiveBase = baseUrl?.trim() ? baseUrl.trim() : undefined;

  const titleEl = doc.querySelector("title");
  const title = titleEl ? titleEl.textContent?.trim() || null : null;

  const appleTouchIcon =
    doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") || null;
  const favicon =
    doc.querySelector('link[rel="icon"][type="image/png"]')?.getAttribute("href") ||
    doc.querySelector('link[rel="icon"]')?.getAttribute("href") ||
    null;
  const faviconSvg =
    doc.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute("href") || null;

  let logo: string | null = null;
  const scriptLdJsons = doc.querySelectorAll('script[type="application/ld+json"]');
  scriptLdJsons.forEach((script) => {
    try {
      const json = JSON.parse(script.textContent || "");
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
      // Ignore invalid JSON
    }
  });

  const rawOgImage =
    doc.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim() || null;
  const rawTwitterImage =
    doc.querySelector('meta[property="twitter:image"]')?.getAttribute("content")?.trim() ||
    doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content")?.trim() ||
    null;

  const preloadScreenshots = Array.from(doc.querySelectorAll('link[rel="preload"][as="image"]'))
    .map((el) => el.getAttribute("href"))
    .filter((href): href is string => Boolean(href))
    .map((href) => absoluteUrl(href, effectiveBase))
    .filter((url): url is string => Boolean(url));

  const keywords =
    doc
      .querySelector('meta[name="keywords"]')
      ?.getAttribute("content")
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean) ?? [];

  const localeAlternate = Array.from(doc.querySelectorAll('meta[property="og:locale:alternate"]'))
    .map((el) => el.getAttribute("content")?.trim())
    .filter((content): content is string => Boolean(content));

  return {
    url: effectiveBase || "Pasted HTML",
    title,
    author: doc.querySelector('meta[name="author"]')?.getAttribute("content")?.trim() || null,
    keywords,
    canonicalUrl:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || null,
    charset:
      doc.querySelector("meta[charset]")?.getAttribute("charset") ||
      doc.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute("content") ||
      null,
    description:
      doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || null,
    generator:
      doc.querySelector('meta[name="generator"]')?.getAttribute("content")?.trim() || null,
    language: doc.querySelector("html")?.getAttribute("lang") || null,

    assets: {
      appleTouchIcon: absoluteUrl(appleTouchIcon, effectiveBase),
      favicon: absoluteUrl(favicon, effectiveBase),
      faviconSvg: absoluteUrl(faviconSvg, effectiveBase),
      logo: absoluteUrl(logo, effectiveBase),
      ogImage: absoluteUrl(rawOgImage, effectiveBase),
      screenshots: preloadScreenshots,
      twitterImage: absoluteUrl(rawTwitterImage, effectiveBase),
    },

    openGraph: {
      description:
        doc.querySelector('meta[property="og:description"]')?.getAttribute("content")?.trim() ||
        null,
      image:
        doc.querySelector('meta[property="og:image"]')?.getAttribute("content")?.trim() || null,
      locale:
        doc.querySelector('meta[property="og:locale"]')?.getAttribute("content")?.trim() || null,
      localeAlternate,
      siteName:
        doc.querySelector('meta[property="og:site_name"]')?.getAttribute("content")?.trim() ||
        null,
      title: doc.querySelector('meta[property="og:title"]')?.getAttribute("content")?.trim() || null,
      type: doc.querySelector('meta[property="og:type"]')?.getAttribute("content")?.trim() || null,
    },

    robots: {
      bingbot: doc.querySelector('meta[name="bingbot"]')?.getAttribute("content")?.trim() || null,
      googlebot:
        doc.querySelector('meta[name="googlebot"]')?.getAttribute("content")?.trim() || null,
      robots: doc.querySelector('meta[name="robots"]')?.getAttribute("content")?.trim() || null,
    },

    securityHeaders: {
      contentSecurityPolicy:
        doc
          .querySelector('meta[http-equiv="Content-Security-Policy"]')
          ?.getAttribute("content")
          ?.trim() || null,
      refresh:
        doc.querySelector('meta[http-equiv="refresh"]')?.getAttribute("content")?.trim() || null,
      xUaCompatible:
        doc.querySelector('meta[http-equiv="X-UA-Compatible"]')?.getAttribute("content")?.trim() ||
        null,
    },

    themeColor: {
      colorScheme:
        doc.querySelector('meta[name="color-scheme"]')?.getAttribute("content")?.trim() || null,
      themeColor:
        doc.querySelector('meta[name="theme-color"]')?.getAttribute("content")?.trim() || null,
    },

    twitter: {
      card: doc.querySelector('meta[name="twitter:card"]')?.getAttribute("content")?.trim() || null,
      creator:
        doc.querySelector('meta[property="twitter:creator"]')?.getAttribute("content")?.trim() ||
        doc.querySelector('meta[name="twitter:creator"]')?.getAttribute("content")?.trim() ||
        null,
      description:
        doc.querySelector('meta[property="twitter:description"]')?.getAttribute("content")?.trim() ||
        doc.querySelector('meta[name="twitter:description"]')?.getAttribute("content")?.trim() ||
        null,
      image:
        doc.querySelector('meta[property="twitter:image"]')?.getAttribute("content")?.trim() ||
        doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content")?.trim() ||
        null,
      site:
        doc.querySelector('meta[property="twitter:site"]')?.getAttribute("content")?.trim() ||
        doc.querySelector('meta[name="twitter:site"]')?.getAttribute("content")?.trim() ||
        null,
      title:
        doc.querySelector('meta[property="twitter:title"]')?.getAttribute("content")?.trim() ||
        doc.querySelector('meta[name="twitter:title"]')?.getAttribute("content")?.trim() ||
        null,
    },

    verification: {
      bing: doc.querySelector('meta[name="msvalidate.01"]')?.getAttribute("content")?.trim() || null,
      facebook:
        doc.querySelector('meta[name="facebook-domain-verification"]')?.getAttribute("content")?.trim() ||
        null,
      google:
        doc.querySelector('meta[name="google-site-verification"]')?.getAttribute("content")?.trim() ||
        null,
      pinterest:
        doc.querySelector('meta[name="p:domain_verify"]')?.getAttribute("content")?.trim() || null,
      yandex:
        doc.querySelector('meta[name="yandex-verification"]')?.getAttribute("content")?.trim() ||
        null,
    },

    viewport:
      doc.querySelector('meta[name="viewport"]')?.getAttribute("content")?.trim() || null,
  };
}
