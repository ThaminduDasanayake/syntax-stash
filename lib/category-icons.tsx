import type { Icon } from "@phosphor-icons/react";
import {
  BookOpenIcon,
  BrowsersIcon,
  CubeIcon,
  DatabaseIcon,
  DevicesIcon,
  FilmStripIcon,
  GameControllerIcon,
  GraduationCapIcon,
  GridFourIcon,
  HardDrivesIcon,
  ImageIcon,
  LightbulbIcon,
  PaletteIcon,
  PenNibIcon,
  RobotIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  SpeakerHighIcon,
  SquaresFourIcon,
  TagIcon,
  TerminalWindowIcon,
  TextAaIcon,
} from "@phosphor-icons/react";

export const CATEGORY_ICON_MAP: Record<string, Icon> = {
  "AI & Machine Learning": RobotIcon,
  "Animation & Motion": FilmStripIcon,
  "Backend & Infrastructure": HardDrivesIcon,
  "Backgrounds & Patterns": GridFourIcon,
  "Color & Gradients": PaletteIcon,
  "Data & APIs": DatabaseIcon,
  "Design & UX": PenNibIcon,
  "Design Systems": CubeIcon,
  "Developer Tools & Utilities": TerminalWindowIcon,
  "Documentation & Markdown": BookOpenIcon,
  "Education & Community": GraduationCapIcon,
  "Fonts & Typography": TextAaIcon,
  "Frontend & UI": BrowsersIcon,
  Games: GameControllerIcon,
  Icons: SparkleIcon,
  "Images & Illustration": ImageIcon,
  "Inspiration & Galleries": LightbulbIcon,
  "Media Tools & Editors": SlidersHorizontalIcon,
  "Mockups & Presentations": DevicesIcon,
  Sound: SpeakerHighIcon,
  "UI & Components": SquaresFourIcon,
};

/**
 * Returns the matching Phosphor Icon component for a given category name.
 * Falls back to TagIcon if unknown, or SquaresFourIcon if empty/all.
 */
export function getCategoryIcon(categoryName?: string | null): Icon {
  if (!categoryName || categoryName === "all" || categoryName === "All Categories") {
    return SquaresFourIcon;
  }
  return CATEGORY_ICON_MAP[categoryName] || TagIcon;
}
