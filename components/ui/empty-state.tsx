"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center font-mono transition-all",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        card: "border-line bg-surface/30 rounded-lg border-[1.5px] p-12",
        compact: "py-8 px-4",
        dashed: "border-line bg-surface/20 rounded-lg border-[1.5px] border-dashed p-12",
        default: "py-16 px-4",
        table: "py-10 px-4",
      },
    },
  },
);

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  iconClassName?: string;
}

export function EmptyState({
  title,
  action,
  className,
  description,
  icon,
  iconClassName,
  variant,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyStateVariants({ variant }), className)}>
      {icon && (
        <div
          className={cn(
            "text-muted-foreground/60 border-line bg-surface/60 mb-3 flex size-12 items-center justify-center rounded-full border-[1.5px]",
            iconClassName,
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-1 max-w-sm text-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
