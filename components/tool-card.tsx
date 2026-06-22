"use client";

import { ArrowSquareOutIcon, ToolboxIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";

import { CardIcon } from "@/components/card-icon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription as UIDialogDescription,
  DialogTitle as UIDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const colorClasses = getAlternatingColor(tool.title, index);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={linkWrapperClass}>
          <CardBody tool={tool} index={index} />
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="border-ink bg-background flex flex-col gap-0 overflow-hidden border-2 p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-0 sm:max-w-4xl md:flex-row"
      >
        {/* Left Side */}
        <div className={`flex flex-col justify-between p-8 md:w-1/2 md:shrink-0 ${colorClasses}`}>
          <div>
            <div className="mb-8 flex items-center justify-between">
              <span className="text-telemetry font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
                {tool.category}
              </span>
              <CardIcon
                url={tool.url!}
                alt={tool.title}
                className={tool.className}
                explicitFavicon={tool.favicon}
              />
            </div>

            <UIDialogTitle className="font-display mb-6 text-4xl leading-[0.9] font-black tracking-tighter uppercase sm:text-5xl">
              {tool.title}
            </UIDialogTitle>

            <UIDialogDescription className="font-sans text-base leading-relaxed font-medium text-inherit opacity-90">
              {tool.description}
            </UIDialogDescription>
          </div>

          {tool.author && (
            <div className="mt-12 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">
              {tool.author}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="bg-paper relative flex flex-col p-8 md:w-1/2">
          <DialogClose asChild>
            <button className="border-ink bg-paper hover:bg-muted focus-visible:ring-ink absolute top-4 right-4 z-10 border-2 p-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
              <XIcon weight="bold" className="size-4" />
            </button>
          </DialogClose>

          <div className="min-h-[300px] flex-1 overflow-y-auto">
            {tool.details && tool.details.length > 0 ? (
              <div className="flex flex-col gap-8 pt-4">
                {tool.details.map((detail, i) => (
                  <div key={i}>
                    <h4 className="text-c-orange mb-3 font-mono text-[10px] font-bold tracking-widest uppercase">
                      {detail.title}
                    </h4>
                    <p className="text-ink font-sans text-sm leading-relaxed font-medium opacity-90">
                      {detail.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center opacity-50">
                <p className="font-mono text-sm tracking-widest uppercase">No additional details</p>
              </div>
            )}
          </div>

          {/* Footer of the right side */}
          <div className="border-ink/10 mt-8 flex items-center justify-between border-t-2 pt-6">
            <div className="flex flex-wrap gap-2">
              {tool.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-ink border border-current/20 bg-current/5 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-ink bg-c-blue text-paper focus-visible:ring-ink flex shrink-0 items-center gap-2 border-2 px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase transition-transform outline-none hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Launch <ArrowSquareOutIcon weight="bold" className="size-4" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
