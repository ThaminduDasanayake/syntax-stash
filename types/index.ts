// Data Models
import { LucideIcon } from "lucide-react";
import { ElementType, ReactNode } from "react";

export interface CodeFile {
  filename: string;
  language: string;
  code: string;
  html: string;
}

export interface Snippet {
  id: string;
  title: string;
  description: string;
  languages: string[];
  setup?: string;
  instructions?: string[];
  files: CodeFile[];
}

// Component Props
export interface ToolLayoutProps {
  children: ReactNode;
  icon: ElementType;
  title: string;
  highlight?: string;
  description: string;
  backHref?: string;
  backText?: string;
  maxWidth?: "max-w-6xl" | "max-w-7xl"; // Allows flexibility for different tools
}

export type Tool = {
  title: string;
  url: string;
  description: string;
  category: string;
  icon?: LucideIcon;
};

export type ToolDashboardProps = {
  tools: Tool[];
  categories: string[];
};

export type ToolGridProps = {
  tools: Tool[];
};
