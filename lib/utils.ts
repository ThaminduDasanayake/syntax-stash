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
 * Dedicated 4-color theme mapping for Inbuilt Tools:
 * 1. Data -> Red (THEMES[0])
 * 2. Developer Tools & Utilities -> Orange (THEMES[1])
 * 3. Frontend & UI -> Yellow (THEMES[2])
 * 4. Media & Assets -> Green (THEMES[3])
 */
/* eslint-disable perfectionist/sort-objects */
export const TOOL_CATEGORY_THEMES: Record<string, Theme> = {
  // 1. Data -> Red
  data: "red",
  "data-apis": "red",

  // 2. Developer Tools & Utilities -> Orange
  dev: "orange",
  "developer-tools": "orange",
  "developer-tools-utilities": "orange",
  devtools: "orange",
  tools: "orange",
  utilities: "orange",

  // 3. Frontend & UI -> Yellow
  frontend: "yellow",
  "frontend-ui": "yellow",
  ui: "yellow",

  // 4. Media & Assets -> Green
  media: "green",
  "media-assets": "green",
  assets: "green",
};
/* eslint-enable perfectionist/sort-objects */

/**
 * Curated list of standard categories in alphabetical order (starting with AI).
 * Themes are assigned in the 8-color theme sequence (Red -> Pink) and repeat.
 */
/* eslint-disable perfectionist/sort-objects */
export const ALPHABETICAL_CATEGORY_THEMES: Record<string, Theme> = {
  // 1. AI & Machine Learning -> Red (THEMES[0])
  ai: "red",
  "ai-machine-learning": "red",
  "ai-models": "red",
  "artificial-intelligence": "red",
  llm: "red",
  models: "red",

  // 2. Animation & Motion -> Orange (THEMES[1])
  animation: "orange",
  "animation-motion": "orange",
  animations: "orange",
  "animations-motion": "orange",
  canvas: "orange",
  interactive: "orange",
  motion: "orange",

  // 3. Backend & Infrastructure -> Yellow (THEMES[2])
  auth: "yellow",
  backend: "yellow",
  "backend-infrastructure": "yellow",
  boilerplate: "yellow",
  boilerplates: "yellow",
  cloud: "yellow",
  databases: "yellow",
  "databases-backend": "yellow",
  docker: "yellow",
  infrastructure: "yellow",
  orm: "yellow",
  serverless: "yellow",
  sql: "yellow",

  // 4. Color & Gradients -> Green (THEMES[3])
  color: "green",
  "color-gradients": "green",
  "color-palettes": "green",
  colors: "green",
  "colors-gradients": "green",
  "colors-palettes": "green",
  gradients: "green",
  palette: "green",
  palettes: "green",

  // 5. Data & APIs -> Cyan (THEMES[4])
  api: "cyan",
  apis: "cyan",
  data: "cyan",
  "data-apis": "cyan",
  graphql: "cyan",
  json: "cyan",
  rest: "cyan",
  schema: "cyan",

  // 6. Design & UX -> Blue (THEMES[5])
  accessibility: "blue",
  design: "blue",
  "design-systems": "blue",
  "design-ux": "blue",
  figma: "blue",
  ui_ux: "blue",
  "ui-ux": "blue",
  ux: "blue",
  wireframe: "blue",

  // 7. Developer Tools & Utilities -> Purple (THEMES[6])
  dev: "purple",
  "developer-tools": "purple",
  "developer-tools-utilities": "purple",
  devtools: "purple",
  tools: "purple",
  utilities: "purple",

  // 8. Documentation & Markdown -> Pink (THEMES[7])
  "cheat-sheets": "pink",
  cheatsheets: "pink",
  docs: "pink",
  documentation: "pink",
  "documentation-markdown": "pink",
  markdown: "pink",
  readme: "pink",
  reference: "pink",

  // --- Cycle 2 (repeating 8 colors) ---

  // 9. Education & Community -> Red (THEMES[0])
  community: "red",
  course: "red",
  education: "red",
  "education-community": "red",
  handbook: "red",
  learn: "red",
  tutorial: "red",

  // 10. Frontend & UI -> Orange (THEMES[1])
  bundle: "orange",
  css: "orange",
  frontend: "orange",
  "frontend-ui": "orange",
  html: "orange",
  javascript: "orange",
  styling: "orange",
  "styling-css": "orange",
  "styling-ui": "orange",
  tailwind: "orange",
  typescript: "orange",

  // 11. Icons & Illustrations -> Yellow (THEMES[2])
  assets: "yellow",
  icons: "yellow",
  "icons-illustrations": "yellow",
  "icons-logos": "yellow",
  illustrations: "yellow",
  logos: "yellow",
  svg: "yellow",

  // 12. Inspiration & Galleries -> Green (THEMES[3])
  directory: "green",
  galleries: "green",
  gallery: "green",
  inspiration: "green",
  "inspiration-galleries": "green",
  portfolio: "green",
  showcase: "green",

  // 13. Media & Assets -> Cyan (THEMES[4])
  audio: "cyan",
  image: "cyan",
  media: "cyan",
  "media-assets": "cyan",
  sound: "cyan",
  texture: "cyan",
  video: "cyan",

  // 14. Mockups & Presentations -> Blue (THEMES[5])
  mockup: "blue",
  mockups: "blue",
  "mockups-presentations": "blue",
  presentation: "blue",
  presentations: "blue",
  preview: "blue",
  prototype: "blue",

  // 15. Typography -> Purple (THEMES[6])
  font: "purple",
  fonts: "purple",
  type: "purple",
  typography: "purple",

  // 16. UI Components & Libraries -> Pink (THEMES[7])
  components: "pink",
  "components-ui": "pink",
  extensions: "pink",
  libraries: "pink",
  ui: "pink",
  "ui-components": "pink",
  "ui-components-libraries": "pink",

  // Extra common utility categories
  "build-tools": "pink",
  generators: "pink",
  performance: "pink",
  qa: "pink",
  security: "pink",
  testing: "pink",
  "testing-qa": "pink",
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

  const normalized = category.trim().toLowerCase();
  const slug = slugify(normalized);

  // If itemType is "tool", use the dedicated 4-color tool category order (Red, Orange, Yellow, Green)
  if (itemType === "tool") {
    // If explicit index is provided, use it directly in theme sequence
    if (typeof index === "number" && index >= 0) {
      return THEMES[index % THEMES.length];
    }

    // If list of tool categories is provided, find its index
    if (Array.isArray(allCategories) && allCategories.length > 0) {
      const foundIdx = allCategories.findIndex(
        (c) => c.toLowerCase().trim() === category.toLowerCase().trim(),
      );
      if (foundIdx !== -1) {
        return THEMES[foundIdx % THEMES.length];
      }
    }

    if (TOOL_CATEGORY_THEMES[slug]) {
      return TOOL_CATEGORY_THEMES[slug];
    }
    if (TOOL_CATEGORY_THEMES[normalized]) {
      return TOOL_CATEGORY_THEMES[normalized];
    }
    for (const [key, theme] of Object.entries(TOOL_CATEGORY_THEMES)) {
      if (slug === key || slug.startsWith(`${key}-`) || slug.endsWith(`-${key}`)) {
        return theme;
      }
    }
    const toolIdx = TOOL_ENTRIES.findIndex(
      ([key, val]) =>
        key.toLowerCase() === slug || val.toLowerCase() === normalized || slugify(val) === slug,
    );
    if (toolIdx !== -1) return THEMES[toolIdx % THEMES.length];
    return THEMES[0];
  }

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

  // Check explicit alphabetical theme map for resources
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
