"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import AppShell from "@/components/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <AppShell onMenuOpen={() => setSidebarOpen(true)}>
          {children}
        </AppShell>
      </main>
    </>
  );
}
