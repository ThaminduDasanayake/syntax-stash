import { resourceLinks } from "@/lib/resource-data";
import { TAGS } from "@/lib/resource-data/tags";
import { Resource } from "@/types";

export interface TagInfo {
  count: number;
  name: string;
}

/**
 * Normalizes a tag string into a clean, lowercased, kebab-cased tag.
 */
export function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

/**
 * Returns all canonical and actively used tags with their usage count across the catalog.
 * Sorted by frequency descending, then alphabetically.
 */
export function getAllTags(customResources?: Resource[]): TagInfo[] {
  const tagCounts = new Map<string, number>();

  // 1. Initialize with all canonical predefined tags from TAGS dictionary
  for (const tagValue of Object.values(TAGS)) {
    const normalized = normalizeTag(tagValue);
    if (normalized) {
      tagCounts.set(normalized, 0);
    }
  }

  // 2. Count occurrences across all live resources
  const list = customResources && customResources.length > 0 ? customResources : resourceLinks;
  for (const item of list) {
    if (!item.tags) continue;
    const tagsArray = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
        ? (item.tags as string).split(",")
        : [];

    for (const rawTag of tagsArray) {
      const normalized = normalizeTag(rawTag);
      if (!normalized) continue;
      tagCounts.set(normalized, (tagCounts.get(normalized) || 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ count, name }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
