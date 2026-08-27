"use client";

import { GithubLogoIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo } from "react";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { signIn } from "@/lib/auth-client";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { getResourceId } from "@/lib/utils";
import { Tool } from "@/types";

const ALL_TOOLS: Tool[] = [...internalTools, ...resourceLinks];

export default function SavedPage() {
  const { bookmarkedSet, bookmarksCount } = useBookmarks();

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
              <p className="lib-sub">
                {bookmarksCount === 0
                  ? "Your cloud-synced personal collection."
                  : `${bookmarksCount} saved item${bookmarksCount === 1 ? "" : "s"} in your cloud collection.`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {bookmarksCount === 0 ? (
        <div className="section-inner py-16 text-center">
          <p className="font-mono text-base font-bold uppercase">Your stash is empty</p>
          <p className="mx-auto mt-1.5 max-w-sm font-mono text-xs opacity-60">
            Sign in with Google or GitHub to save tools and resources to your cloud account across all your devices.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOAuthSignIn("github")}
              className="border-ink/40 font-mono text-xs font-bold tracking-wider uppercase hover:bg-ink hover:text-paper"
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


          <div className="mt-8 flex justify-center gap-3 border-t border-ink/10 pt-6">
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs uppercase opacity-70 hover:opacity-100">
              <Link href="/resources">Browse Resources</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs uppercase opacity-70 hover:opacity-100">
              <Link href="/tools">Browse Tools</Link>
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
