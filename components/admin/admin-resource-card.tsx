"use client";

import {
  ArrowRightIcon,
  ArrowsClockwiseIcon,
  PencilSimpleIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";

import { ResourceCardView } from "@/components/resource-card-view";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { slugifyAuthor } from "@/lib/utils";

import { AdminPingButton } from "./admin-ping-button";
import { AdminResourceItem, HEALTH_STATUS_CONFIG } from "./types";

interface AdminResourceCardProps {
  isApplyingRedirect?: boolean;
  isCheckingHealth?: boolean;
  isWorking?: boolean;
  onApplyRedirect?: () => void;
  onCheckHealth?: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPreview?: () => void;
  resource: AdminResourceItem;
}

export function AdminResourceCard({
  isApplyingRedirect = false,
  isCheckingHealth = false,
  isWorking = false,
  onApplyRedirect,
  onCheckHealth,
  onDelete,
  onEdit,
  onPreview,
  resource: res,
}: AdminResourceCardProps) {
  const hasNoOg = !res.ogImage || !res.ogImage.trim();
  const hasNoAuthor = !res.authorName || !res.authorName.trim();
  const hasNoFavicon = !res.favicon || !res.favicon.trim();
  const hasNoTags = !res.tags || !res.tags.trim();
  const hasMissingData = hasNoOg || hasNoAuthor || hasNoFavicon || hasNoTags;

  const healthStatus = res.healthStatus || "unknown";
  const healthConfig = HEALTH_STATUS_CONFIG[healthStatus];

  return (
    <div className="border-line bg-surface/30 group hover:border-foreground/40 flex h-full flex-col justify-between overflow-hidden rounded-lg border-[1.5px] transition-all">
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
          author={res.authorName}
          authorHref={res.authorName ? `/authors/${slugifyAuthor(res.authorName)}` : undefined}
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

        {/* Quick Ping Button */}
        {onCheckHealth && (
          <AdminPingButton
            onClick={onCheckHealth}
            isChecking={isCheckingHealth}
            disabled={isWorking}
          />
        )}
      </div>

      {/* Suggested Redirect Action Banner (if status is 301/308 redirect) */}
      {healthStatus === "redirect" && res.healthRedirectUrl && (
        <div className="flex flex-col gap-1.5 border-t border-amber-500/20 bg-amber-500/10 px-2.5 py-1.5 font-mono text-[10px] text-amber-800 dark:text-amber-300">
          <div className="flex items-center justify-between gap-1">
            <span className="font-bold uppercase">Redirect Detected:</span>
            {onApplyRedirect && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyRedirect();
                }}
                disabled={isApplyingRedirect || isWorking}
                className="h-6 gap-1 border-amber-600/40 bg-amber-500/20 px-2 text-[9px] font-bold text-amber-900 uppercase hover:bg-amber-500/30 dark:text-amber-200"
              >
                {isApplyingRedirect ? (
                  <>
                    <ArrowsClockwiseIcon className="size-2.5 animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="size-2.5" />
                    <span>Apply URL</span>
                  </>
                )}
              </Button>
            )}
          </div>
          <a
            href={res.healthRedirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[9px] underline opacity-80 hover:opacity-100"
            title={res.healthRedirectUrl}
          >
            {res.healthRedirectUrl}
          </a>
        </div>
      )}

      {/* Missing Data Warning Chips */}
      {hasMissingData && (
        <div className="flex flex-wrap items-center gap-1 border-t border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] text-amber-700 dark:text-amber-400">
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
        </div>
      )}

      {/* Docked Admin Action Bar: 1 Line with 3 Proper Buttons */}
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
