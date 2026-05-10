import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react/ssr";
import { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClearButtonProps extends ComponentProps<typeof Button> {
  label?: string;
  icon?: ReactNode | null;
}

export const ClearButton = ({
  label = "Clear",
  icon = <ArrowCounterClockwiseIcon className="size-4.5" />,
  className,
  variant = "outline",
  size = "default",
  ...props
}: ClearButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2 px-4 transition-colors duration-200", className)}
      {...props}
    >
      {icon && icon}
      {label}
    </Button>
  );
};

ClearButton.displayName = "ClearButton";
