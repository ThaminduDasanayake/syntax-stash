"use client";

import { ReactNode, TextareaHTMLAttributes } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type TextareaGroupVariant = "fill" | "fixed";

interface TextareaGroupProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | ReactNode;
  action?: ReactNode;
  footerText?: string;
  containerClassName?: string;
  /** "fill" stretches to parent height; "fixed" sizes to content, capped by maxHeightClass. Default: "fill". */
  variant?: TextareaGroupVariant;
  /** Tailwind max-height class applied to the outer wrapper, e.g. "max-h-[60vh]". */
  maxHeightClass?: string;
  /** When true, textarea grows with its content instead of being fixed/fill height. */
  autoGrow?: boolean;
}

export function TextareaGroup({
  label,
  action,
  footerText,
  containerClassName,
  className,
  variant = "fill",
  maxHeightClass,
  autoGrow = false,
  ...props
}: TextareaGroupProps) {
  const isFill = variant === "fill" && !autoGrow;

  return (
    <div
      className={cn(
        "relative flex w-full flex-col",
        isFill ? "h-full min-h-0 flex-1" : "",
        maxHeightClass,
        containerClassName,
      )}
    >
      <InputGroup
        className={cn("flex flex-col overflow-hidden", isFill ? "h-full! min-h-0" : "h-auto!")}
      >
        {/* Header */}
        <InputGroupAddon align="block-start" className="shrink-0 border-b">
          <InputGroupText>{label}</InputGroupText>
          {action && <div className="ml-auto flex items-center gap-2">{action}</div>}
        </InputGroupAddon>

        <InputGroupTextarea
          className={cn(
            "resize-none font-mono",
            autoGrow
              ? "field-sizing-content overflow-hidden"
              : cn(
                  "field-sizing-fixed overflow-auto",
                  isFill ? "h-full! min-h-0! flex-1!" : "h-auto",
                ),
            className,
          )}
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
