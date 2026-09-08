"use client";

import {
  ArrowRightIcon,
  CircleNotchIcon,
  FloppyDiskIcon,
  InfoIcon,
  ShieldCheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface FieldDiff {
  field: string;
  label: string;
  newValue: string | number | boolean | null | undefined;
  oldValue: string | number | boolean | null | undefined;
}

export interface AdminConfirmEditDialogProps {
  changes: FieldDiff[];
  confirmLabel?: string;
  description?: string;
  isSaving?: boolean;
  isWorking?: boolean;
  itemName?: string;
  itemTitle?: string;
  onConfirm: () => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title?: string;
}

/**
 * Format arbitrary values into human-readable string descriptions for diff display.
 */
function formatDiffValue(val: unknown): string {
  if (val === null || val === undefined || val === "") {
    return "— (None)";
  }
  if (typeof val === "boolean") {
    return val ? "Yes (True)" : "No (False)";
  }
  return String(val).trim();
}

/**
 * Normalizes two values and returns whether they are meaningfully different.
 */
function isDifferent(valA: unknown, valB: unknown): boolean {
  const normA = valA === null || valA === undefined ? "" : typeof valA === "string" ? valA.trim() : valA;
  const normB = valB === null || valB === undefined ? "" : typeof valB === "string" ? valB.trim() : valB;
  return normA !== normB;
}

/**
 * Utility to compute list of changed fields between initial and current state.
 */
export function computeFieldChanges<T extends object>(
  initial: Partial<T> | null | undefined,
  current: Partial<T>,
  fieldLabels: Record<string, string>,
): FieldDiff[] {
  if (!initial) return [];

  const diffs: FieldDiff[] = [];
  const initialObj = initial as Record<string, unknown>;
  const currentObj = current as Record<string, unknown>;
  const checkedKeys = new Set([...Object.keys(fieldLabels), ...Object.keys(currentObj)]);

  for (const key of checkedKeys) {
    const label = fieldLabels[key];
    if (!label) continue; // Only compare declared fields

    const oldVal = initialObj[key];
    const newVal = currentObj[key];

    if (isDifferent(oldVal, newVal)) {
      diffs.push({
        field: key,
        label,
        newValue: newVal as FieldDiff["newValue"],
        oldValue: oldVal as FieldDiff["oldValue"],
      });
    }
  }

  return diffs;
}

export function AdminConfirmEditDialog({
  title = "Review & Confirm Changes",
  changes,
  confirmLabel = "Confirm & Save Changes",
  description,
  isSaving,
  isWorking,
  itemName,
  itemTitle,
  onConfirm,
  onOpenChange,
  open,
}: AdminConfirmEditDialogProps) {
  const hasChanges = changes.length > 0;
  const isBusy = Boolean(isWorking ?? isSaving);
  const displayName = itemTitle ?? itemName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper max-h-[90vh] max-w-2xl overflow-y-auto font-mono text-xs sm:max-w-2xl">
        <DialogHeader className="border-line border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md border border-primary/20">
              <ShieldCheckIcon weight="duotone" className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-foreground flex flex-wrap items-center gap-2 text-base font-bold uppercase">
                <span>{title}</span>
                {hasChanges && (
                  <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary text-[10px] font-bold">
                    {changes.length} {changes.length === 1 ? "field modified" : "fields modified"}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                {description ||
                  (displayName
                    ? `Please review the proposed modifications to "${displayName}" before applying them.`
                    : "Please review the proposed modifications before applying them to the database.")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2">
          {!hasChanges ? (
            <div className="border-line bg-surface/50 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
              <InfoIcon className="text-muted-foreground size-8" />
              <p className="text-foreground font-bold uppercase">No Changes Detected</p>
              <p className="text-muted-foreground max-w-sm text-xs">
                All field values match the current database record. No modifications will be made.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                Modified Attributes:
              </div>

              <div className="border-line divide-line bg-surface/40 divide-y rounded-lg border">
                {changes.map((change) => {
                  const oldFormatted = formatDiffValue(change.oldValue);
                  const newFormatted = formatDiffValue(change.newValue);
                  const isOldEmpty = oldFormatted.startsWith("—");
                  const isNewEmpty = newFormatted.startsWith("—");

                  return (
                    <div key={change.field} className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-12 sm:items-center">
                      {/* Field Name */}
                      <div className="sm:col-span-4">
                        <span className="text-foreground font-bold tracking-tight uppercase">
                          {change.label}
                        </span>
                        <span className="text-muted-foreground block text-[10px]">
                          ({change.field})
                        </span>
                      </div>

                      {/* Diff: Old → New */}
                      <div className="flex flex-col gap-1.5 sm:col-span-8 sm:flex-row sm:items-center">
                        {/* Old Value */}
                        <div
                          className={cn(
                            "flex-1 rounded border px-2.5 py-1.5 text-xs break-all",
                            isOldEmpty
                              ? "border-line bg-surface/80 text-muted-foreground italic"
                              : "border-destructive/30 bg-destructive/10 text-destructive line-through",
                          )}
                          title="Previous Value"
                        >
                          <span className="text-[10px] uppercase opacity-70 block font-bold">
                            Old:
                          </span>
                          <span>{oldFormatted}</span>
                        </div>

                        <ArrowRightIcon className="text-muted-foreground hidden size-3.5 shrink-0 sm:block" />

                        {/* New Value */}
                        <div
                          className={cn(
                            "flex-1 rounded border px-2.5 py-1.5 text-xs break-all",
                            isNewEmpty
                              ? "border-line bg-surface/80 text-muted-foreground italic"
                              : "border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-300",
                          )}
                          title="New Value"
                        >
                          <span className="text-[10px] uppercase opacity-70 block font-bold">
                            New:
                          </span>
                          <span>{newFormatted}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-line border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
            className="border-line hover:bg-surface font-mono text-xs uppercase"
          >
            <XIcon className="mr-1 size-3.5" />
            <span>{hasChanges ? "Back to Editing" : "Close"}</span>
          </Button>

          {hasChanges && (
            <Button
              type="button"
              onClick={async () => {
                await onConfirm();
              }}
              disabled={isBusy}
              className="font-mono text-xs font-bold uppercase"
            >
              {isBusy ? (
                <>
                  <CircleNotchIcon className="mr-1.5 size-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FloppyDiskIcon weight="duotone" className="mr-1.5 size-4" />
                  <span>{confirmLabel}</span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
