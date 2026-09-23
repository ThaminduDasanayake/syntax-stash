"use client";

import {
  ArrowRightIcon,
  InfoIcon,
  ShieldCheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFormActions,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, isValidHttpUrl } from "@/lib/utils";

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

export interface WordDiffToken {
  text: string;
  type: "added" | "removed" | "unchanged";
}

/**
 * Computes word-level diffs preserving whitespace and punctuation.
 */
export function computeWordDiff(oldText: string, newText: string): WordDiffToken[] {
  if (!oldText && !newText) return [];
  if (!oldText) return [{ text: newText, type: "added" }];
  if (!newText) return [{ text: oldText, type: "removed" }];

  const tokenize = (str: string) => str.split(/(\s+|[^\w\s])/).filter(Boolean);
  const aTokens = tokenize(oldText);
  const bTokens = tokenize(newText);

  const m = aTokens.length;
  const n = bTokens.length;

  const table: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      table[i][j] =
        aTokens[i - 1] === bTokens[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }

  const result: WordDiffToken[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aTokens[i - 1] === bTokens[j - 1]) {
      result.push({ text: aTokens[i - 1], type: "unchanged" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || table[i][j - 1] >= table[i - 1][j])) {
      result.push({ text: bTokens[j - 1], type: "added" });
      j--;
    } else {
      result.push({ text: aTokens[i - 1], type: "removed" });
      i--;
    }
  }

  result.reverse();

  // Merge contiguous tokens of the same type
  const merged: WordDiffToken[] = [];
  for (const token of result) {
    const last = merged[merged.length - 1];
    if (last && last.type === token.type) {
      last.text += token.text;
    } else {
      merged.push({ text: token.text, type: token.type });
    }
  }

  return merged;
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
  const normA =
    valA === null || valA === undefined ? "" : typeof valA === "string" ? valA.trim() : valA;
  const normB =
    valB === null || valB === undefined ? "" : typeof valB === "string" ? valB.trim() : valB;
  return normA !== normB;
}

const LINK_FIELD_NAMES = new Set([
  "authorgithub",
  "authortwitter",
  "authorwebsite",
  "avatar",
  "banner",
  "blog",
  "favicon",
  "github",
  "image",
  "linkedin",
  "ogimage",
  "previewurl",
  "repo",
  "repository",
  "twitter",
  "url",
  "website",
  "youtube",
]);

const SELECT_OR_BOOLEAN_FIELDS = new Set([
  "category",
  "iconbg",
  "isapproved",
  "isfeatured",
  "isfree",
  "isrejected",
  "pricing",
  "role",
  "status",
  "type",
]);

function isLinkField(field: string, valA: unknown, valB: unknown): boolean {
  const normalizedField = field.toLowerCase().replace(/[-_]/g, "");
  if (LINK_FIELD_NAMES.has(normalizedField)) return true;
  if (
    typeof valA === "string" &&
    (isValidHttpUrl(valA) || valA.startsWith("http://") || valA.startsWith("https://"))
  ) {
    return true;
  }
  if (
    typeof valB === "string" &&
    (isValidHttpUrl(valB) || valB.startsWith("http://") || valB.startsWith("https://"))
  ) {
    return true;
  }
  return false;
}

function isSelectOrBooleanField(field: string, valA: unknown, valB: unknown): boolean {
  if (typeof valA === "boolean" || typeof valB === "boolean") return true;
  const normalizedField = field.toLowerCase().replace(/[-_]/g, "");
  return SELECT_OR_BOOLEAN_FIELDS.has(normalizedField);
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
    if (!label) continue;

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
  const [localBusy, setLocalBusy] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setLocalBusy(false);
    }
  }, [open]);

  const hasChanges = changes.length > 0;
  const isBusy = Boolean(isWorking || isSaving || localBusy);
  const displayName = itemTitle ?? itemName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper flex max-h-[85vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 font-mono text-xs sm:max-w-2xl">
        {/* Pinned Header */}
        <div className="border-line shrink-0 border-b-[1.5px] p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 pr-6">
              <div className="bg-primary/10 text-primary border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-md border-[1.5px]">
                <ShieldCheckIcon weight="duotone" className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-foreground flex flex-wrap items-center gap-2 text-base font-bold uppercase">
                  <span>{title}</span>
                  {hasChanges && (
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/10 text-primary text-[10px] font-bold"
                    >
                      {changes.length}{" "}
                      {changes.length === 1 ? "field modified" : "fields modified"}
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
        </div>

        {/* Scrollable Body: Single Unified View */}
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {!hasChanges ? (
            <div className="border-line bg-surface/50 flex flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed p-8 text-center">
              <InfoIcon className="text-muted-foreground size-8" />
              <p className="text-foreground font-bold uppercase">No Changes Detected</p>
              <p className="text-muted-foreground max-w-sm text-xs">
                All field values match the current database record. No modifications will be made.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Modified Attributes:
              </div>

              <div className="border-line divide-line bg-surface/40 divide-y rounded-lg border-[1.5px]">
                {changes.map((change) => {
                  const oldFormatted = formatDiffValue(change.oldValue);
                  const newFormatted = formatDiffValue(change.newValue);
                  const isOldEmpty = oldFormatted.startsWith("—");
                  const isNewEmpty = newFormatted.startsWith("—");

                  const isLink = isLinkField(change.field, change.oldValue, change.newValue);
                  const isSelectOrBoolean = isSelectOrBooleanField(
                    change.field,
                    change.oldValue,
                    change.newValue,
                  );

                  // If it's a link or select/boolean, show Old -> New comparison cards
                  const showSideBySide = isLink || isSelectOrBoolean;

                  // For text/prose, compute word-level diff
                  const rawOld =
                    change.oldValue === null || change.oldValue === undefined
                      ? ""
                      : String(change.oldValue);
                  const rawNew =
                    change.newValue === null || change.newValue === undefined
                      ? ""
                      : String(change.newValue);

                  const wordTokens = !showSideBySide
                    ? computeWordDiff(rawOld, rawNew)
                    : null;

                  return (
                    <div key={change.field} className="space-y-2 p-3.5">
                      {/* Field Label & Action Buttons */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-bold tracking-tight uppercase">
                            {change.label}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            ({change.field})
                          </span>
                        </div>

                        {/* Quick Copy Action */}
                        <div className="flex items-center gap-1.5">
                          <CopyButton
                            textToCopy={newFormatted.startsWith("—") ? oldFormatted : newFormatted}
                            iconOnly
                            size="icon-xs"
                            className="size-5 rounded"
                            title="Copy new value"
                          />
                        </div>
                      </div>

                      {/* Content: Old -> New for Links/Selects vs Word-level Diff for Text */}
                      {showSideBySide ? (
                        /* Links, URLs, Select Options, Booleans: Old -> New Cards */
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                          {/* Old Value */}
                          <div
                            className={cn(
                              "flex-1 rounded border-[1.5px] px-2.5 py-1.5 text-xs break-all",
                              isOldEmpty
                                ? "border-line bg-surface/80 text-muted-foreground italic"
                                : "border-destructive/30 bg-destructive/10 text-destructive line-through",
                            )}
                            title="Previous Value"
                          >
                            <span className="block text-[10px] font-bold uppercase opacity-70">
                              Old:
                            </span>
                            <span>{oldFormatted}</span>
                          </div>

                          <ArrowRightIcon className="text-muted-foreground hidden size-3.5 shrink-0 sm:block" />

                          {/* New Value */}
                          <div
                            className={cn(
                              "flex-1 rounded border-[1.5px] px-2.5 py-1.5 text-xs break-all",
                              isNewEmpty
                                ? "border-line bg-surface/80 text-muted-foreground italic"
                                : "border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-700 dark:text-emerald-300",
                            )}
                            title="New Value"
                          >
                            <span className="block text-[10px] font-bold uppercase opacity-70">
                              New:
                            </span>
                            <span>{newFormatted}</span>
                          </div>
                        </div>
                      ) : (
                        /* Text / Prose / Descriptions: Inline Word-level Diff */
                        <div className="border-line bg-surface/80 rounded border-[1.5px] p-2.5 text-xs leading-relaxed break-words font-mono">
                          {wordTokens && wordTokens.length > 0 ? (
                            wordTokens.map((token, tIdx) => {
                              if (token.type === "added") {
                                return (
                                  <span
                                    key={tIdx}
                                    className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-1 py-0.5 rounded mx-0.5 inline-block"
                                  >
                                    {token.text}
                                  </span>
                                );
                              }
                              if (token.type === "removed") {
                                return (
                                  <span
                                    key={tIdx}
                                    className="bg-destructive/15 text-destructive line-through px-1 py-0.5 rounded mx-0.5 inline-block opacity-80"
                                  >
                                    {token.text}
                                  </span>
                                );
                              }
                              return (
                                <span key={tIdx} className="text-foreground">
                                  {token.text}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-muted-foreground italic">— (None)</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer */}
        <div className="border-line bg-surface/30 shrink-0 border-t-[1.5px] p-4 sm:px-6">
          {hasChanges ? (
            <DialogFormActions
              cancelLabel="Back to Editing"
              cancelVariant="outline"
              cancelIcon={true}
              cancelClassName="border-line hover:bg-surface"
              onCancel={() => onOpenChange(false)}
              isWorking={isBusy}
              workingText="Saving Changes..."
              isEdit={true}
              editLabel={confirmLabel}
              submitType="button"
              onSubmit={async () => {
                try {
                  setLocalBusy(true);
                  await onConfirm();
                } catch {
                  setLocalBusy(false);
                }
              }}
            />
          ) : (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-line hover:bg-surface font-mono text-xs uppercase"
              >
                <XIcon className="mr-1 size-3.5" />
                <span>Close</span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
