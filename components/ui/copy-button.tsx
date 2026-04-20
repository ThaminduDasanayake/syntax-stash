"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends ButtonPrimitive.Props {
  value: string;
  label?: boolean;
  labelName?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "xs" | "sm" | "lg";
}

const CopyButton = ({
  value,
  label = true,
  labelName = "Copy",
  className,
  variant = "outline",
  size = "default",
  ...props
}: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => copy(value)}
      className={cn(
        "gap-2 px-4 text-xs font-semibold transition-colors duration-200",
        copied &&
          "border-emerald-400/30! bg-emerald-400/20! text-emerald-400 hover:bg-emerald-400/20! hover:text-emerald-400!",
        className,
      )}
      {...props}
    >
      {copied ? <Check /> : <Copy />}
      {label && labelName}
    </Button>
  );
};
export default CopyButton;
