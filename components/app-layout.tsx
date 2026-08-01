"use client";

import { ReactNode, useEffect, useState } from "react";

import AppHeader from "@/components/app-header";
import CommandMenu from "@/components/command-menu";
import Footer from "@/components/footer";

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
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
    </div>
  );
}
