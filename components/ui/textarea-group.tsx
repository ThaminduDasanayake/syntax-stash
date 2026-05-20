"use client";

import { ReactNode, TextareaHTMLAttributes } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface TextareaGroupProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | ReactNode;
  action?: ReactNode;
  footerText?: string;
  containerClassName?: string;
}

export function TextareaGroup({
  label,
  action,
  footerText,
  containerClassName,
  className,
  ...props
}: TextareaGroupProps) {
  return (
    <div className={cn("flex h-full w-full flex-col", containerClassName)}>
      <InputGroup className="flex h-full! flex-col">
        {/* Header */}
        <InputGroupAddon align="block-start" className="shrink-0 border-b">
          <InputGroupText>{label}</InputGroupText>
          {action && <div className="ml-auto flex items-center gap-2">{action}</div>}
        </InputGroupAddon>

        {/* TextArea */}
        <InputGroupTextarea
          className={cn("flex-1 font-mono", className)}
          spellCheck={false}
          {...props}
        />

        {/* Footer */}
        {footerText && (
          <InputGroupAddon align="block-end" className="bg-muted/20 shrink-0 border-t">
            <InputGroupText className="text-muted-foreground text-xs">{footerText}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
    </div>
  );
}
