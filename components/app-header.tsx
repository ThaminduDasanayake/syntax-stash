"use client";

import { ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/types";

const navLinks = {
  0: { exact: true, href: "/", label: "Home" },
  1: { exact: false, href: "/tools", label: "Tools" },
  2: { exact: false, href: "/resources", label: "Resources" },
  3: { exact: true, href: "/about", label: "About" },
};

export default function AppHeader({
  isScrolled,
  onSearchOpenAction,
}: HeaderProps & { isScrolled?: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
              const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);

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
