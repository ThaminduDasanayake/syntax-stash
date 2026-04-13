// Data Models
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

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

export type PromptTemplate = {
  id: string;
  title: string;
  description: string;
  template: string;
  variables: string[];
};

// SVG Optimizer Types
export interface OptimizeResult {
  svg: string;
  originalSize: number;
  optimizedSize: number;
  error?: never;
}

export interface OptimizeError {
  error: string;
  svg?: never;
  originalSize?: never;
  optimizedSize?: never;
}

export type OptimizeResponse = OptimizeResult | OptimizeError;

// Component Props
export interface ToolLayoutProps {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
  highlight?: string;
  description: string;
  backHref?: string;
  backText?: string;
  maxWidth?: "max-w-6xl" | "max-w-7xl";
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

export type ToolCardProps = {
  tool: Tool;
};

export type SpotlightSearchProps = {
  onChangeAction: (value: string) => void;
  value: string;
};

export type SidebarNavProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

export type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type HeaderProps = {
  onMenuOpenAction: () => void;
  onSearchOpenAction: () => void;
};

export type FilterPillsProps = {
  categories: string[];
  active: string;
  onSelectAction: (category: string) => void;
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

export type AppShellProps = {
  children: ReactNode;
  onMenuOpenAction: () => void;
};

// Tool Page Types
export type RegexMatch = {
  value: string;
  index: number;
  groups: string[];
};

export type RegexResult = { ok: true; matches: RegexMatch[] } | { ok: false; error: string };

export type SchemaId = "users" | "products" | "posts";

export type JwtDecoded =
  | { ok: true; header: string; payload: string; signature: string }
  | { ok: false; error: string };

export type JsonResult = { ok: true; output: string } | { ok: false; error: string };

export type ImageFormat = "image/webp" | "image/jpeg" | "image/png";

export type HashAlgo = {
  id: string;
  name: string;
  subtleName: string;
};

export type EncoderAction = {
  id: string;
  label: string;
  run: (input: string) => string;
};

export type CronParsed = { ok: true; human: string; dates: Date[] } | { ok: false; error: string };

export type ColorField = "hex" | "rgb" | "hsl" | "oklch";

export type AnalyzerMetrics = {
  chars: number;
  words: number;
  sentences: number;
  bytes: number;
  tokens: number;
};

export type AnalyzerStat = {
  label: string;
  value: number;
  hint?: string;
};
