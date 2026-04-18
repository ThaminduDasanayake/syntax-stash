"use client";

import { InputHTMLAttributes, useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function InputField({
  label,
  containerClassName,
  labelClassName,
  inputClassName,
  id,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  if (!label) {
    return <Input id={inputId} className={inputClassName} {...props} />;
  }

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={inputId} className={labelClassName}>
        {label}
      </Label>
      <Input id={inputId} className={cn("font-mono", inputClassName)} {...props} />
    </div>
  );
}
