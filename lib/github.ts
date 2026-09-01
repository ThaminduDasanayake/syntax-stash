import githubStarsData from "@/lib/resource-data/github-stars.json";

const githubStars: Record<string, number> = githubStarsData;

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  fullName: string;
}

/**
 * Extracts owner, repo, and normalized fullName from a GitHub URL.
 * Safely handles trailing slashes, query parameters, and non-repo URLs (like orgs).
 */
export function parseGitHubRepo(url?: string): GitHubRepoInfo | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return null;

    const segments = parsed.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);

    // Only valid repos with at least owner and repo name
    if (segments.length >= 2) {
      const owner = segments[0];
      const repo = segments[1].replace(/\.git$/, "");
      return {
        fullName: `${owner}/${repo}`.toLowerCase(),
        owner,
        repo,
      };
    }
  } catch {
    // Invalid URL format
  }

  return null;
}

/**
 * Formats star counts nicely into compact display strings.
 * e.g., 14,250 -> 14.3k, 115,000 -> 115k, 950 -> 950
 */
export function formatStarCount(stars: number): string {
  if (stars >= 1_000_000) {
    return `${(stars / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (stars >= 1_000) {
    return `${(stars / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return stars.toLocaleString();
}

/**
 * Looks up the precomputed GitHub star count for a resource's GitHub URL.
 */
export function getGitHubStars(url?: string): number | null {
  const info = parseGitHubRepo(url);
  if (!info) return null;
  const count = githubStars[info.fullName];
  return typeof count === "number" ? count : null;
}
