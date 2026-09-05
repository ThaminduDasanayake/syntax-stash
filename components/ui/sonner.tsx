"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        error: <XCircleIcon className="text-destructive size-4 shrink-0" weight="fill" />,
        info: <InfoIcon className="text-c-blue size-4 shrink-0" weight="fill" />,
        loading: <SpinnerIcon className="text-ink size-4 shrink-0 animate-spin" weight="bold" />,
        success: <CheckCircleIcon className="size-4 shrink-0 text-emerald-500" weight="fill" />,
        warning: <WarningIcon className="size-4 shrink-0 text-amber-400" weight="fill" />,
      }}
      style={
        {
          "--border-radius": "var(--radius)",
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--popover-foreground)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
