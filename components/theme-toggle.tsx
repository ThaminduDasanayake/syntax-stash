"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const root = document.documentElement;

    root.style.setProperty("--x", `${x}px`);
    root.style.setProperty("--y", `${y}px`);

    document.startViewTransition(() => {
      // 1. Force the DOM to update synchronously so the transition captures the new theme immediately
      if (nextTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // 2. Update next-themes state to keep React in sync
      setTheme(nextTheme);
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative h-9 w-9 overflow-hidden"
      onClick={handleToggle}
      title="Toggle theme"
    >
      <SunIcon
        weight="bold"
        size={18}
        className="absolute scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90"
      />

      <MoonIcon
        weight="bold"
        size={18}
        className="absolute scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0"
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
