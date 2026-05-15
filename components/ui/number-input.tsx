"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { ComponentProps, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showStepper?: boolean;
  prefix?: string;
  suffix?: string;
  inputGroupClassName?: string;
}

export function NumberInput({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  showStepper = true,
  prefix,
  suffix,
  inputGroupClassName,
  ...props
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleStep = (direction: 1 | -1) => {
    let current = parseFloat(inputValue);

    if (isNaN(current)) current = min ?? 0;

    let nextValue = Number((current + step * direction).toFixed(5));

    if (max !== undefined && nextValue > max) nextValue = max;
    if (min !== undefined && nextValue < min) nextValue = min;

    setInputValue(String(nextValue));
    onValueChange(nextValue);
  };

  return (
    <InputGroup className={cn("w-24", inputGroupClassName)}>
      {prefix && (
        <InputGroupAddon>
          <InputGroupText>{prefix}</InputGroupText>
        </InputGroupAddon>
      )}

      {prefix && <Separator orientation="vertical" className="ml-2" />}

      <InputGroupInput
        type="text"
        inputMode="decimal"
        min={min}
        max={max}
        value={inputValue}
        onChange={(e) => {
          const rawValue = e.target.value;

          if (!/^-?\d*\.?\d*$/.test(rawValue)) return;

          setInputValue(rawValue);

          if (
            rawValue === "" ||
            rawValue === "-" ||
            rawValue === "." ||
            rawValue === "-." ||
            rawValue.endsWith(".")
          ) {
            return;
          }

          let parsed = parseFloat(rawValue);
          if (isNaN(parsed)) return;

          if (max !== undefined && parsed > max) {
            parsed = max;
            setInputValue(String(parsed));
          }

          if (min !== undefined && parsed < min) {
            if (min < 0 || String(parsed).length >= String(min).length) {
              parsed = min;
            }
          }

          setInputValue(String(parsed));
          onValueChange(parsed);
        }}
        onBlur={() => {
          let parsed = parseFloat(inputValue);

          if (isNaN(parsed)) parsed = min ?? 0;
          if (max !== undefined && parsed > max) parsed = max;
          if (min !== undefined && parsed < min) parsed = min;

          setInputValue(String(parsed));
          onValueChange(parsed);
        }}
        {...props}
      />

      {suffix && (
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffix}</InputGroupText>
        </InputGroupAddon>
      )}

      {showStepper && (
        <InputGroupAddon className="pr-0" align="inline-end">
          <ButtonGroup>
            <Button variant="ghost" className="px-1" tabIndex={-1} onClick={() => handleStep(1)}>
              <PlusIcon weight="bold" className="size-3.5" />
            </Button>
            <Button variant="ghost" className="px-1" tabIndex={-1} onClick={() => handleStep(-1)}>
              <MinusIcon weight="bold" className="size-3.5" />
            </Button>
          </ButtonGroup>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
