"use client";

import {
  ArrowUpRightIcon,
  BookmarkSimpleIcon,
  ImageIcon,
  StarIcon,
  TagIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatStarCount } from "@/lib/github";
import { cn, isValidHttpUrl, Theme } from "@/lib/utils";

export interface ResourceCardViewProps {
  author?: string | string[] | null;
  authorHref?: ((authorName: string) => string) | string | null;
  cardClassName?: string;
  category?: string | null;
  description?: string | null;
  favicon?: string | null;
  iconBg?: "dark" | "light" | "invert" | string | null;
  iconClassName?: string;
  isBookmarked?: boolean;
  ogImage?: string | null;
  onBookmarkClick?: (e: React.MouseEvent) => void;
  onCardClick?: () => void;
  showTags?: boolean;
  stars?: number | null;
  subtitle?: string | null;
  tags?: string | string[] | null;
  theme?: Theme;
  themeClasses?: string;
  title?: string | null;
  url?: string | null;
}

export function ResourceCardView({
  title,
  author,
  authorHref,
  cardClassName,
  description,
  favicon,
  iconBg,
  iconClassName,
  isBookmarked = false,
  ogImage,
  onBookmarkClick,
  onCardClick,
  showTags = false,
  stars = null,
  tags,
  themeClasses: propThemeClasses,
  url,
}: ResourceCardViewProps) {
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);

  const cleanOgImage = ogImage?.trim() || "";

  const [ogState, setOgState] = useState<{ directFallback: boolean; error: boolean; url: string }>({
    directFallback: false,
    error: false,
    url: cleanOgImage,
  });

  if (ogState.url !== cleanOgImage) {
    setOgState({
      directFallback: false,
      error: false,
      url: cleanOgImage,
    });
  }

  // Parse tags if provided as comma-separated string or array
  const parsedTags: string[] = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  // Parse authors supporting comma-separated strings or arrays
  const authorList: string[] = useMemo(() => {
    if (!author) return [];
    if (Array.isArray(author)) {
      return author.flatMap((a) =>
        typeof a === "string"
          ? a
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean)
          : [],
      );
    }
    if (typeof author === "string") {
      return author
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
    return [];
  }, [author]);

  const handleCardClick = () => {
    onCardClick?.();
  };

  const isClickable = Boolean(onCardClick);

  const isValidOg =
    cleanOgImage.startsWith("/") ||
    cleanOgImage.startsWith("data:") ||
    isValidHttpUrl(cleanOgImage);

  const isExternalOg =
    Boolean(cleanOgImage) &&
    isValidOg &&
    (cleanOgImage.startsWith("http://") || cleanOgImage.startsWith("https://")) &&
    !cleanOgImage.startsWith("/api/proxy-image");

  const imageSrc =
    !cleanOgImage || ogState.error || !isValidOg
      ? null
      : isExternalOg && !ogState.directFallback
        ? `/api/proxy-image?url=${encodeURIComponent(cleanOgImage)}`
        : cleanOgImage;

  const handleOgError = () => {
    if (isExternalOg && !ogState.directFallback) {
      setOgState((prev) => ({ ...prev, directFallback: true }));
    } else {
      setOgState((prev) => ({ ...prev, error: true }));
    }
  };

  const cardContent = (
    <article
      data-slot="resource-card"
      className={cn(
        "group relative flex h-full flex-col select-none",
        propThemeClasses,
        cardClassName,
      )}
    >
      {/* 1. Visual Stage: clean 16:10 OG image — no overlays */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#18181b] transition-all duration-300 group-hover:border-white/18 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={imageSrc}
            src={imageSrc}
            alt={title || "Resource preview"}
            loading="lazy"
            onError={handleOgError}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* Abstract ambient fallback when no OG image */
          <div className="from-brand-purple/12 to-brand-orange/12 relative flex h-full w-full items-center justify-center overflow-hidden bg-linear-to-br via-[#18181b]">
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="bg-brand-purple/20 group-hover:bg-brand-purple/35 absolute size-32 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125" />
            <ImageIcon weight="light" className="size-8 text-zinc-600" />
          </div>
        )}
      </div>

      {/* 2. Text Block */}
      <div className="flex flex-col gap-1.5 px-0.5 pt-3">
        {/* Row 1: Inline favicon + title */}
        <div className="flex min-w-0 items-center gap-2">
          <CardIcon
            alt={title || "Resource icon"}
            className="size-8 shrink-0"
            favicon={favicon}
            iconBg={iconBg}
            iconClassName={iconClassName}
          />

          <h3
            title={title || ""}
            className="min-w-0 flex-1 truncate font-mono text-base font-bold tracking-tight text-white"
          >
            <span className="after:bg-primary relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
              {title || ""}
            </span>
          </h3>
        </div>

        {/* Row 2: Description (2-line clamp) */}
        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {description || ""}
        </p>

        {/* Row 3: Footer — author · stars · action buttons */}
        <div
          className="flex items-center justify-between gap-2 pt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Author only — hidden entirely when no author */}
          {authorList.length > 0 && (
            <div className="flex min-w-0 items-center gap-1 font-mono text-xs text-zinc-500">
              <span className="truncate">
                {authorList.map((authorName, index) => {
                  const href =
                    typeof authorHref === "function"
                      ? authorHref(authorName)
                      : typeof authorHref === "string"
                        ? authorHref
                        : null;
                  return (
                    <span key={authorName} className="inline-flex items-center">
                      {index > 0 && <span className="mx-1 text-zinc-700">&amp;</span>}
                      {href ? (
                        <Link
                          href={href}
                          className="text-zinc-400 transition-colors hover:text-white hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {authorName}
                        </Link>
                      ) : (
                        <span className="text-zinc-400">{authorName}</span>
                      )}
                    </span>
                  );
                })}
              </span>
            </div>
          )}

          {/* Center: Stars count — subtle amber, separate from title */}
          {stars !== null && (
            <span
              className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] text-zinc-400 tabular-nums"
              title={`${stars.toLocaleString()} GitHub stars`}
            >
              <StarIcon weight="fill" className="text-star size-3" />
              {formatStarCount(stars)}
            </span>
          )}

          {/* Right: Bookmark + Open-in-new-tab */}
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {onBookmarkClick && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex size-7 cursor-pointer items-center justify-center rounded-lg border border-white/8 bg-white/4 text-zinc-500 transition-all duration-150 hover:border-white/18 hover:bg-white/8 hover:text-white active:scale-95",
                      isBookmarked && "border-primary/40 bg-primary/15 text-primary",
                    )}
                    onMouseEnter={() => setIsBookmarkHovered(true)}
                    onMouseLeave={() => setIsBookmarkHovered(false)}
                    onClick={onBookmarkClick}
                    aria-label={isBookmarked ? "Remove bookmark" : "Save bookmark"}
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
            )}

            {url && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-500 transition-all duration-150 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white active:scale-95"
                    aria-label="Open in new tab"
                  >
                    <ArrowUpRightIcon weight="bold" className="size-3.5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Open in new tab</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Optional tags row */}
        {showTags && parsedTags.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {parsedTags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="border-brand-purple/25 bg-brand-purple/10 text-brand-purple inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-medium"
              >
                <TagIcon className="text-brand-purple size-2.5" />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  if (isClickable) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        className="block h-full w-full cursor-pointer text-left outline-none"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
