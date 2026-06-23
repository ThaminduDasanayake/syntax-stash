import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Theme = "orange" | "blue" | "pink" | "green";

const THEME_LOOP_ORDER: Theme[] = ["orange", "blue", "pink", "green"];

const THEME_STYLES = {
  blue: {
    button: "bg-c-blue text-paper hover:bg-c-blue hover:text-paper",
    dotActive: "bg-paper border-paper",
    dotInactive: "bg-c-blue border-ink",
  },
  green: {
    button: "bg-c-green text-ink hover:bg-c-green",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-green border-ink",
  },
  orange: {
    button: "bg-c-orange text-ink hover:bg-c-orange",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-orange border-ink",
  },
  pink: {
    button: "bg-c-pink text-ink hover:bg-c-pink",
    dotActive: "bg-ink border-ink",
    dotInactive: "bg-c-pink border-ink",
  },
} satisfies Record<
  Theme,
  {
    button: string;
    dotActive: string;
    dotInactive: string;
  }
>;

interface DotButtonProps extends ComponentProps<typeof Button> {
  isActive: boolean;
  index?: number;
  theme?: Theme;
  badgeText?: string;
  label: string;
}

export function DotButton({
  isActive,
  index = 0,
  theme,
  badgeText,
  label,
  className,
  ...props
}: DotButtonProps) {
  const activeTheme: Theme = theme ?? THEME_LOOP_ORDER[index % THEME_LOOP_ORDER.length];

  const styles = THEME_STYLES[activeTheme];

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn("filter-pill", isActive && styles.button, className)}
      {...props}
    >
      <span className={cn("filter-pill-dot", isActive ? styles.dotActive : styles.dotInactive)} />

      {badgeText && <span className="font-mono opacity-80">{badgeText}</span>}
      <span>{label}</span>
    </Button>
  );
}
