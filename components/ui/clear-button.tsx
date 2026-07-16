"use client";

import { EraserIcon } from "@phosphor-icons/react";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClearButtonProps extends ComponentProps<typeof Button> {
  label?: string;
  icon?: ReactNode | null;
  iconOnly?: boolean;
}

export const ClearButton = ({
  className,
  disabled,
  icon = <EraserIcon className="size-4.5" />,
  iconOnly = false,
  label = "Clear",
  size,
  variant,
  ...props
}: ClearButtonProps) => {
  const finalVariant = variant || (iconOnly ? "ghost" : "outline");

  const finalSize = size || (iconOnly ? "icon-sm" : "default");

  return (
    <Button
      variant={finalVariant}
      size={finalSize}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "gap-2 px-4 transition-colors duration-200",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      {icon && icon}
      {!iconOnly && label}
    </Button>
  );
};

ClearButton.displayName = "ClearButton";
