import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ReactNode } from "react";

import AppLayout from "@/components/AppLayout";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "syntax-stash",
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
      className={cn(geistMono.variable, jetbrainsMono.variable)}
    >
      <body className="bg-background text-foreground hacker-grid flex h-screen overflow-hidden antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
