"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { downloadStringAsFile, getResourceId } from "@/lib/utils";
import { Tool } from "@/types";

const BOOKMARKS_STORAGE_KEY = "syntax_stash_bookmarks";
const BOOKMARKS_EVENT_KEY = "syntax-stash-bookmarks-updated";

const EMPTY_BOOKMARKS: string[] = [];

let cachedBookmarks: string[] = [];
let cachedRawString: string | null = null;

function getBookmarksFromStorage(): string[] {
  if (typeof window === "undefined") return EMPTY_BOOKMARKS;
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw === cachedRawString) return cachedBookmarks;
    cachedRawString = raw;
    if (!raw) {
      cachedBookmarks = EMPTY_BOOKMARKS;
      return cachedBookmarks;
    }
    const parsed = JSON.parse(raw);
    cachedBookmarks = Array.isArray(parsed) ? parsed : EMPTY_BOOKMARKS;
    return cachedBookmarks;
  } catch (e) {
    console.error("Failed to parse bookmarks from localStorage", e);
    return EMPTY_BOOKMARKS;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_BOOKMARKS;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === BOOKMARKS_STORAGE_KEY || e.key === null) {
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BOOKMARKS_EVENT_KEY, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BOOKMARKS_EVENT_KEY, handleCustomEvent);
  };
}

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribe,
    getBookmarksFromStorage,
    getServerSnapshot,
  );

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const isBookmarked = useCallback(
    (target: Tool | string): boolean => {
      const id = getResourceId(target);
      return bookmarkedSet.has(id);
    },
    [bookmarkedSet],
  );

  const toggleBookmark = useCallback((target: Tool | string) => {
    if (typeof window === "undefined") return;
    const id = getResourceId(target);
    if (!id) return;

    const current = getBookmarksFromStorage();
    const set = new Set(current);
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }

    const updated = Array.from(set);
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
      cachedRawString = JSON.stringify(updated);
      cachedBookmarks = updated;
      window.dispatchEvent(new Event(BOOKMARKS_EVENT_KEY));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  }, []);

  const clearBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
      cachedRawString = null;
      cachedBookmarks = [];
      window.dispatchEvent(new Event(BOOKMARKS_EVENT_KEY));
    } catch (e) {
      console.error("Failed to clear bookmarks", e);
    }
  }, []);

  const exportBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    const data = JSON.stringify(bookmarks, null, 2);
    downloadStringAsFile(data, "syntax-stash-bookmarks.json", "application/json");
  }, [bookmarks]);

  const importBookmarks = useCallback((jsonContent: string): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const parsed = JSON.parse(jsonContent);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
        const merged = Array.from(new Set([...cachedBookmarks, ...parsed]));
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(merged));
        cachedRawString = JSON.stringify(merged);
        cachedBookmarks = merged;
        window.dispatchEvent(new Event(BOOKMARKS_EVENT_KEY));
        return true;
      }
    } catch (e) {
      console.error("Failed to import bookmarks", e);
    }
    return false;
  }, []);

  return {
    bookmarkedSet,
    bookmarks,
    bookmarksCount: bookmarks.length,
    clearBookmarks,
    exportBookmarks,
    importBookmarks,
    isBookmarked,
    toggleBookmark,
  };
}

