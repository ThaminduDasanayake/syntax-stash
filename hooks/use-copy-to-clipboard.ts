"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyToClipboard<T = string>(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    (text: string, id?: T) => {
      if (typeof window === "undefined" || !text) return;

      const triggerSuccess = () => {
        setCopied(true);
        if (id !== undefined) setCopiedItem(id);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
          setCopiedItem(null);
        }, timeout);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(triggerSuccess)
          .catch(() => {
            // Fallback for clipboard write permission errors
            tryFallbackCopy(text, triggerSuccess);
          });
      } else {
        tryFallbackCopy(text, triggerSuccess);
      }
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

function tryFallbackCopy(text: string, onSuccess: () => void) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    if (successful) {
      onSuccess();
    }
  } catch (err) {
    console.warn("Fallback clipboard copy failed:", err);
  }
}
