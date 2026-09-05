"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { isAdmin } from "@/lib/admin";
import { useSession } from "@/lib/auth-client";

export function usePendingSubmissions() {
  const { data: session } = useSession();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevCountRef = useRef<number | null>(null);
  const isInitialFetchRef = useRef<boolean>(true);

  const isUserAdmin = Boolean(session?.user?.email && isAdmin(session.user.email));

  const fetchCount = useCallback(async () => {
    if (!isUserAdmin) {
      setCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/submissions/count", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      const newCount = typeof data.count === "number" ? data.count : 0;

      // If a new submission arrived while the user was active/online
      if (
        !isInitialFetchRef.current &&
        prevCountRef.current !== null &&
        newCount > prevCountRef.current
      ) {
        const diff = newCount - prevCountRef.current;
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

      isInitialFetchRef.current = false;
      prevCountRef.current = newCount;
      setCount(newCount);
    } catch (err) {
      console.error("Failed to fetch pending submissions count:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isUserAdmin]);

  useEffect(() => {
    if (!isUserAdmin) {
      setCount(0);
      prevCountRef.current = null;
      isInitialFetchRef.current = true;
      return;
    }

    fetchCount();

    // Poll every 45 seconds when window is active
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchCount();
      }
    }, 45000);

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchCount();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [fetchCount, isUserAdmin]);

  return {
    count,
    isInitialLoading: isLoading,
    isUserAdmin,
    refetch: fetchCount,
  };
}
