import {
  AlignItems,
  DisplayType,
  FlexDirection,
  GapSize,
  JustifyContent,
} from "@/app/tools/layout-visualizer/types";

export function getDisplayClass(display: DisplayType): string {
  return display === "flex" ? "flex" : "grid";
}

export function getFlexDirectionClass(direction: FlexDirection): string {
  if (direction === "row") return "flex-row";
  if (direction === "col") return "flex-col";
  return "";
}

export function getJustifyContentClass(justify: JustifyContent): string {
  if (justify === "start") return "justify-start";
  if (justify === "center") return "justify-center";
  if (justify === "end") return "justify-end";
  if (justify === "space-between") return "justify-between";
  return "";
}

export function getAlignItemsClass(align: AlignItems): string {
  if (align === "start") return "items-start";
  if (align === "center") return "items-center";
  if (align === "end") return "items-end";
  if (align === "stretch") return "items-stretch";
  return "";
}

export function getGapClass(gap: GapSize): string {
  if (gap === "2") return "gap-2";
  if (gap === "4") return "gap-4";
  if (gap === "6") return "gap-6";
  if (gap === "8") return "gap-8";
  if (gap === "10") return "gap-10";
  if (gap === "12") return "gap-12";
  return "";
}
