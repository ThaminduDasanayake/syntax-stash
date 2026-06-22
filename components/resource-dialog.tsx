"use client";

import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { DialogClose, DialogContent, DialogTitle as UIDialogTitle } from "@/components/ui/dialog";
import { cn, getAlternatingColor } from "@/lib/utils";
import { ToolCardProps } from "@/types";

export function ResourceDialog({ tool, index }: ToolCardProps & { index?: number }) {
  const colorClasses = getAlternatingColor(tool.title, index);

  return (
    <DialogContent showCloseButton={false} className="modal-panel">
      {/* flex flex-col gap-0 overflow-hidden border-2 p-0 ring-0 sm:max-w-4xl md:flex-row */}
      <div className="modal-top-actions">
        <DialogClose asChild>
          <Button variant="secondary" size="icon">
            <XIcon weight="bold" />
          </Button>
        </DialogClose>
      </div>
      <div className="modal-body">
        {/* Left Side */}
        {/* flex flex-col justify-between p-8 md:w-1/2 md:shrink-0 */}
        <div className={cn("modal-left", colorClasses)}>
          <div className="modal-cat-label">
            <span className="modal-cat-dot"></span>
            <Link href="/" className="modal-cat-name modal-cat-link">
              {tool.category}
            </Link>
          </div>

          <UIDialogTitle className="modal-title">{tool.title}</UIDialogTitle>

          <p className="modal-description">{tool.subtitle}</p>
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
        {/* bg-paper relative flex flex-col p-8 md:w-1/2 */}
        <div className="modal-right">
          <div className="modal-content">
            <p>{tool.description}</p>
          </div>

          <div className="modal-launch">
            <Button asChild>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-console w-full"
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
      {/*<div>*/}
      {/*  <div className="mb-8 flex items-center justify-between">*/}
      {/*    <span className="text-telemetry font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">*/}
      {/*      {tool.category}*/}
      {/*    </span>*/}
      {/*    <CardIcon*/}
      {/*      url={tool.url!}*/}
      {/*      alt={tool.title}*/}
      {/*      className={tool.className}*/}
      {/*      explicitFavicon={tool.favicon}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*  <UIDialogTitle className="font-display mb-6 text-4xl leading-[0.9] font-black tracking-tighter uppercase sm:text-5xl">*/}
      {/*    {tool.title}*/}
      {/*  </UIDialogTitle>*/}
      {/*  <UIDialogDescription className="font-sans text-base leading-relaxed font-medium text-inherit opacity-90">*/}
      {/*    {tool.description}*/}
      {/*  </UIDialogDescription>*/}
      {/*</div>*/}
      {/*{tool.author && (*/}
      {/*  <div className="mt-12 font-mono text-[10px] font-bold tracking-widest uppercase opacity-70">*/}
      {/*    {tool.author}*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*<div className="min-h-[300px] flex-1 overflow-y-auto">*/}
      {/*  {tool.details && tool.details.length > 0 ? (*/}
      {/*    <div className="flex flex-col gap-8 pt-4">*/}
      {/*      {tool.details.map((detail, i) => (*/}
      {/*        <div key={i}>*/}
      {/*          <h4 className="text-c-orange mb-3 font-mono text-[10px] font-bold tracking-widest uppercase">*/}
      {/*            {detail.title}*/}
      {/*          </h4>*/}
      {/*          <p className="text-ink font-sans text-sm leading-relaxed font-medium opacity-90">*/}
      {/*            {detail.content}*/}
      {/*          </p>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  ) : (*/}
      {/*    <div className="flex h-full items-center justify-center opacity-50">*/}
      {/*      <p className="font-mono text-sm tracking-widest uppercase">No additional details</p>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
      {/*/!* Footer of the right side *!/*/}
      {/*<div className="border-ink/10 mt-8 flex items-center justify-between border-t-2 pt-6">*/}
      {/*  <div className="flex flex-wrap gap-2">*/}
      {/*    {tool.tags?.map((tag) => (*/}
      {/*      <span*/}
      {/*        key={tag}*/}
      {/*        className="text-ink border border-current/20 bg-current/5 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase"*/}
      {/*      >*/}
      {/*        {tag}*/}
      {/*      </span>*/}
      {/*    ))}*/}
      {/*  </div>*/}

      {/*</div>*/}
    </DialogContent>
  );
}
