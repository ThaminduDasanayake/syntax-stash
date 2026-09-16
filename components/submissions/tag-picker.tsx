"use client";

import { HashIcon, TagIcon } from "@phosphor-icons/react";
import React, { useEffect, useMemo, useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import type { TagInfo, TagItem } from "@/lib/tags";
import { cn } from "@/lib/utils";

export type { TagInfo, TagItem };

export interface TagPickerProps {
  allowCustom?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  maxTags?: number;
  onChange: (value: string) => void;
  onSelectTag?: (tag: TagItem) => void;
  placeholder?: string;
  value: string | string[] | null | undefined;
}

export type TagComboboxProps = TagPickerProps;

// Global module cache to prevent duplicate requests across renders
let cachedTags: TagItem[] | null = null;
let fetchTagsPromise: Promise<TagItem[]> | null = null;

// Cross-tab synchronization channel
let tagsChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    tagsChannel = new BroadcastChannel("syntax-stash-tags");
  } catch {
    // Fallback if BroadcastChannel is not permitted in sandbox
  }
}

export function invalidateTagCache() {
  cachedTags = null;
  fetchTagsPromise = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("syntax-stash-tags-updated"));
  }
  try {
    tagsChannel?.postMessage({ type: "TAGS_INVALIDATE" });
  } catch {
    // Ignore cross-tab messaging failure
  }
}

export async function fetchTagList(forceRefresh = false): Promise<TagItem[]> {
  if (!forceRefresh && cachedTags) return cachedTags;
  if (fetchTagsPromise) return fetchTagsPromise;

  fetchTagsPromise = (async () => {
    try {
      const res = await fetch("/api/tags", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load tags");
      const data = await res.json();
      const tagsList: TagItem[] = data.tags || [];
      cachedTags = tagsList.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
      return cachedTags!;
    } catch {
      return cachedTags || [];
    } finally {
      fetchTagsPromise = null;
    }
  })();

  return fetchTagsPromise;
}

export function TagCombobox({
  className,
  containerClassName,
  disabled = false,
  maxTags = 10,
  onChange,
  onSelectTag,
  placeholder = "Search tags in taxonomy...",
  value,
}: TagComboboxProps) {
  const [tags, setTags] = useState<TagItem[]>(() => {
    if (!cachedTags) return [];
    return [...cachedTags].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  });

  const anchor = useComboboxAnchor();

  useEffect(() => {
    let mounted = true;

    const syncTags = (force = false) => {
      fetchTagList(force).then((list) => {
        if (mounted && list.length > 0) {
          const sorted = [...list].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          );
          setTags(sorted);
        }
      });
    };

    // 1. Initial Load
    syncTags();

    // 2. Window event listener when a tag is created, edited, or deleted in admin
    const handleLocalUpdate = () => {
      syncTags(true);
    };
    window.addEventListener("syntax-stash-tags-updated", handleLocalUpdate);

    // 3. Cross-tab real-time listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "TAGS_INVALIDATE") {
        syncTags(true);
      }
    };
    tagsChannel?.addEventListener("message", handleBroadcast);

    return () => {
      mounted = false;
      window.removeEventListener("syntax-stash-tags-updated", handleLocalUpdate);
      tagsChannel?.removeEventListener("message", handleBroadcast);
    };
  }, []);

  const selectedValues = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((t) => t.trim()).filter(Boolean);
    }
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [value]);

  const tagNames = useMemo(() => {
    return tags.map((t) => t.name);
  }, [tags]);

  const tagMap = useMemo(() => {
    const map = new Map<string, TagItem>();
    for (const t of tags) {
      map.set(t.name, t);
    }
    return map;
  }, [tags]);

  const handleValueChange = (newValues: string[]) => {
    const next = newValues.slice(0, maxTags);
    onChange(next.join(", "));

    if (onSelectTag && next.length > 0) {
      const latestAdded = next.find((n) => !selectedValues.includes(n)) || next[next.length - 1];
      if (latestAdded) {
        const found = tags.find((t) => t.name.toLowerCase() === latestAdded.toLowerCase());
        if (found) {
          onSelectTag(found);
        }
      }
    }
  };

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Combobox
        multiple
        autoHighlight
        disabled={disabled}
        items={tagNames}
        value={selectedValues}
        onValueChange={handleValueChange}
      >
        <ComboboxChips
          ref={anchor}
          className={cn(
            "bg-paper border-line focus-within:border-primary/60 min-h-9 w-full rounded-md border-[1.5px] font-mono text-xs transition-colors",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <ComboboxValue>
            {(values: string[]) => (
              <React.Fragment>
                {values.map((tagName: string) => (
                  <ComboboxChip
                    key={tagName}
                    className="bg-muted text-foreground border-line/60 rounded border text-xs"
                  >
                    <HashIcon className="text-primary size-3" />
                    <span>{tagName}</span>
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput
                  placeholder={values.length === 0 ? placeholder : ""}
                  className="font-mono text-xs placeholder:text-zinc-500"
                />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent
          anchor={anchor}
          align="start"
          sideOffset={4}
          className="border-line bg-popover text-popover-foreground z-50 rounded-md border-[1.5px] font-mono text-xs shadow-md"
        >
          <ComboboxEmpty className="text-muted-foreground py-3 text-center font-mono text-xs">
            No tags found.
          </ComboboxEmpty>
          <ComboboxList className="no-scrollbar max-h-60 overflow-y-auto p-1 font-mono text-xs">
            {(item: string) => {
              const tagObj = tagMap.get(item);
              return (
                <ComboboxItem
                  key={item}
                  value={item}
                  className="cursor-pointer gap-2 py-1.5 pr-8 pl-2 font-mono text-xs"
                >
                  <TagIcon className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="flex-1 truncate">#{item}</span>
                  {tagObj?.count !== undefined && tagObj.count > 0 && (
                    <span className="text-muted-foreground text-[10px] tabular-nums">
                      ({tagObj.count})
                    </span>
                  )}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

// Alias for backwards compatibility
export const TagPicker = TagCombobox;
