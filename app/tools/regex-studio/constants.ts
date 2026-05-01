import { RegexCategory } from "@/app/tools/regex-studio/types.ts";

export const BOX_H = 30;
export const R = 6; // border radius
export const H_GAP = 18; // gap between items in a sequence
export const V_GAP = 14; // gap between alternatives
export const CONN = 18; // horizontal connector margin for disjunction
export const CHAR_W = 7.5; // approx width per character in 12px mono
export const PAD_X = 10; // horizontal padding inside boxes

export const COLORS = {
  literal: { fill: "#0f172a", stroke: "#38bdf8", text: "#7dd3fc" }, // sky
  charClass: { fill: "#0f172a", stroke: "#fbbf24", text: "#fde68a" }, // amber
  group: { fill: "#0f172a", stroke: "#34d399", text: "#6ee7b7" }, // emerald
  anchor: { fill: "#0f172a", stroke: "#f87171", text: "#fca5a5" }, // rose
  quantifier: { fill: "#0f172a", stroke: "#a78bfa", text: "#c4b5fd" }, // violet
  fallback: { fill: "#0f172a", stroke: "#6b7280", text: "#9ca3af" }, // gray
};

export const CATEGORY_COLORS: Record<RegexCategory, string> = {
  Validation: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Formats: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Code: "bg-green-500/10 text-green-400 border-green-500/20",
  Numbers: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export const REGEX_CATEGORIES: ("All" | RegexCategory)[] = [
  "All",
  "Validation",
  "Formats",
  "Code",
  "Numbers",
];
