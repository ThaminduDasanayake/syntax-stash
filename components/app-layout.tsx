"use client";

import { ReactNode, useState } from "react";

import AppHeader from "@/components/app-header";
import CommandMenu from "@/components/command-menu";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <AppHeader onSearchOpenAction={() => setCommandMenuOpen(true)} />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
    </div>
  );
}
