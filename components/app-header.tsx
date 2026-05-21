"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { internalTools } from "@/lib/tools-data";
import { HeaderProps } from "@/types";

function segmentToLabel(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const sectionLabels: Record<string, string> = {
  tools: "Tools",
  resources: "Resources",
};

export default function AppHeader({ onSearchOpenAction }: HeaderProps) {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);

  const toolMap = new Map(internalTools.map((t) => [`/tools/${t.slug}`, t.title]));

  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 grid h-12 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 border-b px-4 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="text-muted-foreground hover:bg-muted -ml-2 shrink-0" />

        <Breadcrumb className="hidden min-w-0 sm:flex">
          <BreadcrumbList className="min-w-0 flex-nowrap">
            <BreadcrumbItem className="shrink-0">
              {parts.length === 0 ? (
                <BreadcrumbPage className="text-foreground">Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {parts.map((part, idx) => {
              const isLast = idx === parts.length - 1;
              const href = "/" + parts.slice(0, idx + 1).join("/");
              const label =
                toolMap.get(href) ??
                (idx === 0 ? (sectionLabels[part] ?? segmentToLabel(part)) : segmentToLabel(part));

              return (
                <span key={href} className="flex min-w-0 shrink-0 items-center gap-1.5 last:shrink">
                  <BreadcrumbSeparator className="shrink-0" />
                  <BreadcrumbItem className="min-w-0">
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground block truncate">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center: spotlight search */}
      <Button
        onClick={onSearchOpenAction}
        variant="outline"
        className="text-muted-foreground flex shrink-0 sm:w-60 md:w-70"
        aria-label="Search"
      >
        <MagnifyingGlassIcon weight="duotone" size={17} className="shrink-0" />
        <span className="hidden truncate sm:inline">Search...</span>
        <Kbd className="ml-auto">⌘ K</Kbd>
      </Button>

      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
