"use client";

import { ArrowSquareOutIcon, BookmarkSimpleIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { memo, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { CardIcon } from "@/components/card-icon";
import { ResourceDialog } from "@/components/resource-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { cn, getCategoryColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function CardBody({ tool }: ToolCardProps) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getCategoryColor(tool.category);
  const { data: session } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(tool);

  let toolNumber = "";
  if (isInternal) {
    const totalTools = internalTools.length;
    const toolIndex = internalTools.findIndex((t) => t.slug === tool.slug);
    if (toolIndex !== -1) {
      const currentNumber = String(toolIndex + 1).padStart(2, "0");
      const totalFormatted = String(totalTools).padStart(2, "0");
      toolNumber = `${currentNumber}/${totalFormatted}`;
    }
  }

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      setAuthModalOpen(true);
      return;
    }
    toggleBookmark(tool);
  };


  return (
    <>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <article className={cn("card group", colorClasses)} role="button" tabIndex={0}>
        <div className="card-inner">
          <div className="card-face">
            <div className="card-header">
              <span className="card-meta">
                {tool.category}
                {isInternal && (
                  <>
                    <span className="card-meta-sep">·</span>
                    <span>{toolNumber}</span>
                  </>
                )}
              </span>

              {isInternal ? (
                <div className="bg-background text-foreground card-icon-box">
                  <Icon className="card-icon" />
                </div>
              ) : (
                <CardIcon alt={tool.title} className={tool.className} favicon={tool.favicon} />
              )}
            </div>

            <h3 className="card-title">{tool.title}</h3>

            {tool.subtitle && <p className="card-subtitle">{tool.subtitle}</p>}
            <p className="card-description">{tool.description}</p>

            <div className="card-footer">
              {tool.author ? (
                <span className="card-author">{tool.author}</span>
              ) : (
                <div aria-hidden="true" />
              )}
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="group/bookmark border-none bg-transparent text-current hover:bg-transparent"
                        onClick={handleBookmarkClick}
                        aria-label={bookmarked ? "Remove" : "Save"}
                      >
                        <BookmarkSimpleIcon
                          weight={bookmarked ? "fill" : "bold"}
                          className={cn(
                            "size-5 transition-transform group-hover/bookmark:scale-110",
                            bookmarked ? "fill-current text-current" : "",
                          )}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{bookmarked ? "Remove" : "Save"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {!isInternal && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/arrow p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowSquareOutIcon weight="bold" className="card-link-icon" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open in new tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}



function ToolCardComponent({ onTagClickAction, tool }: ToolCardProps) {
  const [open, setOpen] = useState(false);
  const linkWrapperClass =
    "block w-full h-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-left";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={linkWrapperClass}>
        <CardBody tool={tool} />
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={linkWrapperClass}>
          <CardBody tool={tool} />
        </div>
      </DialogTrigger>
      {open && (
        <ResourceDialog
          key={`${tool.url || tool.title}-${open}`}
          tool={tool}
          onTagClickAction={(tag) => {
            setOpen(false);
            onTagClickAction?.(tag);
          }}
        />
      )}
    </Dialog>
  );
}

const ToolCard = memo(ToolCardComponent);
export default ToolCard;
