"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { HeaderProps } from "@/types";

export default function AppHeader({
  isScrolled,
  onSearchOpenAction,
}: HeaderProps & { isScrolled?: boolean }) {
  const pathname = usePathname();

  return (
    <header className={cn("site-nav", isScrolled && "site-nav--scrolled")}>
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          {/* TODO: make into nav-logo-img*/}
          <div className="bg-foreground text-background font-display flex h-8 w-8 items-center justify-center text-xl leading-none font-black tracking-tighter">
            S
          </div>
          <span className="font-display text-2xl font-black tracking-tight uppercase">
            SYNTAX<span className="font-serif tracking-normal lowercase italic">.stash</span>
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="nav-links">
          <Link
            href="/"
            className={`font-mono text-sm font-bold tracking-widest uppercase transition-colors ${
              pathname === "/"
                ? "text-foreground underline decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/tools"
            className={`font-mono text-sm font-bold tracking-widest uppercase transition-colors ${
              pathname.startsWith("/tools")
                ? "text-foreground underline decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tools
          </Link>
          <Link
            href="/resources"
            className={`font-mono text-sm font-bold tracking-widest uppercase transition-colors ${
              pathname.startsWith("/resources")
                ? "text-foreground underline decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Resources
          </Link>
          <Link
            href="/about"
            className={`font-mono text-sm font-bold tracking-widest uppercase transition-colors ${
              pathname === "/about"
                ? "text-foreground underline decoration-2 underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right: Search / CTA */}
        <div className="flex items-center gap-4">
          <Button onClick={onSearchOpenAction} size="sm" aria-label="Search">
            <MagnifyingGlassIcon weight="bold" className="shrink-0" />
            <span className="ml-2 hidden sm:inline">EXPLORE LIBRARY</span>
            <Kbd className="bg-background text-foreground group-hover:bg-background group-hover:text-foreground ml-4 rounded-none border-none px-2 font-mono">
              ⌘K
            </Kbd>
          </Button>
        </div>
      </div>
    </header>
  );
}
