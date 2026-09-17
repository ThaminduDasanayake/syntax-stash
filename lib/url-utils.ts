/**
 * Utility functions for normalizing, comparing, and validating URLs.
 */

const TRACKING_PARAMS = new Set([
  "fbclid",
  "gclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
  "source",
  "twclid",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_name",
  "utm_source",
  "utm_term",
]);

/**
 * Normalizes a URL for consistent storage, deduplication, and lookup.
 * - Ensures valid HTTP/HTTPS protocol
 * - Lowercases hostname
 * - Removes marketing and tracking query parameters
 * - Strips trailing slashes from pathnames
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  let trimmed = rawUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const url = new URL(trimmed);

    // Protocol & Hostname lowercased
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase();

    // Strip default ports
    if (
      (url.protocol === "http:" && url.port === "80") ||
      (url.protocol === "https:" && url.port === "443")
    ) {
      url.port = "";
    }

    // Strip tracking query parameters
    const searchParams = new URLSearchParams(url.search);
    for (const key of Array.from(searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) {
        searchParams.delete(key);
      }
    }
    url.search = searchParams.toString();

    // Strip trailing slashes on paths
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    // Strip hash fragment for base lookup
    url.hash = "";

    // Convert string
    let result = url.toString();
    if (result.endsWith("/")) {
      result = result.slice(0, -1);
    }

    return result;
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Checks if two URLs represent the same destination.
 */
export function areUrlsEqual(urlA?: string | null, urlB?: string | null): boolean {
  if (!urlA || !urlB) return false;
  return normalizeUrl(urlA) === normalizeUrl(urlB);
}

/**
 * Detects if a URL or redirect location is an anti-bot interstitial/challenge endpoint
 * rather than a genuine website relocation.
 */
export function isBotChallengeUrl(rawUrl?: string | null): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const lower = rawUrl.toLowerCase();

  return (
    lower.includes(".within.website") ||
    lower.includes("__cf_chl") ||
    lower.includes("cf_chl_") ||
    lower.includes("cdn-cgi/challenge-platform") ||
    lower.includes("cdn-cgi/l/chk_jschl") ||
    lower.includes("perimeterx") ||
    lower.includes("px-captcha") ||
    lower.includes("datadome") ||
    lower.includes("arkoselabs") ||
    lower.includes("geetest") ||
    lower.includes("bot-detection") ||
    lower.includes("bot-verification") ||
    lower.includes("challenge-bypass") ||
    lower.includes("captcha-delivery") ||
    lower.includes("geo.captcha")
  );
}
