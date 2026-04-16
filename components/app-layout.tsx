"use client";

import { ReactNode, useState } from "react";

import CommandMenu from "@/components/CommandMenu";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onCloseAction={() => setSidebarOpen(false)} />

      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          onSearchOpenAction={() => setCommandMenuOpen(true)}
          onMenuOpenAction={() => setSidebarOpen(true)}
        />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </div>

        <CommandMenu open={commandMenuOpen} setOpenAction={setCommandMenuOpen} />
      </main>
    </>
  );
}
