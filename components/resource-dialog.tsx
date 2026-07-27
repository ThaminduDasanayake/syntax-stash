"use client";

import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { resourceLinks } from "@/lib/resource-data";
import {
  cn,
  getResourceColorByKey,
  getResourceKeyFromValue,
  getResourceThemeByKey,
  RESOURCE_THEME_STYLES,
} from "@/lib/utils";
import { ToolCardProps } from "@/types";

export function ResourceDialog({ tool }: ToolCardProps) {
  const [activeTool, setActiveTool] = useState(tool);
  const [ogError, setOgError] = useState(false);

  useEffect(() => {
    setActiveTool(tool);
  }, [tool]);

  useEffect(() => {
    setOgError(false);
  }, [activeTool]);

  const currentIndex = useMemo(() => {
    return resourceLinks.findIndex((r) => r.title === activeTool.title);
  }, [activeTool]);

  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % resourceLinks.length;
    setActiveTool(resourceLinks[nextIndex]);
  };

  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + resourceLinks.length) % resourceLinks.length;
    setActiveTool(resourceLinks[prevIndex]);
  };

  const key = getResourceKeyFromValue(activeTool.category);
  const colorClasses = getResourceColorByKey(key);

  const authorResources = useMemo(() => {
    if (!activeTool.author) return [];
    return resourceLinks.filter(
      (r) => r.author === activeTool.author && r.title !== activeTool.title,
    );
  }, [activeTool]);

  const relatedResources = useMemo(() => {
    // 1. Explicitly Defined Related Resources
    if (activeTool.related && activeTool.related.length > 0) {
      const explicitRelated = resourceLinks.filter((r) => activeTool.related!.includes(r.title));
      return explicitRelated.filter((r) => !authorResources.some((ar) => ar.title === r.title));
    }

    // 2. Tag Intersection Algorithm
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

    // 3. Fallback (if no tags match, pick 3 from same category)
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
              url={activeTool.url!}
              alt={activeTool.title}
              className={activeTool.className}
              explicitFavicon={activeTool.favicon}
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
                <img
                  src={activeTool.ogImage}
                  alt={activeTool.title}
                  className="h-auto w-full"
                  loading="lazy"
                  onError={() => setOgError(true)}
                />
              </div>
            )}

            <div className="modal-link">
              <span className="modal-section-heading">Resource UrL</span>
              <a
                href={activeTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
              >
                {activeTool.url}
              </a>
            </div>

            <div className="modal-sections">
              {activeTool.details?.map(({ title, content }, index) => (
                <div key={index} className="modal-section">
                  <h3 className="modal-section-heading">{title}</h3>
                  <p className="modal-section-body">{content}</p>
                </div>
              ))}
              <div className="flex gap-2">
                {activeTool.tags?.map((tag) => (
                  <div key={tag} className="text-mono-2xs border px-1 py-0.5 hover:shadow-sm">
                    # {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Author Resources Section */}
            {authorResources.length > 0 && (
              <div className="mb-5.5">
                <span className="modal-related-label">More by {activeTool.author}</span>
                <div className="modal-related-chips">
                  {authorResources.map((res) => {
                    const key = getResourceKeyFromValue(res.category);
                    const theme = getResourceThemeByKey(key);
                    const styles = RESOURCE_THEME_STYLES[theme];
                    return (
                      <button
                        key={res.title}
                        onClick={() => setActiveTool(res)}
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
                <span className="modal-related-label">Related</span>
                <div className="modal-related-chips">
                  {relatedResources.map((res) => {
                    const key = getResourceKeyFromValue(res.category);
                    const theme = getResourceThemeByKey(key);
                    const styles = RESOURCE_THEME_STYLES[theme];
                    return (
                      <button
                        key={res.url || res.title}
                        onClick={() => setActiveTool(res)}
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

          <div className="modal-launch">
            <Button asChild>
              <a
                href={activeTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono-xs w-full"
              >
                Open resource <ArrowSquareOutIcon weight="bold" />
              </a>
            </Button>
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
