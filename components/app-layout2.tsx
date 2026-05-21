"use client";

import { ReactNode, useState } from "react";

import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import CommandMenu from "@/components/CommandMenu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout2({ children }: { children: ReactNode }) {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader onSearchOpenAction={() => setCommandMenuOpen(true)} />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-2 md:p-8">{children}</div>
        <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
      </SidebarInset>
    </SidebarProvider>
  );
}
