"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(
  (
    {
      label,
      containerClassName,
      labelClassName,
      inputClassName,
      value,
      onValueChange,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const safeColor = value.length === 7 ? value : "#000000";

    const content = (
      <div className="flex items-center gap-2">
        <div className="border-border relative h-8 w-10 shrink-0 overflow-hidden rounded-none border">
          <Input
            type="color"
            value={safeColor}
            disabled={disabled}
            onChange={(e) => onValueChange(e.target.value)}
            className="absolute -top-2 -left-2 h-14 w-14 cursor-pointer border-0 p-0"
          />
        </div>

        <Input
          ref={ref}
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            let val = e.target.value;
            if (!val.startsWith("#")) val = "#" + val;
            onValueChange(val);
          }}
          placeholder="#000000"
          maxLength={7}
          className={cn("font-mono", inputClassName)}
          {...props}
        />
      </div>
    );

    if (!label) return content;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
        {content}
      </div>
    );
  },
);

ColorField.displayName = "ColorField";
