"use client";

import {
  BroadcastIcon,
  FoldersIcon,
  StackIcon,
  TagIcon,
  TrayIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

interface NavProps {
  authorsCount?: number;
  categoriesCount?: number;
  changeMonitorCount?: number;
  pendingSubmissionsCount?: number;
  tagsCount?: number;
  totalResourcesCount?: number;
}

interface AdminDockItem {
  count?: number;
  href: string;
  icon: React.ReactNode;
  isAlert?: boolean;
  key: string;
  title: string;
}

export function Nav({
  authorsCount,
  categoriesCount,
  changeMonitorCount,
  pendingSubmissionsCount,
  tagsCount,
  totalResourcesCount,
}: NavProps) {
  const pathname = usePathname();
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

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

  if (isResources) {
    pageTitle = "Live Resource Manager";
  } else if (isCategories) {
    pageTitle = "Category Manager";
  } else if (isTags) {
    pageTitle = "Tags Manager";
  } else if (isAuthors) {
    pageTitle = "Authors Manager";
  } else if (isHistory) {
    pageTitle = "Resource Change Monitor";
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
  const navItems: AdminDockItem[] = useMemo(
    () => [
      {
        title: "Submissions Queue",
        count: pendingSubmissionsCount,
        href: "/admin/submissions",
        icon: <TrayIcon className="size-5" weight="regular" />,
        isAlert: true,
        key: "submissions",
      },
      {
        title: "Live Catalog",
        count: totalResourcesCount,
        href: "/admin/resources",
        icon: <StackIcon className="size-5" weight="regular" />,
        key: "resources",
      },
      {
        title: "Categories",
        count: categoriesCount,
        href: "/admin/categories",
        icon: <FoldersIcon className="size-5" weight="regular" />,
        key: "categories",
      },
      {
        title: "Tags",
        count: tagsCount,
        href: "/admin/tags",
        icon: <TagIcon className="size-5" weight="regular" />,
        key: "tags",
      },
      {
        title: "Authors",
        count: authorsCount,
        href: "/admin/authors",
        icon: <UserCircleIcon className="size-5" weight="regular" />,
        key: "authors",
      },
      {
        title: "Change Monitor",
        count: changeMonitorCount,
        href: "/admin/history",
        icon: <BroadcastIcon className="size-5" weight="regular" />,
        isAlert: true,
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
          <h1 className="text-foreground mt-1 text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Admin Navigation Dock (Pill dock with hover tooltips and active dot) */}
      <div className="mt-8 flex justify-center">
        <nav
          aria-label="Admin Navigation Dock"
          className="relative inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#18181b]/95 px-3.5 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl sm:gap-2.5"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            const isHovered = hoveredKey === item.key;

            return (
              <div key={item.key} className="relative flex items-center justify-center">
                <Link
                  href={item.href}
                  onMouseEnter={() => setHoveredKey(item.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onFocus={() => setHoveredKey(item.key)}
                  onBlur={() => setHoveredKey(null)}
                  className={cn(
                    "group relative flex size-11 items-center justify-center rounded-full transition-colors duration-200",
                    isActive ? "text-white" : "text-zinc-400 hover:text-zinc-100",
                  )}
                  aria-label={item.title}
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>

                  {/* Active Indicator Dot (centered underneath icon, matching reference image) */}
                  {isActive && (
                    <span className="absolute bottom-1 size-1 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                  )}

                  {/* Alert Dot for Pending Submissions or Change Alerts */}
                  {item.isAlert && item.count !== undefined && item.count > 0 && (
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-500 ring-2 ring-[#18181b]" />
                  )}
                </Link>

                {/* Floating Tooltip Pill (white pill above, matching reference image) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 2 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="pointer-events-none absolute -top-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3.5 py-1 font-sans text-xs font-semibold whitespace-nowrap text-zinc-950 shadow-xl"
                    >
                      <span>{item.title}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={cn(
                            "py-0.2 rounded-full px-1.5 text-[10px] leading-tight font-bold",
                            item.isAlert
                              ? "bg-amber-100 text-amber-700"
                              : "bg-zinc-100 text-zinc-600",
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
