import type { IconName } from "@/lib/icons";

export interface BaseItem<TCategory extends string = string> {
  category: TCategory;
  createdAt?: Date | string;
  description?: string;
  title: string;
  updatedAt?: Date | string;
}

export interface InternalTool<TCategory extends string = string> extends BaseItem<TCategory> {
  highlight?: string;
  icon: IconName;
  slug: string;
}

export interface Resource<TCategory extends string = string> extends BaseItem<TCategory> {
  author?: string | string[];
  className?: string;
  createdAt?: Date | string;
  favicon?: string;
  github?: string;
  id?: string;
  ogImage?: string;
  subtitle?: string;
  tags?: string[];
  updatedAt?: Date | string;
  url: string;
}

export type StashItem = InternalTool | Resource;

export function isInternalTool(item: StashItem): item is InternalTool {
  return "slug" in item && typeof item.slug === "string";
}

export function isResource(item: StashItem): item is Resource {
  return "url" in item && typeof item.url === "string";
}

// Backwards compatibility alias
export type Tool = StashItem;

export type ToolCardProps = {
  tool: InternalTool;
};

export type ResourceCardProps = {
  resource: Resource;
  isBookmarked?: boolean;
  onCardClick?: (resource: Resource) => void;
  onTagClickAction?: (tag: string) => void;
  onToggleBookmark?: (resource: Resource) => void;
};

export type StashCardProps = {
  item: StashItem;
  isBookmarked?: boolean;
  onCardClick?: (item: StashItem) => void;
  onTagClickAction?: (tag: string) => void;
  onToggleBookmark?: (item: StashItem) => void;
};

export type HeaderProps = {
  onSearchOpenAction: () => void;
};

export type CommandMenuProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
};
