"use client";

import { ComponentProps, ComponentRef, forwardRef, ReactNode, useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SwitchFieldProps extends ComponentProps<typeof Switch> {
  label: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export const SwitchField = forwardRef<ComponentRef<typeof Switch>, SwitchFieldProps>(
  ({ label, containerClassName, labelClassName, id, className, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
      <div className={cn("flex items-center gap-2", containerClassName)}>
        <Switch ref={ref} id={switchId} className={className} {...props} />
        <Label
          htmlFor={switchId}
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

SwitchField.displayName = "SwitchField";
