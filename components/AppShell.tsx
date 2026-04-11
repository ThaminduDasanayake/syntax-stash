"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CommandMenu from "@/components/CommandMenu";

type AppShellProps = {
  children: React.ReactNode;
  onMenuOpen: () => void;
};

export default function AppShell({ children, onMenuOpen }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onSearchOpen={() => setOpen(true)} onMenuOpen={onMenuOpen} />
      {/* Scrollbar fix: keep padding on inner div, not on the scroll container */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
}
