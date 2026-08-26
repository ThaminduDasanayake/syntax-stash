"use client";

import { ArrowSquareOutIcon, BookmarkSimpleIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { CopyButton } from "@/components/ui/copy-button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { resourceLinks } from "@/lib/resource-data";
import { cn, getCategoryTheme, THEME_CONFIG } from "@/lib/utils";
import { Tool, ToolCardProps } from "@/types";

export function ResourceDialog({ onTagClickAction, tool }: ToolCardProps) {
  const [activeTool, setActiveTool] = useState(tool);
  const [ogError, setOgError] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(activeTool);


  const handleSelectTool = (res: Tool) => {
    setOgError(false);
    setActiveTool(res);
  };

  const currentIndex = useMemo(() => {
    return resourceLinks.findIndex((r) => r.title === activeTool.title);
  }, [activeTool]);

  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % resourceLinks.length;
    handleSelectTool(resourceLinks[nextIndex]);
  };

  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + resourceLinks.length) % resourceLinks.length;
    handleSelectTool(resourceLinks[prevIndex]);
  };

  const activeTheme = getCategoryTheme(activeTool.category);
  const activeThemeStyles = THEME_CONFIG[activeTheme];
  const colorClasses = activeThemeStyles.bg;

  const authorResources = useMemo(() => {
    if (!activeTool.author) return [];
    return resourceLinks.filter(
      (r) => r.author === activeTool.author && r.title !== activeTool.title,
    );
  }, [activeTool]);

  const relatedResources = useMemo(() => {
    const activeTags = activeTool.tags || [];
    const scoredResources = resourceLinks
      .filter(
        (r) => r.title !== activeTool.title && !authorResources.some((ar) => ar.title === r.title),
      )
      .map((r) => {
        const resourceTags = r.tags || [];
        const intersection = resourceTags.filter((tag) => activeTags.includes(tag));
        // Add a slight boost if they share the same category
        const categoryBoost = r.category === activeTool.category ? 0.5 : 0;
        return {
          resource: r,
          score: intersection.length + categoryBoost,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.resource);

    if (scoredResources.length === 0) {
      return resourceLinks
        .filter(
          (r) =>
            r.category === activeTool.category &&
            r.title !== activeTool.title &&
            !authorResources.some((ar) => ar.title === r.title),
        )
        .slice(0, 3);
    }

    return scoredResources;
  }, [activeTool, authorResources]);

  return (
    <DialogContent showCloseButton={false} className="modal-panel">
      <div className="modal-top-actions">
        <DialogClose asChild>
          <Button variant="secondary" size="icon" className="border-[1.5px]">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>

      <DialogDescription className="sr-only">
        Details and documentation for {activeTool.title} — categorized under {activeTool.category}.
      </DialogDescription>

      <div className="modal-body">
        {/* Left Side */}
        <div className={cn("modal-left", colorClasses)}>
          <div className="modal-cat-label">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "modal-cat-dot",
                  colorClasses.includes("bg-c-blue") ? "bg-background" : "bg-foreground",
                )}
              ></span>
              <Link
                href={`/resources/${activeTool.category}`}
                className="modal-cat-name modal-cat-link"
              >
                {activeTool.category}
              </Link>
            </div>

            <CardIcon
              key={activeTool.url}
              alt={activeTool.title}
              className={activeTool.className}
              favicon={activeTool.favicon}
            />
          </div>

          <DialogTitle className="modal-title">{activeTool.title}</DialogTitle>

          {activeTool.subtitle && <p className="modal-subtitle">{activeTool.subtitle}</p>}
          <p className="modal-description">{activeTool.description}</p>

          {activeTool.author && (
            <p className="modal-author">
              <a
                href={activeTool.authorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-author-link"
              >
                {activeTool.author}
              </a>
            </p>
          )}
        </div>

        {/* Right Side */}
        <div className="modal-right">
          <div className="modal-content">
            {activeTool.ogImage && !ogError && (
              <div className="mb-5.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeTool.ogImage}
                  alt={activeTool.title}
                  className="h-auto w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setOgError(true)}
                />
              </div>
            )}

            <div className="modal-link">
              <span className={cn("modal-heading", activeThemeStyles.label)}>Resource UrL</span>
              <a
                href={activeTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
              >
                {activeTool.url}
              </a>
            </div>

            {activeTool.tags && activeTool.tags.length > 0 && (
              <div className="modal-sections">
                <div className="flex flex-wrap gap-1.5">
                  {activeTool.tags.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="xs"
                      onClick={() => onTagClickAction?.(tag)}
                      className={cn(
                        "text-mono-xs h-6 rounded-none border-[1.5px] px-2 py-0 font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs",
                        activeThemeStyles.label,
                        activeThemeStyles.border,
                        activeThemeStyles.soft,
                      )}
                      title={`Filter by #${tag}`}
                    >
                      #{tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Author Resources Section */}
            {authorResources.length > 0 && (
              <div className="mb-5.5">
                <span className={cn("modal-heading", activeThemeStyles.label)}>
                  More by {activeTool.author}
                </span>
                <div className="modal-related-chips">
                  {authorResources.map((res) => {
                    const styles = THEME_CONFIG[getCategoryTheme(res.category)];
                    return (
                      <button
                        key={res.title}
                        onClick={() => handleSelectTool(res)}
                        className={cn("modal-related-chip group", styles.chip)}
                      >
                        <span className={cn("modal-chip-dot", styles.dot)} />
                        {res.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Section */}
            {relatedResources.length > 0 && (
              <div>
                <span className={cn("modal-heading", activeThemeStyles.label)}>Related</span>
                <div className="modal-related-chips">
                  {relatedResources.map((res) => {
                    const styles = THEME_CONFIG[getCategoryTheme(res.category)];
                    return (
                      <button
                        key={res.url || res.title}
                        onClick={() => handleSelectTool(res)}
                        className={cn("modal-related-chip group", styles.chip)}
                      >
                        <span className={cn("modal-chip-dot", styles.dot)} />
                        {res.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-launch flex items-center gap-2">
            <Button asChild size="sm" className="flex-1">
              <a
                href={activeTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono-xs w-full border-[1.5px]"
              >
                Open resource <ArrowSquareOutIcon weight="bold" />
              </a>
            </Button>
            <Button
              variant={bookmarked ? "default" : "secondary"}
              size="sm"
              onClick={() => toggleBookmark(activeTool)}
              className="shrink-0 border-[1.5px]"
            >
              <BookmarkSimpleIcon weight={bookmarked ? "fill" : "bold"} className="size-4" />
              {bookmarked ? "Saved" : "Save"}
            </Button>

            <CopyButton
              textToCopy={activeTool.url || ""}
              labelName="Copy Link"
              variant="secondary"
              size="sm"
              className="shrink-0 border-[1.5px]"
            />
          </div>


          <div className="modal-nav-row">
            <ButtonGroup>
              <Button variant="secondary" size="icon" onClick={handlePrev}>
                <CaretLeftIcon />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleNext}>
                <CaretRightIcon />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
