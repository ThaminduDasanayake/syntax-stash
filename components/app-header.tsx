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
};

function AppHeaderInner({
  isScrolled,
  onSearchOpenAction,
}: HeaderProps & { isScrolled?: boolean }) {
  const pathname = usePathname();
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
              SYNTAX<em>.stash</em>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links hidden md:flex">
            {Object.values(navLinks).map((link) => {
              const isActive =
                !isSavedActive &&
                (link.exact ? pathname === link.href : pathname.startsWith(link.href));

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

            {session && (
              <Link
                href="/saved"
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
                  <span className="bg-ink text-paper dark:bg-paper dark:text-ink inline-flex min-h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-center text-[10px] leading-none font-extrabold">
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

          {/* Actions & Dropdown Triggers */}
          <div className="nav-mobile-actions">
            {!session ? (
              /* Logged Out State */
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="border-ink/40 hidden font-mono text-xs font-bold tracking-wider md:inline-flex"
                >
                  <UserIcon weight="bold" /> Sign In
                </Button>

                {/* Mobile Logged-Out Hamburger DropdownMenu */}
                <div className="md:hidden">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="nav-hamburger" aria-label="Toggle navigation menu">
                        <ListIcon size="24" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2">
                      <DropdownMenuGroup>
                        {Object.values(navLinks).map((link) => (
                          <DropdownMenuItem key={link.href} asChild>
                            <Link
                              href={link.href}
                              className="w-full cursor-pointer py-1.5 font-medium"
                            >
                              {link.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={onSearchOpenAction}
                          className="cursor-pointer py-1.5 font-medium"
                        >
                          <MagnifyingGlassIcon weight="bold" className="mr-2 size-4" />
                          Explore Library
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => setAuthModalOpen(true)}
                          className="cursor-pointer font-medium"
                        >
                          <UserIcon weight="bold" className="mr-2 size-4" />
                          Sign In
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              /* Logged In State: DropdownMenu for both Desktop and Mobile */
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="border-ink/20 hover:bg-muted focus-visible:ring-ring relative size-9 shrink-0 rounded-full border p-0 focus-visible:ring-1"
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
                <DropdownMenuContent align="end" className="w-60 p-2">
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
                    <div className="flex min-w-0 flex-col space-y-0.5">
                      {session.user.name && (
                        <p className="text-foreground truncate text-sm leading-tight font-semibold">
                          {session.user.name}
                        </p>
                      )}
                      {userEmail && (
                        <p className="text-muted-foreground truncate font-mono text-xs leading-tight">
                          {userEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Saved Stash Account Link (Desktop & Mobile) */}
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/saved"
                        className="flex w-full cursor-pointer items-center justify-between py-1.5 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <BookmarksSimpleIcon
                            weight={bookmarksCount > 0 ? "fill" : "bold"}
                            className="size-4 text-current"
                          />
                          Saved Stash
                        </span>
                        {bookmarksCount > 0 && (
                          <span className="bg-ink text-paper dark:bg-paper dark:text-ink min-h-4 min-w-4 rounded-full px-1.5 text-center text-[10px] font-extrabold">
                            {bookmarksCount}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Additional Mobile Navigation Links inside Dropdown (< md) */}
                  <div className="md:hidden">
                    <DropdownMenuGroup>
                      {Object.values(navLinks).map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link
                            href={link.href}
                            className="w-full cursor-pointer py-1.5 font-medium"
                          >
                            {link.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={onSearchOpenAction}
                        className="cursor-pointer py-1.5 font-medium"
                      >
                        <MagnifyingGlassIcon weight="bold" className="mr-2 size-4" />
                        Explore Library
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-1" />
                  </div>

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleSignOut}
                      className="cursor-pointer font-medium"
                    >
                      <SignOutIcon weight="bold" className="mr-2 size-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
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
