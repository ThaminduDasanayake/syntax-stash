"use client";

import { PencilSimpleIcon, TrashIcon, WarningCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { parseIconStyle } from "@/components/card-icon";
import { ResourceCardView } from "@/components/resource-card-view";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  cn,
  getCategoryTheme,
  parseOgImageStyle,
  slugifyAuthor,
  THEME_CONFIG,
} from "@/lib/utils";

import { PingButton } from "../shared/ping-button";
import { HEALTH_STATUS_CONFIG, ResourceItem } from "../shared/types";

interface ResourceCardProps {
  isCheckingHealth?: boolean;
  isWorking?: boolean;
  onCheckHealth?: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPreview?: () => void;
  resource: ResourceItem;
}

export function ResourceCard({
  isCheckingHealth = false,
  isWorking = false,
  onCheckHealth,
  onDelete,
  onEdit,
  onPreview,
  resource: res,
}: ResourceCardProps) {
  const hasNoOg = !res.ogImage || !res.ogImage.trim();
  const hasNoAuthor = !res.authorName || !res.authorName.trim();
  const hasNoFavicon = !res.favicon || !res.favicon.trim();
  const hasNoTags = !res.tags || !res.tags.trim();
  const hasNoGithub = !res.github || !res.github.trim();
  const hasMissingData = hasNoOg || hasNoAuthor || hasNoFavicon || hasNoTags || hasNoGithub;

  const healthStatus = res.healthStatus || "unknown";
  const healthConfig = HEALTH_STATUS_CONFIG[healthStatus];

  const theme = getCategoryTheme(res.category);
  const themeStyles = THEME_CONFIG[theme];

  return (
    <div className="border-line bg-surface/30 group hover:border-foreground/40 flex h-full flex-col justify-between overflow-hidden rounded-lg border-[1.5px] transition-all">
      {/* Category Header Strip (outside the public card view) */}
      <div className="border-line bg-surface/60 flex items-center justify-between border-b px-2.5 py-1.5 font-mono text-[11px]">
        <div className="flex items-center gap-1.5">
          {res.category ? (
            <Link
              href={`/admin/resources?category=${encodeURIComponent(res.category)}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-opacity hover:opacity-80",
                themeStyles.soft,
                themeStyles.label,
                themeStyles.border,
              )}
              title={`Filter by ${res.category}`}
            >
              <span
                className={cn("size-1.5 rounded-full", themeStyles.dotActive || themeStyles.dot)}
              />
              {res.category}
            </Link>
          ) : (
            <span className="text-muted-foreground text-[10px] italic">Uncategorized</span>
          )}
        </div>
      </div>

      {/* Exact Visual Public Card (clicking anywhere on card opens ResourceDialog preview) */}
      <div className="flex-1 p-2 sm:p-2.5">
        <ResourceCardView
          title={res.title}
          subtitle={res.subtitle}
          description={res.description}
          category={res.category}
          favicon={res.favicon}
          iconBg={res.iconBg}
          ogImage={res.ogImage}
          ogImageBg={res.ogImageBg}
          author={res.authorName}
          authorHref={
            res.authorName ? (name: string) => `/authors/${slugifyAuthor(name)}` : undefined
          }
          url={res.url}
          onCardClick={onPreview}
          cardClassName="h-full"
        />
      </div>

      {/* URL Health & Diagnostics Strip */}
      <div className="border-line bg-surface/60 flex items-center justify-between border-t px-2.5 py-1.5 font-mono text-[11px]">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span
            className={`inline-block size-2 shrink-0 rounded-full ${healthConfig.dotColor} ${
              healthStatus === "broken" ? "animate-pulse" : ""
            }`}
          />
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-[10px] font-bold uppercase">
                {healthConfig.label}
              </span>
              {res.healthStatusCode && (
                <span className="text-muted-foreground text-[9px] font-medium">
                  ({res.healthStatusCode})
                </span>
              )}
            </div>
            {res.healthErrorMessage && (
              <span
                className="text-muted-foreground truncate text-[9px]"
                title={res.healthErrorMessage}
              >
                {res.healthErrorMessage}
              </span>
            )}
          </div>
        </div>

        {/* GitHub Indicator & Ping Action */}
        <div className="flex shrink-0 items-center gap-1.5">
          {res.github ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={
                    res.github.startsWith("http") ? res.github : `https://github.com/${res.github}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="border-line bg-paper/60 hover:border-foreground flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                >
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={13}
                    height={13}
                    className="size-3.5 dark:invert"
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>GitHub: {res.github}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 select-none">
                  No GH
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>No GitHub repository link set</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Quick Ping Button */}
          {onCheckHealth && (
            <PingButton
              onClick={onCheckHealth}
              isChecking={isCheckingHealth}
              disabled={isWorking}
            />
          )}
        </div>
      </div>

      {/* Suggested Redirect Action Banner (if status is 301/308 redirect) */}
      {healthStatus === "redirect" && res.healthRedirectUrl && (
        <div className="flex flex-col gap-1.5 border-t border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 font-mono text-[10px] text-amber-600">
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold uppercase">Redirect Detected:</span>
          </div>
          <a
            href={res.healthRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[10px] underline opacity-80 hover:opacity-100"
            title={res.healthRedirectUrl}
          >
            {res.healthRedirectUrl}
          </a>
        </div>
      )}

      {/* Media Background Status Strip (Admin Only) */}
      <div className="border-line bg-surface/50 flex flex-wrap items-center justify-between gap-1.5 border-t px-2.5 py-1.5 font-mono text-[10px]">
        {/* Favicon / Icon BG Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
            Icon:
          </span>
          {(() => {
            const rawBg = (res.iconBg || "").toLowerCase().trim();
            const { color } = parseIconStyle(res.iconBg);
            const isDark =
              color === "dark" ||
              rawBg === "black" ||
              rawBg === "dark" ||
              rawBg.includes("black") ||
              rawBg.includes("dark");
            const isWhite =
              color === "white" || rawBg.includes("white") || rawBg.includes("light");
            const isInvert = color === "invert" || rawBg.includes("invert");
            const isHex = Boolean(
              res.iconBg && (res.iconBg.startsWith("#") || res.iconBg.startsWith("rgb")),
            );

            if (isDark) {
              return (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-black/80 px-1.5 py-0.5 text-zinc-200">
                  <span className="size-2 shrink-0 rounded-xs border border-white/40 bg-black" />
                  <span>Black</span>
                </span>
              );
            }
            if (isWhite) {
              return (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-zinc-200">
                  <span className="size-2 shrink-0 rounded-xs border border-black/30 bg-white" />
                  <span>White</span>
                </span>
              );
            }
            if (isInvert) {
              return (
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-amber-400">
                  <span>◐ Invert</span>
                </span>
              );
            }
            if (isHex) {
              return (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-black/80 px-1.5 py-0.5 text-zinc-200">
                  <span
                    className="size-2 shrink-0 rounded-xs border border-white/30"
                    style={{ backgroundColor: res.iconBg || undefined }}
                  />
                  <span>{res.iconBg}</span>
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-zinc-400">
                <span className="font-bold text-zinc-500">⊘</span>
                <span>No bg</span>
              </span>
            );
          })()}
        </div>

        {/* OG Image BG Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
            OG BG:
          </span>
          {(() => {
            const { bg, fit } = parseOgImageStyle(res.ogImageBg);
            const hasCustomBg = bg !== "none";
            const swatchColor =
              bg === "white"
                ? "#ffffff"
                : bg === "dark"
                  ? "#09090b"
                  : bg === "zinc"
                    ? "#18181b"
                    : bg.startsWith("#") || bg.startsWith("rgb")
                      ? bg
                      : "#18181b";

            if (hasCustomBg) {
              return (
                <span className="inline-flex items-center gap-1 rounded border border-white/20 bg-black/80 px-1.5 py-0.5 text-zinc-200">
                  <span
                    className="size-2 shrink-0 rounded-xs border border-white/30"
                    style={{ backgroundColor: swatchColor }}
                  />
                  <span className="capitalize">{bg}</span>
                  {fit === "contain" && (
                    <span className="text-[9px] text-zinc-400">· contain</span>
                  )}
                </span>
              );
            }
            return (
              <span className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-zinc-400">
                <span className="font-bold text-zinc-500">⊘</span>
                <span>No bg</span>
                {fit === "contain" && (
                  <span className="text-[9px] text-zinc-400">· contain</span>
                )}
              </span>
            );
          })()}
        </div>
      </div>

      {/* Missing Data Warning Chips */}
      {hasMissingData && (
        <div className="flex flex-wrap items-center gap-1 border-t border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-400">
          <WarningCircleIcon weight="bold" className="size-3 shrink-0" />
          <span className="font-semibold uppercase">Missing:</span>
          {hasNoOg && (
            <span className="py-0.2 rounded bg-amber-500/15 px-1 font-medium">og:image</span>
          )}
          {hasNoAuthor && (
            <span className="py-0.2 rounded bg-amber-500/15 px-1 font-medium">author</span>
          )}
          {hasNoFavicon && (
            <span className="py-0.2 rounded bg-amber-500/15 px-1 font-medium">favicon</span>
          )}
          {hasNoTags && (
            <span className="py-0.2 rounded bg-amber-500/15 px-1 font-medium">tags</span>
          )}
          {hasNoGithub && (
            <span className="py-0.2 rounded bg-amber-500/15 px-1 font-medium">github</span>
          )}
        </div>
      )}

      {/* Docked Action Bar: 1 Line with 3 Proper Buttons */}
      <div className="border-line bg-surface/80 border-t p-2.5 font-mono text-[11px]">
        <div className="grid grid-cols-3 gap-2">
          <CopyButton
            textToCopy={() => JSON.stringify(res, null, 2)}
            labelName="JSON"
            size="sm"
            variant="outline"
            className="border-line hover:bg-surface h-8 w-full gap-1.5 px-2 text-[11px] font-bold uppercase"
          />

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            disabled={isWorking}
            className="border-line hover:bg-surface h-8 w-full gap-1.5 px-2 text-[11px] font-bold uppercase"
          >
            <PencilSimpleIcon className="size-3.5" />
            <span>Edit</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isWorking}
            className="border-line hover:bg-destructive/10 text-muted-foreground hover:text-destructive hover:border-destructive/40 h-8 w-full gap-1.5 px-2 text-[11px] font-bold uppercase"
          >
            <TrashIcon className="size-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
