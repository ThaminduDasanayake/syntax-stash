"use client";

import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { ResourceCardView } from "@/components/resource-card-view";
import { SelectBar } from "@/components/ui/select-bar";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, parseAuthors } from "@/lib/utils";

type PreviewMode = "card" | "dialog";

const PREVIEW_MODE_ITEMS: { key: PreviewMode; label: string }[] = [
  { key: "card", label: "Card" },
  { key: "dialog", label: "Dialog" },
];

export interface ResourceCardPreviewProps {
  author?: string | null;
  cardMaxWidthClass?: string;
  category?: string | null;
  className?: string;
  description?: string | null;
  favicon?: string | null;
  iconBg?: "none" | "dark" | "black" | "light" | "white" | "invert" | string | null;
  iconClassName?: string;
  ogImage?: string | null;
  ogImageBg?: string | null;
  title?: string | null;
  subtitle?: string | null;
  tags?: string | null;
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
  ogImageBg,
  subtitle,
  url,
}: ResourceCardPreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("card");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const debouncedOgImage = useDebounce(ogImage, 400);
  const debouncedFavicon = useDebounce(favicon, 400);

  const cleanTitle = title?.trim() || "Untitled Resource";
  const cleanSubtitle = subtitle?.trim() || "";
  const cleanDescription = description?.trim() || "Resource description appears here when entered.";
  const authorList = parseAuthors(author);

  return (
    <div className={cn("border-line bg-paper/50 border-[1.5px] p-5 font-sans text-xs", className)}>
      <div className="border-line mb-4 flex items-center justify-between gap-2 border-b-[1.5px] pb-3">
        <span className="text-foreground font-bold tracking-wider uppercase">Live Preview</span>
        <SelectBar
          ariaLabel="Preview mode"
          className="font-mono text-xs"
          items={PREVIEW_MODE_ITEMS}
          onChange={setPreviewMode}
          size="xs"
          value={previewMode}
        />
      </div>

      {previewMode === "card" ? (
        /* Rendered Syntax Stash Card using shared ResourceCardView */
        <div className={cn("mx-auto w-full font-sans text-base", cardMaxWidthClass)}>
          <ResourceCardView
            author={author}
            category={category}
            description={description}
            favicon={debouncedFavicon}
            iconBg={iconBg}
            iconClassName={iconClassName}
            isBookmarked={isBookmarked}
            ogImage={debouncedOgImage}
            ogImageBg={ogImageBg}
            onBookmarkClick={() => setIsBookmarked((prev) => !prev)}
            showTags={false}
            title={title}
            url={url}
          />
        </div>
      ) : (
        /* Rendered ResourceDialog hero preview showing how subtitle pairs with title & description */
        <div className="text-foreground mx-auto flex w-full flex-col rounded-2xl border-[1.5px] border-white/12 bg-[#141416] p-6 font-sans text-sm shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="bg-primary size-2 shrink-0 rounded-full" />
              <span className="text-muted-foreground truncate font-mono text-xs font-semibold uppercase">
                {category || "Uncategorized"}
              </span>
            </div>
            <CardIcon
              alt={cleanTitle}
              className={iconClassName}
              favicon={debouncedFavicon}
              iconBg={iconBg}
              iconClassName={iconClassName}
            />
          </div>

          <h3 className="font-display mb-3.5 text-2xl leading-tight font-extrabold tracking-tight text-balance wrap-break-word uppercase">
            {cleanTitle}
          </h3>

          {cleanSubtitle ? (
            <p className="text-muted-foreground mb-5 text-sm leading-6 font-medium wrap-break-word opacity-90">
              {cleanSubtitle}
            </p>
          ) : (
            <p className="text-muted-foreground/50 mb-5 text-xs italic">
              No subtitle / motto set (optional)
            </p>
          )}

          <p className="text-foreground/90 border-t-[1.5px] border-white/8 pt-3 text-sm leading-6.5 font-normal wrap-break-word opacity-90">
            {cleanDescription}
          </p>

          {authorList.length > 0 && (
            <div className="text-mono-2xs text-muted-foreground mt-6 flex flex-wrap items-center gap-1 opacity-75">
              {authorList.map((authorName, index) => (
                <span key={authorName} className="inline-flex items-center">
                  {index > 0 && <span className="mr-1 opacity-60">&amp;</span>}
                  <span>{authorName}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
