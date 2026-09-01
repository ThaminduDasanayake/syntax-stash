"use client";

import { ArrowSquareOutIcon, BookmarkSimpleIcon, StarIcon } from "@phosphor-icons/react";
import { memo, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { formatStarCount, getGitHubStars } from "@/lib/github";
import { cn, getCategoryColor } from "@/lib/utils";
import { ResourceCardProps } from "@/types";

function ResourceCardComponent({
  isBookmarked: propIsBookmarked,
  onCardClick,
  onToggleBookmark: propOnToggleBookmark,
  resource,
}: ResourceCardProps) {
  const colorClasses = getCategoryColor(resource.category);
  const isBlue = colorClasses.includes("bg-c-blue");
  const stars = getGitHubStars(resource.gitHubLink);
  const { data: session } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isBookmarked: hookIsBookmarked, toggleBookmark: hookToggleBookmark } = useBookmarks();
  const bookmarked = propIsBookmarked !== undefined ? propIsBookmarked : hookIsBookmarked(resource);
  const toggle = propOnToggleBookmark || hookToggleBookmark;
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      setAuthModalOpen(true);
      return;
    }
    toggle(resource);
  };

  const handleCardClick = () => {
    onCardClick?.(resource);
  };

  return (
    <>
      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
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
        <article className={cn("card group", colorClasses)}>
          <div className="card-inner">
            <div className="card-face">
              <div className="card-header">
                <span className="card-meta">{resource.category}</span>
                <CardIcon
                  alt={resource.title}
                  className={resource.className}
                  favicon={resource.favicon}
                />
              </div>

              <h3 className="card-title">{resource.title}</h3>

              {resource.subtitle && <p className="card-subtitle">{resource.subtitle}</p>}
              <p className="card-description">{resource.description}</p>

              <div className="card-footer">
                <div className="flex min-w-0 items-center gap-2">
                  {resource.author ? (
                    <span className="card-author truncate">{resource.author}</span>
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
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className={cn(
                          "group/bookmark border-none bg-transparent transition-opacity duration-200 hover:bg-transparent",
                          isBlue ? "text-paper hover:text-paper" : "text-ink hover:text-ink",
                          bookmarked ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                        )}
                        onMouseEnter={() => setIsBookmarkHovered(true)}
                        onMouseLeave={() => setIsBookmarkHovered(false)}
                        onClick={handleBookmarkClick}
                        aria-label={bookmarked ? "Remove" : "Save"}
                      >
                        <BookmarkSimpleIcon
                          weight={bookmarked ? "fill" : isBookmarkHovered ? "duotone" : "regular"}
                          className={cn(
                            "size-5 transition-transform group-hover/bookmark:scale-110",
                            bookmarked ? "fill-current opacity-100" : "",
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className={isBlue ? "bg-paper text-ink" : undefined}>
                      <p>{bookmarked ? "Remove" : "Save"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/arrow p-1"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Open in new tab"
                      >
                        <ArrowSquareOutIcon weight="bold" className="card-link-icon" />
                      </a>
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
      </div>
    </>
  );
}

export const ResourceCard = memo(ResourceCardComponent);
export default ResourceCard;
