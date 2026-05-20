"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

import { CopyButton } from "@/components/ui/copy-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label?: string | ReactNode;
  prefix?: string | ReactNode;
  showCopy?: boolean;
  showSeparator?: boolean;
  copyPrefix?: boolean;
  containerClassName?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      prefix,
      showCopy,
      showSeparator = false,
      copyPrefix = false,
      containerClassName,
      className,
      type = "text",
      value,
      ...props
    },
    ref,
  ) => {
    const id = useId();

    const prefixToCopy = copyPrefix && typeof prefix === "string" ? prefix : "";
    const textToCopy = `${prefixToCopy} ${value || ""}`;

    const renderInputGroup = () => (
      <InputGroup>
        {/* Prefix */}
        {prefix && (
          <InputGroupAddon align="inline-start">
            {typeof prefix === "string" ? (
              <InputGroupText className="font-mono">{prefix}</InputGroupText>
            ) : (
              prefix
            )}
          </InputGroupAddon>
        )}

        {showSeparator && <Separator orientation="vertical" />}

        <InputGroupInput
          ref={ref}
          id={id}
          type={type}
          value={value}
          className={cn("font-mono", className)}
          {...props}
        />

        {showCopy && (
          <InputGroupAddon align="inline-end">
            <CopyButton
              label={false}
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              textToCopy={textToCopy}
              disabled={!value}
            />
          </InputGroupAddon>
        )}
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

InputField.displayName = "InputField";
