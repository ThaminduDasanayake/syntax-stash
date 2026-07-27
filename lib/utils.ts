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

export function downloadStringAsFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

type ResourceCategoryKey = keyof typeof RESOURCE_CATEGORIES;
type ToolCategoryKey = keyof typeof TOOL_CATEGORIES;

const TOOL_COLOR_MAP: Record<ToolCategoryKey, string> = {
  assets: "bg-c-orange text-ink",
  data: "bg-c-blue text-paper",
  dev: "bg-c-pink text-ink",
  frontend: "bg-c-green text-ink",
};

const RESOURCE_COLOR_MAP: Record<ResourceCategoryKey, string> = {
  ai: "bg-c-orange text-ink",
  data: "bg-c-blue text-paper",
  design: "bg-c-pink text-ink",
  dev: "bg-c-green text-ink",
  education: "bg-c-orange text-ink",
  frontend: "bg-c-blue text-paper",
  media: "bg-c-pink text-ink",
};

export function getToolKeyFromValue(value: string): string {
  const entry = Object.entries(TOOL_CATEGORIES).find(([_, val]) => val === value);
  return entry ? entry[0] : "unknown";
}

export function getResourceKeyFromValue(value: string): string {
  const entry = Object.entries(RESOURCE_CATEGORIES).find(([_, val]) => val === value);
  return entry ? entry[0] : "unknown";
}

export function getToolColorByKey(key: string): string {
  return TOOL_COLOR_MAP[key as ToolCategoryKey] || "bg-[var(--paper)] text-[var(--ink)]";
}

export function getResourceColorByKey(key: string): string {
  return RESOURCE_COLOR_MAP[key as ResourceCategoryKey] || "bg-[var(--paper)] text-[var(--ink)]";
}

export type ResourceTheme = "orange" | "blue" | "pink" | "green";

const RESOURCE_THEME_MAP: Record<ResourceCategoryKey, ResourceTheme> = {
  ai: "orange",
  data: "blue",
  design: "pink",
  dev: "green",
  education: "orange",
  frontend: "blue",
  media: "pink",
};

export function getResourceThemeByKey(key: string): ResourceTheme {
  return RESOURCE_THEME_MAP[key as ResourceCategoryKey] || "blue";
}

export const RESOURCE_THEME_STYLES: Record<ResourceTheme, { chip: string; dot: string }> = {
  blue: {
    chip: "hover:bg-c-blue hover:text-paper",
    dot: "bg-c-blue border-blue-deep group-hover:bg-paper group-hover:border-paper",
  },
  green: {
    chip: "hover:bg-c-green hover:text-ink",
    dot: "bg-c-green border-green-deep group-hover:bg-ink group-hover:border-ink",
  },
  orange: {
    chip: "hover:bg-c-orange hover:text-ink",
    dot: "bg-c-orange border-orange-deep group-hover:bg-ink group-hover:border-ink",
  },
  pink: {
    chip: "hover:bg-c-pink hover:text-ink",
    dot: "bg-c-pink border-pink-deep group-hover:bg-ink group-hover:border-ink",
  },
};

// "bg-c-yellow text-ink",
// "bg-c-purple text-paper",
// "bg-c-cyan text-ink",
// "bg-c-red text-paper",

export const tabStyles = [
  "tab-trigger-blue",
  "tab-trigger-green",
  "tab-trigger-orange",
  "tab-trigger-pink",
];
