import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export type Theme = "red" | "orange" | "yellow" | "green" | "cyan" | "blue" | "purple" | "pink";

/* eslint-disable perfectionist/sort-arrays, perfectionist/sort-objects */
export const THEMES: readonly Theme[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
] as const;

const UNIFIED_THEME = {
  bg: "bg-card text-foreground",
  border: "border-border/60",
  chip: "hover:bg-muted text-foreground",
  dot: "bg-accent",
  dotActive: "bg-primary",
  dotInactive: "bg-muted-foreground/40",
  label: "text-foreground",
  pillActive: "bg-primary text-primary-foreground",
  soft: "bg-muted/50",
};

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
  blue: UNIFIED_THEME,
  cyan: UNIFIED_THEME,
  green: UNIFIED_THEME,
  orange: UNIFIED_THEME,
  pink: UNIFIED_THEME,
  purple: UNIFIED_THEME,
  red: UNIFIED_THEME,
  yellow: UNIFIED_THEME,
};
/* eslint-enable perfectionist/sort-arrays, perfectionist/sort-objects */

export const CATEGORY_THEME_MAP: Record<string, Theme> = {};

export function getCategoryTheme(
  _category?: string,
  _itemType: "resource" | "tool" = "resource",
  _index?: number,
  _allCategories?: string[],
): Theme {
  return "red";
}

export function getCategoryColor(
  category: string,
  itemType: "resource" | "tool" = "resource",
): string {
  return THEME_CONFIG[getCategoryTheme(category, itemType)].bg;
}
