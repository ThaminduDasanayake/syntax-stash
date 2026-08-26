"use client";

import { DownloadSimpleIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useRef } from "react";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { getResourceId } from "@/lib/utils";
import { Tool } from "@/types";

const ALL_TOOLS: Tool[] = [...internalTools, ...resourceLinks];

export default function SavedPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    bookmarkedSet,
    bookmarksCount,
    clearBookmarks,
    exportBookmarks,
    importBookmarks,
  } = useBookmarks();

  const savedResources = useMemo(() => {
    return ALL_TOOLS.filter((item) => bookmarkedSet.has(getResourceId(item)));
  }, [bookmarkedSet]);

  const savedCategories = useMemo(() => {
    return Array.from(new Set(savedResources.map((r) => r.category)));
  }, [savedResources]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBookmarks(content);
        if (success) {
          alert("Bookmarks imported successfully!");
        } else {
          alert("Failed to import bookmarks. Please verify the JSON file format.");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="lib-page">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json"
        className="hidden"
      />

      {/* Header */}
      <header className="lib-header">
        <div className="section-inner">
          <div className="hero-eyebrow">
            <HeroEyebrowDots />
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="lib-headline">
                YOUR STASH
                <br />
                <em>saved.</em>
              </h1>
              <p className="lib-sub">
                {bookmarksCount === 0
                  ? "No saved resources yet."
                  : `${bookmarksCount} saved item${bookmarksCount === 1 ? "" : "s"} in your personal collection.`}
              </p>
            </div>

            {bookmarksCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={exportBookmarks}
                  className="font-mono text-xs"
                >
                  <DownloadSimpleIcon weight="bold" /> Export JSON
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-xs"
                >
                  <UploadSimpleIcon weight="bold" /> Import JSON
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    if (confirm("Are you sure you want to clear all saved bookmarks?")) {
                      clearBookmarks();
                    }
                  }}
                  className="text-destructive hover:bg-destructive/10 font-mono text-xs border-destructive/30"
                >
                  <TrashIcon weight="bold" /> Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {bookmarksCount === 0 ? (
        <div className="section-inner py-16 text-center">
          <p className="font-mono text-base font-bold uppercase">Your stash is empty</p>
          <p className="font-mono text-xs opacity-60 mt-1.5 max-w-sm mx-auto">
            Click the bookmark icon on any tool or resource card to save it here for quick access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild variant="default" size="sm" className="font-mono text-xs">
              <Link href="/resources">Browse Resources</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="font-mono text-xs">
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
