"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { isAdmin } from "@/lib/admin";
import { useSession } from "@/lib/auth-client";

// Global module state shared across all components and instances on the page
let globalPendingCount = 0;
let globalIsLoading = false;
let prevCount: number | null = null;
let isInitialFetch = true;
let lastFetchTime = 0;
let inFlightFetch: Promise<number> | null = null;
const listeners = new Set<(count: number, isLoading: boolean) => void>();

// Cross-tab synchronization channel
let submissionsChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    submissionsChannel = new BroadcastChannel("syntax-stash-submissions");
    submissionsChannel.onmessage = (event) => {
      if (event.data?.type === "COUNT_UPDATED" && typeof event.data.count === "number") {
        globalPendingCount = event.data.count;
        notifyListeners();
      } else if (event.data?.type === "REFETCH_REQUESTED") {
        triggerSharedFetch(true);
      }
    };
  } catch {
    // Ignore if BroadcastChannel is blocked
  }
}

function notifyListeners() {
  listeners.forEach((listener) => listener(globalPendingCount, globalIsLoading));
}

export function broadcastSubmissionsUpdated(newCount?: number) {
  try {
    if (typeof newCount === "number") {
      globalPendingCount = newCount;
      notifyListeners();
      submissionsChannel?.postMessage({ count: newCount, type: "COUNT_UPDATED" });
    } else {
      submissionsChannel?.postMessage({ type: "REFETCH_REQUESTED" });
      triggerSharedFetch(true);
    }
  } catch {
    // Ignore cross-tab message failure
  }
}

async function triggerSharedFetch(force = false): Promise<number> {
  const now = Date.now();
  // Throttle: don't fetch if last fetch was less than 20 seconds ago, unless forced
  if (!force && now - lastFetchTime < 20000 && lastFetchTime > 0) {
    return globalPendingCount;
  }

  // Deduplicate concurrent requests
  if (inFlightFetch) {
    return inFlightFetch;
  }

  inFlightFetch = (async () => {
    try {
      globalIsLoading = true;
      notifyListeners();

      const res = await fetch("/api/admin/submissions/count", {
        cache: "no-store",
      });

      if (!res.ok) return globalPendingCount;

      const data = await res.json();
      const newCount = typeof data.count === "number" ? data.count : 0;
      lastFetchTime = Date.now();

      // Show toast if a new submission arrived while the user was active
      if (!isInitialFetch && prevCount !== null && newCount > prevCount) {
        const diff = newCount - prevCount;
        toast.info(
          diff === 1 ? "New tool submitted for review!" : `${diff} new tools submitted for review!`,
          {
            action: {
              label: "Review",
              onClick: () => {
                window.location.href = "/admin/submissions";
              },
            },
            duration: 8000,
          },
        );
      }

      isInitialFetch = false;
      prevCount = newCount;
      globalPendingCount = newCount;

      // Broadcast to other open tabs
      try {
        submissionsChannel?.postMessage({ count: newCount, type: "COUNT_UPDATED" });
      } catch {
        // Ignore
      }

      return newCount;
    } catch (err) {
      console.error("Failed to fetch pending submissions count:", err);
      return globalPendingCount;
    } finally {
      globalIsLoading = false;
      inFlightFetch = null;
      notifyListeners();
    }
  })();

  return inFlightFetch;
}

// Global timer manager so only 1 timer runs regardless of how many components are mounted
let globalInterval: ReturnType<typeof setInterval> | null = null;
let activeAdminHookCount = 0;

function startGlobalPolling() {
  if (globalInterval || typeof window === "undefined") return;

  // Poll every 60 seconds when document is visible
  globalInterval = setInterval(() => {
    if (document.visibilityState === "visible") {
      triggerSharedFetch();
    }
  }, 60000);
}

function stopGlobalPolling() {
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
}

export function usePendingSubmissions() {
  const { data: session } = useSession();
  const [count, setCount] = useState<number>(globalPendingCount);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);

  const isUserAdmin = Boolean(session?.user?.email && isAdmin(session.user.email));

  const refetch = useCallback(async () => {
    if (isUserAdmin) {
      await triggerSharedFetch(true);
    }
  }, [isUserAdmin]);

  useEffect(() => {
    if (!isUserAdmin) {
      setCount(0);
      return;
    }

    // Subscribe component to global shared state
    const handleUpdate = (updatedCount: number, updatedLoading: boolean) => {
      setCount(updatedCount);
      setIsLoading(updatedLoading);
    };

    listeners.add(handleUpdate);
    activeAdminHookCount++;

    if (activeAdminHookCount === 1) {
      startGlobalPolling();
      triggerSharedFetch();
    } else {
      // Return immediate cached state
      setCount(globalPendingCount);
    }

    const handleWindowFocus = () => {
      if (document.visibilityState === "visible") {
        // Debounced shared fetch
        triggerSharedFetch();
      }
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      listeners.delete(handleUpdate);
      window.removeEventListener("focus", handleWindowFocus);
      activeAdminHookCount--;

      if (activeAdminHookCount <= 0) {
        activeAdminHookCount = 0;
        stopGlobalPolling();
      }
    };
  }, [isUserAdmin]);

  return {
    count,
    isInitialLoading: isLoading,
    isUserAdmin,
    refetch,
  };
}
