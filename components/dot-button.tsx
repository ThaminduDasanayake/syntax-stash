import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DotButtonProps extends ComponentProps<typeof Button> {
  badgeText?: string;
  index?: number;
  isActive: boolean;
  label: string;
}

export function DotButton({ badgeText, className, isActive, label, ...props }: DotButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn(
        "filter-pill cursor-pointer",
        isActive && "border-secondary/60 bg-secondary text-secondary-foreground hover:bg-secondary",
        className,
      )}
      {...props}
    >
      {badgeText && <span className="font-mono opacity-80">{badgeText}</span>}
      <span>{label}</span>
    </Button>
  );
}
