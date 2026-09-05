"use client";

import {
  ArrowUpRightIcon,
  BookmarksSimpleIcon,
  ClockCounterClockwiseIcon,
  HandshakeIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SignOutIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resetBookmarkCache, useBookmarks } from "@/hooks/use-bookmarks";
import { usePendingSubmissions } from "@/hooks/use-pending-submissions";
import { signOut, useSession } from "@/lib/auth-client";
import { siteConfig } from "@/lib/site-config";

import { NAV_LINKS } from "./constants";

interface UserMenuProps {
  onSearchOpenAction: () => void;
}

export function UserMenu({ onSearchOpenAction }: UserMenuProps) {
  const { data: session } = useSession();
  const { bookmarksCount } = useBookmarks();
  const { count: pendingCount, isUserAdmin } = usePendingSubmissions();

  if (!session) return null;

  const handleSignOut = async () => {
    resetBookmarkCache();
    await signOut();
  };

  const userAvatar = session.user?.image;
  const userName = session.user?.name || session.user?.email || "User";
  const userEmail = session.user?.email;
  const userInitial = (session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="border-ink/20 hover:bg-muted focus-visible:ring-ring relative size-9 shrink-0 rounded-full border p-0 focus-visible:ring-1"
          aria-label="User menu"
        >
          <Avatar className="size-9 overflow-visible">
            <AvatarImage
              src={userAvatar || undefined}
              alt={userName}
              referrerPolicy="no-referrer"
              className="rounded-full"
            />
            <AvatarFallback className="bg-ink text-paper font-mono text-xs font-bold uppercase">
              {userInitial}
            </AvatarFallback>

            {isUserAdmin && pendingCount > 0 && (
              <AvatarBadge
                className="bg-c-orange text-ink ring-ink px-1 font-mono text-[10px] font-bold"
                aria-label={`${pendingCount} pending submissions`}
              >
                {pendingCount > 99 ? "99+" : pendingCount}
              </AvatarBadge>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2">
        {/* User Identity Header */}
        <div className="flex items-center gap-2.5 p-2">
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

        <div className="lg:hidden">
          <DropdownMenuGroup>
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className="w-full cursor-pointer py-1.5 font-medium">
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
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

        {/* Community & Info Links */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/about"
              className="flex w-full cursor-pointer items-center gap-2 py-1.5 font-medium"
            >
              <InfoIcon weight="bold" className="text-muted-foreground size-4" />
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/authors"
              className="flex w-full cursor-pointer items-center gap-2 py-1.5 font-medium"
            >
              <UsersIcon weight="bold" className="text-muted-foreground size-4" />
              Authors
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/changelog"
              className="flex w-full cursor-pointer items-center gap-2 py-1.5 font-medium"
            >
              <ClockCounterClockwiseIcon weight="bold" className="text-muted-foreground size-4" />
              Changelog
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full cursor-pointer items-center justify-between py-1.5 font-medium"
            >
              <span className="flex items-center gap-2">
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={16}
                  height={16}
                  className="size-4 opacity-70 group-hover:opacity-100 dark:invert"
                />
                GitHub
              </span>
              <ArrowUpRightIcon weight="bold" className="text-muted-foreground size-3" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full cursor-pointer items-center justify-between py-1.5 font-medium"
            >
              <span className="flex items-center gap-2">
                <HandshakeIcon weight="bold" className="text-muted-foreground size-4" />
                Contribute
              </span>
              <ArrowUpRightIcon weight="bold" className="text-muted-foreground size-3" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Admin Section */}
        {isUserAdmin && (
          <>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/submissions"
                  className="flex w-full cursor-pointer items-center justify-between py-1.5 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheckIcon weight="bold" className="size-4" />
                    Admin Queue
                  </span>
                  {pendingCount > 0 && (
                    <span className="bg-c-orange text-ink rounded-full border-[1.5px] px-1 text-center font-mono text-[10px] font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="my-1" />

        {/* Sign Out */}
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
  );
}
