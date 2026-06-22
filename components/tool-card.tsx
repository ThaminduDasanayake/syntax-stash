"use client";

import { ArrowSquareOutIcon, ToolboxIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { CardIcon } from "@/components/card-icon";
import { ResourceDialog } from "@/components/resource-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { iconMap } from "@/lib/icons";
import { cn, getAlternatingColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

function CardBody({ tool, index }: ToolCardProps & { index?: number }) {
  const isInternal = !!tool.slug;
  const Icon = (tool.icon && iconMap[tool.icon]) || ToolboxIcon;
  const colorClasses = getAlternatingColor(tool.title, index);

  return (
    <article className={cn("card group", colorClasses)} role="button" tabIndex={0}>
      <div className="card-inner">
        <div className="card-face">
          <div className="card-header">
            <span className="card-meta">{tool.category}</span>

            {isInternal ? (
              <div className="bg-background text-foreground card-icon-box">
                <Icon className="card-icon" />
              </div>
            ) : (
              <CardIcon
                url={tool.url!}
                alt={tool.title}
                className={tool.className}
                explicitFavicon={tool.favicon}
              />
            )}
          </div>

          <h3 className="card-title">{tool.title}</h3>

          <p className="card-description">{tool.description}</p>

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

export default function ToolCard({ tool, index }: ToolCardProps & { index?: number }) {
  const linkWrapperClass =
    "block w-full h-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary text-left";

  if (tool.slug) {
    return (
      <Link href={`/tools/${tool.slug}`} className={linkWrapperClass}>
        <CardBody tool={tool} index={index} />
      </Link>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={linkWrapperClass}>
          <CardBody tool={tool} index={index} />
        </div>
      </DialogTrigger>
      <ResourceDialog tool={tool} index={index} />
    </Dialog>
  );
}
