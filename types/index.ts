declare module "turndown-plugin-gfm" {
  import TurndownService from "turndown";
  export function gfm(service: TurndownService): void;
  export function tables(service: TurndownService): void;
  export function strikethrough(service: TurndownService): void;
}

// Data Models
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// Component Props
export interface ToolLayoutProps {
  children: ReactNode;
  icon: LucideIcon;
  title: string | ReactNode;
  highlight?: string;
  description: string;
  backHref?: string;
  backText?: string;
  maxWidth?: "max-w-4xl" | "max-w-6xl" | "max-w-7xl";
}

export type Tool = {
  title: string;
  url: string;
  description: string;
  category: string;
  icon?: LucideIcon;
};

export type ToolCardProps = {
  tool: Tool;
};

export type SpotlightSearchProps = {
  onChangeAction: (value: string) => void;
  value: string;
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
