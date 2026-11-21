"use client";

import {
  CaretDownIcon,
  CheckIcon,
  HeartbeatIcon,
} from "@phosphor-icons/react";
import React, { useMemo, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface HealthOption {
  count: number;
  icon?: string;
  label: string;
  value: string;
}

export interface HealthMegaFilterProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  onValueChange: (value: string) => void;
  options: HealthOption[];
  totalResourcesCount: number;
  triggerClassName?: string;
  value: string;
}

export function HealthMegaFilter({
  className,
  disabled = false,
  label = "Health & Data:",
  onValueChange,
  options,
  totalResourcesCount,
  triggerClassName,
  value,
}: HealthMegaFilterProps) {
  const [open, setOpen] = useState(false);

  const isAllSelected = value === "all" || !value;

  const currentOption = useMemo(() => {
    if (isAllSelected) return null;
    return options.find((o) => o.value === value) || null;
  }, [isAllSelected, options, value]);

  const handleSelect = (val: string) => {
    onValueChange(val);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <HeartbeatIcon weight="duotone" className="size-6 shrink-0 text-rose-500" />
      <span className="text-muted-foreground text-[11px] font-bold whitespace-nowrap uppercase">
        {label}
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "group flex h-8 min-w-[200px] max-w-[320px] cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background/50 px-2.5 font-mono text-xs shadow-xs transition-all outline-none",
              "hover:bg-surface focus-visible:border-rose-500/60 focus-visible:ring-1 focus-visible:ring-rose-500/60",
              open && "border-rose-500/60 ring-1 ring-rose-500/60 bg-surface",
              disabled && "cursor-not-allowed opacity-50",
              triggerClassName,
            )}
            aria-expanded={open}
            aria-label="Filter by health and data diagnostics"
          >
            <div className="flex min-w-0 items-center gap-1.5 truncate">
              {isAllSelected ? (
                <>
                  <span className="truncate text-foreground font-medium">Health / Data: All</span>
                  <span className="text-muted-foreground text-[10px] tabular-nums font-semibold">
                    ({totalResourcesCount})
                  </span>
                </>
              ) : (
                <>
                  <span className="truncate font-semibold text-rose-400">
                    {currentOption?.label || value}
                  </span>
                  {currentOption && (
                    <span className="text-[10px] font-semibold tabular-nums text-rose-400/80">
                      ({currentOption.count})
                    </span>
                  )}
                </>
              )}
            </div>

            <CaretDownIcon
              weight="bold"
              className={cn(
                "size-3 text-muted-foreground shrink-0 transition-transform duration-200",
                open && "rotate-180 text-foreground",
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="z-70 w-[calc(100vw-2rem)] max-w-3xl lg:max-w-4xl rounded-2xl border-[1.5px] border-white/12 bg-[#0e0e11]/98 p-0 font-mono text-xs shadow-[0_24px_60px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2">
              <HeartbeatIcon weight="bold" className="size-4 text-rose-500" />
              <span className="font-sans text-xs font-semibold text-white">
                Health & Metadata Diagnostics
              </span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                {options.length} Checks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs transition-all",
                  isAllSelected
                    ? "border-rose-500/60 bg-rose-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.25)]"
                    : "border-white/10 bg-[#161619] text-zinc-300 hover:border-white/20 hover:bg-[#1f1f25] hover:text-white",
                )}
              >
                <HeartbeatIcon weight={isAllSelected ? "fill" : "bold"} className="size-3.5" />
                <span>All Resources</span>
                <span
                  className={cn(
                    "rounded-sm px-1 text-[10px] tabular-nums font-semibold",
                    isAllSelected ? "bg-black/25 text-white" : "bg-white/5 text-zinc-400",
                  )}
                >
                  {totalResourcesCount}
                </span>
                {isAllSelected && <CheckIcon weight="bold" className="size-3" />}
              </button>

              {!isAllSelected && (
                <button
                  type="button"
                  onClick={() => handleSelect("all")}
                  className="cursor-pointer text-[11px] text-zinc-400 hover:text-rose-400 underline-offset-4 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Cloudflare-style Diagnostic Grid */}
          <div className="no-scrollbar max-h-[60vh] overflow-y-auto p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {options.map((opt) => {
                const isSelected = value === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(isSelected ? "all" : opt.value)}
                    className={cn(
                      "group relative flex cursor-pointer items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all duration-150",
                      isSelected
                        ? "border-rose-500/60 bg-rose-500/15 text-white shadow-[0_0_15px_rgba(244,63,94,0.18)] ring-1 ring-rose-500/60"
                        : "border-white/6 bg-[#141417] text-zinc-300 hover:border-rose-500/30 hover:bg-[#1b1b22] hover:text-white hover:scale-[1.015]",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {opt.icon ? (
                        <span className="text-sm shrink-0 leading-none">{opt.icon}</span>
                      ) : (
                        <span
                          className={cn(
                            "size-1.5 shrink-0 rounded-full transition-colors",
                            isSelected ? "bg-rose-500" : "bg-zinc-600 group-hover:bg-zinc-400",
                          )}
                        />
                      )}
                      <span className="truncate font-sans text-xs font-medium">
                        {opt.label}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition-colors",
                          isSelected
                            ? "bg-rose-500 text-white font-bold"
                            : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-200",
                        )}
                      >
                        {opt.count}
                      </span>
                      {isSelected && (
                        <CheckIcon weight="bold" className="size-3 text-rose-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.01] px-5 py-2.5 text-[11px] text-zinc-500">
            <span>
              Showing {options.length} diagnostic checks • {totalResourcesCount} resources
            </span>
            <span className="hidden sm:inline text-zinc-600">
              Click any check to filter issues immediately
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
