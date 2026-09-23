"use client";

import { WarningCircleIcon } from "@phosphor-icons/react";
import { useState } from "react";

import { CloudinaryUploadButton } from "@/components/admin/shared/cloudinary-upload-button";
import {
  CardIcon,
  IconBgOption,
  IconColorOption,
  IconSpacingOption,
  parseIconStyle,
  serializeIconStyle,
} from "@/components/card-icon";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, isValidHttpUrl } from "@/lib/utils";

import { CandidateOption, EditableCandidateInput } from "./editable-candidate-input";
import { FieldCheckmark } from "./field-checkmark";

export type { IconBgOption, IconColorOption, IconSpacingOption };
export { parseIconStyle, serializeIconStyle };

export interface MediaAssetFieldsProps {
  allowUpload?: boolean;
  className?: string;
  disabled?: boolean;
  favicon?: string | null;
  faviconOptions?: CandidateOption[];
  iconBg?: string | null;
  ogImage?: string | null;
  ogImageOptions?: CandidateOption[];
  onFaviconChange: (val: string) => void;
  onIconBgChange?: (val: IconBgOption) => void;
  onOgImageChange: (val: string) => void;
}

function OgImagePreviewBanner({ ogImage }: { ogImage: string }) {
  const debouncedOg = useDebounce(ogImage, 400);
  const cleanOg = (debouncedOg || "").trim();

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

  const isValidUrl =
    cleanOg.startsWith("/") || cleanOg.startsWith("data:") || isValidHttpUrl(cleanOg);

  const isExternal =
    Boolean(cleanOg) &&
    isValidUrl &&
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
    <div className="border-line bg-paper/60 mt-2.5 overflow-hidden rounded border-[1.5px] p-3">
      <div className="border-line relative aspect-[1.91/1] w-full overflow-hidden rounded border-[1.5px] bg-black/5 dark:bg-black/30">
        {!state.error && isValidUrl && cleanOg ? (
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
            <span className="text-[10px]">
              {!cleanOg
                ? "No image specified"
                : !isValidUrl
                  ? "Invalid image URL"
                  : "Unable to load preview from this URL"}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between px-0.5">
        <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          OG Image Banner Preview
        </span>
        {(state.error || (cleanOg && !isValidUrl)) && (
          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            Check image URL
          </span>
        )}
      </div>
    </div>
  );
}

export function MediaAssetFields({
  allowUpload = false,
  className,
  disabled = false,
  favicon,
  faviconOptions = [],
  iconBg = "dark",
  ogImage,
  ogImageOptions = [],
  onFaviconChange,
  onIconBgChange,
  onOgImageChange,
}: MediaAssetFieldsProps) {
  const debouncedFavicon = useDebounce(favicon, 400);
  const cleanFavicon = debouncedFavicon?.trim() || "";
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
            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
              <span>Favicon URL</span>
              <FieldCheckmark
                checked={Boolean(
                  cleanFavicon &&
                  (cleanFavicon.startsWith("/") ||
                    cleanFavicon.startsWith("data:") ||
                    isValidHttpUrl(cleanFavicon)),
                )}
              />
            </Label>
            {allowUpload && (
              <CloudinaryUploadButton
                label="Upload Icon / SVG"
                onUploadSuccess={onFaviconChange}
                disabled={disabled}
              />
            )}
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
                    iconBg={iconBg}
                    className="size-6 shrink-0 rounded-[30%]"
                  />
                ) : null
              }
              renderPreview={(option) => (
                <div className="bg-paper/60 grid size-6 place-items-center overflow-hidden rounded-[30%]">
                  <CardIcon
                    alt="favicon option"
                    favicon={option.url}
                    iconBg={iconBg}
                    className="size-6 rounded-[30%]"
                  />
                </div>
              )}
            />
          </div>

          {/* Favicon Styling Controls: Separate Color & Spacing Options */}
          {cleanFavicon && onIconBgChange && (() => {
            const { color: currentColor, spacing: currentSpacing } = parseIconStyle(iconBg);

            const handleColorChange = (newColor: IconColorOption) => {
              onIconBgChange(serializeIconStyle(newColor, currentSpacing));
            };

            const handleSpacingChange = (newSpacing: IconSpacingOption) => {
              onIconBgChange(serializeIconStyle(currentColor, newSpacing));
            };

            return (
              <div className="border-line/70 bg-surface/40 space-y-2.5 rounded-lg border-[1.5px] p-3">
                {/* Row 1: Background / Contrast */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-wider">
                    Background / Color:
                  </span>
                  <div className="border-line bg-surface/80 inline-flex rounded border-[1.5px] p-0.5 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleColorChange("dark")}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-0.5 font-bold transition-all",
                        currentColor === "dark"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Dark (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleColorChange("light")}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-0.5 font-bold transition-all",
                        currentColor === "light"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      White Tile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleColorChange("invert")}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-0.5 font-bold transition-all",
                        currentColor === "invert"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Invert
                    </button>
                  </div>
                </div>

                {/* Row 2: Spacing & Fit */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-wider">
                    Icon Spacing & Fit:
                  </span>
                  <div className="border-line bg-surface/80 inline-flex rounded border-[1.5px] p-0.5 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleSpacingChange("padded")}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-0.5 font-bold transition-all",
                        currentSpacing === "padded"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      title="Inner padding (safe from corner cutting for transparent SVGs/logos)"
                    >
                      Padded (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpacingChange("fill")}
                      disabled={disabled}
                      className={cn(
                        "cursor-pointer rounded px-2.5 py-0.5 font-bold transition-all",
                        currentSpacing === "fill"
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      title="Edge-to-edge fill with squircle corners (ideal for solid square icons)"
                    >
                      Fill (Edge-to-Edge)
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* OG Image URL Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
              <span>OG Image URL</span>
              <FieldCheckmark
                checked={Boolean(
                  cleanOg &&
                  (cleanOg.startsWith("/") ||
                    cleanOg.startsWith("data:") ||
                    isValidHttpUrl(cleanOg)),
                )}
              />
            </Label>
            {allowUpload && (
              <CloudinaryUploadButton
                label="Upload Screenshot"
                onUploadSuccess={onOgImageChange}
                disabled={disabled}
              />
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
              renderPreview={(option) => {
                const isExt = option.url.startsWith("http://") || option.url.startsWith("https://");
                const optSrc = isExt
                  ? `/api/proxy-image?url=${encodeURIComponent(option.url)}`
                  : option.url;
                return (
                  <div className="border-line relative h-6 w-10 shrink-0 overflow-hidden rounded border-[1.5px] bg-black/10">
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
