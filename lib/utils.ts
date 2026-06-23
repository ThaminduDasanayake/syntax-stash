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
  calculators: "bg-c-orange text-ink",
  data: "bg-c-blue text-paper",
  development: "bg-c-pink text-ink",
  devops: "bg-c-green text-ink",
  imagesAssets: "bg-c-orange text-ink",
  network: "bg-c-blue text-paper",
  schemas: "bg-c-pink text-ink",
  typography: "bg-c-green text-ink",
  uiStyling: "bg-c-orange text-ink",
};

const RESOURCE_COLOR_MAP: Record<ResourceCategoryKey, string> = {
  ai: "bg-c-orange text-ink",
  animations: "bg-c-blue text-paper",
  backend: "bg-c-pink text-ink",
  colors: "bg-c-green text-ink",
  data: "bg-c-orange text-ink",
  dataViz: "bg-c-blue text-paper",
  design: "bg-c-pink text-ink",
  development: "bg-c-green text-ink",
  devTools: "bg-c-orange text-ink",
  education: "bg-c-blue text-paper",
  icons: "bg-c-pink text-ink",
  imagesAssets: "bg-c-green text-ink",
  jobs: "bg-c-orange text-ink",
  maps: "bg-c-blue text-paper",
  react: "bg-c-pink text-ink",
  typography: "bg-c-green text-ink",
  uiComponents: "bg-c-orange text-ink",
  unknown: "bg-[var(--paper)] text-[var(--ink)]",
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

// "bg-c-yellow text-ink",
// "bg-c-purple text-paper",
// "bg-c-cyan text-ink",
// "bg-c-red text-paper",

export const tabStyles = [
  "tab-trigger-orange",
  "tab-trigger-blue",
  "tab-trigger-pink",
  "tab-trigger-green",
];
