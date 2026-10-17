"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { toast } from "sonner";

const PALETTE_BOOKMARKS_EVENT = "syntax-stash-palette-bookmarks-updated";
const STORAGE_KEY = "syntax-stash-bookmarked-palettes";
const EMPTY_ARRAY: string[] = [];

let cachedBookmarks: string[] = [];
let hasLoaded = false;

function getSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;
  if (!hasLoaded) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          cachedBookmarks = parsed.filter(
            (id): id is string => typeof id === "string" && id.trim().length > 0,
          );
        }
      }
    } catch (e) {
      console.error("Failed to load palette bookmarks from localStorage", e);
    }
    hasLoaded = true;
  }
  return cachedBookmarks;
}

function getServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PALETTE_BOOKMARKS_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      hasLoaded = false;
      notifySubscribers();
    }
  };

  window.addEventListener(PALETTE_BOOKMARKS_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(PALETTE_BOOKMARKS_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function usePaletteBookmarks() {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const isBookmarked = useCallback(
    (name: string): boolean => {
      return bookmarkedSet.has(name);
    },
    [bookmarkedSet],
  );

  const toggleBookmark = useCallback((name: string) => {
    if (!name || typeof window === "undefined") return;

    const currentList = getSnapshot();
    const currentSet = new Set(currentList);
    const wasBookmarked = currentSet.has(name);

    if (wasBookmarked) {
      currentSet.delete(name);
      toast(`Removed "${name}" from Color Palettes.`);
    } else {
      currentSet.add(name);
      toast.success(`Saved "${name}" to Color Palettes collection.`);
    }

    cachedBookmarks = Array.from(currentSet);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedBookmarks));
    } catch (e) {
      console.error("Failed to persist palette bookmark to localStorage", e);
    }

    notifySubscribers();
  }, []);

  const removeBookmark = useCallback((name: string) => {
    if (!name || typeof window === "undefined") return;

    const currentList = getSnapshot();
    const currentSet = new Set(currentList);
    if (currentSet.has(name)) {
      currentSet.delete(name);
      cachedBookmarks = Array.from(currentSet);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedBookmarks));
      } catch (e) {
        console.error("Failed to persist palette bookmark to localStorage", e);
      }
      notifySubscribers();
      toast(`Removed "${name}" from Color Palettes.`);
    }
  }, []);

  const clearAllBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    cachedBookmarks = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear palette bookmarks from localStorage", e);
    }
    notifySubscribers();
    toast("Cleared all bookmarked color palettes.");
  }, []);

  return {
    bookmarkedPalettes: bookmarks,
    bookmarkedSet,
    clearAllBookmarks,
    count: bookmarks.length,
    isBookmarked,
    removeBookmark,
    toggleBookmark,
  };
}
