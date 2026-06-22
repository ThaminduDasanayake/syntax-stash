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

export function downloadStringAsFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function getAlternatingColor(title: string, index?: number) {
  const colorOptions = [
    "bg-c-orange text-ink",
    "bg-c-blue text-paper",
    "bg-c-pink text-ink",
    "bg-c-green text-ink",
  ];

  if (index !== undefined) {
    return colorOptions[index % colorOptions.length];
  }

  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorOptions[hash % colorOptions.length];
}

export const tabStyles = [
  "tab-trigger-orange",
  "tab-trigger-blue",
  "tab-trigger-pink",
  "tab-trigger-green",
];
