"use client";

import { ArrowSquareOutIcon, BookmarkSimpleIcon, StarIcon, TagIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatStarCount } from "@/lib/github";
import { cn, getCategoryColor, Theme, THEME_CONFIG } from "@/lib/utils";

export interface ResourceCardViewProps {
  author?: string | string[] | null;
  authorHref?: ((authorName: string) => string) | string | null;
  cardClassName?: string;
  category?: string | null;
  description?: string | null;
  favicon?: string | null;
  iconClassName?: string;
  isBookmarked?: boolean;
  onBookmarkClick?: (e: React.MouseEvent) => void;
  onCardClick?: () => void;
  stars?: number | null;
  subtitle?: string | null;
  tags?: string | string[] | null;
  theme?: Theme;
  themeClasses?: string;
  title?: string | null;
  url?: string | null;
}

export function ResourceCardView({
  title,
  author,
  authorHref,
  cardClassName,
  category = "Generators",
  description,
  favicon,
  iconClassName,
  isBookmarked = false,
  onBookmarkClick,
  onCardClick,
  stars = null,
  subtitle,
  tags,
  theme,
  themeClasses: propThemeClasses,
  url,
}: ResourceCardViewProps) {
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  const resolvedCategory = category || "Generators";
  const themeClasses =
    propThemeClasses ??
    (theme ? THEME_CONFIG[theme].bg : getCategoryColor(resolvedCategory));
  const isBlue = themeClasses.includes("bg-c-blue") || theme === "blue";

  // Parse tags if provided as comma-separated string or array
  const parsedTags: string[] = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const handleCardClick = () => {
    onCardClick?.();
  };

  const isClickable = Boolean(onCardClick);

  const cardContent = (
    <article className={cn("card group", themeClasses, cardClassName)}>
      <div className="card-inner">
        <div className="card-face">
          {/* Card Header */}
          <div className="card-header">
            <span className="card-meta">{resolvedCategory}</span>
            <CardIcon
              alt={title || "Preview"}
              className={iconClassName}
              favicon={favicon || undefined}
            />
          </div>

          {/* Card Title & Subtitle */}
          <h3 className="card-title">{title || "Resource Title"}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}

          {/* Description */}
          <p className="card-description">
            {description ||
              "Tool description preview will appear here. It explains the features, purpose, and utility for developers."}
          </p>

          {/* Tags (if any) */}
          {parsedTags.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1">
              {parsedTags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className={cn(
                    "py-0.2 inline-flex items-center gap-0.5 rounded px-1.5 font-mono text-[9px]",
                    isBlue ? "bg-paper/20 text-paper" : "bg-ink/10 text-ink",
                  )}
                >
                  <TagIcon className="size-2.5" />
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer */}
          <div className="card-footer">
            {/* Left: Author & GitHub Stars */}
            <div className="flex min-w-0 items-center gap-2">
              {author ? (
                <div className="card-author flex min-w-0 items-center truncate">
                  {Array.isArray(author) ? (
                    author.map((authorName, index) => {
                      const href =
                        typeof authorHref === "function"
                          ? authorHref(authorName)
                          : typeof authorHref === "string"
                            ? authorHref
                            : null;

                      return (
                        <span key={authorName} className="inline-flex items-center truncate">
                          {index > 0 && <span className="mx-1 opacity-60">&</span>}
                          {href ? (
                            <Link
                              href={href}
                              className="truncate hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {authorName}
                            </Link>
                          ) : (
                            <span className="truncate">{authorName}</span>
                          )}
                        </span>
                      );
                    })
                  ) : (
                    (() => {
                      const href =
                        typeof authorHref === "function"
                          ? authorHref(author)
                          : typeof authorHref === "string"
                            ? authorHref
                            : null;

                      return href ? (
                        <Link
                          href={href}
                          className="truncate hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {author}
                        </Link>
                      ) : (
                        <span className="truncate">{author}</span>
                      );
                    })()
                  )}
                </div>
              ) : null}

              {stars !== null && (
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 font-mono text-[11px] font-medium",
                    isBlue ? "text-paper/90" : "text-ink/80",
                  )}
                  title={`${stars.toLocaleString()} GitHub stars`}
                >
                  <StarIcon weight="fill" className="size-3 text-amber-500" />
                  <span>{formatStarCount(stars)}</span>
                </span>
              )}
            </div>

            {/* Right: Bookmark & Open Link Actions */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className={cn(
                      "group/bookmark border-none bg-transparent transition-opacity duration-200 hover:bg-transparent",
                      isBlue ? "text-paper hover:text-paper" : "text-ink hover:text-ink",
                      isBookmarked ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                    )}
                    onMouseEnter={() => setIsBookmarkHovered(true)}
                    onMouseLeave={() => setIsBookmarkHovered(false)}
                    onClick={onBookmarkClick}
                    aria-label={isBookmarked ? "Remove" : "Save"}
                  >
                    <BookmarkSimpleIcon
                      weight={
                        isBookmarked
                          ? "fill"
                          : isBookmarkHovered
                            ? "duotone"
                            : "regular"
                      }
                      className={cn(
                        "size-5 transition-transform group-hover/bookmark:scale-110",
                        isBookmarked ? "fill-current opacity-100" : "",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className={isBlue ? "bg-paper text-ink" : undefined}>
                  <p>{isBookmarked ? "Remove" : "Save"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group/arrow p-1",
                        isBlue ? "text-paper" : "text-ink",
                      )}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Open in new tab"
                    >
                      <ArrowSquareOutIcon weight="bold" className="card-link-icon" />
                    </a>
                  ) : (
                    <span
                      className={cn(
                        "group/arrow p-1 opacity-60 cursor-not-allowed",
                        isBlue ? "text-paper" : "text-ink",
                      )}
                      aria-label="Open in new tab"
                    >
                      <ArrowSquareOutIcon weight="bold" className="card-link-icon" />
                    </span>
                  )}
                </TooltipTrigger>
                <TooltipContent className={isBlue ? "bg-paper text-ink" : undefined}>
                  <p>Open in new tab</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  if (isClickable) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="focus-visible:outline-primary block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
