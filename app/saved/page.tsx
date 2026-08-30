"use client";

import { GoogleLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useMemo } from "react";

import { FilterBarSkeleton } from "@/components/filter-bar-skeleton";
import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { signIn } from "@/lib/auth-client";
import { resourceLinks } from "@/lib/resource-data";
import { getResourceId } from "@/lib/utils";

export default function SavedPage() {
  const { bookmarkedSet, isLoading } = useBookmarks();

  const savedResources = useMemo(() => {
    return resourceLinks.filter((item) => bookmarkedSet.has(getResourceId(item)));
  }, [bookmarkedSet]);

  const savedCategories = useMemo(() => {
    return Array.from(new Set(savedResources.map((r) => r.category)));
  }, [savedResources]);

  const handleOAuthSignIn = (provider: "github" | "google") => {
    signIn.social({
      callbackURL: "/saved",
      provider,
    });
  };

  return (
    <div className="lib-page">
      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="lib-headline">
                YOUR STASH
                <br />
                <em>saved.</em>
              </h1>
              <p className="lib-sub">
                {savedResources.length > 0
                  ? `${savedResources.length} saved resource${savedResources.length === 1 ? "" : "s"} in your cloud collection.`
                  : "Your cloud-synced personal collection."}
              </p>
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <>
          <FilterBarSkeleton searchPlaceholder="Search saved stash..." />
          <div className="card-body">
            <div className="section-inner">
              <div className="card-grid w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : savedResources.length === 0 ? (
        <div className="mx-auto flex min-h-[45vh] flex-col items-center justify-center py-16 text-center">
          <p className="font-mono text-base font-bold uppercase">Your stash is empty</p>
          <p className="mt-1.5 max-w-sm font-mono text-xs opacity-60">
            Sign in with Google or GitHub to save tools and resources to your cloud account across
            all your devices.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOAuthSignIn("github")}
              className="group border-ink/40 hover:bg-ink hover:text-paper font-mono text-xs font-bold tracking-wider uppercase"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="size-4 transition-all group-hover:invert"
              />{" "}
              Sign In with GitHub
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOAuthSignIn("google")}
              className="border-ink/40 hover:bg-ink hover:text-paper font-mono text-xs font-bold tracking-wider uppercase"
            >
              <GoogleLogoIcon weight="bold" /> Sign In with Google
            </Button>
          </div>
        </div>
      ) : (
        <FilterSection
          items={savedResources}
          categories={savedCategories}
          searchPlaceholder="Search saved stash..."
          itemLabel="Saved Resources"
        />
      )}
    </div>
  );
}
