"use client";

import { ImageIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";

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

function OgImagePreviewBanner({ ogImage }: { ogImage: string }) {
  const cleanOg = ogImage.trim();

  const [state, setState] = useState<{ directFallback: boolean; error: boolean; url: string }>({
    directFallback: false,
    error: false,
    url: cleanOg,
  });

  if (state.url !== cleanOg) {
    setState({
      directFallback: false,
      error: false,
      url: cleanOg,
    });
  }

  const isExternal =
    Boolean(cleanOg) &&
    (cleanOg.startsWith("http://") || cleanOg.startsWith("https://")) &&
    !cleanOg.startsWith("/api/proxy-image");

  const handleOgError = () => {
    if (isExternal && !state.directFallback) {
      setState((prev) => ({ ...prev, directFallback: true }));
    } else {
      setState((prev) => ({ ...prev, error: true }));
    }
  };

  const currentSrc =
    isExternal && !state.directFallback
      ? `/api/proxy-image?url=${encodeURIComponent(cleanOg)}`
      : cleanOg;

  return (
    <div className="border-line bg-paper/60 mt-2.5 overflow-hidden rounded border p-3">
      <div className="border-line relative aspect-[1.91/1] w-full overflow-hidden rounded border bg-black/5 dark:bg-black/30">
        {!state.error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={currentSrc}
            src={currentSrc}
            alt="OG Image Preview"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={handleOgError}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-zinc-500">
            <WarningCircleIcon className="size-6 text-amber-500 opacity-80" />
            <span className="text-[10px]">Unable to load preview from this URL</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between px-0.5">
        <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          OG Image Banner Preview
        </span>
        {state.error && (
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            Check image URL
          </span>
        )}
      </div>
    </div>
  );
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
  const cleanFavicon = favicon?.trim() || "";
  const cleanOg = ogImage?.trim() || "";

  return (
    <div className={cn("border-line space-y-5 border-t pt-4 font-mono text-xs", className)}>
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
              prefix={
                cleanFavicon ? (
                  <CardIcon
                    alt="current favicon"
                    favicon={cleanFavicon}
                    className="size-6 shrink-0"
                  />
                ) : null
              }
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
          </div>
          <div className="h-9">
            <EditableCandidateInput
              type="url"
              placeholder="https://example.com/og.png"
              value={ogImage || ""}
              onChange={onOgImageChange}
              options={ogImageOptions}
              disabled={disabled}
              renderPreview={(option) => {
                const isExt = option.url.startsWith("http://") || option.url.startsWith("https://");
                const optSrc = isExt
                  ? `/api/proxy-image?url=${encodeURIComponent(option.url)}`
                  : option.url;
                return (
                  <div className="border-line relative h-6 w-10 shrink-0 overflow-hidden rounded border bg-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={optSrc}
                      alt="OG option preview"
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        if (isExt && e.currentTarget.src !== option.url) {
                          e.currentTarget.src = option.url;
                        }
                      }}
                    />
                  </div>
                );
              }}
            />
          </div>

          {/* OG Image Preview Thumbnail */}
          {cleanOg && <OgImagePreviewBanner ogImage={cleanOg} />}
        </div>
      </div>
    </div>
  );
}
