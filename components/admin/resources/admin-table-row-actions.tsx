"use client";

import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface AdminTableRowActionsProps {
  className?: string;
  copyJsonText?: (() => string) | string;
  copyJsonTitle?: string;
  deleteDisabled?: boolean;
  deleteDisabledReason?: string;
  deleteTitle?: string;
  editTitle?: string;
  extraActions?: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function AdminTableRowActions({
  className,
  copyJsonText,
  copyJsonTitle = "Copy JSON",
  deleteDisabled = false,
  deleteDisabledReason,
  deleteTitle = "Delete item",
  editTitle = "Edit item",
  extraActions,
  onDelete,
  onEdit,
}: AdminTableRowActionsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-1 font-mono", className)}>
      {extraActions}

      {copyJsonText && (
        <Tooltip>
          <TooltipTrigger asChild>
            <CopyButton
              textToCopy={copyJsonText}
              iconOnly
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground hover:bg-surface"
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{copyJsonTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground hover:bg-surface"
            >
              <PencilSimpleIcon className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{editTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                size="icon-xs"
                variant="ghost"
                disabled={deleteDisabled}
                onClick={onDelete}
                className={cn(
                  "text-destructive hover:bg-destructive/10",
                  deleteDisabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                )}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{deleteDisabled && deleteDisabledReason ? deleteDisabledReason : deleteTitle}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
