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
    url: string | null;
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
        const el = doc.querySelector(sel);
        if (el) {
          const content = el.getAttribute("content")?.trim() || el.getAttribute("value")?.trim();
          if (content) return content;
        }
      }
    }
    return null;
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

  const rawOgImage = getMeta(["og:image", "og:image:secure_url", "og:image:url"]);
  const rawTwitterImage = getMeta([
    "twitter:image",
    "twitter:image:secure_url",
    "twitter:image:src",
    "twitter:image:url",
  ]);

  const preloadScreenshots = Array.from(doc.querySelectorAll('link[rel="preload"][as="image"]'))
    .map((el) => el.getAttribute("href"))
    .filter((href): href is string => Boolean(href))
    .map((href) => absoluteUrl(href, effectiveBase))
    .filter((url): url is string => Boolean(url));

  const keywords =
    getMeta(["keywords"])
      ?.split(",")
      .map((k) => k.trim())
      .filter(Boolean) ?? [];

  const localeAlternate = Array.from(
    doc.querySelectorAll(
      'meta[property="og:locale:alternate"], meta[name="og:locale:alternate"], meta[property="og:locale:alternate:locale"], meta[name="og:locale:alternate:locale"]',
    ),
  )
    .map((el) => el.getAttribute("content")?.trim() || el.getAttribute("value")?.trim())
    .filter((content): content is string => Boolean(content));

  return {
    title,
    assets: {
      appleTouchIcon: absoluteUrl(appleTouchIcon, effectiveBase),
      favicon: absoluteUrl(favicon, effectiveBase),
      faviconSvg: absoluteUrl(faviconSvg, effectiveBase),
      logo: absoluteUrl(logo, effectiveBase),
      ogImage: absoluteUrl(rawOgImage, effectiveBase),
      screenshots: preloadScreenshots,
      twitterImage: absoluteUrl(rawTwitterImage, effectiveBase),
    },
    author: getMeta(["article:author", "author", "creator"]),
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() || null,
    charset:
      doc.querySelector("meta[charset]")?.getAttribute("charset") ||
      doc.querySelector('meta[http-equiv="Content-Type"]')?.getAttribute("content") ||
      null,
    description: getMeta(["description"]),
    generator: getMeta(["generator"]),
    keywords,
    language: doc.querySelector("html")?.getAttribute("lang") || null,

    openGraph: {
      title: getMeta(["og:title"]),
      description: getMeta(["og:description"]),
      image: absoluteUrl(rawOgImage, effectiveBase),
      locale: getMeta(["og:locale"]),
      localeAlternate,
      siteName: getMeta(["og:site_name", "og:sitename"]),
      type: getMeta(["og:type"]),
      url: absoluteUrl(getMeta(["og:url"]), effectiveBase),
    },

    robots: {
      bingbot: getMeta(["bingbot"]),
      googlebot: getMeta(["googlebot"]),
      robots: getMeta(["robots"]),
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
      colorScheme: getMeta(["color-scheme"]),
      themeColor: getMeta(["theme-color"]),
    },

    twitter: {
      title: getMeta(["twitter:title"]),
      card: getMeta(["twitter:card"]),
      creator: getMeta(["twitter:creator"]),
      description: getMeta(["twitter:description"]),
      image: absoluteUrl(rawTwitterImage, effectiveBase),
      site: getMeta(["twitter:site"]),
    },

    url: effectiveBase || "Pasted HTML",

    verification: {
      bing: getMeta(["msvalidate.01"]),
      facebook: getMeta(["facebook-domain-verification"]),
      google: getMeta(["google-site-verification"]),
      pinterest: getMeta(["p:domain_verify"]),
      yandex: getMeta(["yandex-verification"]),
    },

    viewport: getMeta(["viewport"]),
  };
}
