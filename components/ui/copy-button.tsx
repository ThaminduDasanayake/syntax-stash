"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ComponentProps<typeof Button> {
  textToCopy: string | (() => string);
  label?: boolean;
  labelName?: string;
  copiedLabelName?: string;
}

export const CopyButton = ({
  textToCopy,
  label = true,
  labelName = "Copy",
  copiedLabelName = "Copied!",
  className,
  variant = "outline",
  size = "default",
  ...props
}: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    const finalString = typeof textToCopy === "function" ? textToCopy() : textToCopy;
    if (finalString) {
      copy(finalString);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "gap-2 px-4 transition-colors duration-200",
        copied && "text-emerald-400 hover:text-emerald-400!",
        className,
      )}
      {...props}
    >
      {copied ? (
        <CheckIcon weight="bold" className="size-4.5" />
      ) : (
        <CopyIcon weight="duotone" className="size-4.5 rotate-y-180" />
      )}
      {label && <span>{copied ? copiedLabelName : labelName}</span>}
    </Button>
  );
};

CopyButton.displayName = "CopyButton";
