"use client";

import { ReactNode, useState } from "react";

import CommandMenu from "@/components/CommandMenu";
import Header from "@/components/Header";

type AppShellProps = {
  children: ReactNode;
  onMenuOpenAction: () => void;
};

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
