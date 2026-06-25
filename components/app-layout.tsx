"use client";

import { ReactNode, useEffect, useState } from "react";

import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import CommandMenu from "@/components/command-menu";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader isScrolled={isScrolled} onSearchOpenAction={() => setCommandMenuOpen(true)} />
      <main
        // onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 10)}
        className="flex-1"
      >
        {children}
      </main>
      <AppFooter />
      <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
    </div>
  );
}
