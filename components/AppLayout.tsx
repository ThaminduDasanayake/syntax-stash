"use client";

import { ReactNode, useState } from "react";

import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
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
      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppShell onMenuOpenAction={() => setSidebarOpen(true)}>{children}</AppShell>
      </main>
    </>
  );
}
