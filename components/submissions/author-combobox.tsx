"use client";

import { GlobeIcon, UserIcon, XIcon, XLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface AuthorLinks {
  blog?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface AuthorOption {
  count?: number;
  links?: AuthorLinks | null;
  name: string;
  slug: string;
}

export interface AuthorComboboxProps {
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  maxAuthors?: number;
  onChange: (value: string) => void;
  onSelectAuthor?: (author: AuthorOption) => void;
  placeholder?: string;
  value: string | string[] | null | undefined;
}

// Global module cache to prevent duplicate requests across renders
let cachedAuthors: AuthorOption[] | null = null;
let fetchPromise: Promise<AuthorOption[]> | null = null;

// Cross-tab synchronization channel
let authorsChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    authorsChannel = new BroadcastChannel("syntax-stash-authors");
  } catch {
    // Fallback if BroadcastChannel is not permitted in sandbox
  }
}

export function invalidateAuthorCache() {
  cachedAuthors = null;
  fetchPromise = null;
  try {
    authorsChannel?.postMessage({ type: "AUTHORS_INVALIDATE" });
  } catch {
    // Ignore cross-tab messaging failure
  }
}

export async function fetchAuthorList(forceRefresh = false): Promise<AuthorOption[]> {
  if (!forceRefresh && cachedAuthors) return cachedAuthors;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch("/api/authors", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load authors");
      const data = await res.json();
      const list: AuthorOption[] = data.authors || [];
      cachedAuthors = list.sort((a, b) => a.name.localeCompare(b.name));
      return cachedAuthors!;
    } catch {
      return cachedAuthors || [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function AuthorCombobox({
  className,
  containerClassName,
  disabled = false,
  maxAuthors = 10,
  onChange,
  onSelectAuthor,
  placeholder = "Search creators or type a name...",
  value,
}: AuthorComboboxProps) {
  const [authors, setAuthors] = useState<AuthorOption[]>(cachedAuthors || []);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let mounted = true;

    const syncAuthors = (force = false) => {
      fetchAuthorList(force).then((list) => {
        if (mounted && list.length > 0) {
          setAuthors(list);
        }
      });
    };

    // 1. Initial Load
    syncAuthors();

    // 2. Cross-tab real-time listener (when author created/edited in another tab)
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "AUTHORS_INVALIDATE") {
        cachedAuthors = null;
        fetchPromise = null;
        syncAuthors(true);
      }
    };

    if (authorsChannel) {
      authorsChannel.addEventListener("message", handleBroadcast);
    }

    // 3. Tab focus / visibility change (when user returns to this tab from another window/tab)
    const handleFocus = () => {
      syncAuthors(true);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      mounted = false;
      if (authorsChannel) {
        authorsChannel.removeEventListener("message", handleBroadcast);
      }
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  // Parse current selected authors into an array
  const selectedAuthors: string[] = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  }, [value]);

  const cleanQuery = query.trim().toLowerCase();

  // Filter available author suggestions (excluding already selected ones) in alphabetical order
  const filteredAuthors = useMemo(() => {
    const selectedLower = new Set(selectedAuthors.map((a) => a.toLowerCase()));
    const unselected = authors.filter((a) => !selectedLower.has(a.name.toLowerCase()));

    if (!cleanQuery) {
      return unselected.slice(0, 10);
    }
    return unselected
      .filter((a) => a.name.toLowerCase().includes(cleanQuery) || a.slug.includes(cleanQuery))
      .slice(0, 10);
  }, [authors, cleanQuery, selectedAuthors]);

  // Check if current typed value exactly matches an author in list or is already selected
  const exactMatch = authors.some((a) => a.name.toLowerCase() === cleanQuery);
  const isAlreadySelected = selectedAuthors.some((a) => a.toLowerCase() === cleanQuery);

  const emitChange = (newAuthors: string[]) => {
    onChange(newAuthors.join(", "));
  };

  const addAuthor = (authorName: string, authorOption?: AuthorOption) => {
    const trimmed = authorName.trim();
    if (!trimmed) return;
    if (selectedAuthors.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return;
    if (selectedAuthors.length >= maxAuthors) return;

    const nextAuthors = [...selectedAuthors, trimmed];
    emitChange(nextAuthors);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(-1);

    if (authorOption && onSelectAuthor) {
      onSelectAuthor(authorOption);
    }

    inputRef.current?.focus();
  };

  const removeAuthor = (authorToRemove: string) => {
    const nextAuthors = selectedAuthors.filter(
      (a) => a.toLowerCase() !== authorToRemove.toLowerCase(),
    );
    emitChange(nextAuthors);
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

    // Remove last author on Backspace if query is empty
    if (e.key === "Backspace" && !query && selectedAuthors.length > 0) {
      const lastAuthor = selectedAuthors[selectedAuthors.length - 1];
      if (lastAuthor) {
        removeAuthor(lastAuthor);
      }
      return;
    }

    // Comma or Enter to add creator
    if (e.key === "," || (e.key === "Enter" && !isOpen)) {
      e.preventDefault();
      if (query.trim()) {
        addAuthor(query.trim());
      }
      return;
    }

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    const showCustomOption = cleanQuery && !exactMatch && !isAlreadySelected;
    const totalItems = filteredAuthors.length + (showCustomOption ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredAuthors.length) {
        const item = filteredAuthors[highlightedIndex];
        if (item) addAuthor(item.name, item);
      } else if (showCustomOption && highlightedIndex === filteredAuthors.length) {
        addAuthor(query.trim());
      } else if (filteredAuthors.length === 1 && filteredAuthors[0]) {
        addAuthor(filteredAuthors[0].name, filteredAuthors[0]);
      } else if (query.trim()) {
        addAuthor(query.trim());
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll("li");
      const target = items[highlightedIndex];
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className={cn("relative w-full", containerClassName)}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "border-border bg-input/30 focus-within:border-primary/80 focus-within:ring-primary/20 flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-none border-2 p-1.5 font-mono text-xs transition-colors focus-within:ring-2",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {/* Selected Author Badges */}
        {selectedAuthors.map((authName) => (
          <span
            key={authName}
            className="border-border bg-muted/80 text-foreground inline-flex items-center gap-1 rounded-none border px-2 py-0.5 font-mono text-[11px] font-medium"
          >
            <UserIcon className="text-primary size-3 shrink-0" />
            <span className="max-w-40 truncate">{authName}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAuthor(authName);
                }}
                className="text-muted-foreground hover:text-destructive p-0.5 transition-colors focus-visible:outline-none"
                aria-label={`Remove ${authName}`}
              >
                <XIcon className="size-3" />
              </button>
            )}
          </span>
        ))}

        {/* Search Input */}
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
            if (!disabled) {
              setIsOpen(true);
            }
          }}
          disabled={disabled || selectedAuthors.length >= maxAuthors}
          placeholder={selectedAuthors.length === 0 ? placeholder : "Add another author..."}
          className="placeholder:text-muted-foreground min-w-28 flex-1 bg-transparent px-1.5 py-0.5 font-mono text-xs focus-visible:outline-none"
        />

        {selectedAuthors.length > 0 && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              emitChange([]);
              setQuery("");
              inputRef.current?.focus();
            }}
            className="text-muted-foreground hover:text-foreground ml-auto p-1 transition-colors"
            aria-label="Clear all authors"
            title="Clear all authors"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="border-border bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-none border-2 shadow-lg">
          <div className="border-border/60 text-muted-foreground bg-muted/40 border-b px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider uppercase">
            {cleanQuery ? "Matching Creators" : "Suggested Creators (A-Z)"}
          </div>

          <ul ref={dropdownRef} className="max-h-48 overflow-y-auto py-1 font-mono text-xs">
            {filteredAuthors.map((author, index) => {
              const isHighlighted = index === highlightedIndex;
              const hasLinks = author.links && Object.values(author.links).some(Boolean);

              return (
                <li
                  key={author.slug}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => addAuthor(author.name, author)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 px-2.5 py-1.5 transition-colors",
                    isHighlighted ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <UserIcon
                      className={cn(
                        "size-3.5 shrink-0",
                        isHighlighted ? "text-primary-foreground" : "text-muted-foreground",
                      )}
                    />
                    <span className="truncate">{author.name}</span>
                    {typeof author.count === "number" && author.count > 0 && (
                      <span
                        className={cn(
                          "py-0.2 rounded-none border px-1 text-[10px]",
                          isHighlighted
                            ? "border-primary-foreground/40 bg-primary-foreground/20 text-primary-foreground"
                            : "border-border bg-muted/40 text-muted-foreground",
                        )}
                      >
                        {author.count} {author.count === 1 ? "tool" : "tools"}
                      </span>
                    )}
                  </div>

                  {/* Social Profile Badges */}
                  {hasLinks && (
                    <div className="flex shrink-0 items-center gap-1 opacity-80">
                      {author.links?.website && (
                        <GlobeIcon
                          className={cn(
                            "size-3",
                            isHighlighted ? "text-primary-foreground" : "text-muted-foreground",
                          )}
                        />
                      )}
                      {author.links?.twitter && (
                        <XLogoIcon
                          className={cn(
                            "size-3",
                            isHighlighted ? "text-primary-foreground" : "text-muted-foreground",
                          )}
                        />
                      )}
                      {author.links?.github && (
                        <Image
                          src="/github.svg"
                          alt="GitHub"
                          width={12}
                          height={12}
                          className={cn(
                            "size-3",
                            isHighlighted ? "brightness-0 invert" : "opacity-60 dark:invert",
                          )}
                        />
                      )}
                    </div>
                  )}
                </li>
              );
            })}

            {/* If query has no exact match and is not already selected, offer "+ Add as new creator" */}
            {cleanQuery && !exactMatch && !isAlreadySelected && (
              <li
                onMouseEnter={() => setHighlightedIndex(filteredAuthors.length)}
                onClick={() => addAuthor(query.trim())}
                className={cn(
                  "border-border/40 text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 border-t px-2.5 py-2 transition-colors",
                  highlightedIndex === filteredAuthors.length
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/60",
                )}
              >
                <span>
                  + Add &quot;<strong className="text-foreground">{query.trim()}</strong>&quot; as
                  creator
                </span>
              </li>
            )}

            {filteredAuthors.length === 0 && (!cleanQuery || exactMatch || isAlreadySelected) && (
              <li className="text-muted-foreground px-2.5 py-2 text-center text-xs">
                {selectedAuthors.length >= maxAuthors
                  ? `Maximum limit of ${maxAuthors} authors reached.`
                  : "No more authors to suggest."}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
