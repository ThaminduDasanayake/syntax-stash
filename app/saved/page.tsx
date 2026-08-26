"use client";

import { DownloadSimpleIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { toast } from "sonner";

import { FilterSection } from "@/components/filter-section";
import { HeroEyebrowDots } from "@/components/hero-eyebrow-dots";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { resourceLinks } from "@/lib/resource-data";
import { internalTools } from "@/lib/tools-data";
import { getResourceId } from "@/lib/utils";
import { Tool } from "@/types";

const ALL_TOOLS: Tool[] = [...internalTools, ...resourceLinks];

export default function SavedPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { bookmarkedSet, bookmarksCount, clearBookmarks, exportBookmarks, importBookmarks } =
    useBookmarks();

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
        const res = importBookmarks(content);
        if (res.success) {
          if (res.count > 0) {
            toast.success(`Imported ${res.count} new item${res.count === 1 ? "" : "s"} to your stash!`);
          } else {
            toast.info("All items in the imported file are already in your stash.");
          }
        } else {
          toast.error(res.error || "Failed to import bookmarks.");
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
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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
              <div className="mb-1 shrink-0">
                <ButtonGroup className="border-ink bg-background border-[1.5px] shadow-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportBookmarks}
                    className="border-ink/20 hover:bg-ink hover:text-paper h-8 rounded-none border-r px-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    <DownloadSimpleIcon weight="bold" /> Export JSON
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-ink/20 hover:bg-ink hover:text-paper h-8 rounded-none border-r px-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    <UploadSimpleIcon weight="bold" /> Import JSON
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-paper h-8 rounded-none px-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors"
                      >
                        <TrashIcon weight="bold" /> Clear Stash
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear saved stash?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all {bookmarksCount} saved resource{bookmarksCount === 1 ? "" : "s"} from your browser&apos;s local storage. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearBookmarks}>
                          Clear Stash
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ButtonGroup>
              </div>
            )}
          </div>
        </div>
      </header>

      {bookmarksCount === 0 ? (
        <div className="section-inner py-16 text-center">
          <p className="font-mono text-base font-bold uppercase">Your stash is empty</p>
          <p className="mx-auto mt-1.5 max-w-sm font-mono text-xs opacity-60">
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
