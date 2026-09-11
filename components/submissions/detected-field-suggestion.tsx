"use client";

import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="max-w-[180px] cursor-help truncate sm:max-w-[280px]">
              Detected: <strong className="font-semibold">&quot;{detectedValue}&quot;</strong>
            </span>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            align="start"
            sideOffset={6}
            className="border-line bg-paper text-foreground max-w-xs rounded border p-2.5 font-mono text-xs shadow-xl sm:max-w-md"
          >
            <div className="flex flex-col gap-1.5">
              <div className="border-line text-muted-foreground flex items-center justify-between border-b pb-1 font-mono text-[10px] font-bold uppercase">
                <span>Detected Value</span>
                <span>{detectedValue.length} chars</span>
              </div>
              <div className="max-h-48 overflow-y-auto leading-relaxed wrap-break-word whitespace-pre-wrap select-text">
                {detectedValue}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
