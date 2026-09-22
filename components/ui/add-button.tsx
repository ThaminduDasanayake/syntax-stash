"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AddButtonProps extends ComponentProps<typeof Button> {
  children?: ReactNode;
  icon?: ReactNode | null;
  iconOnly?: boolean;
  label?: string;
}

export function AddButton({
  asChild = false,
  children,
  className,
  icon = <PlusIcon className="size-4" weight="bold" />,
  iconOnly = false,
  label = "Add",
  size = "sm",
  variant = "default",
  ...props
}: AddButtonProps) {
  if (asChild) {
    return (
      <Button
        asChild
        size={size}
        variant={variant}
        className={cn("text-xs font-bold uppercase transition-colors duration-200", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={cn(
        "text-xs font-bold uppercase transition-colors duration-200",
        iconOnly && "size-8 p-0",
        className,
      )}
      {...props}
    >
      {icon && icon}
      {!iconOnly && (children ?? <span>{label}</span>)}
    </Button>
  );
}

AddButton.displayName = "AddButton";
