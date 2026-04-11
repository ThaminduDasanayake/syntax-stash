"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CommandMenu from "@/components/CommandMenu";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onSearchOpen={() => setOpen(true)} />
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
}
