"use client";

import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AdminTableRowActionsProps {
  className?: string;
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

      {onEdit && (
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={onEdit}
          title={editTitle}
          className="text-muted-foreground hover:text-foreground hover:bg-surface"
        >
          <PencilSimpleIcon className="size-3.5" />
        </Button>
      )}

      {onDelete && (
        <Button
          size="icon-xs"
          variant="ghost"
          disabled={deleteDisabled}
          onClick={onDelete}
          title={deleteDisabled && deleteDisabledReason ? deleteDisabledReason : deleteTitle}
          className={cn(
            "text-destructive hover:bg-destructive/10",
            deleteDisabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
          )}
        >
          <TrashIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
