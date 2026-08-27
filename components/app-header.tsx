"use client";

import { BookmarksSimpleIcon, ListIcon, MagnifyingGlassIcon, SignOutIcon, UserIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { resetBookmarkCache, useBookmarks } from "@/hooks/use-bookmarks";
import { signOut, useSession } from "@/lib/auth-client";
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
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { data: session } = useSession();
  const { bookmarksCount } = useBookmarks();
  const isSavedActive = pathname === "/saved";

  const handleSignOut = async () => {
    resetBookmarkCache();
    await signOut();
  };

  return (
    <>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
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
              href="/saved"
              onClick={() => setIsOpen(false)}
              className={cn(
                "nav-link inline-flex items-center gap-1.5",
                isSavedActive && "nav-link--active",
              )}
            >
              <BookmarksSimpleIcon
                weight={bookmarksCount > 0 ? "fill" : "bold"}
                className="size-4 text-current"
              />
              <span>Saved</span>
              {bookmarksCount > 0 && (
                <span className="bg-ink text-paper dark:bg-paper dark:text-ink inline-flex min-h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full px-1 text-center text-[10px] font-extrabold leading-none">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            {session ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                title={`Signed in as ${session?.user?.name || session?.user?.email}`}
              >
                <SignOutIcon weight="bold" /> Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="border-ink/40 font-mono text-xs font-bold tracking-wider"
              >
                <UserIcon weight="bold" /> Sign In
              </Button>
            )}


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
