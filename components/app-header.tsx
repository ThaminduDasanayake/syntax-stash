"use client";

import { Menu, Search } from "lucide-react";
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
import { HeaderProps } from "@/types";

/** Convert a URL segment to a human-readable label.
 *  e.g. "prompt-enhancer" → "Prompt Enhancer"
 */
function segmentToLabel(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const sectionLabels: Record<string, string> = {
  tools: "Tools",
  category: "Resources",
};

export default function Header({ onSearchOpenAction, onMenuOpenAction }: HeaderProps) {
  const pathname = usePathname();

  const parts = pathname.split("/").filter(Boolean);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b px-4 backdrop-blur-sm">
      {/* Left: hamburger (mobile) + breadcrumbs */}
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuOpenAction}
          className="text-muted-foreground h-8 w-8 shrink-0 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </Button>

        <Breadcrumb className="hidden min-w-0 sm:flex">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              {parts.length === 0 ? (
                <BreadcrumbPage className="text-foreground font-medium">Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  render={
                    <Link
                      href="/"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Home
                    </Link>
                  }
                />
              )}
            </BreadcrumbItem>

            {parts.map((part, idx) => {
              const isLast = idx === parts.length - 1;
              const href = "/" + parts.slice(0, idx + 1).join("/");
              const label =
                idx === 0 ? (sectionLabels[part] ?? segmentToLabel(part)) : segmentToLabel(part);

              return (
                <span key={href} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground max-w-35 truncate font-medium">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        render={
                          <Link
                            href={href}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {label}
                          </Link>
                        }
                      />
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center: spotlight search */}
      <button
        onClick={onSearchOpenAction}
        className="border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground flex h-8 w-45 items-center gap-2 rounded-full border px-3 text-xs font-normal transition-colors sm:w-60 md:w-70"
        aria-label="Search"
      >
        <Search size={13} className="shrink-0" />
        <span className="hidden truncate sm:inline">Search...</span>
        <kbd className="border-border bg-background text-muted-foreground pointer-events-none ml-auto hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] select-none md:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Right: placeholder */}
      <div className="flex items-center justify-end gap-2"></div>
    </header>
  );
}
