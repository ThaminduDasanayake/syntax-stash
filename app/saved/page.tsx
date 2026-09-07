"use client";

import { BookmarkSimpleIcon, FolderSimpleIcon, GoogleLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { CollectionsView } from "@/components/collections/collections-view";
import { FilterBarSkeleton } from "@/components/filter-bar-skeleton";
import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { signIn } from "@/lib/auth-client";
import { cn, getResourceId } from "@/lib/utils";
import { Resource } from "@/types";

type StashTab = "bookmarks" | "collections";

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<StashTab>("bookmarks");
  const { bookmarkedSet, isLoading: isBookmarksLoading } = useBookmarks();
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => {
        if (data.resources && Array.isArray(data.resources)) {
          setAllResources(data.resources);
        }
      })
      .catch((err) => console.error("Failed to load resources for saved page:", err))
      .finally(() => setIsResourcesLoading(false));
  }, []);

  const savedResources = useMemo(() => {
    return allResources.filter((item) => bookmarkedSet.has(getResourceId(item)));
  }, [allResources, bookmarkedSet]);

  const savedCategories = useMemo(() => {
    return Array.from(new Set(savedResources.map((r) => r.category)));
  }, [savedResources]);

  const isLoading = isBookmarksLoading || isResourcesLoading;

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
                Your cloud-synced personal bookmarks and custom curated collections.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-line bg-surface/60 inline-flex items-center rounded-lg border p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("bookmarks")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-bold uppercase transition-colors",
                  activeTab === "bookmarks"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <BookmarkSimpleIcon className="size-3.5" />
                <span>Bookmarks ({savedResources.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("collections")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3.5 py-1.5 font-bold uppercase transition-colors",
                  activeTab === "collections"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <FolderSimpleIcon className="size-3.5" />
                <span>Collections</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      {activeTab === "collections" ? (
        <div className="section-inner py-6">
          <CollectionsView />
        </div>
      ) : isLoading ? (
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
