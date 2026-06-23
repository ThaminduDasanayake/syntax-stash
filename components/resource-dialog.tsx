"use client";

import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { resourceLinks } from "@/lib/resource-data";
import { cn, getAlternatingColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

export function ResourceDialog({ tool, index }: ToolCardProps & { index?: number }) {
  const colorClasses = getAlternatingColor(tool.title, index);

  const relatedResources = React.useMemo(() => {
    if (tool.related && tool.related.length > 0) {
      return resourceLinks.filter((r) => tool.related!.includes(r.title));
    }

    return resourceLinks
      .filter((r) => r.category === tool.category && r.title !== tool.title)
      .slice(0, 3);
  }, [tool]);

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
        Details and documentation for {tool.title} — categorized under {tool.category}.
      </DialogDescription>

      <div className="modal-body">
        {/* Left Side */}
        <div className={cn("modal-left", colorClasses)}>
          <div className="modal-cat-label">
            <div className="flex items-center gap-2">
              <span className="modal-cat-dot"></span>
              <Link href={`/resources/${tool.category}`} className="modal-cat-name modal-cat-link">
                {tool.category}
              </Link>
            </div>

            <CardIcon
              url={tool.url!}
              alt={tool.title}
              className={tool.className}
              explicitFavicon={tool.favicon}
            />
          </div>

          <DialogTitle className="modal-title">{tool.title}</DialogTitle>

          {tool.subtitle && <p className="modal-subtitle">{tool.subtitle}</p>}
          <p className="modal-description">{tool.description}</p>
          <p className="modal-author">
            <a
              href={tool.authorLink}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-author-link"
            >
              {tool.author}
            </a>
          </p>
        </div>

        {/* Right Side */}
        <div className="modal-right">
          <div className="modal-content">
            <div className="modal-sections">
              {tool.details?.map(({ title, content }, index) => (
                <div key={index} className="modal-section">
                  <h3 className="modal-section-heading">{title}</h3>
                  <p className="modal-section-body">{content}</p>
                </div>
              ))}
              <div className="flex gap-2">
                {tool.tags?.map((tag) => (
                  <div key={tag} className="text-mono-2xs border px-1 py-0.5 hover:shadow-sm">
                    # {tag}
                  </div>
                ))}
              </div>
            </div>

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

          <div className="modal-launch">
            <Button asChild>
              <a
                href={tool.url}
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
              <Button variant="secondary" size="icon">
                <CaretLeftIcon />
              </Button>
              <Button variant="secondary" size="icon">
                <CaretRightIcon />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
