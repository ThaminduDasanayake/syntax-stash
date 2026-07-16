"use client";

import { ComponentProps, ComponentRef, forwardRef, ReactNode, useId } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SliderFieldProps extends ComponentProps<typeof Slider> {
  label?: string | ReactNode;
  leftLabel?: string | ReactNode;
  rightLabel?: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  valueLabelClassName?: string;
  valueLabel?: string | ReactNode;
}

export const SliderField = forwardRef<ComponentRef<typeof Slider>, SliderFieldProps>(
  (
    {
      id,
      className,
      containerClassName,
      label,
      labelClassName,
      leftLabel,
      rightLabel,
      valueLabel,
      valueLabelClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const sliderId = id ?? generatedId;

    return (
      <div className={cn("space-y-3", containerClassName)}>
        {/* Top Header Label and Dynamic Value Display */}
        {label && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <Label htmlFor={sliderId} className={labelClassName}>
                {label}
              </Label>
            )}
            {valueLabel && (
              <span className={cn("text-muted-foreground font-mono text-sm", valueLabelClassName)}>
                {valueLabel}
              </span>
            )}
          </div>
        )}

        <Slider ref={ref} id={sliderId} className={cn("py-1", className)} {...props} />

        {/* Bottom Footer Labels */}
        {(leftLabel || rightLabel) && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground text-xs">{leftLabel}</span>
            <span className="text-muted-foreground text-xs">{rightLabel}</span>
          </div>
        )}
      </div>
    );
  },
);

SliderField.displayName = "SliderField";
