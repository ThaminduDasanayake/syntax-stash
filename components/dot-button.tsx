import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn, Theme, THEME_CONFIG, THEMES } from "@/lib/utils";

export type { Theme };

interface DotButtonProps extends ComponentProps<typeof Button> {
  badgeText?: string;
  index?: number;
  isActive: boolean;
  label: string;
  theme?: Theme;
}

export function DotButton({
  badgeText,
  className,
  index = 0,
  isActive,
  label,
  theme,
  ...props
}: DotButtonProps) {
  const activeTheme: Theme = theme ?? THEMES[index % THEMES.length];
  const styles = THEME_CONFIG[activeTheme];

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn("filter-pill", isActive && styles.pillActive, className)}
      {...props}
    >
      <span className={cn("filter-pill-dot", isActive ? styles.dotActive : styles.dotInactive)} />

      {badgeText && <span className="font-mono opacity-80">{badgeText}</span>}
      <span>{label}</span>
    </Button>
  );
}
