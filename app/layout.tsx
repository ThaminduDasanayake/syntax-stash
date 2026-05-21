import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { ReactNode } from "react";

import AppLayout from "@/components/app-layout";
import AppLayout2 from "@/components/app-layout2";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | syntax-stash",
    default: "syntax-stash",
  },
  description: "A curated stash of developer tools, resources, and snippets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(manrope.variable, jetbrainsMono.variable, "h-full")}
    >
      <body className="bg-background text-foreground flex h-screen overflow-hidden antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppLayout2>{children}</AppLayout2>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
