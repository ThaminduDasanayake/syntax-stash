"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground relative h-9 w-9 overflow-hidden"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
