"use client";

import { ReactNode, useState } from "react";

import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import CommandMenu from "@/components/CommandMenu";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader onSearchOpenAction={() => setCommandMenuOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 md:p-8">{children}</div>
        </div>
        <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
      </main>
    </SidebarProvider>
  );
}
