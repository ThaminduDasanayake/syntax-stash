import fs from "node:fs";
import path from "node:path";

import { parseGitHubRepo } from "@/lib/github";
import { resourceLinks } from "@/lib/resource-data";

interface RepoEntry {
  owner: string;
  repo: string;
  fullName: string;
  url: string;
}

const STARS_FILE_PATH = path.join(process.cwd(), "lib/resource-data/github-stars.json");

async function fetchRepoStars(
  entry: RepoEntry,
  token?: string,
): Promise<{ fullName: string; stars: number | null; error?: string }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "syntax-stash-stars-sync",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${entry.owner}/${entry.repo}`, {
      headers,
    });

    if (res.status === 404) {
      return { error: "Repo not found (404)", fullName: entry.fullName, stars: null };
    }

    if (res.status === 403) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      if (remaining === "0") {
        return {
          error: "GitHub API rate limit exceeded (403)",
          fullName: entry.fullName,
          stars: null,
        };
      }
      return { error: `Forbidden (HTTP 403)`, fullName: entry.fullName, stars: null };
    }

    if (!res.ok) {
      return { error: `HTTP ${res.status}`, fullName: entry.fullName, stars: null };
    }

    const data = (await res.json()) as { stargazers_count?: number };
    if (typeof data.stargazers_count === "number") {
      return { fullName: entry.fullName, stars: data.stargazers_count };
    }

    return { error: "Missing stargazers_count field", fullName: entry.fullName, stars: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : String(err),
      fullName: entry.fullName,
      stars: null,
    };
  }
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

async function main() {
  console.log("🌟 Scanning resourceLinks for GitHub repositories...");

  const repoMap = new Map<string, RepoEntry>();

  for (const res of resourceLinks) {
    if (!res.gitHubLink) continue;
    const parsed = parseGitHubRepo(res.gitHubLink);
    if (parsed && !repoMap.has(parsed.fullName)) {
      repoMap.set(parsed.fullName, {
        ...parsed,
        url: res.gitHubLink,
      });
    }
  }

  const entries = Array.from(repoMap.values());
  console.log(`Found ${entries.length} unique repositories to check.`);

  // Load existing star counts if any to preserve historical data on transient errors
  let existingData: Record<string, number> = {};
  if (fs.existsSync(STARS_FILE_PATH)) {
    try {
      existingData = JSON.parse(fs.readFileSync(STARS_FILE_PATH, "utf8"));
    } catch {
      existingData = {};
    }
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) {
    console.log("🔑 Authenticated using GITHUB_TOKEN.");
  } else {
    console.log("⚠️ No GITHUB_TOKEN detected; running unauthenticated (rate limit: 60 req/hr).");
  }

  const updatedData: Record<string, number> = { ...existingData };
  let successCount = 0;
  let failedCount = 0;

  // Run with concurrency limit of 5 to avoid triggering GitHub secondary rate limits
  await runPool(entries, 5, async (entry) => {
    const result = await fetchRepoStars(entry, token);
    if (result.stars !== null) {
      updatedData[result.fullName] = result.stars;
      successCount++;
      console.log(`  ✅ ${result.fullName}: ${result.stars.toLocaleString()} stars`);
    } else {
      failedCount++;
      console.log(`  ❌ ${result.fullName}: ${result.error || "Unknown error"}`);
    }
    return result;
  });

  // Sort keys alphabetically for deterministic git diffs
  const sortedData: Record<string, number> = {};
  for (const key of Object.keys(updatedData).sort()) {
    sortedData[key] = updatedData[key];
  }

  fs.writeFileSync(STARS_FILE_PATH, JSON.stringify(sortedData, null, 2) + "\n", "utf8");

  console.log("\n📊 Sync Summary:");
  console.log(`  Total tracked repositories: ${Object.keys(sortedData).length}`);
  console.log(`  Successfully updated: ${successCount}`);
  if (failedCount > 0) {
    console.log(`  Failed / Skipped: ${failedCount}`);
  }
  console.log(`  File saved to: ${path.relative(process.cwd(), STARS_FILE_PATH)}`);
}

main().catch((err) => {
  console.error("Failed to sync GitHub stars:", err);
  process.exit(1);
});
