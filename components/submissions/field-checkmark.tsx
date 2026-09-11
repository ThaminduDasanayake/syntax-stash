"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export interface FieldCheckmarkProps {
  checked?: boolean;
  className?: string;
}

export function FieldCheckmark({ checked, className }: FieldCheckmarkProps) {
  if (!checked) return null;

  return (
    <span
      title="Completed"
      className="inline-flex items-center animate-in fade-in zoom-in-75 duration-150"
    >
      <CheckCircleIcon
        weight="fill"
        className={cn(
          "size-3.5 shrink-0 text-emerald-500 dark:text-emerald-400",
          className,
        )}
        aria-hidden="true"
      />
    </span>
  );
}

