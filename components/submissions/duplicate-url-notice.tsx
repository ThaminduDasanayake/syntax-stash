"use client";

import { ArrowSquareOutIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import React from "react";

export interface DuplicateUrlItem {
  category?: string | null;
  id?: string;
  status?: string | null;
  title: string;
  url?: string;
}

export interface DuplicateNoticeProps {
  adminLink?: boolean;
  className?: string;
  description?: React.ReactNode;
  item?: DuplicateUrlItem | null;
  liveUrl?: string | null;
  onDismiss?: () => void;
  title?: string;
  type?: "author" | "category" | "resource" | "submission" | "tag";
}

export function DuplicateNotice({
  title,
  className = "",
  description,
  item,
  liveUrl,
  onDismiss,
  type = "resource",
}: DuplicateNoticeProps) {
  if (!item && !title && !description) return null;

  const defaultTitle = (() => {
    if (title) return title;
    switch (type) {
      case "category":
        return "This category is already added!";
      case "author":
        return "This author is already added!";
      case "tag":
        return "This tag is already added!";
      case "submission":
        return "This resource has already been submitted!";
      case "resource":
      default:
        return "This resource is already added to Syntax Stash!";
    }
  })();

  const defaultDescription = (() => {
    if (description) return description;
    if (item) {
      return (
        <>
          Already listed as <strong className="font-bold underline">{item.title}</strong>
          {item.category ? ` in ${item.category}` : ""}
          {type === "submission" && item.status ? ` (Status: ${item.status})` : ""}
        </>
      );
    }
    return null;
  })();

  const activeLiveUrl = liveUrl ?? (type === "resource" && item?.url ? item.url : null);

  return (
    <div
      className={`animate-in fade-in flex w-full min-w-0 max-w-full items-start justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 font-mono text-xs text-amber-600 dark:text-amber-400 ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <WarningCircleIcon weight="fill" className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="leading-snug font-semibold">{defaultTitle}</p>
          {defaultDescription && (
            <div className="break-words text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/90">
              {defaultDescription}
            </div>
          )}
          {activeLiveUrl && (
            <div className="pt-0.5">
              <a
                href={activeLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:underline dark:text-amber-200"
              >
                <span>View live URL</span>
                <ArrowSquareOutIcon className="size-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 cursor-pointer p-0.5 text-amber-600 hover:opacity-80 dark:text-amber-400"
          title="Dismiss notice"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

// Export alias for seamless backward compatibility
export const DuplicateUrlNotice = DuplicateNotice;
