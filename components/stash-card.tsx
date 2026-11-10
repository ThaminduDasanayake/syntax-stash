"use client";

import { memo, useEffect, useRef, useState } from "react";

import { ResourceCard } from "@/components/resource-card";
import { ToolCard } from "@/components/tool-card";
import { cn } from "@/lib/utils";
import { isInternalTool, StashCardProps } from "@/types";

function StashCardComponent({
  index = 0,
  isBookmarked,
  item,
  onCardClick,
  onTagClickAction,
  onToggleBookmark,
  priority,
}: StashCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Above-the-fold cards (first 8) are revealed immediately to prevent LCP lag & layout shift
  const isAboveTheFold = index < 8;
  const [isObservedRevealed, setIsObservedRevealed] = useState(isAboveTheFold);
  const [staggerDelay, setStaggerDelay] = useState(0);

  const isRevealed = isAboveTheFold || isObservedRevealed;

  useEffect(() => {
    if (isRevealed) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger cards within the emerging row (col 0..3: 0ms, 50ms, 100ms, 150ms)
          const colIndex = index % 4;
          setStaggerDelay(colIndex * 50);

          setIsObservedRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px 40px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index, isRevealed]);

  const content = isInternalTool(item) ? (
    <ToolCard tool={item} />
  ) : (
    <ResourceCard
      resource={item}
      isBookmarked={isBookmarked}
      onCardClick={onCardClick}
      onTagClickAction={onTagClickAction}
      onToggleBookmark={onToggleBookmark}
      priority={priority ?? index === 0}
    />
  );

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: isRevealed && staggerDelay > 0 ? `${staggerDelay}ms` : "0ms",
      }}
      className={cn(
        "card-motion-wrapper",
        isRevealed ? "card-motion-revealed" : "card-motion-hidden",
      )}
    >
      {content}
    </div>
  );
}

export const StashCard = memo(StashCardComponent);
export default StashCard;
