"use client";

import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import { useMemo } from "react";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { signIn } from "@/lib/auth-client";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { getResourceId } from "@/lib/utils";
import { Tool } from "@/types";

const ALL_TOOLS: Tool[] = [...internalTools, ...resourceLinks];

export default function SavedPage() {
  const { bookmarkedSet, bookmarksCount, isLoading } = useBookmarks();

  const savedResources = useMemo(() => {
    return ALL_TOOLS.filter((item) => bookmarkedSet.has(getResourceId(item)));
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
              <div className="lib-sub">
                {isLoading ? (
                  <Skeleton className="h-5 w-64 bg-ink/10" />
                ) : bookmarksCount === 0 ? (
                  "Your cloud-synced personal collection."
                ) : (
                  `${bookmarksCount} saved item${bookmarksCount === 1 ? "" : "s"} in your cloud collection.`
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="card-body">
          <div className="section-inner">
            <div className="mb-8 flex w-full items-center gap-3">
              <Skeleton className="h-4 w-32 bg-ink/10" />
              <span className="h-0.5 flex-1 bg-primary/20" />
            </div>
            <div className="card-grid w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : bookmarksCount === 0 ? (
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
              className="border-ink/40 hover:bg-ink hover:text-paper font-mono text-xs font-bold tracking-wider uppercase"
            >
              <GithubLogoIcon weight="bold" /> Sign In with GitHub
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
          itemLabel="Saved Items"
        />
      )}
    </div>
  );
}
