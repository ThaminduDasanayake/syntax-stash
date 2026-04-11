"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Search } from "lucide-react";
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
};

export default function Header({ onSearchOpen }: HeaderProps) {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const parts = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-6 shrink-0">
      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <Breadcrumb>
        <BreadcrumbList>
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
                    <BreadcrumbPage className="text-foreground font-medium">
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

      {/* ── Right Controls ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <Button
          id="open-command-menu"
          variant="outline"
          size="sm"
          onClick={onSearchOpen}
          className="h-8 gap-2 text-muted-foreground border-border bg-muted/30 hover:bg-muted/60 text-xs font-normal pr-2"
        >
          <Search size={13} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Theme toggle */}
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
