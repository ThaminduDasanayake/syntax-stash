"use client";

import { ListIcon, MagnifyingGlassIcon, PlusIcon, UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { SubmitToolDialog } from "@/components/submit-tool-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NAV_LINKS } from "./constants";

interface MobileNavDropdownProps {
  onSearchOpenAction: () => void;
  onSignInAction: () => void;
}

export function MobileNavDropdown({ onSearchOpenAction, onSignInAction }: MobileNavDropdownProps) {
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <SubmitToolDialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen} />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="nav-hamburger" aria-label="Toggle navigation menu">
            <ListIcon size="24" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-2">
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
              onSelect={() => setSubmitDialogOpen(true)}
              className="cursor-pointer py-1.5 font-medium"
            >
              <PlusIcon weight="bold" className="mr-2 size-4" />
              Submit a Resource
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
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onSignInAction} className="cursor-pointer font-medium">
              <UserIcon weight="bold" className="mr-2 size-4" />
              Sign In
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
