"use client";

import { BookMarked, Box, ChevronRight, Home, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { internalTools, resourceCategories } from "@/lib/data";
import { cn, slugify } from "@/lib/utils";
import { SidebarProps } from "@/types";

const Sidebar = ({ isOpen, onCloseAction }: SidebarProps) => {
  const pathname = usePathname();

  /** Active state for internal tool links */
  const toolLinkClass = (url: string) =>
    cn(
      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
      pathname === url
        ? "text-primary bg-primary/10 font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-accent",
    );

  /** Active state for resource category links */
  const categorySlug = (cat: string) => `/category/${slugify(cat)}`;

  const catLinkClass = (cat: string) => {
    const href = categorySlug(cat);
    return cn(
      "group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
      pathname === href
        ? "text-primary bg-primary/10 font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-accent",
    );
  };

  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground relative z-50 flex h-full w-60 shrink-0 flex-col border-r",
        // Mobile: fixed overlay that slides in/out
        "fixed inset-y-0 left-0 transition-transform duration-300 ease-in-out",
        // Desktop: static, always visible, no translate
        "md:static md:translate-x-0 md:transition-none",
        // Mobile open/closed state
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Branding */}
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        <div>
          <Link
            href="/"
            className="text-sidebar-foreground block font-mono text-base font-semibold tracking-tight"
            onClick={onCloseAction}
          >
            syntax<span className="text-primary">-</span>stash
          </Link>
          <p className="text-muted-foreground mt-0.5 text-[11px]">Developer swiss army knife</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onCloseAction}
          className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md p-1 transition-colors md:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-2 py-4">
        {/* Section 0: Home */}
        <section>
          <ul className="mb-6 space-y-0.5">
            <li>
              <Link href="/" className={toolLinkClass("/")} onClick={onCloseAction}>
                <Home size={16} className="text-foreground/80 mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Home</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* Section 1: Inbuilt Tools */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 px-2">
            <Wrench size={11} className="text-primary" />
            <h3 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Inbuilt Tools
            </h3>
          </div>
          <ul className="space-y-0.5">
            {internalTools.map((tool) => {
              const Icon = tool.icon || Box;
              return (
                <li key={tool.url}>
                  <Link href={tool.url} className={toolLinkClass(tool.url)} onClick={onCloseAction}>
                    <Icon className="text-primary mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">{tool.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Divider */}
        <div className="border-sidebar-border border-t" />

        {/* Section 2: Resource Stash */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 px-2">
            <BookMarked size={11} className="text-secondary" />
            <h3 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Resource Stash
            </h3>
          </div>
          <ul className="space-y-0.5">
            {resourceCategories.map((cat) => (
              <li key={cat}>
                <Link
                  href={categorySlug(cat)}
                  className={catLinkClass(cat)}
                  onClick={onCloseAction}
                >
                  <span className="truncate">{cat}</span>
                  <ChevronRight
                    size={12}
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>

      {/* Footer */}
      <div className="border-sidebar-border border-t p-3">
        <p className="text-muted-foreground text-center font-mono text-[10px]">
          syntax-stash · handmade
        </p>
      </div>
    </aside>
  );
};
export default Sidebar;
