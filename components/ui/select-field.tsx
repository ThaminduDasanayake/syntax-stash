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

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
}

export function SelectField({
  value,
  onValueChange,
  options,
  label,
  placeholder,
  disabled,
  containerClassName,
  labelClassName,
  triggerClassName,
}: SelectFieldProps) {
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  const selectComponent = (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v) onValueChange(v);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn("bg-input! border-accent! w-full cursor-pointer", triggerClassName)}
      >
        <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
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
