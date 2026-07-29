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
    <div className="bg-background border-border flex min-h-[70vh] flex-col items-center justify-center border-b-2 px-6 py-24 text-center sm:px-12 lg:px-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        {/* Eyebrow */}
        <div className="hero-eyebrow mb-8">
          <HeroEyebrowDots />
          ERROR 404 · PAGE NOT FOUND
        </div>

        {/* Headline */}
        <h1 className="hero-headline mb-6">
          STASH NOT
          <br />
          <em className="text-c-orange">found.</em>
        </h1>

        {/* Description */}
        <p className="hero-sub mx-auto mb-10 max-w-lg font-mono text-sm leading-relaxed opacity-85">
          The tool, page, or resource you were looking for doesn&apos;t exist or has been moved. Use
          the links below to return to the library.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" variant="default">
            <Link href="/" className="text-display-xs">
              RETURN TO HOME
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/tools" className="text-display-xs">
              EXPLORE TOOLS ↗
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
