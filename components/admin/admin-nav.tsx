"use client";

import { StackIcon, TrayIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface AdminNavProps {
  pendingSubmissionsCount?: number;
  totalResourcesCount?: number;
  userEmail?: string;
}

export function AdminNav({
  pendingSubmissionsCount,
  totalResourcesCount,
  userEmail,
}: AdminNavProps) {
  const pathname = usePathname();

  const isSubmissions = pathname.startsWith("/admin/submissions");
  const isResources = pathname.startsWith("/admin/resources");

  return (
    <div className="border-line/60 mb-8 border-b pb-6 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <span className="bg-primary size-2 rounded-full" />
            <span>Admin Suite</span>
          </div>
          <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            {isResources ? "Live Resource Manager" : "Tool Submissions Queue"}
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">
            {isResources
              ? "Browse, search, edit, create, and manage live published tools in the catalog."
              : "Review, edit, approve, and manage community tool submissions."}
          </p>
        </div>

        {userEmail && (
          <div className="text-muted-foreground text-right text-xs">
            <span>Admin: </span>
            <strong className="text-foreground">{userEmail}</strong>
          </div>
        )}
      </div>

      {/* Admin Module Switcher Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
        <Link
          href="/admin/submissions"
          className={cn(
            "flex items-center gap-2 rounded px-3.5 py-1.5 text-xs font-bold uppercase transition-all duration-150",
            isSubmissions
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border-line bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground border",
          )}
        >
          <TrayIcon weight={isSubmissions ? "fill" : "bold"} className="size-4" />
          <span>Submissions Queue</span>
          {pendingSubmissionsCount !== undefined && pendingSubmissionsCount > 0 && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none",
                isSubmissions
                  ? "bg-primary-foreground text-primary"
                  : "bg-amber-500/20 text-amber-700 border border-amber-600/40",
              )}
            >
              {pendingSubmissionsCount}
            </span>
          )}
        </Link>

        <Link
          href="/admin/resources"
          className={cn(
            "flex items-center gap-2 rounded px-3.5 py-1.5 text-xs font-bold uppercase transition-all duration-150",
            isResources
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border-line bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground border",
          )}
        >
          <StackIcon weight={isResources ? "fill" : "bold"} className="size-4" />
          <span>Live Catalog</span>
          {totalResourcesCount !== undefined && totalResourcesCount > 0 && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none",
                isResources
                  ? "bg-primary-foreground text-primary"
                  : "bg-surface-elevated text-muted-foreground border border-border",
              )}
            >
              {totalResourcesCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
