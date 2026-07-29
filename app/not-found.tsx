import type { Metadata } from "next";
import Link from "next/link";

import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page or resource you were looking for does not exist in syntax-stash.",
};

export default function NotFound() {
  return (
    <div className="bg-background border-border flex min-h-[75vh] flex-col items-center justify-center border-b-2 px-6 py-16 text-center sm:px-12 lg:px-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Eyebrow */}
        <div className="hero-eyebrow mb-4">
          <HeroEyebrowDots />
          ERROR 404 · PAGE NOT FOUND
        </div>

        {/* Giant 404 Typography */}
        <div className="my-2 overflow-hidden select-none">
          <h1 className="font-display text-destructive text-[22vw] leading-none font-black tracking-tighter uppercase sm:text-[18vw]">
            404
          </h1>
        </div>

        {/* Headline Subtitle */}
        <h2 className="text-mono-3xl mb-4">The page you are looking for does not exist.</h2>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" variant="default">
            <Link href="/" className="text-display-xs">
              RETURN TO HOME
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
