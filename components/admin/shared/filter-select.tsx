"use client";

import { FunnelIcon } from "@phosphor-icons/react";
import React from "react";

import { Option, SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/utils";

export interface FilterSelectProps {
  className?: string;
  disabled?: boolean;
  iconClassName?: string;
  label?: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  triggerClassName?: string;
  value: string;
  variant?: "accent" | "default" | "destructive" | "primary" | "rose" | "secondary";
}

export function FilterSelect({
  className,
  disabled,
  iconClassName,
  label = "Filter:",
  onValueChange,
  options,
  placeholder,
  triggerClassName,
  value,
  variant = "accent",
}: FilterSelectProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <FunnelIcon weight="duotone" className={cn("text-accent size-6 shrink-0", iconClassName)} />
      <span className="text-muted-foreground text-[11px] font-bold uppercase">{label}</span>
      <SelectField
        disabled={disabled}
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={placeholder}
        triggerClassName={cn("h-8 min-w-[200px] font-mono text-xs", triggerClassName)}
        variant={variant}
      />
    </div>
  );
}
