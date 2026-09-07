"use client";

import { HashIcon, PlusIcon, TagIcon, XIcon } from "@phosphor-icons/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import type { TagInfo } from "@/lib/tags";
import { cn, normalizeTag } from "@/lib/utils";

export interface TagPickerProps {
  allowCustom?: boolean;
  className?: string;
  disabled?: boolean;
  maxTags?: number;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string | string[];
}

// Global cache to avoid refetching on every render
let cachedTags: TagInfo[] | null = null;
let fetchTagsPromise: Promise<TagInfo[]> | null = null;

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
  try {
    tagsChannel?.postMessage({ type: "TAGS_INVALIDATE" });
  } catch {
    // Ignore
  }
}

export async function fetchTagList(forceRefresh = false): Promise<TagInfo[]> {
  if (!forceRefresh && cachedTags) return cachedTags;
  if (fetchTagsPromise) return fetchTagsPromise;

  fetchTagsPromise = (async () => {
    try {
      const res = await fetch("/api/tags", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load tags");
      const data = await res.json();
      const tagsList: TagInfo[] = data.tags || [];
      cachedTags = tagsList.sort((a, b) => a.name.localeCompare(b.name));
      return cachedTags!;
    } catch {
      return cachedTags || [];
    } finally {
      fetchTagsPromise = null;
    }
  })();

  return fetchTagsPromise;
}

export function TagPicker({
  allowCustom = false,
  className,
  disabled = false,
  maxTags = 8,
  onChange,
  placeholder = "Select tags...",
  value,
}: TagPickerProps) {
  const [allTags, setAllTags] = useState<TagInfo[]>(cachedTags || []);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let mounted = true;

    const syncTags = (force = false) => {
      fetchTagList(force).then((list) => {
        if (mounted && list.length > 0) {
          setAllTags(list);
        }
      });
    };

    // 1. Initial Load
    syncTags();

    // 2. Cross-tab real-time listener (when tags created/updated in another tab)
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "TAGS_INVALIDATE") {
        cachedTags = null;
        fetchTagsPromise = null;
        syncTags(true);
      }
    };

    if (tagsChannel) {
      tagsChannel.addEventListener("message", handleBroadcast);
    }

    // 3. Tab focus / visibility change
    const handleFocus = () => {
      syncTags(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      mounted = false;
      if (tagsChannel) {
        tagsChannel.removeEventListener("message", handleBroadcast);
      }
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  // Parse current selected tags into an array, sorted alphabetically
  const selectedTags: string[] = useMemo(() => {
    let raw: string[] = [];
    if (Array.isArray(value)) {
      raw = value.map(normalizeTag).filter(Boolean);
    } else if (typeof value === "string") {
      raw = value.split(",").map(normalizeTag).filter(Boolean);
    }
    return Array.from(new Set(raw)).sort((a, b) => a.localeCompare(b));
  }, [value]);

  // Filter available suggestions based on query and already selected tags, strictly in alphabetical order
  const cleanQuery = normalizeTag(query);
  const filteredSuggestions = useMemo(() => {
    const unselected = allTags
      .filter((t) => !selectedTags.includes(t.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (!cleanQuery) {
      return unselected.slice(0, 10);
    }
    return unselected.filter((t) => t.name.includes(cleanQuery)).slice(0, 10);
  }, [allTags, cleanQuery, selectedTags]);

  const exactMatchExists = allTags.some((t) => t.name === cleanQuery);
  const isAlreadySelected = selectedTags.includes(cleanQuery);
  const canAddCustom = allowCustom && cleanQuery && !exactMatchExists && !isAlreadySelected;

  const emitChange = (newTags: string[]) => {
    const sorted = [...new Set(newTags.map(normalizeTag).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    );
    onChange(sorted.join(", "));
  };

  const addTag = (tagName: string) => {
    const normalized = normalizeTag(tagName);
    if (!normalized) return;
    if (selectedTags.includes(normalized)) return;
    if (selectedTags.length >= maxTags) return;

    const nextTags = [...selectedTags, normalized];
    emitChange(nextTags);
    setQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    const nextTags = selectedTags.filter((t) => t !== tagToRemove);
    emitChange(nextTags);
    inputRef.current?.focus();
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && !query && selectedTags.length > 0) {
      // Remove last tag when backspacing on empty input
      removeTag(selectedTags[selectedTags.length - 1]!);
      return;
    }

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    const totalOptions = filteredSuggestions.length + (canAddCustom ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % totalOptions);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalOptions) % totalOptions);
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
        const item = filteredSuggestions[highlightedIndex];
        if (item) addTag(item.name);
      } else if (highlightedIndex === filteredSuggestions.length && canAddCustom) {
        addTag(cleanQuery);
      } else if (filteredSuggestions.length > 0 && filteredSuggestions[0]) {
        addTag(filteredSuggestions[0].name);
      } else if (canAddCustom) {
        addTag(cleanQuery);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Interactive Tag Container */}
      <div
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
            setIsOpen(true);
          }
        }}
        className={cn(
          "border-border bg-input/30 focus-within:border-primary/80 focus-within:ring-primary/20 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-none border-2 p-1.5 font-mono text-xs transition-colors focus-within:ring-2",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-text",
          className,
        )}
      >
        {/* Selected Tag Badges */}
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="border-primary/40 bg-primary/10 text-foreground flex items-center gap-1 rounded-none border px-1.5 py-0.5 font-mono text-[11px] font-semibold"
          >
            <HashIcon className="text-primary size-3 shrink-0" />
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="text-muted-foreground hover:text-foreground ml-0.5 rounded-none p-0.5 transition-colors"
                aria-label={`Remove tag ${tag}`}
              >
                <XIcon className="size-2.5" />
              </button>
            )}
          </span>
        ))}

        {/* Embedded Filter Input */}
        {selectedTags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (!disabled) setIsOpen(true);
            }}
            disabled={disabled}
            placeholder={selectedTags.length === 0 ? placeholder : "Add more tags..."}
            className="placeholder:text-muted-foreground min-w-[120px] flex-1 bg-transparent px-1 font-mono text-xs outline-none"
          />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && !disabled && (
        <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-none border-2 shadow-lg">
          <div className="border-border/60 text-muted-foreground bg-muted/40 flex items-center justify-between border-b px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
            <span>{allowCustom ? "Select or Add Tags" : "Canonical Tags (Select Only)"}</span>
            <span>
              {selectedTags.length}/{maxTags}
            </span>
          </div>

          <ul ref={dropdownRef} className="max-h-48 overflow-y-auto py-1 font-mono text-xs">
            {filteredSuggestions.map((tagItem, index) => {
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={tagItem.name}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => addTag(tagItem.name)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 transition-colors",
                    isHighlighted ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <TagIcon
                      className={cn(
                        "size-3 shrink-0",
                        isHighlighted ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                    />
                    <span className="font-semibold">{tagItem.name}</span>
                  </div>

                  {tagItem.count > 0 && (
                    <span
                      className={cn(
                        "py-0.2 rounded-none border px-1 text-[10px]",
                        isHighlighted
                          ? "border-primary-foreground/40 bg-primary-foreground/20 text-primary-foreground"
                          : "border-border bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {tagItem.count} {tagItem.count === 1 ? "tool" : "tools"}
                    </span>
                  )}
                </li>
              );
            })}

            {/* Custom Tag creation option if allowed */}
            {canAddCustom && (
              <li
                onMouseEnter={() => setHighlightedIndex(filteredSuggestions.length)}
                onClick={() => addTag(cleanQuery)}
                className={cn(
                  "border-border/40 text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 border-t px-2.5 py-2 transition-colors",
                  highlightedIndex === filteredSuggestions.length
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/60",
                )}
              >
                <PlusIcon className="size-3" />
                <span>
                  + Add &quot;<strong className="text-foreground">{cleanQuery}</strong>&quot; as
                  custom tag
                </span>
              </li>
            )}

            {/* Empty State when no matches */}
            {filteredSuggestions.length === 0 && !canAddCustom && (
              <li className="text-muted-foreground px-3 py-3 text-center text-xs">
                {query
                  ? !allowCustom
                    ? `No canonical tag matching "${query}". Only existing tags can be selected.`
                    : "No tags found."
                  : "All suggested tags already selected."}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
