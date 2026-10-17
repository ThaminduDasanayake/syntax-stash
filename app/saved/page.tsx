"use client";

import {
  BookmarkSimpleIcon,
  FolderSimpleIcon,
  GoogleLogoIcon,
  PaletteIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { CollectionsView } from "@/components/collections/collections-view";
import { FilterBarSkeleton } from "@/components/filter-bar-skeleton";
import { FilterSection } from "@/components/filter-section";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { usePaletteBookmarks } from "@/hooks/use-palette-bookmarks";
import { signIn, useSession } from "@/lib/auth-client";
import { cn, getResourceId } from "@/lib/utils";
import { Resource } from "@/types";

type StashTab = "bookmarks" | "collections";

function SavedPageInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<StashTab>("bookmarks");
  const { data: session, isPending: isSessionLoading } = useSession();
  const { bookmarkedSet, isLoading: isBookmarksLoading } = useBookmarks();
  const { count: paletteBookmarksCount } = usePaletteBookmarks();
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);

  // Sync tab from query params if navigating with ?tab=collections or ?collection=color-palettes
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const colParam = searchParams.get("collection");
    if (tabParam === "collections" || colParam) {
      setActiveTab("collections");
    }
  }, [searchParams]);

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

  const isLoading = isBookmarksLoading || isResourcesLoading || isSessionLoading;

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
            <div className="border-line bg-surface/60 inline-flex items-center rounded-lg border-[1.5px] p-1 font-mono text-xs">
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
          <div className="card-body pb-32">
            <div className="section-inner">
              <div className="card-grid w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
          <FilterBarSkeleton searchPlaceholder="Search saved stash..." />
        </>
      ) : savedResources.length === 0 ? (
        <div className="mx-auto flex min-h-[45vh] flex-col items-center justify-center py-16 text-center">
          <p className="font-mono text-base font-bold uppercase">Your stash is empty</p>

          {paletteBookmarksCount > 0 ? (
            <div className="border-line bg-surface/40 mt-4 flex max-w-md flex-col items-center rounded-lg border-[1.5px] p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase">
                <PaletteIcon className="text-primary size-4" />
                <span>Saved Color Palettes</span>
              </div>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                You have {paletteBookmarksCount} color{" "}
                {paletteBookmarksCount === 1 ? "palette" : "palettes"} saved. You can view and
                manage them in your collections.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("collections")}
                className="mt-3 gap-1.5 font-mono text-xs font-bold uppercase"
              >
                <FolderSimpleIcon className="size-3.5" />
                <span>Open Color Palettes Collection</span>
              </Button>
            </div>
          ) : session ? (
            <>
              <p className="mt-1.5 max-w-sm font-mono text-xs opacity-60">
                You haven&apos;t saved any tools or resources yet. Bookmark items across the library
                to access them here anytime.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-ink/40 hover:bg-ink hover:text-paper font-mono text-xs font-bold tracking-wider uppercase"
                >
                  <Link href="/resources">Explore Library</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-ink/40 hover:bg-ink hover:text-paper font-mono text-xs font-bold tracking-wider uppercase"
                >
                  <Link href="/tools/color-studio">Explore Color Studio</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-1.5 max-w-sm font-mono text-xs opacity-60">
                Sign in with Google or GitHub to save tools and resources to your cloud account
                across all your devices.
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
            </>
          )}
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

export default function SavedPage() {
  return (
    <Suspense fallback={<FilterBarSkeleton searchPlaceholder="Loading saved stash..." />}>
      <SavedPageInner />
    </Suspense>
  );
}
