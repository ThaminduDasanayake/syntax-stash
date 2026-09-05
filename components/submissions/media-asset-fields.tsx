"use client";

import { ImageIcon } from "@phosphor-icons/react";
import Image from "next/image";

import { CardIcon } from "@/components/card-icon";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { CandidateOption, EditableCandidateInput } from "./editable-candidate-input";

export interface MediaAssetFieldsProps {
  className?: string;
  disabled?: boolean;
  favicon?: string | null;
  faviconOptions?: CandidateOption[];
  ogImage?: string | null;
  ogImageOptions?: CandidateOption[];
  onFaviconChange: (val: string) => void;
  onOgImageChange: (val: string) => void;
}

export function MediaAssetFields({
  className,
  disabled = false,
  favicon,
  faviconOptions = [],
  ogImage,
  ogImageOptions = [],
  onFaviconChange,
  onOgImageChange,
}: MediaAssetFieldsProps) {
  return (
    <div className={cn("border-line/40 space-y-5 border-t pt-4 font-mono text-xs", className)}>
      <div>
        <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
          Visual Assets & Media
        </h4>
        <p className="text-muted-foreground text-[11px]">
          Favicon icon and OpenGraph preview banner image.
        </p>
      </div>

      <div className="space-y-4">
        {/* Favicon URL Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Favicon URL
            </Label>
          </div>
          <div className="h-9">
            <EditableCandidateInput
              type="url"
              placeholder="https://example.com/favicon.ico"
              value={favicon || ""}
              onChange={onFaviconChange}
              options={faviconOptions}
              disabled={disabled}
              renderPreview={(option) => (
                <div className="border-line bg-paper/60 grid size-6 place-items-center rounded border">
                  <CardIcon alt="favicon option" favicon={option.url} className="size-4" />
                </div>
              )}
            />
          </div>
        </div>

        {/* OG Image URL Section */}
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
            <EditableCandidateInput
              type="url"
              placeholder="https://example.com/og.png"
              value={ogImage || ""}
              onChange={onOgImageChange}
              options={ogImageOptions}
              disabled={disabled}
              renderPreview={(option) => (
                <div className="border-line/60 relative h-6 w-10 shrink-0 overflow-hidden rounded border bg-black/10">
                  <Image
                    src={option.url}
                    alt="OG option preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            />
          </div>

          {/* OG Image Preview Thumbnail */}
          {ogImage && (
            <div className="border-line/40 bg-paper/60 mt-2.5 flex items-center gap-3 rounded border p-2.5">
              <div className="border-line/60 relative h-12 w-20 shrink-0 overflow-hidden rounded border bg-black/10">
                <Image
                  src={ogImage}
                  alt="OG Image Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
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
      </div>
    </div>
  );
}
