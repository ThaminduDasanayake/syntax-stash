"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="border-border bg-background sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b-2 px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <SidebarTrigger
        // className="btn-caps-stripe-primary btn-caps-stripe rounded-none transition-colors"
        />

        <Breadcrumb className="hidden min-w-0 sm:flex">
          <BreadcrumbList className="min-w-0 flex-nowrap font-mono text-xs font-bold tracking-widest">
            <BreadcrumbItem className="shrink-0">
              {parts.length === 0 ? (
                <BreadcrumbPage className="text-primary font-bold">&gt; ROOT</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    ROOT
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
                <span key={href} className="flex min-w-0 shrink-0 items-center gap-2 last:shrink">
                  <BreadcrumbSeparator className="text-muted-foreground shrink-0 opacity-50">
                    /
                  </BreadcrumbSeparator>
                  <BreadcrumbItem className="min-w-0">
                    {isLast ? (
                      <BreadcrumbPage className="text-primary block truncate font-bold">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={href}
                          className="text-muted-foreground hover:text-primary transition-colors"
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
        className="border-border text-muted-foreground hover:border-primary hover:text-primary flex shrink-0 rounded-none border-2 bg-transparent font-mono text-xs font-bold tracking-widest uppercase transition-colors sm:w-64 md:w-80"
        aria-label="Search"
      >
        <MagnifyingGlassIcon weight="duotone" className="shrink-0" />
        <span className="hidden truncate sm:inline">Search Registry...</span>
        <Kbd className="border-border bg-foreground text-background ml-auto rounded-none border-none px-2 font-mono">
          ⌘ K
        </Kbd>
      </Button>
    </header>
  );
}
