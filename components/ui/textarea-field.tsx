"use client";

import { ReactNode, TextareaHTMLAttributes, useId } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string | ReactNode;
  action?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  textClassName?: string;
}

export function TextAreaField({
  label,
  action,
  containerClassName,
  labelClassName,
  textClassName,
  id,
  ...props
}: TextareaFieldProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  if (!label) {
    return <Textarea id={textareaId} className={textClassName} {...props} />;
  }

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={textareaId} className={labelClassName}>
          {label}
        </Label>
        {action && <>{action}</>}
      </div>
      <Textarea id={textareaId} className={textClassName} {...props} />
    </div>
  );
}
