"use client";

import React from "react";

export interface DetectedFieldSuggestionProps {
  currentValue?: string | null;
  detectedValue?: string | null;
  onApply: (val: string) => void;
  onDismiss: () => void;
}

export function DetectedFieldSuggestion({
  currentValue,
  detectedValue,
  onApply,
  onDismiss,
}: DetectedFieldSuggestionProps) {
  if (!detectedValue || !detectedValue.trim()) return null;
  if (currentValue && currentValue.trim().toLowerCase() === detectedValue.trim().toLowerCase()) {
    return null;
  }

  return (
    <div className="animate-in fade-in inline-flex max-w-full items-center gap-1.5 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-500">
      <span className="max-w-[180px] truncate sm:max-w-[280px]" title={detectedValue}>
        Detected: <strong className="font-semibold">&quot;{detectedValue}&quot;</strong>
      </span>
      <button
        type="button"
        onClick={() => onApply(detectedValue)}
        className="shrink-0 cursor-pointer font-bold hover:underline"
      >
        Use this
      </button>
      <button
        type="button"
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground ml-0.5 shrink-0 cursor-pointer"
        title="Dismiss suggestion"
      >
        ✕
      </button>
    </div>
  );
}
