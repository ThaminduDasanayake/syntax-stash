"use client";

import { BookmarkSimpleIcon, BracketsCurlyIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import React, { memo } from "react";

import { Palette } from "@/app/tools/color-studio/palette-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const cssLines = palette.colors
    .map((c) => `  --${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
    .join("\n");

  const tailwindLines = palette.colors
    .map((c) => `  --color-${c.name.toLowerCase().replace(/\s+/g, "-")}: ${c.hex};`)
    .join("\n");

  const combinedCode = `:root {\n${cssLines}\n}\n\n@theme inline {\n${tailwindLines}\n}`;

  return (
    <Card className="hover:ring-muted-foreground transform ring-2 duration-200 hover:-translate-y-1 hover:scale-100">
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-lg font-bold tracking-tight">{palette.name}</h3>
          <span className="text-muted-foreground font-mono text-xs font-semibold">
            {palette.colors.length} colors
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Bookmark Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleBookmark}
            title={isBookmarked ? "Remove from Color Palettes" : "Save to Color Palettes"}
            aria-label={isBookmarked ? `Unbookmark ${palette.name}` : `Bookmark ${palette.name}`}
            className={cn(
              "h-8 cursor-pointer gap-1.5 px-2.5 font-mono text-xs font-bold transition-all",
              isBookmarked
                ? "border-primary/80 bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <BookmarkSimpleIcon
              weight={isBookmarked ? "fill" : "bold"}
              className={cn("size-3.5", isBookmarked && "text-primary")}
            />
            <span className="sr-only sm:not-sr-only sm:inline-block">
              {isBookmarked ? "Saved" : "Save"}
            </span>
          </Button>

          {/* Export Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 font-bold">
                <BracketsCurlyIcon weight="bold" />
                Code
              </Button>
            </DialogTrigger>
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

      {/* Dynamic Bento Box Layout inside the Card */}
      <CardContent className="grid flex-1 grid-cols-3 grid-rows-3 gap-1.5">
        {palette.colors.map((color, i) => {
          const swatchKey = `${palette.name}-${color.hex}-${i}`;
          const isCopied = copiedItem === swatchKey;

          return (
            <div
              key={i}
              onClick={() => onCopySwatch(color.hex, swatchKey)}
              title={`Click to copy ${color.hex}`}
              className={cn(
                "border-border/30 group/swatch relative flex min-h-24 cursor-pointer flex-col justify-between rounded-none border-[1.5px] p-3 font-mono transition-all duration-100 select-none hover:brightness-105 active:scale-[0.99]",
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
      </CardContent>
    </Card>
  );
}

export const PaletteCard = memo(PaletteCardComponent);
