"use client";

import { UserIcon } from "@phosphor-icons/react";
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
import { cn, parseAuthors, slugifyAuthor } from "@/lib/utils";

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
  id?: string;
  links?: AuthorLinks | null;
  name: string;
  slug: string;
}

export interface AuthorComboboxProps {
  allowCustom?: boolean;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
  maxAuthors?: number;
  onChange: (value: string) => void;
  onRequestCreateAuthor?: (authorName: string) => void;
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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("syntax-stash-authors-updated"));
  }
  try {
    authorsChannel?.postMessage({ type: "AUTHORS_INVALIDATE" });
  } catch {
    // Ignore cross-tab messaging failure
  }
}

export function registerNewAuthorLocally(newAuthor: AuthorOption) {
  if (cachedAuthors) {
    if (
      !cachedAuthors.some(
        (a) => a.slug === newAuthor.slug || a.name.toLowerCase() === newAuthor.name.toLowerCase(),
      )
    ) {
      cachedAuthors = [...cachedAuthors, newAuthor].sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  invalidateAuthorCache();
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
      cachedAuthors = list.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
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
  placeholder = "Search creators in catalog...",
  value,
}: AuthorComboboxProps) {
  const [authors, setAuthors] = useState<AuthorOption[]>(() => {
    if (!cachedAuthors) return [];
    return [...cachedAuthors].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  });

  const anchor = useComboboxAnchor();

  useEffect(() => {
    let mounted = true;

    const syncAuthors = (force = false) => {
      fetchAuthorList(force).then((list) => {
        if (mounted && list.length > 0) {
          const sorted = [...list].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          );
          setAuthors(sorted);
        }
      });
    };

    // 1. Initial Load
    syncAuthors();

    // 2. Window event listener when an author is created or edited
    const handleLocalUpdate = () => {
      syncAuthors(true);
    };
    window.addEventListener("syntax-stash-authors-updated", handleLocalUpdate);

    // 3. Cross-tab real-time listener
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === "AUTHORS_INVALIDATE") {
        syncAuthors(true);
      }
    };
    authorsChannel?.addEventListener("message", handleBroadcast);

    return () => {
      mounted = false;
      window.removeEventListener("syntax-stash-authors-updated", handleLocalUpdate);
      authorsChannel?.removeEventListener("message", handleBroadcast);
    };
  }, []);

  const selectedValues = useMemo(() => {
    return parseAuthors(value);
  }, [value]);

  const authorNames = useMemo(() => {
    return authors.map((a) => a.name);
  }, [authors]);

  const authorMap = useMemo(() => {
    const map = new Map<string, AuthorOption>();
    for (const a of authors) {
      map.set(a.name, a);
    }
    return map;
  }, [authors]);

  const handleValueChange = (newValues: string[]) => {
    const next = newValues.slice(0, maxAuthors);
    onChange(next.join(", "));

    if (onSelectAuthor && next.length > 0) {
      const latestAdded = next.find((n) => !selectedValues.includes(n)) || next[next.length - 1];
      if (latestAdded) {
        const found = authors.find(
          (a) =>
            a.name.toLowerCase() === latestAdded.toLowerCase() ||
            a.slug === slugifyAuthor(latestAdded),
        );
        if (found) {
          onSelectAuthor(found);
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
        items={authorNames}
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
                {values.map((authorName: string) => (
                  <ComboboxChip
                    key={authorName}
                    className="bg-muted text-foreground border-line/60 rounded border text-xs"
                  >
                    <UserIcon className="size-3 text-zinc-400" />
                    <span>{authorName}</span>
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
            No creators found.
          </ComboboxEmpty>
          <ComboboxList className="no-scrollbar max-h-60 overflow-y-auto p-1 font-mono text-xs">
            {(item: string) => {
              const authorObj = authorMap.get(item);
              return (
                <ComboboxItem
                  key={item}
                  value={item}
                  className="cursor-pointer gap-2 py-1.5 pr-8 pl-2 font-mono text-xs"
                >
                  <UserIcon className="text-muted-foreground size-3.5 shrink-0" />
                  <span className="flex-1 truncate">{item}</span>
                  {authorObj?.count !== undefined && authorObj.count > 0 && (
                    <span className="text-muted-foreground text-[10px] tabular-nums">
                      ({authorObj.count})
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
