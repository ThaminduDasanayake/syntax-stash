"use client";

import {
  BookmarksSimpleIcon,
  ListIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const userAvatar = session?.user?.image;
  const userName = session?.user?.name || session?.user?.email || "User";
  const userEmail = session?.user?.email;
  const userInitial = (session?.user?.name?.[0] || session?.user?.email?.[0] || "U").toUpperCase();

  return (
    <>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <header className={cn("site-nav", isScrolled && "site-nav--scrolled")}>
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <Image width={36} height={36} src="/logo.svg" alt="logo" priority />
            <span className="nav-wordmark">
              SYNTAX<em className="hidden sm:inline">.stash</em>
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

            {session && (
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
                  <span className="bg-ink text-paper dark:bg-paper dark:text-ink inline-flex min-h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full px-1 text-center text-[10px] leading-none font-extrabold">
                    {bookmarksCount}
                  </span>
                )}
              </Link>
            )}

            <Button onClick={onSearchOpenAction} size="sm" aria-label="Search" className="nav-cta">
              <MagnifyingGlassIcon weight="bold" className="shrink-0" />
              <span className="text-display-xs hidden lg:inline">EXPLORE LIBRARY</span>
              <span className="text-display-xs hidden md:inline lg:hidden">EXPLORE</span>
              <span className="text-display-xs md:hidden">EXPLORE LIBRARY</span>
              <Kbd className="bg-bg-2 text-foreground group-hover:bg-background group-hover:text-foreground hidden border-none px-2 font-mono xl:flex">
                ⌘K
              </Kbd>
            </Button>
          </nav>

          {/* Header Actions: Sign In button or User Avatar Dropdown */}
          <div className="nav-mobile-actions">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 rounded-full p-0 border border-ink/20 hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring shrink-0"
                    aria-label="User menu"
                  >
                    <Avatar className="size-9">
                      <AvatarImage
                        src={userAvatar || undefined}
                        alt={userName}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-ink text-paper font-mono text-xs font-bold uppercase">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <div className="flex items-center gap-2.5 p-2">
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage
                        src={userAvatar || undefined}
                        alt={userName}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-ink text-paper font-mono text-xs font-bold uppercase">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 space-y-0.5">
                      {session.user.name && (
                        <p className="text-sm font-semibold truncate leading-tight text-foreground">
                          {session.user.name}
                        </p>
                      )}
                      {userEmail && (
                        <p className="text-xs text-muted-foreground truncate leading-tight">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleSignOut}
                      className="cursor-pointer font-medium"
                    >
                      <SignOutIcon weight="bold" className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="border-ink/40 font-mono text-xs font-bold tracking-wider px-2 sm:px-3"
                aria-label="Sign In"
              >
                <UserIcon weight="bold" className="size-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>

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
