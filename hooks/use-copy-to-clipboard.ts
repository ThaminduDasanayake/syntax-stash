"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard<T = string>(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    (text: string, id?: T) => {
      if (typeof window === "undefined" || !navigator.clipboard) {
        console.warn("Clipboard not supported");
        return;
      }

      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        if (id !== undefined) setCopiedItem(id);

        // Clear any existing timeout to prevent stale state bugs
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          setCopiedItem(null);
        }, timeout);
      });
    },
    [timeout],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copiedItem, copy };
}
