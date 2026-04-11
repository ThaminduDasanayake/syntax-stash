"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  BookMarked,
  ChevronRight,
  Home,
  Box,
} from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { internalTools, resourceCategories } from "@/lib/data";

export default function SidebarNav() {
  const pathname = usePathname();

  /** Active state for internal tool links */
  const toolLinkClass = (url: string) =>
    cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
      pathname === url
        ? "text-primary bg-primary/10 font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    );

  /** Active state for resource category links */
  const categorySlug = (cat: string) => `/category/${slugify(cat)}`;
  const catLinkClass = (cat: string) => {
    const href = categorySlug(cat);
    return cn(
      "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors group",
      pathname === href
        ? "text-primary bg-primary/10 font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    );
  };

  return (
    <aside className="w-60 h-screen flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shrink-0">
      {/* ── Branding ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-sidebar-border">
        <Link
          href="/"
          className="block font-mono text-base font-semibold tracking-tight text-sidebar-foreground"
        >
          syntax<span className="text-primary">-</span>stash
        </Link>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Developer swiss army knife
        </p>
      </div>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {/* Section 0: Home */}
        <section>
          <ul className="space-y-0.5 mb-6">
            <li>
              <Link href="/" className={toolLinkClass("/")}>
                <Home size={16} className="shrink-0 text-foreground/80 w-4 h-4 mr-2" />
                <span className="truncate">Home</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* Section 1: Inbuilt Tools */}
        <section>
          <div className="flex items-center gap-1.5 px-2 mb-2">
            <Wrench size={11} className="text-primary" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Inbuilt Tools
            </h3>
          </div>
          <ul className="space-y-0.5">
            {internalTools.map((tool) => {
              const Icon = tool.icon || Box;
              return (
                <li key={tool.url}>
                  <Link href={tool.url} className={toolLinkClass(tool.url)}>
                    <Icon className="shrink-0 text-primary w-4 h-4 mr-2" />
                    <span className="truncate">{tool.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Divider */}
        <div className="border-t border-sidebar-border" />

        {/* Section 2: Resource Stash */}
        <section>
          <div className="flex items-center gap-1.5 px-2 mb-2">
            <BookMarked size={11} className="text-secondary" />
            <h3 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Resource Stash
            </h3>
          </div>
          <ul className="space-y-0.5">
            {resourceCategories.map((cat) => (
              <li key={cat}>
                <Link href={categorySlug(cat)} className={catLinkClass(cat)}>
                  <span className="truncate">{cat}</span>
                  <ChevronRight
                    size={12}
                    className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground font-mono text-center">
          syntax-stash · handmade
        </p>
      </div>
    </aside>
  );
}
