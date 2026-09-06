"use client";

import {
  ArrowLeftIcon,
  CircleNotchIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  FolderSimpleIcon,
  GlobeIcon,
  LockIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { FilterSection } from "@/components/filter-section";
import { ToolCardSkeleton } from "@/components/tool-card-skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCollections,UserCollection } from "@/hooks/use-collections";
import { resourceCategories } from "@/lib/resource-data";
import { Resource } from "@/types";

export function CollectionsView() {
  const { collections, createCollection, deleteCollection, isLoading } = useCollections();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColDesc] = useState("");
  const [newColPublic, setNewColPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [activeCollection, setActiveCollection] = useState<UserCollection | null>(null);
  const [collectionItems, setCollectionItems] = useState<Resource[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const [deletingCol, setDeletingCol] = useState<UserCollection | null>(null);

  // Fetch items when activeCollection changes
  useEffect(() => {
    if (!activeCollection) {
      setCollectionItems([]);
      return;
    }

    const loadItems = async () => {
      try {
        setIsLoadingItems(true);
        const res = await fetch(`/api/collections/${activeCollection.id}`);
        const data = await res.json();
        if (res.ok && data.items) {
          const validResources: Resource[] = data.items
            .map((it: { resource: Resource }) => it.resource)
            .filter(Boolean);
          setCollectionItems(validResources);
        }
      } catch (err) {
        console.error("Failed to load collection items:", err);
        toast.error("Failed to load collection items.");
      } finally {
        setIsLoadingItems(false);
      }
    };

    loadItems();
  }, [activeCollection]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    try {
      setIsCreating(true);
      const created = await createCollection({
        description: newColDesc.trim(),
        isPublic: newColPublic,
        name: newColName.trim(),
      });

      if (created) {
        setIsCreateOpen(false);
        setNewColName("");
        setNewColDesc("");
        setNewColPublic(false);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const collectionCategories = useMemo(() => {
    const cats = Array.from(new Set(collectionItems.map((r) => r.category)));
    return cats.length > 0 ? cats : resourceCategories;
  }, [collectionItems]);

  if (activeCollection) {
    return (
      <div className="space-y-6">
        {/* Header inside specific collection */}
        <div className="border-line flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between font-mono">
          <div className="space-y-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveCollection(null)}
              className="border-line hover:bg-surface h-7 gap-1 px-2.5 text-xs font-bold uppercase"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>All Collections</span>
            </Button>
            <h2 className="text-foreground pt-1 text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <FolderOpenIcon className="size-5 text-primary" />
              <span>{activeCollection.name}</span>
            </h2>
            {activeCollection.description && (
              <p className="text-muted-foreground text-xs font-sans">
                {activeCollection.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="border-line bg-surface rounded border px-2 py-0.5 text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              {activeCollection.isPublic ? (
                <>
                  <GlobeIcon className="size-3" /> Public Stash
                </>
              ) : (
                <>
                  <LockIcon className="size-3" /> Private Stash
                </>
              )}
            </span>
          </div>
        </div>

        {isLoadingItems ? (
          <div className="card-grid w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : collectionItems.length === 0 ? (
          <div className="border-line bg-surface/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center font-mono text-xs">
            <FolderSimpleIcon className="text-muted-foreground/60 size-10" />
            <p className="text-foreground mt-3 font-bold uppercase">This collection is empty</p>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Save tools from across the catalog or browse the main directory to populate this list.
            </p>
          </div>
        ) : (
          <FilterSection
            items={collectionItems}
            categories={collectionCategories}
            searchPlaceholder={`Search within ${activeCollection.name}...`}
            itemLabel={`${activeCollection.name} Tools`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-b pb-4 font-mono">
        <div>
          <h2 className="text-foreground text-sm font-bold uppercase tracking-wider">
            Custom Stash Folders
          </h2>
          <p className="text-muted-foreground text-xs">
            Organize your tools into personalized, curated lists.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="h-8 gap-1.5 px-3 text-xs font-bold uppercase"
        >
          <FolderPlusIcon className="size-4" />
          <span>New Collection</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-line bg-surface/40 h-32 animate-pulse rounded-lg border" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="border-line bg-surface/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-14 text-center font-mono text-xs">
          <FolderPlusIcon className="text-muted-foreground/60 size-10" />
          <p className="text-foreground mt-3 font-bold uppercase">No collections yet</p>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Create custom folders like &quot;Next.js Stack&quot; or &quot;UI Primitives&quot; to organize your favorite tools.
          </p>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 h-8 gap-1.5 text-xs font-bold uppercase"
          >
            <PlusIcon className="size-3.5" />
            <span>Create Your First Collection</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono text-xs">
          {collections.map((col) => (
            <div
              key={col.id}
              className="border-line bg-surface/40 hover:bg-surface/70 flex flex-col justify-between rounded-lg border p-4 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderSimpleIcon className="size-5 text-primary" />
                    <h3 className="text-foreground font-bold tracking-tight">{col.name}</h3>
                  </div>

                  <span className="border-line bg-surface rounded border px-1.5 py-0.5 text-[9px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    {col.isPublic ? <GlobeIcon className="size-2.5" /> : <LockIcon className="size-2.5" />}
                    {col.isPublic ? "Public" : "Private"}
                  </span>
                </div>

                {col.description && (
                  <p className="text-muted-foreground line-clamp-2 text-xs font-sans leading-relaxed">
                    {col.description}
                  </p>
                )}
              </div>

              <div className="border-line mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-muted-foreground text-[11px]">
                  <strong>{col.itemCount}</strong> {col.itemCount === 1 ? "tool" : "tools"}
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveCollection(col)}
                    className="border-line hover:bg-surface h-7 px-2.5 text-[11px] font-bold uppercase"
                  >
                    Open
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingCol(col)}
                    className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive h-7 px-2 text-[11px]"
                    title="Delete collection"
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="font-mono text-xs sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2 text-base font-bold uppercase tracking-tight">
              <FolderPlusIcon className="size-5 text-primary" />
              <span>Create New Collection</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs font-mono">
              Create a custom folder to organize, group, and curate your favorite developer tools.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Collection Name *
              </Label>
              <InputField
                placeholder="e.g. Next.js App Router Stack"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                required
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Description (Optional)
              </Label>
              <Textarea
                placeholder="What is this collection for?"
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                rows={2}
                className="font-sans text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="isPublicCheck"
                type="checkbox"
                checked={newColPublic}
                onChange={(e) => setNewColPublic(e.target.checked)}
                className="size-4 cursor-pointer accent-primary"
              />
              <label htmlFor="isPublicCheck" className="cursor-pointer text-xs select-none">
                Make this collection public (shareable link)
              </label>
            </div>

            <div className="border-line flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                disabled={isCreating}
                className="h-8 text-xs font-bold uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !newColName.trim()}
                className="h-8 gap-1 px-4 text-xs font-bold uppercase"
              >
                {isCreating ? (
                  <>
                    <CircleNotchIcon className="size-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Collection</span>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={Boolean(deletingCol)} onOpenChange={(open) => !open && setDeletingCol(null)}>
        <AlertDialogContent className="font-mono text-xs sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-mono text-base font-bold uppercase">
              Delete Collection?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-mono text-xs leading-relaxed">
              Are you sure you want to delete the collection{" "}
              <strong className="text-foreground">&quot;{deletingCol?.name}&quot;</strong>?
              <br />
              <br />
              This will remove the folder list. The saved tools themselves will remain in your
              bookmarks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="border-line font-mono text-xs font-bold uppercase">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCol) {
                  deleteCollection(deletingCol.id);
                  setDeletingCol(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs font-bold uppercase"
            >
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
