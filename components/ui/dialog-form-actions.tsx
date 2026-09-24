"use client";

import { CheckIcon, CircleNotchIcon, FloppyDiskIcon, XIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DialogFormActionsProps {
  /** Custom class for the cancel button. */
  cancelClassName?: string;
  /** Optional icon for cancel button. If true, renders default XIcon. */
  cancelIcon?: boolean | React.ReactNode;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Variant for the cancel button. Defaults to "ghost". */
  cancelVariant?: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary";
  /** Optional container className override. */
  className?: string;
  /** Custom label when in create mode. Defaults to "Create". */
  createLabel?: string;
  /** Disabled state for the submit button (in addition to isWorking). */
  disabled?: boolean;
  /** Custom label when in edit mode. Defaults to "Save Changes". */
  editLabel?: string;
  /** Whether the dialog is in edit mode (true) or create mode (false). Defaults to false. */
  isEdit?: boolean;
  /** Whether the submit action is currently working / loading. */
  isWorking?: boolean;
  /** Layout alignment: "end" (right aligned, default) or "between" (Cancel on left, Submit on right). */
  layout?: "between" | "end";
  /** Callback when cancel button is clicked. */
  onCancel?: () => void;
  /** Optional click handler for submit button. */
  onSubmit?: () => void;
  /** Size for both buttons. */
  size?: "default" | "icon-lg" | "icon-sm" | "icon-xs" | "icon" | "lg" | "sm" | "xs";
  /** Custom class for the submit button. */
  submitClassName?: string;
  /** Submit button icon override. If omitted, uses FloppyDiskIcon for edit or CheckIcon for create. */
  submitIcon?: React.ReactNode;
  /** Submit button HTML type. Defaults to "submit". */
  submitType?: "button" | "reset" | "submit";
  /** Variant for the submit button. Defaults to "default". */
  submitVariant?: "default" | "destructive" | "ghost" | "link" | "outline" | "secondary";
  /** Text to display while loading. Defaults to "Saving..." (in edit mode) or "Creating..." (in create mode). */
  workingText?: string;
}

export function DialogFormActions({
  cancelClassName,
  cancelIcon,
  cancelLabel = "Cancel",
  cancelVariant = "ghost",
  className,
  createLabel = "Create",
  disabled = false,
  editLabel = "Save Changes",
  isEdit = false,
  isWorking = false,
  layout = "end",
  onCancel,
  onSubmit,
  size,
  submitClassName,
  submitIcon,
  submitType = "submit",
  submitVariant = "default",
  workingText,
}: DialogFormActionsProps) {
  const currentWorkingText = workingText || (isEdit ? "Saving..." : "Creating...");
  const currentLabel = isEdit ? editLabel : createLabel;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        layout === "between" ? "justify-between" : "justify-end",
        className,
      )}
    >
      <Button
        type="button"
        variant={cancelVariant}
        size={size}
        onClick={onCancel}
        disabled={isWorking}
        className={cn("font-mono text-xs uppercase", cancelClassName)}
      >
        {cancelIcon === true ? <XIcon className="size-3.5" /> : cancelIcon}
        <span>{cancelLabel}</span>
      </Button>

      <Button
        type={submitType}
        variant={submitVariant}
        size={size}
        onClick={onSubmit}
        disabled={isWorking || disabled}
        className={cn("gap-1.5 font-mono text-xs font-bold uppercase", submitClassName)}
      >
        {isWorking ? (
          <>
            <CircleNotchIcon className="size-3.5 animate-spin" />
            <span>{currentWorkingText}</span>
          </>
        ) : (
          <>
            {submitIcon !== undefined ? (
              submitIcon
            ) : isEdit ? (
              <FloppyDiskIcon weight="duotone" className="size-3.5" />
            ) : (
              <CheckIcon weight="bold" className="size-3.5" />
            )}
            <span>{currentLabel}</span>
          </>
        )}
      </Button>
    </div>
  );
}
