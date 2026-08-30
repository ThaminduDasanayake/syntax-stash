"use client";

import { BookmarkSimpleIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { memo, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { cn, getCategoryColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function ToolCardComponent({
  isBookmarked: propIsBookmarked,
  onToggleBookmark: propOnToggleBookmark,
  tool,
}: ToolCardProps) {
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getCategoryColor(tool.category, "tool");
  const { data: session } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isBookmarked: hookIsBookmarked, toggleBookmark: hookToggleBookmark } = useBookmarks();
  const bookmarked = propIsBookmarked !== undefined ? propIsBookmarked : hookIsBookmarked(tool);
  const toggle = propOnToggleBookmark || hookToggleBookmark;
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  const totalTools = internalTools.length;
  const toolIndex = internalTools.findIndex((t) => t.slug === tool.slug);
  const currentNumber = toolIndex !== -1 ? String(toolIndex + 1).padStart(2, "0") : "01";
  const totalFormatted = String(totalTools).padStart(2, "0");
  const toolNumber = `${currentNumber}/${totalFormatted}`;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      setAuthModalOpen(true);
      return;
    }
    toggle(tool);
  };

  return (
    <>
      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
      <Link
        href={`/tools/${tool.slug}`}
        className="focus-visible:outline-primary block h-full w-full cursor-pointer text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <article className={cn("card group", colorClasses)}>
          <div className="card-inner">
            <div className="card-face">
              <div className="card-header">
                <span className="card-meta">
                  {tool.category}
                  <span className="card-meta-sep">·</span>
                  <span>{toolNumber}</span>
                </span>

                <div className="bg-background text-foreground card-icon-box">
                  <Icon className="card-icon" />
                </div>
              </div>

              <h3 className="card-title">{tool.title}</h3>

              <p className="card-description">{tool.description}</p>

              <div className="card-footer">
                {tool.highlight ? (
                  <span className="card-author">{tool.highlight}</span>
                ) : (
                  <div aria-hidden="true" />
                )}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className={cn(
                          "group/bookmark border-none bg-transparent text-current transition-opacity duration-200 hover:bg-transparent",
                          bookmarked ? "opacity-100" : "opacity-80 group-hover:opacity-100",
                        )}
                        onMouseEnter={() => setIsBookmarkHovered(true)}
                        onMouseLeave={() => setIsBookmarkHovered(false)}
                        onClick={handleBookmarkClick}
                        aria-label={bookmarked ? "Remove" : "Save"}
                      >
                        <BookmarkSimpleIcon
                          weight={bookmarked ? "fill" : isBookmarkHovered ? "duotone" : "bold"}
                          className={cn(
                            "size-5 transition-transform group-hover/bookmark:scale-110",
                            bookmarked ? "fill-current text-current opacity-100" : "",
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{bookmarked ? "Remove" : "Save"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}

export const ToolCard = memo(ToolCardComponent);
export default ToolCard;
