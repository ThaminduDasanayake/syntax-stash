import type { IconName } from "@/lib/icons";

export type Tool = {
  author?: string;
  authorLink?: string;
  category: string;
  className?: string;
  description?: string;
  favicon?: string;
  highlight?: string;
  icon?: IconName;
  ogImage?: string;
  slug?: string;
  subtitle?: string;
  tags?: string[];
  title: string;
  url?: string;
};

export type ToolCardProps = {
  tool: Tool;
  onTagClickAction?: (tag: string) => void;
};

export type HeaderProps = {
  onSearchOpenAction: () => void;
};

export type FileDropzoneProps = {
  onFileDropAction: (file: File) => void;
  accept: string;
  label: string;
};

export type CommandMenuProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
};
