"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { ChangeEvent, forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface StepperFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  label?: string | ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  containerClassName?: string;
}

export const StepperField = forwardRef<HTMLInputElement, StepperFieldProps>(
  (
    {
      className,
      containerClassName,
      label,
      max = Infinity,
      min = -Infinity,
      onValueChange,
      step = 1,
      value,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    const handleIncrement = () => {
      const nextValue = value + step;
      if (nextValue <= max) onValueChange(nextValue);
    };

    const handleDecrement = () => {
      const nextValue = value - step;
      if (nextValue >= min) onValueChange(nextValue);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
        onValueChange("" as unknown as number);
        return;
      }

      const val = Number(e.target.value);

      if (!isNaN(val)) {
        if (val > max) {
          onValueChange(max);
        } else {
          onValueChange(val);
        }
      }
    };

    const handleBlur = () => {
      if (value === ("" as unknown as number) || value < min) {
        onValueChange(min);
      }
    };

    const renderInputGroup = () => (
      <InputGroup className={cn(!props.disabled && "opacity-100!")}>
        {/* Input */}
        <InputGroupInput
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn("text-center font-mono", className)}
          {...props}
        />

        <InputGroupAddon align="inline-end" className="m-0 p-0">
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none border-0 disabled:opacity-40"
              onClick={handleDecrement}
              disabled={value <= min}
            >
              <MinusIcon weight="bold" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-0 disabled:opacity-40"
              onClick={handleIncrement}
              disabled={value >= max}
            >
              <PlusIcon weight="bold" />
            </Button>
          </ButtonGroup>
        </InputGroupAddon>
      </InputGroup>
    );

    if (!label) {
      return <div className={cn("w-full", containerClassName)}>{renderInputGroup()}</div>;
    }

    return (
      <div className={cn("w-full space-y-2", containerClassName)}>
        <Label htmlFor={id}>{label}</Label>
        {renderInputGroup()}
      </div>
    );
  },
);

StepperField.displayName = "StepperField";
