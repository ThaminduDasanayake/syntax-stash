"use client";

import { useState } from "react";

import { ResourceCardView } from "@/components/resource-card-view";
import { Button } from "@/components/ui/button";
import { cn, getCategoryTheme, Theme } from "@/lib/utils";

export interface ResourceCardPreviewProps {
  author?: string | null;
  cardMaxWidthClass?: string;
  category?: string | null;
  className?: string;
  description?: string | null;
  favicon?: string | null;
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
  subtitle,
  tags,
  url,
}: ResourceCardPreviewProps) {
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const activeTheme: Theme = customTheme ?? getCategoryTheme(category || "Generators");

  return (
    <div className={cn("border-line bg-paper/50 border p-5 font-mono text-xs", className)}>
      {/* Header with Hero Eyebrow Theme Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <span className="text-foreground font-bold tracking-wider uppercase">
          Card Preview
        </span>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-[10px] font-bold uppercase">
            Theme:
          </span>
          <span className="hero-eyebrow-dots flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("orange")}
              title="Orange theme"
              aria-label="Select orange theme"
              className={cn(
                "bg-c-orange size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "orange"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("blue")}
              title="Blue theme"
              aria-label="Select blue theme"
              className={cn(
                "bg-c-blue size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "blue"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("pink")}
              title="Pink theme"
              aria-label="Select pink theme"
              className={cn(
                "bg-c-pink size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "pink"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setCustomTheme("green")}
              title="Green theme"
              aria-label="Select green theme"
              className={cn(
                "bg-c-green size-3.5 min-w-3.5 cursor-pointer rounded-none border-none p-0 transition-opacity hover:opacity-80",
                activeTheme === "green"
                  ? "ring-ink opacity-100 ring-1 ring-inset"
                  : "opacity-60",
              )}
            />
          </span>
        </div>
      </div>

      {/* Rendered Syntax Stash Card using shared ResourceCardView */}
      <div className={cn("mx-auto w-full font-sans text-base", cardMaxWidthClass)}>
        <ResourceCardView
          author={author}
          category={category}
          description={description}
          favicon={favicon}
          isBookmarked={isBookmarked}
          onBookmarkClick={() => setIsBookmarked((prev) => !prev)}
          subtitle={subtitle}
          tags={tags}
          theme={activeTheme}
          title={title}
          url={url}
        />
      </div>
    </div>
  );
}
