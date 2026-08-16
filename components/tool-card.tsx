"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { ResourceDialog } from "@/components/resource-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { cn, getCategoryColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function CardBody({ onTagClick, tool }: ToolCardProps) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getCategoryColor(tool.category);

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

  return (
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

          {tool.tags && tool.tags.length > 0 && (
            <div className="card-tags flex flex-wrap gap-1 pt-2">
              {tool.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    if (onTagClick) {
                      e.stopPropagation();
                      onTagClick(tag);
                    }
                  }}
                  className="text-mono-2xs text-ink-mute hover:text-ink hover:border-ink/50 border-ink/20 inline-flex items-center border px-1 py-0.2 font-mono transition-colors"
                >
                  #{tag}
                </button>
              ))}
              {tool.tags.length > 3 && (
                <span className="text-mono-2xs text-ink-mute/60 self-center font-mono">
                  +{tool.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {!isInternal && (
            <div className="card-footer">
              {tool.author ? (
                <span className="card-author">{tool.author}</span>
              ) : (
                <div aria-hidden="true" />
              )}
              {!isInternal && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/arrow"
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
          )}
        </div>
      </div>
    </article>
  );
}

export default function ToolCard({ onTagClick, tool }: ToolCardProps) {
  const [open, setOpen] = useState(false);
  const linkWrapperClass =
    "block w-full h-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-left";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={linkWrapperClass}>
        <CardBody tool={tool} onTagClick={onTagClick} />
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={linkWrapperClass}>
          <CardBody tool={tool} onTagClick={onTagClick} />
        </div>
      </DialogTrigger>
      <ResourceDialog
        key={`${tool.url || tool.title}-${open}`}
        tool={tool}
        onTagClick={(tag) => {
          setOpen(false);
          onTagClick?.(tag);
        }}
      />
    </Dialog>
  );
}
