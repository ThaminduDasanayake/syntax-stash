"use client";

import { ButtonProps } from "@base-ui/react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "value"> {
  value: string | (() => string);
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

  const handleCopy = () => {
    const textToCopy = typeof value === "function" ? value() : value;
    if (textToCopy) {
      copy(textToCopy);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "gap-2 px-4 text-xs font-semibold transition-colors duration-200",
        copied &&
          "border-emerald-400/30! bg-emerald-400/20! text-emerald-400 hover:bg-emerald-400/20! hover:text-emerald-400!",
        className,
      )}
      {...props}
    >
      {copied ? <CheckIcon weight="bold" /> : <CopyIcon />}
      {label && labelName}
    </Button>
  );
};
export default CopyButton;
