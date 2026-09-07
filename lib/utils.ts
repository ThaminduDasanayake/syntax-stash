import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { CATEGORIES as TOOL_CATEGORIES } from "@/lib/tools-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes and converts an author name into a clean, URL-friendly slug.
 * Handles diacritics / accents (e.g. "falk schröter" -> "falk-schroter").
 */
export function slugifyAuthor(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes a tag string into a clean, lowercased, kebab-cased tag.
 */
export function normalizeTag(rawTag: string): string {
  return rawTag
    .toLowerCase()
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

export function getResourceId(
  target: { title?: string; slug?: string; url?: string } | string,
): string {
  if (typeof target === "string") return target;
  if (target.slug) return target.slug;
  if (target.url) return target.url;
  if (target.title) return slugify(target.title);
  return "";
}

export function downloadStringAsFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export type Theme = "orange" | "blue" | "pink" | "green";

export const THEMES: readonly Theme[] = ["orange", "blue", "pink", "green"] as const;

export const THEME_CONFIG: Record<
  Theme,
  {
    bg: string;
    border: string;
    chip: string;
    dot: string;
    dotActive: string;
    dotInactive: string;
    label: string;
    pillActive: string;
    soft: string;
  }
> = {
  orange: {
    bg: "bg-c-orange text-ink",
    border: "border-orange-deep",
    chip: "hover:bg-c-orange hover:text-ink",
    dot: "bg-c-orange border-orange-deep group-hover:bg-ink group-hover:border-ink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-orange border-ink",
    label: "text-orange-deep hover:text-orange-deep",
    pillActive: "bg-c-orange text-ink hover:bg-c-orange",
    soft: "bg-orange-tint hover:bg-orange-tint",
  },
  blue: {
    bg: "bg-c-blue text-paper",
    border: "border-blue-deep",
    chip: "hover:bg-c-blue hover:text-paper",
    dot: "bg-c-blue border-blue-deep group-hover:bg-paper group-hover:border-paper",
    dotActive: "bg-paper border-paper",
    dotInactive: "bg-c-blue border-ink",
    label: "text-blue-deep hover:text-blue-deep",
    pillActive: "bg-c-blue text-paper hover:bg-c-blue hover:text-paper",
    soft: "bg-blue-tint hover:bg-blue-tint",
  },
  pink: {
    bg: "bg-c-pink text-ink",
    border: "border-pink-deep",
    chip: "hover:bg-c-pink hover:text-ink",
    dot: "bg-c-pink border-pink-deep group-hover:bg-ink group-hover:border-ink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-pink border-ink",
    label: "text-pink-deep hover:text-pink-deep",
    pillActive: "bg-c-pink text-ink hover:bg-c-pink",
    soft: "bg-pink-tint hover:bg-pink-tint",
  },
  green: {
    bg: "bg-c-green text-ink",
    border: "border-green-deep",
    chip: "hover:bg-c-green hover:text-ink",
    dot: "bg-c-green border-green-deep group-hover:bg-ink group-hover:border-ink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-green border-ink",
    label: "text-green-deep hover:text-green-deep",
    pillActive: "bg-c-green text-ink hover:bg-c-green",
    soft: "bg-green-tint hover:bg-green-tint",
  },
};

const TOOL_ENTRIES = Object.entries(TOOL_CATEGORIES);

export function getCategoryTheme(
  category: string,
  itemType: "resource" | "tool" = "resource",
): Theme {
  if (!category) return THEMES[0];
  const normalized = category.trim().toLowerCase();
  const slug = slugify(normalized);

  if (itemType === "tool") {
    const toolIdx = TOOL_ENTRIES.findIndex(
      ([key, val]) =>
        key.toLowerCase() === slug || val.toLowerCase() === normalized || slugify(val) === slug,
    );
    if (toolIdx !== -1) return THEMES[toolIdx % THEMES.length];
  }

  // Consistent deterministic hash for any category name
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % THEMES.length;
  return THEMES[index];
}

export function getCategoryColor(
  category: string,
  itemType: "resource" | "tool" = "resource",
): string {
  return THEME_CONFIG[getCategoryTheme(category, itemType)].bg;
}
