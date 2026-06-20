"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { HeaderProps } from "@/types";

export default function AppHeader({ onSearchOpenAction }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b-2 px-6 md:px-12">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80"
        >
          <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center font-display font-black text-xl leading-none tracking-tighter">
            S
          </div>
          <span className="font-display text-2xl font-black uppercase tracking-tight">
            SYNTAX<span className="font-serif italic lowercase tracking-normal">.stash</span>
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden items-center gap-8 md:flex">
        <Link
          href="/"
          className={`font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
            pathname === "/" ? "text-foreground underline underline-offset-8 decoration-2" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Home
        </Link>
        <Link
          href="/tools"
          className={`font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
            pathname.startsWith("/tools") ? "text-foreground underline underline-offset-8 decoration-2" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tools
        </Link>
        <Link
          href="/resources"
          className={`font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
            pathname.startsWith("/resources") ? "text-foreground underline underline-offset-8 decoration-2" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Resources
        </Link>
        <Link
          href="/about"
          className={`font-mono text-sm font-bold uppercase tracking-widest transition-colors ${
            pathname === "/about" ? "text-foreground underline underline-offset-8 decoration-2" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          About
        </Link>
      </nav>

      {/* Right: Search / CTA */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onSearchOpenAction}
          variant="outline"
          className="border-border text-foreground hover:bg-foreground hover:text-background flex shrink-0 rounded-none border-2 bg-transparent font-mono text-xs font-bold tracking-widest uppercase transition-colors"
          aria-label="Search"
        >
          <MagnifyingGlassIcon weight="bold" className="shrink-0" />
          <span className="hidden sm:inline ml-2">EXPLORE LIBRARY</span>
          <Kbd className="border-border bg-background text-foreground ml-4 rounded-none border-none px-2 font-mono group-hover:bg-background group-hover:text-foreground">
            ⌘K
          </Kbd>
        </Button>
      </div>
    </header>
  );
}
