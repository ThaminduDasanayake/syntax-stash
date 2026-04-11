"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, Menu } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type HeaderProps = {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
};

export default function Header({ onSearchOpen, onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const parts = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] h-12 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-sm px-4 shrink-0">

      {/* ── Left: hamburger (mobile) + breadcrumbs ─────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — mobile only */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuOpen}
          className="h-8 w-8 text-muted-foreground md:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </Button>

        <Breadcrumb className="hidden sm:flex min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem>
              {parts.length === 0 ? (
                <BreadcrumbPage className="text-foreground font-medium">
                  Home
                </BreadcrumbPage>
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
                idx === 0
                  ? (sectionLabels[part] ?? segmentToLabel(part))
                  : segmentToLabel(part);

              return (
                <span key={href} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-foreground font-medium truncate max-w-[140px]">
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

      {/* ── Center: spotlight search ────────────────────────────────── */}
      <button
        onClick={onSearchOpen}
        className="flex items-center gap-2 h-8 px-3 rounded-full border border-border bg-muted/30 hover:bg-muted/60 text-muted-foreground text-xs font-normal transition-colors w-[180px] sm:w-[240px] md:w-[280px]"
        aria-label="Search"
      >
        <Search size={13} className="shrink-0" />
        <span className="hidden sm:inline truncate">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* ── Right: theme toggle ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                id="theme-toggle"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground relative"
                aria-label="Toggle theme"
              >
                <Sun
                  size={15}
                  className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  size={15}
                  className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun size={13} className="mr-2" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon size={13} className="mr-2" /> Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
