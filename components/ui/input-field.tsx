"use client";

import { InputHTMLAttributes, ReactNode, useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  action?: ReactNode;
}

export function InputField({
  label,
  containerClassName,
  labelClassName,
  inputClassName,
  action,
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
      <div className="flex gap-2">
        <Input id={inputId} className={cn("font-mono", inputClassName)} {...props} />
        {action && <>{action}</>}
      </div>
    </div>
  );
}
