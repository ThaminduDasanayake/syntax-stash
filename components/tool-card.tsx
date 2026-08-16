"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { memo, useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { ResourceDialog } from "@/components/resource-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { iconMap } from "@/lib/icons";
import { internalTools } from "@/lib/tools-data";
import { cn, getCategoryColor, getCategoryTheme, THEME_CONFIG } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function CardBody({ onTagClick, tool }: ToolCardProps) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getCategoryColor(tool.category);
  const theme = getCategoryTheme(tool.category);
  const themeConfig = THEME_CONFIG[theme];
  const deepColorClass = themeConfig.label;
  const deepBorderClass = themeConfig.border;
  const softColorClass = themeConfig.soft;

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
            <div className="card-tags flex flex-wrap items-center gap-1.5 pt-2.5">
              {tool.tags.slice(0, 3).map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="xs"
                  onClick={(e) => {
                    if (onTagClick) {
                      e.stopPropagation();
                      onTagClick(tag);
                    }
                  }}
                  className={cn(
                    "text-mono-2xs h-5.5 rounded-none border-[1.5px] px-1.5 py-0 font-mono font-bold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs",
                    deepColorClass,
                    deepBorderClass,
                    softColorClass,
                  )}
                >
                  #{tag}
                </Button>
              ))}
              {tool.tags.length > 3 && (
                <span
                  className={cn(
                    "text-mono-2xs self-center font-mono font-semibold opacity-75",
                    deepColorClass,
                  )}
                >
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

function ToolCardComponent({ onTagClick, tool }: ToolCardProps) {
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
      {open && (
        <ResourceDialog
          key={`${tool.url || tool.title}-${open}`}
          tool={tool}
          onTagClick={(tag) => {
            setOpen(false);
            onTagClick?.(tag);
          }}
        />
      )}
    </Dialog>
  );
}

const ToolCard = memo(ToolCardComponent);
export default ToolCard;
