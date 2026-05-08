import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { DownloadIcon } from "@phosphor-icons/react/ssr";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DownloadButtonProps extends ButtonPrimitive.Props {
  label?: string;
  icon?: ReactNode | null;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "xs" | "sm" | "lg";
  disabled?: boolean;
}

export function DownloadButton({
  label = "Download",
  icon = <DownloadIcon className="size-4.5" />,
  className,
  variant = "default",
  size = "default",
  ...props
}: DownloadButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2 px-4 text-xs font-semibold transition-colors duration-200", className)}
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
}

DownloadButton.displayName = "DownloadButton";
