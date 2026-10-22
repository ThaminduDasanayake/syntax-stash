import { DUAL_PALETTES } from "@/app/tools/color-studio/dual-palette";
import { FIVE_PALETTES } from "@/app/tools/color-studio/five-palette";
import { FOUR_PALETTES } from "@/app/tools/color-studio/four-palette";
import { SIX_PALETTES } from "@/app/tools/color-studio/six-palette";
import { THREE_PALETTES } from "@/app/tools/color-studio/three-palette";

export type Colors = {
  name: string;
  hex: string;
  colSpan?: string;
  textColor?: "white" | "black";
};

export type Palette = {
  name: string;
  colors: Colors[];
};

export const COLOR_PALETTES: Palette[] = [
  ...DUAL_PALETTES,
  ...THREE_PALETTES,
  ...FOUR_PALETTES,
  ...FIVE_PALETTES,
  ...SIX_PALETTES,
];
