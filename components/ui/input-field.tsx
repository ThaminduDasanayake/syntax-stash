"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

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

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, containerClassName, labelClassName, inputClassName, action, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    if (!label) {
      return (
        <div className="flex items-center gap-2">
          <Input ref={ref} id={inputId} className={cn("font-mono", inputClassName)} {...props} />
          {action && <>{action}</>}
        </div>
      );
    }

    return (
      <div className={cn("space-y-2", containerClassName)}>
        <Label htmlFor={inputId} className={labelClassName}>
          {label}
        </Label>
        <div className="flex items-center gap-2">
          <Input ref={ref} id={inputId} className={cn("font-mono", inputClassName)} {...props} />
          {action && <>{action}</>}
        </div>
      </div>
    );
  },
);

InputField.displayName = "InputField";
