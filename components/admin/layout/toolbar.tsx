"use client";

import React from "react";

import { cn } from "@/lib/utils";

export interface ToolbarProps {
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  filters?: React.ReactNode;
  footer?: React.ReactNode;
  search?: React.ReactNode;
}

export function Toolbar({ actions, children, className, filters, footer, search }: ToolbarProps) {
  return (
    <div
      className={cn(
        "border-line bg-surface/50 mb-6 space-y-4 rounded-lg border-[1.5px] p-4 font-mono text-xs",
        className,
      )}
    >
      {(search || filters || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {search && <div className="min-w-0 flex-1">{search}</div>}
          {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      {children}

      {footer && (
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] pt-3">
          {footer}
        </div>
      )}
    </div>
  );
}
