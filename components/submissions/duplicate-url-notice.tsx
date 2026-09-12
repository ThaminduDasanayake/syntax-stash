"use client";

import { ArrowSquareOutIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

export interface DuplicateUrlItem {
  category?: string | null;
  id: string;
  status?: string | null;
  title: string;
  url: string;
}

export interface DuplicateUrlNoticeProps {
  adminLink?: boolean;
  item?: DuplicateUrlItem | null;
  onDismiss?: () => void;
  type?: "resource" | "submission";
}

export function DuplicateUrlNotice({
  adminLink = false,
  item,
  onDismiss,
  type = "resource",
}: DuplicateUrlNoticeProps) {
  if (!item) return null;

  const isLiveResource = type === "resource";

  return (
    <div className="animate-in fade-in flex items-start justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 font-mono text-xs text-amber-600 dark:text-amber-400">
      <div className="flex items-start gap-2 min-w-0">
        <WarningCircleIcon weight="fill" className="size-4 shrink-0 mt-0.5 text-amber-500" />
        <div className="space-y-1 min-w-0">
          <p className="font-semibold leading-snug">
            {isLiveResource
              ? "This resource is already added to Syntax Stash!"
              : "This resource has already been submitted!"}
          </p>
          <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90 leading-relaxed truncate">
            Already listed as <strong className="font-bold underline">{item.title}</strong>
            {item.category ? ` in ${item.category}` : ""}
            {!isLiveResource && item.status ? ` (Status: ${item.status})` : ""}
          </p>
          <div className="pt-0.5">
            {adminLink ? (
              <Link
                href={`/admin/resources?edit=${item.id}`}
                className="inline-flex items-center gap-1 font-bold text-amber-800 dark:text-amber-200 hover:underline text-[11px]"
              >
                Edit existing resource
                <ArrowSquareOutIcon className="size-3" />
              </Link>
            ) : isLiveResource ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-800 dark:text-amber-200 hover:underline text-[11px]"
              >
                View live URL
                <ArrowSquareOutIcon className="size-3" />
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-amber-600 dark:text-amber-400 hover:opacity-80 p-0.5 shrink-0 cursor-pointer"
          title="Dismiss notice"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
