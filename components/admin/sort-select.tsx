"use client";

import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import React from "react";

import { Option, SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/utils";

export interface SortSelectProps {
  className?: string;
  disabled?: boolean;
  label?: string;
  onValueChange: (value: string) => void;
  options: Option[];
  triggerClassName?: string;
  value: string;
}

export function SortSelect({
  className,
  disabled,
  label = "Sort:",
  onValueChange,
  options,
  triggerClassName,
  value,
}: SortSelectProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <SlidersHorizontalIcon className="text-brand-purple size-7 shrink-0" />
      <span className="text-muted-foreground text-[11px] font-bold uppercase">{label}</span>
      <SelectField
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        options={options}
        triggerClassName={cn("h-8 min-w-[200px] font-mono text-xs", triggerClassName)}
        variant="secondary"
      />
    </div>
  );
}
