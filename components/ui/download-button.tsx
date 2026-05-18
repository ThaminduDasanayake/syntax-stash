"use client";

import { DownloadIcon } from "@phosphor-icons/react";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps extends ComponentProps<typeof Button> {
  label?: string;
  icon?: ReactNode | null;
}

export function DownloadButton({
  label = "Download",
  icon = <DownloadIcon weight="duotone" className="size-4.5" />,
  className,
  variant = "default",
  size = "default",
  ...props
}: DownloadButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2 px-4 font-semibold transition-colors duration-200", className)}
      {...props}
    >
      {icon && icon}
      {label}
    </Button>
  );
}

DownloadButton.displayName = "DownloadButton";
