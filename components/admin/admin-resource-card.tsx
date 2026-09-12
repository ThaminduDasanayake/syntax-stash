"use client";

import {
  CheckCircleIcon,
  ClipboardTextIcon,
  PencilSimpleIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { ResourceCardView } from "@/components/resource-card-view";
import { Button } from "@/components/ui/button";
import { slugifyAuthor } from "@/lib/utils";

import { AdminResourceItem } from "./types";

interface AdminResourceCardProps {
  isWorking?: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onPreview?: () => void;
  resource: AdminResourceItem;
}

export function AdminResourceCard({
  isWorking = false,
  onDelete,
  onEdit,
  onPreview,
  resource: res,
}: AdminResourceCardProps) {
  const [copied, setCopied] = useState(false);

  const hasNoOg = !res.ogImage || !res.ogImage.trim();
  const hasNoAuthor = !res.authorName || !res.authorName.trim();
  const hasNoFavicon = !res.favicon || !res.favicon.trim();
  const hasNoTags = !res.tags || !res.tags.trim();
  const hasMissingData = hasNoOg || hasNoAuthor || hasNoFavicon || hasNoTags;

  const handleCopyJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(res, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-line bg-surface/30 group hover:border-foreground/40 flex h-full flex-col justify-between overflow-hidden rounded-lg border transition-all">
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
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyJson}
            className="border-line hover:bg-surface h-8 w-full gap-1.5 px-2 text-[11px] font-bold uppercase"
          >
            {copied ? (
              <>
                <CheckCircleIcon className="size-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <ClipboardTextIcon className="size-3.5" />
                <span>JSON</span>
              </>
            )}
          </Button>

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
