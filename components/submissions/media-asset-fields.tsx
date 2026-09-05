"use client";

import { ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";

import { CardIcon } from "@/components/card-icon";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface MediaAssetFieldsProps {
  className?: string;
  disabled?: boolean;
  favicon?: string | null;
  ogImage?: string | null;
  onFaviconChange: (val: string) => void;
  onOgImageChange: (val: string) => void;
}

export function MediaAssetFields({
  className,
  disabled = false,
  favicon,
  ogImage,
  onFaviconChange,
  onOgImageChange,
}: MediaAssetFieldsProps) {
  return (
    <div className={cn("border-line/40 space-y-4 border-t pt-4 font-mono text-xs", className)}>
      <div>
        <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
          Visual Assets & Media
        </h4>
        <p className="text-muted-foreground text-[11px]">
          Favicon icon and OpenGraph preview banner image.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Favicon URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Favicon URL
            </Label>
            {favicon && (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                <CardIcon alt="favicon preview" favicon={favicon} className="size-4" />
                <span>Loaded</span>
              </span>
            )}
          </div>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://example.com/favicon.ico"
              value={favicon || ""}
              onChange={(e) => onFaviconChange(e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>

        {/* OG Image URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              OG Image URL
            </Label>
            {ogImage && (
              <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                <ImageIcon className="size-4" />
                <span>Image set</span>
              </span>
            )}
          </div>
          <div className="h-9">
            <InputField
              type="url"
              placeholder="https://example.com/og.png"
              value={ogImage || ""}
              onChange={(e) => onOgImageChange(e.target.value)}
              disabled={disabled}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* OG Image Preview Thumbnail */}
      {ogImage && (
        <div className="border-line/40 bg-paper/60 flex items-center gap-3 rounded border p-2.5">
          <div className="border-line/60 relative h-12 w-20 shrink-0 overflow-hidden rounded border bg-black/10">
            <Image src={ogImage} alt="OG Image Preview" fill unoptimized className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-muted-foreground block text-[10px] font-bold uppercase">
              OG Image Banner
            </span>
            <span className="text-foreground/80 block truncate font-mono text-[11px]">
              {ogImage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
