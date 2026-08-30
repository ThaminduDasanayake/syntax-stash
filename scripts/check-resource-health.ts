import fs from "node:fs";
import path from "node:path";

import * as cheerio from "cheerio";

import { resourceLinks } from "../lib/resource-data";
import { Resource } from "../types";

interface AuditFinding {
  type: "broken" | "redirect" | "metadata" | "title_change" | "blocked";
  resourceTitle: string;
  category: string;
  url: string;
  details: string;
  suggestion?: string;
  statusCode?: number;
}

const TITLE_DELIMITERS = [" - ", " – ", " — ", " : ", ": ", " · ", " • ", " | "];

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTitleAndSubtitle(
  rawTitle: string,
  existingTitle: string,
): { isTitleMatch: boolean; candidateSubtitle?: string } {
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
        return normPart === normExisting || normPart.includes(normExisting) || normExisting.includes(normPart);
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
  if (resource.ignoreAudit) return [];

  const findings: AuditFinding[] = [];
  const targetUrl = resource.url;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(targetUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
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
    const htmlSnippet = await res.text().then((text) => text.slice(0, 75000));
    const $ = cheerio.load(htmlSnippet);

    const scrapedTitle =
      $('meta[property="og:title"]').attr("content")?.trim() ||
      $("title").text().trim() ||
      "";

    const scrapedOgImage =
      $('meta[property="og:image"]').attr("content")?.trim() ||
      $('meta[name="twitter:image"]').attr("content")?.trim() ||
      "";

    // Title / Subtitle Analysis
    if (scrapedTitle && !resource.customTitle) {
      const { candidateSubtitle, isTitleMatch } = parseTitleAndSubtitle(scrapedTitle, resource.title);

      if (!isTitleMatch) {
        findings.push({
          category: resource.category,
          details: `Title may have changed. Stored: "${resource.title}", Found: "${scrapedTitle}"`,
          resourceTitle: resource.title,
          suggestion: scrapedTitle,
          type: "title_change",
          url: targetUrl,
        });
      } else if (
        !resource.subtitle &&
        !resource.customSubtitle &&
        candidateSubtitle &&
        candidateSubtitle.length >= 8 &&
        candidateSubtitle.length <= 120
      ) {
        findings.push({
          category: resource.category,
          details: `Candidate subtitle discovered from site title`,
          resourceTitle: resource.title,
          suggestion: candidateSubtitle,
          type: "metadata",
          url: targetUrl,
        });
      }
    }

    // OpenGraph Image Discovery
    if (!resource.ogImage && !resource.customOgImage && scrapedOgImage) {
      try {
        const fullOgImage = new URL(scrapedOgImage, targetUrl).href;
        findings.push({
          category: resource.category,
          details: `Available ogImage discovered`,
          resourceTitle: resource.title,
          suggestion: fullOgImage,
          type: "metadata",
          url: targetUrl,
        });
      } catch {
        // invalid URL ignore
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

async function runPool<T, R>(items: T[], limit: number, iteratorFn: (item: T) => Promise<R>): Promise<R[]> {
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

function generateMarkdownReport(findings: AuditFinding[]): string {
  const broken = findings.filter((f) => f.type === "broken");
  const redirects = findings.filter((f) => f.type === "redirect");
  const metadata = findings.filter((f) => f.type === "metadata");
  const titleChanges = findings.filter((f) => f.type === "title_change");
  const blocked = findings.filter((f) => f.type === "blocked");

  const date = new Date().toISOString().split("T")[0];
  let md = `## 🔍 Syntax Stash Resource Health Check Report (${date})\n\n`;

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

  if (metadata.length > 0) {
    md += `### 💡 Discovered Metadata & Suggestions (${metadata.length})\n`;
    md += `New assets or candidate subtitles discovered from website meta tags.\n\n`;
    md += `| Resource | Category | Type | Recommendation |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of metadata) {
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${item.details} | \`${item.suggestion}\` |\n`;
    }
    md += `\n`;
  }

  if (titleChanges.length > 0) {
    md += `### 📝 Potential Rebrands / Title Changes (${titleChanges.length})\n`;
    md += `The scraped webpage title differs significantly from the stored title.\n\n`;
    md += `| Resource | Category | Details |\n`;
    md += `| :--- | :--- | :--- |\n`;
    for (const item of titleChanges) {
      md += `| **${item.resourceTitle}** | \`${item.category}\` | ${item.details} |\n`;
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
  const sampleArg = args.find((a) => a.startsWith("--sample="));
  const categoryArg = args.find((a) => a.startsWith("--category="));
  const isDryRun = args.includes("--dry-run");
  const isVerbose = args.includes("--verbose");

  let targets = [...resourceLinks];

  if (categoryArg) {
    const cat = categoryArg.split("=")[1].toLowerCase();
    targets = targets.filter((r) => r.category.toLowerCase().includes(cat));
  }

  if (sampleArg) {
    const sampleSize = parseInt(sampleArg.split("=")[1], 10);
    if (!isNaN(sampleSize)) {
      targets = targets.slice(0, sampleSize);
    }
  }

  console.log(`Starting health check on ${targets.length} resources...`);

  let completed = 0;
  const allFindings: AuditFinding[] = [];

  await runPool(targets, 15, async (resource) => {
    const findings = await checkResource(resource);
    completed++;

    if (isVerbose || findings.length > 0) {
      const statusIcon = findings.length === 0 ? "✅" : "⚠️";
      console.log(`[${completed}/${targets.length}] ${statusIcon} ${resource.title} (${resource.url})`);
      for (const f of findings) {
        console.log(`   └─ [${f.type}] ${f.details}`);
      }
    } else if (completed % 25 === 0 || completed === targets.length) {
      console.log(`Progress: ${completed}/${targets.length} checked...`);
    }

    allFindings.push(...findings);
  });

  const reportMd = generateMarkdownReport(allFindings);

  if (isDryRun) {
    console.log("\n================ HEALTH CHECK REPORT ================");
    console.log(reportMd);
    console.log("=====================================================\n");
  } else {
    const reportPath = path.join(process.cwd(), "health-report.md");
    fs.writeFileSync(reportPath, reportMd, "utf8");
    console.log(`Report written to ${reportPath}`);
  }

  // GitHub Actions output
  const actionableCount = allFindings.filter((f) => f.type !== "blocked").length;
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_findings=${actionableCount > 0}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `total_findings=${allFindings.length}\n`);
  }
}

main().catch((err) => {
  console.error("Health check failed:", err);
  process.exit(1);
});
