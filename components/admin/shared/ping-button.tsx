"use client";

import { HeartbeatIcon } from "@phosphor-icons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PingButtonProps {
  checkingLabel?: string;
  className?: string;
  disabled?: boolean;
  isChecking?: boolean;
  label?: string;
  onClick: (e: React.MouseEvent) => void;
  showLabel?: boolean;
  side?: "bottom" | "left" | "right" | "top";
  size?: "default" | "icon" | "sm";
  tooltipText?: string;
  variant?: "ghost" | "outline";
}

export function PingButton({
  checkingLabel = "Checking",
  className,
  disabled = false,
  isChecking = false,
  label = "Ping",
  onClick,
  showLabel = true,
  side = "bottom",
  size = "sm",
  tooltipText = "Check health",
  variant = "ghost",
}: PingButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size={size}
          variant={variant}
          onClick={handleClick}
          disabled={disabled || isChecking}
          className={cn(
            "hover:bg-surface h-6 shrink-0 gap-1 font-mono font-bold uppercase transition-colors",
            showLabel ? "px-1.5 text-[10px]" : "size-6 p-0",
            className,
          )}
        >
          <HeartbeatIcon
            weight="duotone"
            className={cn("size-3 text-rose-500", isChecking && "animate-pulse")}
          />
          {showLabel && <span>{isChecking ? checkingLabel : label}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
