"use client";

import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookmarkSimpleIcon, SparkleIcon, StarIcon, TagIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatStarCount } from "@/lib/github";
import { cn, Theme } from "@/lib/utils";

export interface ResourceCardViewProps {
  author?: string | string[] | null;
  authorHref?: ((authorName: string) => string) | string | null;
  cardClassName?: string;
  category?: string | null;
  description?: string | null;
  favicon?: string | null;
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
  const [imageError, setImageError] = useState(false);

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

  // Compute proxied OG image URL if external
  const imageSrc = useMemo(() => {
    if (!ogImage || imageError) return null;
    if (
      (ogImage.startsWith("http://") || ogImage.startsWith("https://")) &&
      !ogImage.startsWith("/api/proxy-image")
    ) {
      return `/api/proxy-image?url=${encodeURIComponent(ogImage)}`;
    }
    return ogImage;
  }, [imageError, ogImage]);

  // Compute proxied favicon URL if external
  const faviconSrc = useMemo(() => {
    if (!favicon) return null;
    if (favicon.startsWith("http://") || favicon.startsWith("https://")) {
      return `/api/proxy-image?url=${encodeURIComponent(favicon)}`;
    }
    return favicon;
  }, [favicon]);

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
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#18181b] transition-all duration-300 group-hover:border-white/[0.18] group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={title || "Resource preview"}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          /* Abstract ambient fallback when no OG image */
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-purple/[0.12] via-[#18181b] to-brand-orange/[0.12]">
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute size-32 rounded-full bg-brand-purple/20 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-brand-purple/35" />
            <SparkleIcon weight="light" className="size-8 text-zinc-600" />
          </div>
        )}
      </div>

      {/* 2. Text Block */}
      <div className="flex flex-col gap-1.5 pt-3 px-0.5">

        {/* Row 1: Inline favicon + title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Small 24px favicon squircle beside the title */}
          <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border border-primary/50 bg-white/[0.05] p-0.5">
            {faviconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faviconSrc}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-sm object-contain"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.getAttribute("data-fallback") && favicon) {
                    img.setAttribute("data-fallback", "true");
                    img.src = favicon;
                  } else {
                    img.style.display = "none";
                  }
                }}
              />
            ) : (
              <SparkleIcon weight="light" className="size-3 text-zinc-600" />
            )}
          </div>

          <h3
            title={title || "Resource Title"}
            className="min-w-0 flex-1 truncate font-mono text-base font-bold tracking-tight text-white"
          >
            <span className="relative inline after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
              {title || "Resource Title"}
            </span>
          </h3>
        </div>

        {/* Row 2: Description (2-line clamp) */}
        <p className="line-clamp-2 font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {description ||
            "Tool description preview will appear here. It explains the features, purpose, and utility for developers."}
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
              className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] tabular-nums text-zinc-400"
              title={`${stars.toLocaleString()} GitHub stars`}
            >
              <StarIcon weight="fill" className="size-3 text-brand-orange" />
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
                      "flex size-7 cursor-pointer items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-500 transition-all duration-150 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white active:scale-95",
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
                    <HugeiconsIcon
                      aria-hidden="true"
                      icon={ArrowUpRight01Icon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
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
                className="inline-flex items-center gap-1 rounded-md border border-brand-purple/25 bg-brand-purple/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-brand-purple"
              >
                <TagIcon className="size-2.5 text-brand-purple" />
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
