import fs from "node:fs";
import path from "node:path";

import * as cheerio from "cheerio";

import { CATEGORIES, resourceLinks } from "@/lib/resource-data";
import { AUDIT_CONFIG } from "@/lib/resource-data/audit-config";
import { Resource } from "@/types";

interface AuditFinding {
  type: "broken" | "redirect" | "description_change" | "metadata" | "title_change" | "blocked";
  resourceTitle: string;
  category: string;
  url: string;
  details: string;
  storedValue?: string;
  suggestion?: string;
  statusCode?: number;
}

const TITLE_DELIMITERS = [" - ", " – ", " — ", " : ", ": ", " · ", " • ", " | "];

function normalizeUrlKey(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    return `${u.origin}${u.pathname.replace(/\/$/, "")}`.toLowerCase();
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/$/, "");
  }
}

const skipDescSet = new Set(AUDIT_CONFIG.skipDescriptionChanges.map(normalizeUrlKey));
const skipFaviconSet = new Set(AUDIT_CONFIG.skipFaviconChecks.map(normalizeUrlKey));
const skipOgImageSet = new Set(AUDIT_CONFIG.skipOgImageChecks.map(normalizeUrlKey));
const skipAllSet = new Set(AUDIT_CONFIG.skipAll.map(normalizeUrlKey));

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCategory(input: string): { name: string; slug: string } | null {
  const norm = input.trim().toLowerCase();

  // 1. Direct key match (e.g. "ai", "ui", "dev", "docs")
  if (norm in CATEGORIES) {
    const key = norm as keyof typeof CATEGORIES;
    return { name: CATEGORIES[key], slug: key };
  }

  // 2. Full or partial category value match (e.g. "ai & machine learning", "machine learning")
  for (const [key, val] of Object.entries(CATEGORIES)) {
    if (val.toLowerCase() === norm || val.toLowerCase().includes(norm) || norm.includes(key)) {
      return { name: val, slug: key };
    }
  }

  return null;
}

function getUniqueReportPath(dir: string, baseName: string): string {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const initialPath = path.join(dir, `${baseName}.md`);
  if (!fs.existsSync(initialPath)) {
    return initialPath;
  }

  let counter = 1;
  while (fs.existsSync(path.join(dir, `${baseName}-${counter}.md`))) {
    counter++;
  }

  return path.join(dir, `${baseName}-${counter}.md`);
}

function parseTitleAndSubtitle(
  rawTitle: string,
  existingTitle: string,
): { candidateSubtitle?: string; isTitleMatch: boolean } {
  const normRaw = normalizeText(rawTitle);
  const normExisting = normalizeText(existingTitle);

  if (normRaw === normExisting || normRaw.includes(normExisting)) {
    return { isTitleMatch: true };
  }

  for (const delimiter of TITLE_DELIMITERS) {
    if (rawTitle.includes(delimiter)) {
      const parts = rawTitle
        .split(delimiter)
        .map((p) => p.trim())
        .filter(Boolean);

      const matchIndex = parts.findIndex((part) => {
        const normPart = normalizeText(part);
        return (
          normPart === normExisting ||
          normPart.includes(normExisting) ||
          normExisting.includes(normPart)
        );
      });

      if (matchIndex !== -1) {
        const otherParts = parts.filter((_, idx) => idx !== matchIndex);
        const candidateSubtitle = otherParts.join(" — ").trim();
        return { candidateSubtitle, isTitleMatch: true };
      }
    }
  }

  return { isTitleMatch: false };
}

async function checkResource(resource: Resource): Promise<AuditFinding[]> {
  const normUrl = normalizeUrlKey(resource.url);
  if (skipAllSet.has(normUrl)) return [];

  const findings: AuditFinding[] = [];
  const targetUrl = resource.url;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(targetUrl, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      redirect: "manual",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 1. Check for Redirects (301, 308, 302)
    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (location) {
        const resolved = new URL(location, targetUrl).href;
        const cleanOld = targetUrl.replace(/\/$/, "");
        const cleanNew = resolved.replace(/\/$/, "");

        if (cleanOld !== cleanNew) {
          findings.push({
            category: resource.category,
            details: `Moved with HTTP ${res.status} to: ${resolved}`,
            resourceTitle: resource.title,
            statusCode: res.status,
            suggestion: resolved,
            type: "redirect",
            url: targetUrl,
          });
        }
      }
      return findings;
    }

    // 2. Check for Bot Blocks
    if (res.status === 403 || res.status === 429) {
      findings.push({
        category: resource.category,
        details: `Returned HTTP ${res.status} (likely anti-bot / Cloudflare protection)`,
        resourceTitle: resource.title,
        statusCode: res.status,
        type: "blocked",
        url: targetUrl,
      });
      return findings;
    }

    // 3. Check for Dead / Server Error
    if (res.status >= 400) {
      findings.push({
        category: resource.category,
        details: `Dead / Unreachable (HTTP ${res.status})`,
        resourceTitle: resource.title,
        statusCode: res.status,
        type: "broken",
        url: targetUrl,
      });
      return findings;
    }

    // 4. Parse HTML Head
    const htmlSnippet = await res.text().then((text) => text.slice(0, 85000));
    const $ = cheerio.load(htmlSnippet);

    const htmlTitle = $("title").first().text().trim().replace(/\s+/g, " ");
    const ogTitle =
      $('meta[property="og:title"], meta[name="og:title"]')
        .first()
        .attr("content")
        ?.trim()
        .replace(/\s+/g, " ") || "";

    const scrapedDescription =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      $('meta[name="twitter:description"]').attr("content")?.trim() ||
      "";

    const scrapedFavicon =
      $('link[rel="icon"]').attr("href")?.trim() ||
      $('link[rel="shortcut icon"]').attr("href")?.trim() ||
      $('link[rel="apple-touch-icon"]').attr("href")?.trim() ||
      "";

    const scrapedOgImage =
      $('meta[property="og:image"]').attr("content")?.trim() ||
      $('meta[name="twitter:image"]').attr("content")?.trim() ||
      "";

    // --- Description Analysis ---
    let cleanScrapedDesc = scrapedDescription;
    if (targetUrl.includes("github.com")) {
      cleanScrapedDesc = cleanScrapedDesc.replace(/\s*[-–—]\s*[\w.-]+\/[\w.-]+\s*$/, "").trim();
    }

    if (!resource.description && cleanScrapedDesc) {
      // Always notify if description is missing in your resource data
      findings.push({
        category: resource.category,
        details: "Missing description in resource data (found on website)",
        resourceTitle: resource.title,
        suggestion: cleanScrapedDesc,
        type: "metadata",
        url: targetUrl,
      });
    } else if (resource.description && cleanScrapedDesc && !skipDescSet.has(normUrl)) {
      // Notify if description changed, unless the URL is in skipDescriptionChanges
      const normStored = normalizeText(resource.description);
      const normScraped = normalizeText(cleanScrapedDesc);

      if (normStored !== normScraped) {
        findings.push({
          category: resource.category,
          details: "Site description updated on webpage",
          resourceTitle: resource.title,
          storedValue: resource.description,
          suggestion: cleanScrapedDesc,
          type: "description_change",
          url: targetUrl,
        });
      }
    }

    // --- Title / Subtitle Analysis ---
    if (htmlTitle && ogTitle && normalizeText(htmlTitle) === normalizeText(ogTitle)) {
      const { candidateSubtitle, isTitleMatch } = parseTitleAndSubtitle(htmlTitle, resource.title);

      if (!isTitleMatch) {
        findings.push({
          category: resource.category,
          details: `Title may have changed (title, og:title). Stored: "${resource.title}", Found: "${htmlTitle}"`,
          resourceTitle: resource.title,
          suggestion: htmlTitle,
          type: "title_change",
          url: targetUrl,
        });
      } else if (
        !resource.subtitle &&
        candidateSubtitle &&
        candidateSubtitle.length >= 8 &&
        candidateSubtitle.length <= 120
      ) {
        findings.push({
          category: resource.category,
          details: "Candidate subtitle discovered from site title",
          resourceTitle: resource.title,
          suggestion: candidateSubtitle,
          type: "metadata",
          url: targetUrl,
        });
      }
    } else {
      let candidateSubtitle: string | undefined;

      if (htmlTitle) {
        const parsedHtml = parseTitleAndSubtitle(htmlTitle, resource.title);
        if (!parsedHtml.isTitleMatch) {
          findings.push({
            category: resource.category,
            details: `Title may have changed (title). Stored: "${resource.title}", Found: "${htmlTitle}"`,
            resourceTitle: resource.title,
            suggestion: htmlTitle,
            type: "title_change",
            url: targetUrl,
          });
        } else if (parsedHtml.candidateSubtitle) {
          candidateSubtitle = parsedHtml.candidateSubtitle;
        }
      }

      if (ogTitle) {
        const parsedOg = parseTitleAndSubtitle(ogTitle, resource.title);
        if (!parsedOg.isTitleMatch) {
          findings.push({
            category: resource.category,
            details: `Title may have changed (og:title). Stored: "${resource.title}", Found: "${ogTitle}"`,
            resourceTitle: resource.title,
            suggestion: ogTitle,
            type: "title_change",
            url: targetUrl,
          });
        } else if (!candidateSubtitle && parsedOg.candidateSubtitle) {
          candidateSubtitle = parsedOg.candidateSubtitle;
        }
      }

      if (
        !resource.subtitle &&
        candidateSubtitle &&
        candidateSubtitle.length >= 8 &&
        candidateSubtitle.length <= 120
      ) {
        findings.push({
          category: resource.category,
          details: "Candidate subtitle discovered from site title",
          resourceTitle: resource.title,
          suggestion: candidateSubtitle,
          type: "metadata",
          url: targetUrl,
        });
      }
    }

    // --- Favicon Discovery ---
    if (scrapedFavicon && !skipFaviconSet.has(normUrl)) {
      try {
        const fullFavicon = new URL(scrapedFavicon, targetUrl).href;
        if (!resource.favicon) {
          findings.push({
            category: resource.category,
            details: "Available favicon discovered",
            resourceTitle: resource.title,
            suggestion: fullFavicon,
            type: "metadata",
            url: targetUrl,
          });
        }
      } catch {
        // invalid URL
      }
    }

    // --- OpenGraph Image Discovery ---
    if (scrapedOgImage && !skipOgImageSet.has(normUrl)) {
      try {
        const fullOgImage = new URL(scrapedOgImage, targetUrl).href;
        if (!resource.ogImage) {
          findings.push({
            category: resource.category,
            details: "Available ogImage discovered",
            resourceTitle: resource.title,
            suggestion: fullOgImage,
            type: "metadata",
            url: targetUrl,
          });
        }
      } catch {
        // invalid URL
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("abort") || message.includes("timeout")) {
      findings.push({
        category: resource.category,
        details: "Connection timed out after 9s",
        resourceTitle: resource.title,
        type: "blocked",
        url: targetUrl,
      });
    } else if (message.includes("ENOTFOUND") || message.includes("ECONNREFUSED")) {
      findings.push({
        category: resource.category,
        details: `DNS or Connection failed (${message})`,
        resourceTitle: resource.title,
        type: "broken",
        url: targetUrl,
      });
    } else {
      findings.push({
        category: resource.category,
        details: `Request error: ${message}`,
        resourceTitle: resource.title,
        type: "blocked",
        url: targetUrl,
      });
    }
  }

  return findings;
}

async function runPool<T, R>(
  items: T[],
  limit: number,
  iteratorFn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    results.push(p as unknown as R);

    const e: Promise<void> = p.then(() => {
      executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

function generateMarkdownReport(findings: AuditFinding[], categoryName?: string): string {
  const broken = findings.filter((f) => f.type === "broken");
  const redirects = findings.filter((f) => f.type === "redirect");
  const descriptionChanges = findings.filter((f) => f.type === "description_change");
  const metadata = findings.filter((f) => f.type === "metadata");
  const titleChanges = findings.filter((f) => f.type === "title_change");
  const blocked = findings.filter((f) => f.type === "blocked");

  const date = new Date().toISOString().split("T")[0];
  const titleCategory = categoryName ? ` — ${categoryName}` : "";
  let md = `## 🔍 Syntax Stash Resource Health Check Report${titleCategory} (${date})\n\n`;

  if (findings.length === 0) {
    md += `✅ All verified resources are active and healthy with no missing metadata detected!\n`;
    return md;
  }

  if (broken.length > 0) {
    md += `### 🚨 Dead or Broken URLs (${broken.length})\n`;
    md += `Action required: The following resources returned 404 or failed DNS lookup.\n\n`;
    md += `| Resource | Category | Current URL | Error |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of broken) {
      md += `| **${item.resourceTitle}** | \`${item.category}\` | [Link](${item.url}) | ${item.details} |\n`;
    }
    md += `\n`;
  }

  if (redirects.length > 0) {
    md += `### 🔄 Moved URLs / Redirects (${redirects.length})\n`;
    md += `The following resources returned permanent 301/308 redirects with a new target location.\n\n`;
    md += `| Resource | Category | Old URL | Suggested New URL |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of redirects) {
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${item.url} | \`${item.suggestion}\` |\n`;
    }
    md += `\n`;
  }

  if (descriptionChanges.length > 0) {
    md += `### 📝 Description Changes (${descriptionChanges.length})\n`;
    md += `The website description has been updated. If you prefer your stored description, add the URL to \`skipDescriptionChanges\` in \`lib/resource-data/audit-config.ts\`.\n\n`;
    md += `| Resource | Category | Stored Description | Webpage Description |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of descriptionChanges) {
      const stored = item.storedValue?.replace(/\|/g, "-") || "";
      const suggested = item.suggestion?.replace(/\|/g, "-") || "";
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${stored} | ${suggested} |\n`;
    }
    md += `\n`;
  }

  if (metadata.length > 0) {
    md += `### 💡 Discovered Metadata & Missing Assets (${metadata.length})\n`;
    md += `New assets or candidate subtitles discovered from website meta tags.\n\n`;
    md += `| Resource | Category | Type | Recommendation |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of metadata) {
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${item.details} | \`${item.suggestion}\` |\n`;
    }
    md += `\n`;
  }

  if (titleChanges.length > 0) {
    md += `### 🏷️ Potential Rebrands / Title Changes (${titleChanges.length})\n`;
    md += `The scraped webpage title differs significantly from the stored title.\n\n`;
    md += `| Resource | Category | Details |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const item of titleChanges) {
      const details = item.details.replace(/\|/g, "-");
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${details} |\n`;
    }
    md += `\n`;
  }

  if (blocked.length > 0) {
    md += `### ⚠️ Unverifiable / Protected Sites (${blocked.length})\n`;
    md += `These sites returned 403, 429, or timed out (likely Cloudflare / bot protection). Check manually in a browser.\n\n`;
    md += `| Resource | URL | Details |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const item of blocked) {
      md += `| **${item.resourceTitle}** | [Link](${item.url}) | ${item.details} |\n`;
    }
    md += `\n`;
  }

  return md;
}

async function main() {
  const args = process.argv.slice(2);

  // 1. Sample argument parsing
  const sampleArgIdx = args.findIndex(
    (a) => a === "--sample" || a === "-s" || a.startsWith("--sample="),
  );
  let sampleSize: number | undefined;
  if (sampleArgIdx !== -1) {
    const val = args[sampleArgIdx].includes("=")
      ? args[sampleArgIdx].split("=")[1]
      : args[sampleArgIdx + 1];
    sampleSize = parseInt(val, 10);
  } else if (process.env.SAMPLE) {
    sampleSize = parseInt(process.env.SAMPLE, 10);
  }

  // 2. Category argument parsing
  const catArgIdx = args.findIndex(
    (a) => a === "-c" || a === "--category" || a.startsWith("--category=") || a.startsWith("-c="),
  );
  let categoryInput: string | undefined;

  if (catArgIdx !== -1) {
    categoryInput = args[catArgIdx].includes("=")
      ? args[catArgIdx].split("=")[1]
      : args[catArgIdx + 1];
  } else if (process.env.CATEGORY) {
    categoryInput = process.env.CATEGORY;
  } else {
    // Check for positional argument (e.g. `npm run check:resources -- ai`)
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a.startsWith("-")) continue;
      const prev = args[i - 1];
      if (prev === "--sample" || prev === "-s" || prev === "--category" || prev === "-c") continue;
      const resolved = resolveCategory(a);
      if (resolved) {
        categoryInput = a;
        break;
      }
    }
  }

  const isDryRun = args.includes("--dry-run");
  const isVerbose = args.includes("--verbose");

  let targets = [...resourceLinks];
  let resolvedCategory: { name: string; slug: string } | null = null;

  if (categoryInput) {
    resolvedCategory = resolveCategory(categoryInput);
    if (!resolvedCategory) {
      const validCategories = Object.keys(CATEGORIES).join(", ");
      console.error(
        `❌ Unknown category: "${categoryInput}".\nAvailable categories: ${validCategories}`,
      );
      process.exit(1);
    }

    targets = targets.filter(
      (r) =>
        r.category === resolvedCategory?.name ||
        r.category.toLowerCase().includes(resolvedCategory!.slug),
    );
    console.log(`Filtering by category: ${resolvedCategory.name} (${targets.length} resources)`);
  }

  if (sampleSize && !isNaN(sampleSize)) {
    targets = targets.slice(0, sampleSize);
  }

  console.log(`Starting health check on ${targets.length} resources...`);

  let completed = 0;
  const allFindings: AuditFinding[] = [];

  await runPool(targets, 15, async (resource) => {
    const findings = await checkResource(resource);
    completed++;

    if (isVerbose || findings.length > 0) {
      const statusIcon = findings.length === 0 ? "✅" : "⚠️";
      console.log(
        `[${completed}/${targets.length}] ${statusIcon} ${resource.title} (${resource.url})`,
      );
      for (const f of findings) {
        console.log(`   └─ [${f.type}] ${f.details}`);
      }
    } else if (completed % 25 === 0 || completed === targets.length) {
      console.log(`Progress: ${completed}/${targets.length} checked...`);
    }

    allFindings.push(...findings);
  });

  const reportMd = generateMarkdownReport(allFindings, resolvedCategory?.name);

  if (isDryRun) {
    console.log("\n================ HEALTH CHECK REPORT ================");
    console.log(reportMd);
    console.log("=====================================================\n");
  } else {
    const reportsDir = path.join(process.cwd(), "health-reports");
    const baseName = resolvedCategory ? `health-report-${resolvedCategory.slug}` : "health-report";
    const reportPath = getUniqueReportPath(reportsDir, baseName);

    fs.writeFileSync(reportPath, reportMd, "utf8");
    console.log(`\nReport written to ${path.relative(process.cwd(), reportPath)}`);

    // GitHub Actions output
    const actionableCount = allFindings.filter((f) => f.type !== "blocked").length;
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_findings=${actionableCount > 0}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_findings=${allFindings.length}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `report_path=${reportPath}\n`);
    }
  }
}

main().catch((err) => {
  console.error("Health check failed:", err);
  process.exit(1);
});
