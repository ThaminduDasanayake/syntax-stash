"use client";

import {
  BroadcastIcon,
  FoldersIcon,
  StackIcon,
  TagIcon,
  TrayIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { SelectBar, type SelectBarItem } from "@/components/ui/select-bar";

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

  let pageTitle = "Resource Submissions Queue";
  let pageSubtitle = "Review, edit, approve, and manage community resource submissions.";

  if (isResources) {
    pageTitle = "Live Resource Manager";
    pageSubtitle =
      "Browse, search, edit, create, and manage live published resources in the catalog.";
  } else if (isCategories) {
    pageTitle = "Category Manager";
    pageSubtitle = "Create, organize, style, and manage first-class resource categories.";
  } else if (isTags) {
    pageTitle = "Tags Manager";
    pageSubtitle =
      "Manage canonical resource tags, slug identifiers, and usage across the catalog.";
  } else if (isAuthors) {
    pageTitle = "Authors Manager";
    pageSubtitle = "Manage verified creator profiles, social links, and resource attributions.";
  } else if (isHistory) {
    pageTitle = "Resource Change Monitor";
    pageSubtitle =
      "Live alerts for remote website changes, author updates, redirects, and dead links. Review detected changes without altering your catalog.";
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
  const navItems: SelectBarItem<string>[] = useMemo(
    () => [
      {
        title: "Submissions Queue",
        badge:
          pendingSubmissionsCount !== undefined && pendingSubmissionsCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold tabular-nums text-black shadow-md ring-2 ring-[#252525]">
              {pendingSubmissionsCount}
            </span>
          ) : null,
        href: "/admin/submissions",
        icon: <TrayIcon className="size-5.5 sm:size-6" weight="regular" />,
        key: "submissions",
      },
      {
        title: "Live Catalog",
        badge:
          totalResourcesCount !== undefined && totalResourcesCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#252525]">
              {totalResourcesCount}
            </span>
          ) : null,
        href: "/admin/resources",
        icon: <StackIcon className="size-5.5 sm:size-6" weight="regular" />,
        key: "resources",
      },
      {
        title: "Categories",
        badge:
          categoriesCount !== undefined && categoriesCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#252525]">
              {categoriesCount}
            </span>
          ) : null,
        href: "/admin/categories",
        icon: <FoldersIcon className="size-5.5 sm:size-6" weight="regular" />,
        key: "categories",
      },
      {
        title: "Tags",
        badge:
          tagsCount !== undefined && tagsCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#252525]">
              {tagsCount}
            </span>
          ) : null,
        href: "/admin/tags",
        icon: <TagIcon className="size-5.5 sm:size-6" weight="regular" />,
        key: "tags",
      },
      {
        title: "Authors",
        badge:
          authorsCount !== undefined && authorsCount > 0 ? (
            <span className="bg-brand-purple text-paper flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums shadow-md ring-2 ring-[#252525]">
              {authorsCount}
            </span>
          ) : null,
        href: "/admin/authors",
        icon: <UserCircleIcon className="size-5.5 sm:size-6" weight="regular" />,
        key: "authors",
      },
      {
        title: "Change Monitor",
        badge:
          changeMonitorCount !== undefined && changeMonitorCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-extrabold tabular-nums text-black shadow-md ring-2 ring-[#252525]">
              {changeMonitorCount}
            </span>
          ) : null,
        href: "/admin/history",
        icon: <BroadcastIcon className="size-5.5 sm:size-6" weight="regular" />,
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
          <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <span className="bg-primary size-2 rounded-full" />
            <span>Admin Suite</span>
          </div>
          <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-xs">{pageSubtitle}</p>
        </div>

        {userEmail && (
          <div className="text-muted-foreground text-right text-xs">
            <span>Admin: </span>
            <strong className="text-foreground">{userEmail}</strong>
          </div>
        )}
      </div>

      {/* Module Switcher Dock using SelectBar */}
      <div className="border-border/40 mt-6 flex items-center justify-center border-t pt-4 sm:justify-start">
        <SelectBar
          items={navItems}
          value={currentTab}
          size="lg"
          gap="gap-6 sm:gap-8"
          showTooltip
          ariaLabel="Admin navigation"
        />
      </div>
    </div>
  );
}
