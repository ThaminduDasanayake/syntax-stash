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
  red: {
    bg: "bg-c-red text-paper",
    border: "border-red-deep",
    chip: "hover:bg-c-red hover:text-paper",
    dot: "bg-c-red border-red-deep group-hover:bg-paper group-hover:border-paper",
    dotActive: "bg-paper border-paper",
    dotInactive: "bg-c-red border-ink",
    label: "text-red-deep hover:text-red-deep",
    pillActive: "bg-c-red text-paper hover:bg-c-red hover:text-paper",
    soft: "bg-red-tint hover:bg-red-tint",
  },
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
  yellow: {
    bg: "bg-c-yellow text-ink",
    border: "border-yellow-deep",
    chip: "hover:bg-c-yellow hover:text-ink",
    dot: "bg-c-yellow border-yellow-deep group-hover:bg-ink group-hover:border-ink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-yellow border-ink",
    label: "text-yellow-deep hover:text-yellow-deep",
    pillActive: "bg-c-yellow text-ink hover:bg-c-yellow",
    soft: "bg-yellow-tint hover:bg-yellow-tint",
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
  cyan: {
    bg: "bg-c-cyan text-ink",
    border: "border-cyan-deep",
    chip: "hover:bg-c-cyan hover:text-ink",
    dot: "bg-c-cyan border-cyan-deep group-hover:bg-ink group-hover:border-ink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-cyan border-ink",
    label: "text-cyan-deep hover:text-cyan-deep",
    pillActive: "bg-c-cyan text-ink hover:bg-c-cyan",
    soft: "bg-cyan-tint hover:bg-cyan-tint",
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
  purple: {
    bg: "bg-c-purple text-paper",
    border: "border-purple-deep",
    chip: "hover:bg-c-purple hover:text-paper",
    dot: "bg-c-purple border-purple-deep group-hover:bg-paper group-hover:border-paper",
    dotActive: "bg-paper border-paper",
    dotInactive: "bg-c-purple border-ink",
    label: "text-purple-deep hover:text-purple-deep",
    pillActive: "bg-c-purple text-paper hover:bg-c-purple hover:text-paper",
    soft: "bg-purple-tint hover:bg-purple-tint",
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
};
/* eslint-enable perfectionist/sort-arrays, perfectionist/sort-objects */

const TOOL_ENTRIES = Object.entries(TOOL_CATEGORIES);

/**
 * Curated list of standard categories in alphabetical order (starting with AI).
 * Themes are assigned in the 8-color theme sequence (Red -> Pink) and repeat.
 */
/* eslint-disable perfectionist/sort-objects */
export const ALPHABETICAL_CATEGORY_THEMES: Record<string, Theme> = {
  // 1. A: AI & Machine Learning -> Red (THEMES[0])
  ai: "red",
  "artificial-intelligence": "red",
  "ai-machine-learning": "red",
  "ai-models": "red",
  llm: "red",
  models: "red",

  // 2. A: Animations & Motion -> Orange (THEMES[1])
  animations: "orange",
  motion: "orange",
  "animations-motion": "orange",
  canvas: "orange",
  interactive: "orange",

  // 3. B: Backend & Databases -> Yellow (THEMES[2])
  backend: "yellow",
  boilerplates: "yellow",
  boilerplate: "yellow",
  databases: "yellow",
  "databases-backend": "yellow",
  sql: "yellow",
  orm: "yellow",

  // 4. C: Components & UI -> Green (THEMES[3])
  components: "green",
  "components-ui": "green",
  ui: "green",
  libraries: "green",
  extensions: "green",

  // 5. C: CSS & Styling -> Cyan (THEMES[4])
  css: "cyan",
  styling: "cyan",
  "styling-css": "cyan",
  "styling-ui": "cyan",
  tailwind: "cyan",
  cheatsheets: "cyan",
  "cheat-sheets": "cyan",

  // 6. D: Documentation & DevOps -> Blue (THEMES[5])
  documentation: "blue",
  docs: "blue",
  devops: "blue",
  "developer-tools": "blue",
  "developer-tools-utilities": "blue",
  dev: "blue",
  infrastructure: "blue",
  cloud: "blue",
  data: "blue",

  // 7. I: Icons & Logos -> Purple (THEMES[6])
  icons: "purple",
  logos: "purple",
  "icons-logos": "purple",
  assets: "purple",
  media: "purple",
  "media-assets": "purple",
  design: "purple",
  "design-systems": "purple",

  // 8. T: Testing & QA -> Pink (THEMES[7])
  testing: "pink",
  qa: "pink",
  "testing-qa": "pink",
  "build-tools": "pink",
  performance: "pink",
  security: "pink",
  generators: "pink",
  tools: "pink",
  typography: "pink",
  utilities: "pink",
};
/* eslint-enable perfectionist/sort-objects */

export const CATEGORY_THEME_MAP = ALPHABETICAL_CATEGORY_THEMES;

export function getCategoryTheme(
  category: string,
  itemType: "resource" | "tool" = "resource",
  index?: number,
  allCategories?: string[],
): Theme {
  if (!category) return THEMES[0];

  // If explicit index is provided, use it directly in theme sequence
  if (typeof index === "number" && index >= 0) {
    return THEMES[index % THEMES.length];
  }

  // If list of categories is provided, find its index in the alphabetical list
  if (Array.isArray(allCategories) && allCategories.length > 0) {
    const foundIdx = allCategories.findIndex(
      (c) => c.toLowerCase().trim() === category.toLowerCase().trim(),
    );
    if (foundIdx !== -1) {
      return THEMES[foundIdx % THEMES.length];
    }
  }

  const normalized = category.trim().toLowerCase();
  const slug = slugify(normalized);

  // Check explicit alphabetical theme map first
  if (ALPHABETICAL_CATEGORY_THEMES[slug]) {
    return ALPHABETICAL_CATEGORY_THEMES[slug];
  }
  if (ALPHABETICAL_CATEGORY_THEMES[normalized]) {
    return ALPHABETICAL_CATEGORY_THEMES[normalized];
  }

  // Check matching key prefix or segment in ALPHABETICAL_CATEGORY_THEMES
  for (const [key, theme] of Object.entries(ALPHABETICAL_CATEGORY_THEMES)) {
    if (slug === key || slug.startsWith(`${key}-`) || slug.endsWith(`-${key}`)) {
      return theme;
    }
  }

  if (itemType === "tool") {
    const toolIdx = TOOL_ENTRIES.findIndex(
      ([key, val]) =>
        key.toLowerCase() === slug || val.toLowerCase() === normalized || slugify(val) === slug,
    );
    if (toolIdx !== -1) return THEMES[toolIdx % THEMES.length];
  }

  // Consistent deterministic hash for any unrecognized category name
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % THEMES.length;
  return THEMES[idx];
}

export function getCategoryColor(
  category: string,
  itemType: "resource" | "tool" = "resource",
): string {
  return THEME_CONFIG[getCategoryTheme(category, itemType)].bg;
}
