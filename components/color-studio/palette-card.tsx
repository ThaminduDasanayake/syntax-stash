"use client";

import { BookmarkSimpleIcon, BracketsCurlyIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import React, { memo, useState } from "react";

import { Palette } from "@/app/tools/color-studio/palette-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PaletteCardProps {
  palette: Palette;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  copiedItem: string | null;
  onCopySwatch: (hex: string, swatchKey: string) => void;
}

function PaletteCardComponent({
  copiedItem,
  isBookmarked,
  onCopySwatch,
  onToggleBookmark,
  palette,
}: PaletteCardProps) {
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  const cssLines = palette.colors
    .map((c) => `  --${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
    .join("\n");

  const tailwindLines = palette.colors
    .map((c) => `  --color-${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
    .join("\n");

  const combinedCode = `:root {\n${cssLines}\n}\n\n@theme inline {\n${tailwindLines}\n}`;

  return (
    <Card className="group relative flex flex-col rounded-2xl border-[1.5px] border-white/8 bg-[#18181b] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-white/18">
      <CardHeader className="mb-3.5 flex items-center justify-between p-0">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate font-mono text-base font-bold tracking-tight text-white">
            {palette.name}
          </h3>
          <span className="text-muted-foreground font-mono text-xs font-semibold">
            {palette.colors.length} colors
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Bookmark Button (Matching ResourceCard action button) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex size-7 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-white/8 bg-white/4 text-zinc-500 transition-all duration-150 hover:border-white/18 hover:bg-white/8 hover:text-white active:scale-95",
                  isBookmarked && "border-primary/40 bg-primary/15 text-primary",
                )}
                onMouseEnter={() => setIsBookmarkHovered(true)}
                onMouseLeave={() => setIsBookmarkHovered(false)}
                onClick={onToggleBookmark}
                aria-label={
                  isBookmarked
                    ? `Remove ${palette.name} from saved`
                    : `Save ${palette.name} to bookmarks`
                }
              >
                <BookmarkSimpleIcon
                  weight={isBookmarked ? "fill" : isBookmarkHovered ? "duotone" : "bold"}
                  className="size-3.5"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{isBookmarked ? "Remove bookmark" : "Save bookmark"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Export Code Dialog */}
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex size-7 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-white/8 bg-white/4 text-zinc-500 transition-all duration-150 hover:border-white/18 hover:bg-white/8 hover:text-white active:scale-95"
                    aria-label="Export CSS code"
                  >
                    <BracketsCurlyIcon weight="bold" className="size-3.5" />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Export code</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-mono-sm">
                  Palette name: &quot;{palette.name}&quot;
                </DialogTitle>
              </DialogHeader>
              <div className="bg-card overflow-hidden border-2">
                <div className="bg-muted/30 flex items-center justify-between border-b-2 px-4 py-2">
                  <h4 className="text-mono-xs">{"//"} Combined CSS Properties</h4>
                  <CopyButton iconOnly textToCopy={combinedCode} />
                </div>
                <div className="max-h-[50vh] overflow-x-auto p-4">
                  <pre className="text-foreground font-mono text-xs leading-relaxed">
                    <code>{combinedCode}</code>
                  </pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {/* Dynamic Bento Box Layout inside the Card with unified rounded-xl stage */}
      <CardContent className="flex-1 p-0">
        <div className="relative w-full overflow-hidden rounded-xl border-[1.5px] border-white/10 transition-all duration-300 group-hover:border-white/18">
          <div className="grid min-h-48 flex-1 grid-cols-3 grid-rows-3 gap-px bg-white/10">
            {palette.colors.map((color, i) => {
              const swatchKey = `${palette.name}-${color.hex}-${i}`;
              const isCopied = copiedItem === swatchKey;

              return (
                <div
                  key={i}
                  onClick={() => onCopySwatch(color.hex, swatchKey)}
                  title={`Click to copy ${color.hex}`}
                  className={cn(
                    "group/swatch relative flex min-h-24 cursor-pointer flex-col justify-between p-3 font-mono transition-all duration-150 select-none hover:brightness-105 active:scale-[0.99]",
                    color.textColor === "black" ? "text-black" : "text-white",
                    color.colSpan,
                  )}
                  style={{
                    backgroundColor: color.hex,
                  }}
                >
                  <div className="text-sm font-bold tracking-tight">{color.name}</div>
                  <div className="mt-6 flex items-center justify-between font-mono text-xs font-bold opacity-80 group-hover/swatch:opacity-100">
                    <span>{isCopied ? "Copied!" : color.hex}</span>
                    {isCopied ? (
                      <CheckIcon weight="bold" className="size-3.5" />
                    ) : (
                      <CopyIcon
                        weight="bold"
                        className="size-3 opacity-0 transition-opacity group-hover/swatch:opacity-80"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const PaletteCard = memo(PaletteCardComponent);
