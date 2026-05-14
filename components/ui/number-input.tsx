"use client";

import { ComponentProps, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input-field";

interface NumberInputProps extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberInput({ value, onValueChange, min, max, ...props }: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <InputField
      type="text"
      inputMode="decimal"
      min={min}
      max={max}
      value={inputValue}
      onChange={(e) => {
        const rawValue = e.target.value;

        if (rawValue === "" || rawValue === "-") {
          setInputValue(rawValue);
          return;
        }

        let parsed = parseInt(rawValue, 10);
        if (isNaN(parsed)) return;

        if (max !== undefined && parsed > max) {
          parsed = max;
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
        let parsed = parseInt(inputValue, 10);

        if (isNaN(parsed)) parsed = min ?? 0;
        if (max !== undefined && parsed > max) parsed = max;
        if (min !== undefined && parsed < min) parsed = min;

        setInputValue(String(parsed));
        onValueChange(parsed);
      }}
      {...props}
    />
  );
}
