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
}: StashCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [staggerDelay, setStaggerDelay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger cards within the emerging row (col 0..3: 0ms, 50ms, 100ms, 150ms)
          const colIndex = index % 4;
          setStaggerDelay(colIndex * 50);

          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        // Negative bottom margin ensures cards animate as they emerge into visible view
        rootMargin: "0px 0px -70px 0px",
        threshold: 0.08,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const content = isInternalTool(item) ? (
    <ToolCard tool={item} />
  ) : (
    <ResourceCard
      resource={item}
      isBookmarked={isBookmarked}
      onCardClick={onCardClick}
      onTagClickAction={onTagClickAction}
      onToggleBookmark={onToggleBookmark}
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
