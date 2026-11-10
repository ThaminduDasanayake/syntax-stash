"use client";

import { CircleHalfIcon, CircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";
import {
  cn,
  isValidHttpUrl,
  OgImageBgColor,
  OgImageFitOption,
  parseOgImageStyle,
  serializeOgImageStyle,
} from "@/lib/utils";

import { CandidateOption, EditableCandidateInput } from "./editable-candidate-input";
import { FieldCheckmark } from "./field-checkmark";

export type { IconBgOption, IconColorOption, IconSpacingOption, OgImageBgColor, OgImageFitOption };
export { parseIconStyle, parseOgImageStyle, serializeIconStyle, serializeOgImageStyle };

export interface MediaAssetFieldsProps {
  allowUpload?: boolean;
  className?: string;
  disabled?: boolean;
  favicon?: string | null;
  faviconOptions?: CandidateOption[];
  iconBg?: string | null;
  ogImage?: string | null;
  ogImageBg?: string | null;
  ogImageOptions?: CandidateOption[];
  onFaviconChange: (val: string) => void;
  onIconBgChange?: (val: IconBgOption) => void;
  onOgImageBgChange?: (val: string) => void;
  onOgImageChange: (val: string) => void;
}

function OgImagePreviewBanner({
  ogImage,
  ogImageBg = "none",
}: {
  ogImage: string;
  ogImageBg?: string | null;
}) {
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

  const { bg, fit } = parseOgImageStyle(ogImageBg);
  const hasCustomBg = bg !== "none";
  const isContain = fit === "contain" || hasCustomBg;

  return (
    <div className="border-line bg-paper/60 mt-2.5 overflow-hidden rounded-[20px] border-[1.5px] p-3">
      <div
        className={cn(
          "border-line relative aspect-2/1 w-full overflow-hidden rounded-[14px] border-[1.5px]",
          hasCustomBg
            ? bg === "white"
              ? "bg-white"
              : bg === "dark"
                ? "bg-[#09090b]"
                : bg === "zinc"
                  ? "bg-zinc-900"
                  : "bg-black/5 dark:bg-black/30"
            : "bg-[#18181b]",
        )}
        style={
          hasCustomBg && (bg.startsWith("#") || bg.startsWith("rgb"))
            ? { backgroundColor: bg }
            : undefined
        }
      >
        {!state.error && isValidUrl && cleanOg ? (
          <>
            {isContain && !hasCustomBg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35 blur-xl brightness-90 saturate-150 select-none"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentSrc}
              src={currentSrc}
              alt="OG Image Preview"
              loading="lazy"
              referrerPolicy="no-referrer"
              className={cn(
                "h-full w-full",
                isContain ? "relative z-10 object-contain" : "object-cover",
              )}
              onError={handleOgError}
            />
          </>
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
  iconBg = "none",
  ogImage,
  ogImageBg = "none",
  ogImageOptions = [],
  onFaviconChange,
  onIconBgChange,
  onOgImageBgChange,
  onOgImageChange,
}: MediaAssetFieldsProps) {
  const debouncedFavicon = useDebounce(favicon, 400);
  const cleanFavicon = debouncedFavicon?.trim() || "";
  const cleanOg = ogImage?.trim() || "";

  return (
    <div className={cn("border-line space-y-5 border-t pt-4 font-sans text-xs", className)}>
      <div>
        <h4 className="text-foreground font-sans text-xs font-bold tracking-tight uppercase">
          Visual Assets & Media
        </h4>
        <p className="text-muted-foreground text-[11px]">
          Favicon icon and OpenGraph preview banner image.
        </p>
      </div>

      <div className="space-y-4">
        {/* Favicon URL Section */}
        <div className="space-y-2">
          <EditableCandidateInput
            label="Favicon URL"
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
                  className="size-5 shrink-0 rounded-[30%]"
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
            suffix={
              <FieldCheckmark
                checked={Boolean(
                  cleanFavicon &&
                  (cleanFavicon.startsWith("/") ||
                    cleanFavicon.startsWith("data:") ||
                    isValidHttpUrl(cleanFavicon)),
                )}
              />
            }
          />

          {/* Favicon Actions Row: Styling Controls & Upload Button in One Row */}
          {((cleanFavicon && onIconBgChange) || allowUpload) && (
            <div className="border-line/70 bg-surface/40 flex flex-wrap items-center justify-between gap-2.5 rounded-[16px] border-[1.5px] p-2.5 sm:px-3">
              {cleanFavicon && onIconBgChange ? (
                (() => {
                  const { color: currentColor } = parseIconStyle(iconBg);

                  return (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground font-sans text-[10px] font-bold tracking-wider uppercase">
                        Background / Color:
                      </span>
                      <div className="border-line bg-surface/80 inline-flex items-center gap-0.5 rounded-[12px] border-[1.5px] p-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onIconBgChange("none")}
                              disabled={disabled}
                              aria-label="No bg"
                              className={cn(
                                "grid size-7 cursor-pointer place-items-center rounded-[10px] transition-all",
                                currentColor === "none"
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <CircleIcon
                                weight="fill"
                                className={cn(
                                  "size-4 shrink-0 rounded-full ring-1",
                                  currentColor === "none"
                                    ? "text-black/30 ring-black/20"
                                    : "text-zinc-500/40 ring-white/15",
                                )}
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>No bg</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onIconBgChange("dark")}
                              disabled={disabled}
                              aria-label="Black"
                              className={cn(
                                "grid size-7 cursor-pointer place-items-center rounded-[10px] transition-all",
                                currentColor === "dark"
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <CircleIcon
                                weight="fill"
                                className="size-4 shrink-0 rounded-full text-black ring-1 ring-white/25"
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Black</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onIconBgChange("white")}
                              disabled={disabled}
                              aria-label="White"
                              className={cn(
                                "grid size-7 cursor-pointer place-items-center rounded-[10px] transition-all",
                                currentColor === "white"
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <CircleIcon
                                weight="fill"
                                className="size-4 shrink-0 rounded-full text-white ring-1 ring-black/15"
                              />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>White</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={() => onIconBgChange("invert")}
                              disabled={disabled}
                              aria-label="Invert"
                              className={cn(
                                "grid size-7 cursor-pointer place-items-center rounded-[10px] transition-all",
                                currentColor === "invert"
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              <CircleHalfIcon weight="fill" className="size-4 shrink-0" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Invert</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <span className="text-muted-foreground font-sans text-[10px]">
                  Favicon image or vector asset
                </span>
              )}

              {allowUpload && (
                <CloudinaryUploadButton
                  label="Upload Icon / SVG"
                  onUploadSuccess={onFaviconChange}
                  disabled={disabled}
                  className="border-line bg-surface/80 hover:bg-surface ml-auto h-8 gap-1.5 rounded-[12px] px-3 font-sans text-[11px] font-bold uppercase shadow-xs"
                />
              )}
            </div>
          )}
        </div>

        {/* OG Image URL Section */}
        <div className="space-y-2">
          <EditableCandidateInput
            label="OG Image URL"
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
                <div className="border-line relative h-6 w-10 shrink-0 overflow-hidden rounded-[8px] border-[1.5px] bg-black/10">
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
            suffix={
              <FieldCheckmark
                checked={Boolean(
                  cleanOg &&
                  (cleanOg.startsWith("/") ||
                    cleanOg.startsWith("data:") ||
                    isValidHttpUrl(cleanOg)),
                )}
              />
            }
          />

          {/* OG Image Controls: Fit, Canvas & Upload in One Group */}
          {cleanOg && onOgImageBgChange ? (
            (() => {
              const { bg: currentBg, fit: currentFit } = parseOgImageStyle(ogImageBg);

              const handleFitChange = (newFit: OgImageFitOption) => {
                onOgImageBgChange(serializeOgImageStyle(currentBg, newFit));
              };

              const handleBgChange = (newBg: OgImageBgColor) => {
                onOgImageBgChange(serializeOgImageStyle(newBg, currentFit));
              };

              return (
                <div className="border-line/70 bg-surface/40 space-y-2.5 rounded-[16px] border-[1.5px] p-3">
                  {/* Row 1: Fit & Framing */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-sans text-[10px] font-bold tracking-wider uppercase">
                        Image Fit & Framing:
                      </span>
                      <span className="text-muted-foreground text-[9px]">
                        Choose how the image scales to the 2:1 card aspect ratio
                      </span>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <div className="border-line bg-surface/80 inline-flex rounded-[12px] border-[1.5px] p-0.5 font-sans text-[11px]">
                        <button
                          type="button"
                          onClick={() => handleFitChange("cover")}
                          disabled={disabled}
                          className={cn(
                            "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                            currentFit === "cover"
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          title="Edge-to-edge fill (crops edges for non-2:1 images)"
                        >
                          Fill / Cover (Default)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFitChange("contain")}
                          disabled={disabled}
                          className={cn(
                            "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                            currentFit === "contain"
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          title="Shows 100% of image without cropping, with ambient backdrop"
                        >
                          Contain (Full View)
                        </button>
                      </div>

                      {allowUpload && (
                        <CloudinaryUploadButton
                          label="Upload Screenshot"
                          onUploadSuccess={onOgImageChange}
                          disabled={disabled}
                          className="border-line bg-surface/80 hover:bg-surface h-8 gap-1.5 rounded-[12px] px-3 font-sans text-[11px] font-bold uppercase shadow-xs"
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Background / Canvas */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground font-sans text-[10px] font-bold tracking-wider uppercase">
                        Background / Canvas:
                      </span>
                      <span className="text-muted-foreground text-[9px]">
                        Canvas color for contain mode or transparent SVGs
                      </span>
                    </div>
                    <div className="border-line bg-surface/80 inline-flex flex-wrap rounded-[12px] border-[1.5px] p-0.5 font-sans text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleBgChange("none")}
                        disabled={disabled}
                        className={cn(
                          "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                          currentBg === "none"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        None (Dark Card)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBgChange("white")}
                        disabled={disabled}
                        className={cn(
                          "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                          currentBg === "white"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        White Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBgChange("dark")}
                        disabled={disabled}
                        className={cn(
                          "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                          currentBg === "dark"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Dark Slate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBgChange("zinc")}
                        disabled={disabled}
                        className={cn(
                          "cursor-pointer rounded-[10px] px-2.5 py-1 font-bold transition-all",
                          currentBg === "zinc"
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        Zinc
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : allowUpload ? (
            <div className="border-line/70 bg-surface/40 flex items-center justify-between gap-3 rounded-[16px] border-[1.5px] p-2.5 sm:px-3">
              <span className="text-muted-foreground font-sans text-[10px]">
                OpenGraph preview banner image
              </span>
              <CloudinaryUploadButton
                label="Upload Screenshot"
                onUploadSuccess={onOgImageChange}
                disabled={disabled}
                className="border-line bg-surface/80 hover:bg-surface ml-auto h-8 gap-1.5 rounded-[12px] px-3 font-sans text-[11px] font-bold uppercase shadow-xs"
              />
            </div>
          ) : null}

          {/* OG Image Preview Thumbnail */}
          {cleanOg && <OgImagePreviewBanner ogImage={cleanOg} ogImageBg={ogImageBg} />}
        </div>
      </div>
    </div>
  );
}
