"use client";

import { ComponentProps, ComponentRef, forwardRef, ReactNode, useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps extends ComponentProps<typeof Checkbox> {
  label: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export const CheckboxField = forwardRef<ComponentRef<typeof Checkbox>, CheckboxFieldProps>(
  ({ label, containerClassName, labelClassName, id, className, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <div className={cn("flex items-center gap-2", containerClassName)}>
        <Checkbox ref={ref} id={checkboxId} className={className} {...props} />
        <Label
          htmlFor={checkboxId}
          className={cn(
            "cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName,
          )}
        >
          {label}
        </Label>
      </div>
    );
  },
);

CheckboxField.displayName = "CheckboxField";
