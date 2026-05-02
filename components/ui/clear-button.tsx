import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ClearButtonProps extends ButtonPrimitive.Props {
  label?: string;
  icon?: ReactNode | null;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "xs" | "sm" | "lg";
  disabled?: boolean;
}

const ClearButton = ({
  label = "Clear",
  icon = <ArrowCounterClockwiseIcon />,
  className,
  variant = "outline",
  size = "default",
  ...props
}: ClearButtonProps) => {
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
};

export default ClearButton;
