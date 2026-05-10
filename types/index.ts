import { Icon } from "@phosphor-icons/react";

export type Tool = {
  title: string;
  highlight?: string;
  url: string;
  description: string;
  category: string;
  icon?: Icon;
  favicon?: string;
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
