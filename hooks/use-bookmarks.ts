"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

import { useSession } from "@/lib/auth-client";
import { downloadStringAsFile, getResourceId } from "@/lib/utils";
import { Resource } from "@/types";

const CLOUD_BOOKMARKS_EVENT_KEY = "syntax-stash-cloud-bookmarks-updated";
const EMPTY_ARRAY: string[] = [];

let cachedBookmarks: string[] = [];
let isFetching = false;
let hasFetchedBookmarksOnce = false;

function getSnapshot(): string[] {
  return cachedBookmarks;
}

function getServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

export function notifySubscribers() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CLOUD_BOOKMARKS_EVENT_KEY));
  }
}

export function resetBookmarkCache() {
  cachedBookmarks = EMPTY_ARRAY;
  hasFetchedBookmarksOnce = false;
  notifySubscribers();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(CLOUD_BOOKMARKS_EVENT_KEY, callback);
  window.addEventListener("focus", fetchCloudBookmarks);

  return () => {
    window.removeEventListener(CLOUD_BOOKMARKS_EVENT_KEY, callback);
    window.removeEventListener("focus", fetchCloudBookmarks);
  };
}

async function fetchCloudBookmarks() {
  if (typeof window === "undefined" || isFetching) return;
  isFetching = true;
  try {
    const res = await fetch("/api/bookmarks", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.bookmarks)) {
        cachedBookmarks = data.bookmarks;
      }
    } else if (res.status === 401) {
      cachedBookmarks = EMPTY_ARRAY;
    }
  } catch (e) {
    console.error("Failed to fetch cloud bookmarks", e);
  } finally {
    isFetching = false;
    hasFetchedBookmarksOnce = true;
    notifySubscribers();
  }
}

export function useBookmarks() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const userId = session?.user?.id;
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    fetchCloudBookmarks();
  }, [userId]);

  const isLoading = isSessionLoading || (Boolean(userId) && !hasFetchedBookmarksOnce);

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const isBookmarked = useCallback(
    (target: Resource | string): boolean => {
      const id = getResourceId(target);
      return bookmarkedSet.has(id);
    },
    [bookmarkedSet],
  );

  const toggleBookmark = useCallback(async (target: Resource | string) => {
    const id = getResourceId(target);
    if (!id) return;

    // Optimistic UI update
    const currentSet = new Set(cachedBookmarks);
    if (currentSet.has(id)) {
      currentSet.delete(id);
    } else {
      currentSet.add(id);
    }
    cachedBookmarks = Array.from(currentSet);
    notifySubscribers();

    try {
      const res = await fetch("/api/bookmarks", {
        body: JSON.stringify({ resourceId: id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.bookmarks)) {
          cachedBookmarks = data.bookmarks;
          notifySubscribers();
        }
      } else {
        // Revert if unauthorized or failed
        fetchCloudBookmarks();
      }
    } catch (e) {
      console.error("Failed to sync bookmark to cloud", e);
      fetchCloudBookmarks();
    }
  }, []);

  const clearBookmarks = useCallback(async () => {
    cachedBookmarks = EMPTY_ARRAY;
    notifySubscribers();

    try {
      const res = await fetch("/api/bookmarks", { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        cachedBookmarks = data.bookmarks || EMPTY_ARRAY;
        notifySubscribers();
      }
    } catch (e) {
      console.error("Failed to clear cloud bookmarks", e);
      fetchCloudBookmarks();
    }
  }, []);

  const exportBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    const data = JSON.stringify(bookmarks, null, 2);
    downloadStringAsFile(data, "syntax-stash-bookmarks.json", "application/json");
  }, [bookmarks]);

  const importBookmarks = useCallback(
    async (jsonContent: string): Promise<{ count: number; error?: string; success: boolean }> => {
      try {
        const parsed = JSON.parse(jsonContent);
        if (!Array.isArray(parsed)) {
          return {
            count: 0,
            error: "JSON file must contain an array of bookmark IDs.",
            success: false,
          };
        }
        const validIds = parsed.filter(
          (id): id is string => typeof id === "string" && id.trim().length > 0,
        );
        if (validIds.length === 0) {
          return {
            count: 0,
            error: "No valid bookmark IDs found in the file.",
            success: false,
          };
        }

        let addedCount = 0;
        for (const id of validIds) {
          if (!bookmarkedSet.has(id)) {
            await toggleBookmark(id);
            addedCount++;
          }
        }

        return { count: addedCount, success: true };
      } catch (e) {
        console.error("Failed to import bookmarks", e);
        return {
          count: 0,
          error: "Invalid JSON format. Please verify the file syntax.",
          success: false,
        };
      }
    },
    [bookmarkedSet, toggleBookmark],
  );

  return {
    bookmarkedSet,
    bookmarks,
    bookmarksCount: bookmarks.length,
    clearBookmarks,
    exportBookmarks,
    importBookmarks,
    isBookmarked,
    isLoading,
    refetchBookmarks: fetchCloudBookmarks,
    toggleBookmark,
  };
}
