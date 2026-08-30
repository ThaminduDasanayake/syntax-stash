"use client";

import { memo } from "react";

import { ResourceCard } from "@/components/resource-card";
import { ToolCard } from "@/components/tool-card";
import { isInternalTool, StashCardProps } from "@/types";

function StashCardComponent({
  isBookmarked,
  item,
  onCardClick,
  onTagClickAction,
  onToggleBookmark,
}: StashCardProps) {
  if (isInternalTool(item)) {
    return <ToolCard tool={item} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} />;
  }

  return (
    <ResourceCard
      resource={item}
      isBookmarked={isBookmarked}
      onCardClick={onCardClick}
      onTagClickAction={onTagClickAction}
      onToggleBookmark={onToggleBookmark}
    />
  );
}

export const StashCard = memo(StashCardComponent);
export default StashCard;
