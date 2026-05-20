"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends ComponentProps<typeof Button> {
  textToCopy: string | (() => string);
  iconOnly?: boolean;
  labelName?: string;
  copiedLabelName?: string;
}

export const CopyButton = ({
  textToCopy,
  iconOnly = false,
  labelName = "Copy",
  copiedLabelName = "Copied!",
  className,
  variant,
  size,
  ...props
}: CopyButtonProps) => {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    const finalString = typeof textToCopy === "function" ? textToCopy() : textToCopy;
    if (finalString) {
      copy(finalString);
    }
  };

  const finalVariant = variant || (iconOnly ? "ghost" : "outline");

  const finalSize = size || (iconOnly ? "icon-sm" : "default");

  return (
    <Button
      variant={finalVariant}
      size={finalSize}
      onClick={handleCopy}
      className={cn(
        "transition-colors duration-200",
        !iconOnly && "gap-2 px-4",
        copied && "text-emerald-500 hover:bg-emerald-500/10! hover:text-emerald-500!",
        className,
      )}
      {...props}
    >
      {copied ? (
        <CheckIcon weight="bold" />
      ) : (
        <CopyIcon weight="duotone" className="rotate-y-180" />
      )}
      {!iconOnly && <span>{copied ? copiedLabelName : labelName}</span>}
    </Button>
  );
};

CopyButton.displayName = "CopyButton";
