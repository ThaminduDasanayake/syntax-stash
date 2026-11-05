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
  pendingSubmissionsCount?: number;
  tagsCount?: number;
  totalResourcesCount?: number;
  userEmail?: string;
}

export function Nav({
  authorsCount,
  categoriesCount,
  pendingSubmissionsCount,
  tagsCount,
  totalResourcesCount,
  userEmail,
}: NavProps) {
  const pathname = usePathname();

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
        href: "/admin/submissions",
        icon: <TrayIcon className="size-4" />,
        key: "submissions",
        label: (
          <span className="flex items-center gap-1.5">
            <span>Submissions Queue</span>
            {pendingSubmissionsCount !== undefined && pendingSubmissionsCount > 0 && (
              <span className="rounded-full border border-amber-600/40 bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-amber-500">
                {pendingSubmissionsCount}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "Live Catalog",
        href: "/admin/resources",
        icon: <StackIcon className="size-4" />,
        key: "resources",
        label: (
          <span className="flex items-center gap-1.5">
            <span>Live Catalog</span>
            {totalResourcesCount !== undefined && totalResourcesCount > 0 && (
              <span className="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-zinc-300">
                {totalResourcesCount}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "Categories",
        href: "/admin/categories",
        icon: <FoldersIcon className="size-4" />,
        key: "categories",
        label: (
          <span className="flex items-center gap-1.5">
            <span>Categories</span>
            {categoriesCount !== undefined && categoriesCount > 0 && (
              <span className="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-zinc-300">
                {categoriesCount}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "Tags",
        href: "/admin/tags",
        icon: <TagIcon className="size-4" />,
        key: "tags",
        label: (
          <span className="flex items-center gap-1.5">
            <span>Tags</span>
            {tagsCount !== undefined && tagsCount > 0 && (
              <span className="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-zinc-300">
                {tagsCount}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "Authors",
        href: "/admin/authors",
        icon: <UserCircleIcon className="size-4" />,
        key: "authors",
        label: (
          <span className="flex items-center gap-1.5">
            <span>Authors</span>
            {authorsCount !== undefined && authorsCount > 0 && (
              <span className="rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-zinc-300">
                {authorsCount}
              </span>
            )}
          </span>
        ),
      },
      {
        title: "Change Monitor",
        href: "/admin/history",
        icon: <BroadcastIcon className="size-4" />,
        key: "history",
        label: <span>Change Monitor</span>,
      },
    ],
    [
      authorsCount,
      categoriesCount,
      pendingSubmissionsCount,
      tagsCount,
      totalResourcesCount,
    ],
  );
  /* eslint-enable perfectionist/sort-arrays */

  return (
    <div className="border-line/60 mb-8 border-b-[1.5px] pb-6 font-mono">
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

      {/* Module Switcher Tabs */}
      <div className="border-border/40 mt-6 flex items-center border-t pt-4">
        <SelectBar
          items={navItems}
          value={currentTab}
          size="sm"
          className="font-mono text-xs uppercase"
          ariaLabel="Admin navigation"
        />
      </div>
    </div>
  );
}
