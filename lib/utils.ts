import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { CATEGORIES as TOOL_CATEGORIES } from "@/lib/tools-data";

import { CATEGORIES as RESOURCE_CATEGORIES } from "./resource-data/categories";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

const RESOURCE_VALUES: string[] = Object.values(RESOURCE_CATEGORIES);
const TOOL_VALUES: string[] = Object.values(TOOL_CATEGORIES);

export function getCategoryTheme(category: string): Theme {
  const toolIdx = TOOL_VALUES.indexOf(category);
  if (toolIdx !== -1) return THEMES[toolIdx % THEMES.length];

  const resourceIdx = RESOURCE_VALUES.indexOf(category);
  if (resourceIdx !== -1) return THEMES[resourceIdx % THEMES.length];

  return THEMES[0];
}

export function getCategoryColor(category: string): string {
  return THEME_CONFIG[getCategoryTheme(category)].bg;
}
