"use client";

import {
  BroadcastIcon,
  CardsIcon,
  SquaresFourIcon,
  TagIcon,
  TrayIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavProps {
  authorsCount?: number;
  categoriesCount?: number;
  changeMonitorCount?: number;
  pendingSubmissionsCount?: number;
  tagsCount?: number;
  totalResourcesCount?: number;
  userEmail?: string;
}

export function Nav({
  authorsCount,
  categoriesCount,
  changeMonitorCount,
  pendingSubmissionsCount,
  tagsCount,
  totalResourcesCount,
  userEmail,
}: NavProps) {
  const pathname = usePathname();

  // Hide the global admin suite header and tabs on dedicated editor and inspect workflow sub-pages
  const isResourceDetail =
    pathname !== "/admin/resources" && pathname.startsWith("/admin/resources/");
  const isSubmissionDetail =
    pathname !== "/admin/submissions" && pathname.startsWith("/admin/submissions/");

  const isSubmissions = pathname.startsWith("/admin/submissions");
  const isResources = pathname.startsWith("/admin/resources");
  const isCategories = pathname.startsWith("/admin/categories");
  const isTags = pathname.startsWith("/admin/tags");
  const isAuthors = pathname.startsWith("/admin/authors");
  const isHistory = pathname.startsWith("/admin/history");

  let pageTitle = "Submissions";

  if (isResources) {
    pageTitle = "Resources";
  } else if (isCategories) {
    pageTitle = "Categories";
  } else if (isTags) {
    pageTitle = "Tags";
  } else if (isAuthors) {
    pageTitle = "Authors";
  } else if (isHistory) {
    pageTitle = "Change Monitor";
  }

  const currentTab = isSubmissions
    ? "submissions"
    : isResources
      ? "resources"
      : isCategories
        ? "categories"
        : isTags
          ? "tags"
          : isAuthors
            ? "authors"
            : isHistory
              ? "history"
              : "submissions";

  /* eslint-disable perfectionist/sort-arrays */
  const navItems = useMemo(
    () => [
      {
        title: "Submissions",
        badge:
          pendingSubmissionsCount !== undefined && pendingSubmissionsCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-black tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {pendingSubmissionsCount}
            </span>
          ) : null,
        href: "/admin/submissions",
        Icon: TrayIcon,
        key: "submissions",
      },
      {
        title: "Resources",
        badge:
          totalResourcesCount !== undefined && totalResourcesCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {totalResourcesCount}
            </span>
          ) : null,
        href: "/admin/resources",
        Icon: CardsIcon,
        key: "resources",
      },
      {
        title: "Categories",
        badge:
          categoriesCount !== undefined && categoriesCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {categoriesCount}
            </span>
          ) : null,
        href: "/admin/categories",
        Icon: SquaresFourIcon,
        key: "categories",
      },
      {
        title: "Tags",
        badge:
          tagsCount !== undefined && tagsCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {tagsCount}
            </span>
          ) : null,
        href: "/admin/tags",
        Icon: TagIcon,
        key: "tags",
      },
      {
        title: "Authors",
        badge:
          authorsCount !== undefined && authorsCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {authorsCount}
            </span>
          ) : null,
        href: "/admin/authors",
        Icon: UserCircleIcon,
        key: "authors",
      },
      {
        title: "Change Monitor",
        badge:
          changeMonitorCount !== undefined && changeMonitorCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold text-black tabular-nums shadow-md ring-2 ring-[#0e0e11]">
              {changeMonitorCount}
            </span>
          ) : null,
        href: "/admin/history",
        Icon: BroadcastIcon,
        key: "history",
      },
    ],
    [
      authorsCount,
      categoriesCount,
      changeMonitorCount,
      pendingSubmissionsCount,
      tagsCount,
      totalResourcesCount,
    ],
  );
  /* eslint-enable perfectionist/sort-arrays */

  if (isResourceDetail || isSubmissionDetail) {
    return null;
  }

  return (
    <div className="pb-6 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            {pageTitle}
          </h1>
        </div>

        {userEmail && (
          <div className="text-muted-foreground text-right text-xs">
            <span>Admin: </span>
            <strong className="text-foreground">{userEmail}</strong>
          </div>
        )}
      </div>

      {/* Floating-style Admin Dock */}
      <div className="border-border/40 mt-6 flex items-center justify-center border-t pt-4 sm:justify-start">
        <TooltipProvider delayDuration={0}>
          <nav
            aria-label="Admin navigation"
            className="no-scrollbar relative isolate inline-flex max-w-full items-center gap-3.5 overflow-x-auto rounded-full border-[1.5px] border-white/12 bg-[#0e0e11]/95 px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_1px_0_0_rgba(255,255,255,0.1)_inset] backdrop-blur-2xl sm:gap-5 sm:px-4 sm:py-2.5"
          >
            {navItems.map((item) => {
              const isSelected = currentTab === item.key;
              const Icon = item.Icon;

              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={item.title}
                      aria-current={isSelected ? "page" : undefined}
                      className={cn(
                        "relative isolate flex shrink-0 cursor-pointer items-center justify-center rounded-full border-0 outline-none select-none",
                        "size-11 sm:size-12",
                        "bg-[#1a1a1a] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
                        "transition-all duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        "active:scale-[0.93] [@media(hover:hover)]:hover:scale-[1.045]",
                        isSelected
                          ? "text-brand-purple shadow-[0_0_0_1.5px_rgba(192,132,252,0.8),0_4px_16px_rgba(192,132,252,0.25)]"
                          : "text-[#a1a1aa] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]",
                      )}
                    >
                      <Icon weight={isSelected ? "fill" : "bold"} className="size-5 sm:size-5.5" />
                      {item.badge && (
                        <span className="pointer-events-none absolute -top-1 -right-1 z-10 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    sideOffset={10}
                    hideArrow
                    className="pointer-events-none z-50 rounded-full border-0 !bg-white px-3.5 py-1 font-sans text-xs !font-normal tracking-normal whitespace-nowrap !text-zinc-900 normal-case antialiased shadow-xl"
                    style={{ fontWeight: 400 }}
                  >
                    <span
                      className="font-sans text-xs !font-normal tracking-normal text-zinc-900 normal-case"
                      style={{ fontWeight: 400 }}
                    >
                      {item.title}
                    </span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
}
