import type { IconName } from "@/lib/icons";

export type Tool = {
  title: string;
  subtitle?: string;
  highlight?: string;
  slug?: string;
  url?: string;
  description: string;
  category: string;
  icon?: IconName;
  favicon?: string;
  className?: string;
  tags?: string[];
  author?: string;
  authorLink?: string;
  details?: { title: string; content: string }[];
  related?: string[];
};

export type ToolCardProps = {
  tool: Tool;
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
