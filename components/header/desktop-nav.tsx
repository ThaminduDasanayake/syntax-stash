"use client";

import { BookmarksSimpleIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SubmitToolDialog } from "@/components/submit-tool-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { NAV_LINKS } from "./constants";

interface DesktopNavProps {
  onSearchOpenAction: () => void;
}

export function DesktopNav({ onSearchOpenAction }: DesktopNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { bookmarksCount } = useBookmarks();
  const isSavedActive = pathname === "/saved";

  return (
    <nav className="nav-links hidden lg:flex">
      {NAV_LINKS.map((link) => {
        const isActive =
          !isSavedActive && (link.exact ? pathname === link.href : pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn("nav-link", isActive && "nav-link--active")}
          >
            {link.label}
          </Link>
        );
      })}

      <SubmitToolDialog>
        <button type="button" className="nav-link cursor-pointer">
          Submit
        </button>
      </SubmitToolDialog>

      {session && (
        <Link
          href="/saved"
          className={cn(
            "nav-link inline-flex items-center gap-1.5 no-underline",
            isSavedActive && "text-ink",
          )}
        >
          <BookmarksSimpleIcon
            weight={bookmarksCount > 0 ? "fill" : "bold"}
            className="size-4 text-current"
          />
          <span
            className={cn(
              isSavedActive &&
                "text-ink decoration-ink underline decoration-2 underline-offset-[6px]",
            )}
          >
            Saved
          </span>
          {bookmarksCount > 0 && (
            <span className="bg-ink text-paper inline-flex min-h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-center text-[10px] leading-none font-extrabold no-underline">
              {bookmarksCount}
            </span>
          )}
        </Link>
      )}

      <Button onClick={onSearchOpenAction} size="sm" aria-label="Search" className="nav-cta">
        <MagnifyingGlassIcon weight="bold" className="shrink-0" />
        <span className="text-display-xs">EXPLORE LIBRARY</span>
        <Kbd className="bg-bg-2 text-foreground group-hover:bg-background group-hover:text-foreground hidden border-none px-2 font-mono xl:flex">
          ⌘K
        </Kbd>
      </Button>
    </nav>
  );
}
