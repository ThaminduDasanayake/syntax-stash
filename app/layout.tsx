import "./globals.css";

import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { ReactNode } from "react";

import AppLayout from "@/components/app-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  style: ["italic", "normal"],
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "400"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "syntax-stash",
    template: "%s | syntax-stash",
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
      className={cn(
        bricolage.variable,
        inter.variable,
        instrumentSerif.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <TooltipProvider>
            <AppLayout>{children}</AppLayout>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
