"use client";

import { useState } from "react";

import { ResourceCardView } from "@/components/resource-card-view";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

export interface ResourceCardPreviewProps {
  author?: string | null;
  cardMaxWidthClass?: string;
  category?: string | null;
  className?: string;
  description?: string | null;
  favicon?: string | null;
  iconBg?: "dark" | "light" | "invert" | string | null;
  iconClassName?: string;
  ogImage?: string | null;
  subtitle?: string | null;
  tags?: string | null;
  title?: string | null;
  url?: string | null;
}

export function ResourceCardPreview({
  title,
  author,
  cardMaxWidthClass = "max-w-80",
  category = "Generators",
  className,
  description,
  favicon,
  iconBg,
  iconClassName,
  ogImage,
  subtitle,
  url,
}: ResourceCardPreviewProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const debouncedOgImage = useDebounce(ogImage, 400);
  const debouncedFavicon = useDebounce(favicon, 400);

  return (
    <div className={cn("border-line bg-paper/50 border p-5 font-mono text-xs", className)}>
      <div className="border-line mb-4 flex items-center justify-between border-b pb-3">
        <span className="text-foreground font-bold tracking-wider uppercase">Card Preview</span>
      </div>

      {/* Rendered Syntax Stash Card using shared ResourceCardView */}
      <div className={cn("mx-auto w-full font-sans text-base", cardMaxWidthClass)}>
        <ResourceCardView
          author={author}
          category={category}
          description={description}
          favicon={debouncedFavicon}
          iconBg={iconBg}
          iconClassName={iconClassName}
          ogImage={debouncedOgImage}
          isBookmarked={isBookmarked}
          onBookmarkClick={() => setIsBookmarked((prev) => !prev)}
          showTags={false}
          subtitle={subtitle}
          title={title}
          url={url}
        />
      </div>
    </div>
  );
}
