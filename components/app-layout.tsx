"use client";

import { ReactNode, useState } from "react";

import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";
import CommandMenu from "@/components/command-menu";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <main 
        onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 10)} 
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        <AppHeader isScrolled={isScrolled} onSearchOpenAction={() => setCommandMenuOpen(true)} />
        {children}
        <AppFooter />
      </main>
      <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
    </div>
  );
}
