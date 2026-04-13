"use client";

import { useState } from "react";

import CommandMenu from "@/components/CommandMenu";
import Header from "@/components/Header";
import { AppShellProps } from "@/types";

export default function AppShell({ children, onMenuOpenAction }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onSearchOpenAction={() => setOpen(true)} onMenuOpenAction={onMenuOpenAction} />
      {/* Scrollbar fix: keep padding on inner div, not on the scroll container */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </div>
      <CommandMenu open={open} setOpenAction={setOpen} />
    </>
  );
}
