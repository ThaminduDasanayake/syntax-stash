"use client";

import React from "react";

import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
  badge?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  value: number | string;
}

export function AdminStatCard({
  badge,
  className,
  description,
  icon,
  label,
  onClick,
  value,
}: AdminStatCardProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "border-line bg-card/60 flex items-center justify-between rounded-xl border-[1.5px] p-4 text-left font-mono transition-all",
        onClick && "hover:border-primary/60 cursor-pointer",
        className,
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs font-semibold uppercase">{label}</p>
          {badge}
        </div>
        <p className="text-foreground text-2xl font-bold tracking-tight">{value}</p>
        {description && <div className="text-muted-foreground text-[11px]">{description}</div>}
      </div>
      {icon && (
        <div className="text-muted-foreground/70 bg-surface/50 border-line/60 flex size-10 shrink-0 items-center justify-center rounded-lg border">
          {icon}
        </div>
      )}
    </Comp>
  );
}

export interface AdminStatsGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function AdminStatsGrid({ children, className, columns = 4 }: AdminStatsGridProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return <div className={cn("grid gap-3", colClasses[columns], className)}>{children}</div>;
}
