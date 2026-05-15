"use client";

import { ComponentProps, ComponentRef, forwardRef, ReactNode, useId } from "react";

import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SliderFieldProps extends ComponentProps<typeof Slider> {
  label?: string | ReactNode;
  showInput?: boolean;
  leftLabel?: string | ReactNode;
  rightLabel?: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  showStepper?: boolean;
  suffix?: string;
  inputClassName?: string;
  valueLabelClassName?: string;
  valueLabel?: string | ReactNode;
}

export const SliderField = forwardRef<ComponentRef<typeof Slider>, SliderFieldProps>(
  (
    {
      label,
      showInput,
      leftLabel,
      rightLabel,
      valueLabel,
      valueLabelClassName,
      containerClassName,
      labelClassName,
      id,
      className,
      showStepper,
      suffix,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const sliderId = id ?? generatedId;

    return (
      <div className={cn("space-y-3", containerClassName)}>
        {/* Top Header Label and Dynamic Value Display */}
        {(label || showInput) && (
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
            {showInput && (
              <NumberInput
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value?.[0] ?? props.defaultValue?.[0] ?? 0}
                onValueChange={(val) => props.onValueChange?.([val])}
                inputGroupClassName={cn("min-w-28", inputClassName)}
                className="text-center font-mono"
                suffix={suffix}
                showStepper={showStepper}
              />
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
