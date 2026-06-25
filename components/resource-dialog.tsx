"use client";

import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { resourceLinks } from "@/lib/resource-data";
import { cn, getResourceColorByKey, getResourceKeyFromValue } from "@/lib/utils";
import { ToolCardProps } from "@/types";

export function ResourceDialog({ tool }: ToolCardProps) {
  const [activeTool, setActiveTool] = React.useState(tool);

  React.useEffect(() => {
    setActiveTool(tool);
  }, [tool]);

  const currentIndex = React.useMemo(() => {
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

  const authorResources = React.useMemo(() => {
    if (!activeTool.author) return [];
    return resourceLinks.filter(
      (r) => r.author === activeTool.author && r.title !== activeTool.title,
    );
  }, [activeTool]);

  const relatedResources = React.useMemo(() => {
    let baseRelated = [];
    if (activeTool.related && activeTool.related.length > 0) {
      baseRelated = resourceLinks.filter((r) => activeTool.related!.includes(r.title));
    } else {
      baseRelated = resourceLinks
        .filter((r) => r.category === activeTool.category && r.title !== activeTool.title)
        .slice(0, 3);
    }
    return baseRelated.filter((r) => !authorResources.some((ar) => ar.title === r.title));
  }, [activeTool, authorResources]);

  return (
    <DialogContent showCloseButton={false} className="modal-panel">
      <div className="modal-top-actions">
        <DialogClose asChild>
          <Button variant="secondary" size="icon">
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
              <span className="modal-cat-dot"></span>
              <Link
                href={`/resources/${activeTool.category}`}
                className="modal-cat-name modal-cat-link"
              >
                {activeTool.category}
              </Link>
            </div>

            <CardIcon
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
              <div className="mt-12">
                <h4 className="text-mono-2xs text-c-blue mb-4 font-extrabold tracking-wider uppercase">
                  More by {activeTool.author}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {authorResources.map((res, i) => {
                    const colors = ["bg-c-blue", "bg-c-orange", "bg-c-pink", "bg-c-green"];
                    const dotColor = colors[i % colors.length];
                    return (
                      <div
                        key={res.title}
                        onClick={() => setActiveTool(res)}
                        className="border-ink text-mono-xs bg-paper flex cursor-pointer items-center gap-2 border px-3 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                      >
                        <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
                        {res.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Section */}
            {relatedResources.length > 0 && (
              <div className="mt-12">
                <h4 className="text-mono-2xs text-c-green mb-4">RELATED</h4>
                <div className="flex flex-wrap gap-3">
                  {relatedResources.map((res, i) => {
                    const colors = ["bg-c-blue", "bg-c-orange", "bg-c-pink", "bg-c-green"];
                    const dotColor = colors[i % colors.length];
                    return (
                      <div
                        key={res.title}
                        onClick={() => setActiveTool(res)}
                        className="border-ink text-mono-xs bg-paper flex cursor-pointer items-center gap-2 border px-3 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
                      >
                        <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
                        {res.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="modal-link">
            <span className="modal-section-heading">RESOURCE URL</span>
            <a
              href={activeTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs break-all underline decoration-current/40 underline-offset-2 transition-all duration-150 ease-out hover:decoration-current"
            >
              {activeTool.url}
            </a>
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
