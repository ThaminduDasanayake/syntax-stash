"use client";

import { DownloadIcon } from "@phosphor-icons/react";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps extends ComponentProps<typeof Button> {
  label?: string;
  icon?: ReactNode | null;
  iconOnly?: boolean;
}

export function DownloadButton({
  label = "Download",
  icon = <DownloadIcon weight="duotone" className="size-4.5" />,
  iconOnly = false,
  className,
  variant,
  size,
  ...props
}: DownloadButtonProps) {
  const finalVariant = variant || (iconOnly ? "ghost" : "default");

  const finalSize = size || (iconOnly ? "icon-sm" : "default");

  return (
    <Button
      variant={finalVariant}
      size={finalSize}
      className={cn("gap-2 px-4 font-semibold transition-colors duration-200", className)}
      {...props}
    >
      {icon && icon}
      {!iconOnly && label}
    </Button>
  );
}

DownloadButton.displayName = "DownloadButton";
