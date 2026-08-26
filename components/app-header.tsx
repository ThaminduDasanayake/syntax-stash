"use client";

import { BookmarkSimpleIcon, ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/types";

const navLinks = {
  0: { exact: true, href: "/", label: "Home" },
  1: { exact: false, href: "/tools", label: "Tools" },
  2: { exact: false, href: "/resources", label: "Resources" },
  3: { exact: true, href: "/about", label: "About" },
};

function AppHeaderInner({
  isScrolled,
  onSearchOpenAction,
}: HeaderProps & { isScrolled?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { bookmarksCount } = useBookmarks();
  const isSavedActive = pathname === "/resources" && searchParams?.get("saved") === "true";

  return (
    <>
      <header className={cn("site-nav", isScrolled && "site-nav--scrolled")}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            {/* Brand name*/}
            <Image width={36} height={36} src="/logo.svg" alt="logo" priority />
            <span className="nav-wordmark">
              SYNTAX<em>.stash</em>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className={cn("nav-links", isOpen && "nav-links--open")}>
            {Object.values(navLinks).map((link) => {
              const isActive =
                !isSavedActive &&
                (link.exact ? pathname === link.href : pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn("nav-link", isActive && "nav-link--active")}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/resources?saved=true"
              onClick={() => setIsOpen(false)}
              className={cn(
                "nav-link inline-flex items-center gap-1.5",
                isSavedActive && "nav-link--active",
              )}
            >
              <BookmarkSimpleIcon
                weight={bookmarksCount > 0 ? "fill" : "bold"}
                className={cn("size-4", bookmarksCount > 0 && "text-amber-500")}
              />
              <span>Saved</span>
              {bookmarksCount > 0 && (
                <span className="bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.2 rounded-full leading-none">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            <Button onClick={onSearchOpenAction} size="sm" aria-label="Search" className="nav-cta">
              <MagnifyingGlassIcon weight="bold" className="shrink-0" />
              <span className="text-display-xs">EXPLORE LIBRARY</span>
              <Kbd className="bg-bg-2 text-foreground group-hover:bg-background group-hover:text-foreground hidden border-none px-2 font-mono sm:flex">
                ⌘K
              </Kbd>
            </Button>
          </nav>

          {/* Hamburger Button Toggle Switch */}
          <button
            className="nav-hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <XIcon size="24" /> : <ListIcon size="24" />}
          </button>
        </div>
      </header>
      {isOpen && (
        <div className="nav-backdrop" aria-hidden="true" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

export default function AppHeader(props: HeaderProps & { isScrolled?: boolean }) {
  return (
    <Suspense>
      <AppHeaderInner {...props} />
    </Suspense>
  );
}

