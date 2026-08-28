"use client";

import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import Link from "next/link";

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
import { resetBookmarkCache } from "@/hooks/use-bookmarks";
import { signOut, useSession } from "@/lib/auth-client";

import { NAV_LINKS } from "./constants";

interface UserMenuProps {
  onSearchOpenAction: () => void;
}

export function UserMenu({ onSearchOpenAction }: UserMenuProps) {
  const { data: session } = useSession();

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

        <div className="md:hidden">
          <DropdownMenuGroup>
            {NAV_LINKS.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className="w-full cursor-pointer py-1.5 font-medium">
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
  );
}
