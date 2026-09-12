"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  containerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  itemClassName?: string;
  label?: string;
  labelClassName?: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  triggerClassName?: string;
  value: string;
  variant?: "accent" | "default" | "destructive" | "primary" | "rose" | "secondary";
}

export function SelectField({
  containerClassName,
  contentClassName,
  disabled,
  itemClassName,
  label,
  labelClassName,
  onValueChange,
  options,
  placeholder,
  triggerClassName,
  value,
  variant = "default",
}: SelectFieldProps) {
  const selectComponent = (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onValueChange(v);
      }}
      disabled={disabled}
    >
      <SelectTrigger variant={variant} className={cn("w-full cursor-pointer", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn("shadow-none", contentClassName)}>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            variant={variant}
            className={itemClassName}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!label) {
    return selectComponent;
  }

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label className={labelClassName}>{label}</Label>
      {selectComponent}
    </div>
  );
}
