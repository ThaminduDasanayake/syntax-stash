"use client";

import {
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
  ArticleIcon,
  GlobeIcon,
  UserCircleIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";

import { Pagination } from "@/components/admin/shared/pagination";
import { AdminToolbar } from "@/components/admin/layout/admin-toolbar";
import { AuthorDialog } from "@/components/admin/authors/author-dialog";
import { AdminTableRowActions } from "@/components/admin/resources/admin-table-row-actions";
import { SortSelect } from "@/components/admin/shared/sort-select";
import { ConfirmDialog } from "@/components/confirm-dialog/confirm-dialog";
import { invalidateAuthorCache } from "@/components/submissions/author-combobox";
import { AddButton } from "@/components/ui/add-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface AdminAuthorItem {
  blog: string | null;
  createdAt?: Date | string;
  github: string | null;
  id: string;
  linkedin: string | null;
  name: string;
  resourceCount: number;
  slug: string;
  twitter: string | null;
  updatedAt?: Date | string;
  website: string | null;
  youtube: string | null;
}

interface AdminAuthorsClientProps {
  initialAuthors: AdminAuthorItem[];
}

const ITEMS_PER_PAGE = 25;

const SORT_OPTIONS = [
  { label: "Fewest Resources", value: "resources-asc" },
  { label: "Most Resources", value: "resources-desc" },
  { label: "Name (A → Z)", value: "name-asc" },
  { label: "Name (Z → A)", value: "name-desc" },
  { label: "Recently Added", value: "created-desc" },
  { label: "Recently Updated", value: "updated-desc" },
];

function AdminAuthorsClientContent({ initialAuthors = [] }: AdminAuthorsClientProps) {
  const searchParams = useSearchParams();
  const paramQ = searchParams.get("q") || "";
  const [authors, setAuthors] = useState<AdminAuthorItem[]>(initialAuthors);
  const [searchQuery, setSearchQuery] = useState(paramQ);
  const [filterMode, setFilterMode] = useState<"all" | "with-resources" | "without-resources">(
    "all",
  );
  const [sortBy, setSortBy] = useState<string>("resources-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AdminAuthorItem | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<AdminAuthorItem | null>(null);

  // Refresh from API
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/authors");
      const data = await res.json();
      if (res.ok && data.authors) {
        setAuthors(data.authors);
        toast.info("Authors list synchronized.");
      } else {
        toast.error(data.error || "Failed to refresh authors.");
      }
    } catch {
      toast.error("Network error while refreshing.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingAuthor(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (authorItem: AdminAuthorItem) => {
    setEditingAuthor(authorItem);
    setIsModalOpen(true);
  };

  // Delete Author
  const handleConfirmDelete = async () => {
    if (!deletingAuthor) return;
    const target = deletingAuthor;

    if (target.resourceCount > 0) {
      toast.error(
        `Cannot delete "${target.name}". It is assigned to ${target.resourceCount} resource(s).`,
      );
      setDeletingAuthor(null);
      return;
    }

    const previousAuthors = authors;
    setAuthors((prev) => prev.filter((a) => a.id !== target.id));
    setDeletingAuthor(null);

    toast.success(`"${target.name}" deleted.`);
    invalidateAuthorCache();

    try {
      const res = await fetch(`/api/admin/authors?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthors(previousAuthors);
        toast.error(data.error || "Failed to delete author. Restoring.");
      }
    } catch {
      setAuthors(previousAuthors);
      toast.error("Network error. Author restoration applied.");
    }
  };

  // Filter and Sort
  const filteredAndSortedAuthors = useMemo(() => {
    let result = authors;

    if (filterMode === "with-resources") {
      result = result.filter((a) => a.resourceCount > 0);
    } else if (filterMode === "without-resources") {
      result = result.filter((a) => a.resourceCount === 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          a.website?.toLowerCase().includes(q) ||
          a.github?.toLowerCase().includes(q) ||
          a.twitter?.toLowerCase().includes(q) ||
          a.blog?.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    if (sortBy === "resources-desc") {
      sorted.sort((a, b) => b.resourceCount - a.resourceCount || a.name.localeCompare(b.name));
    } else if (sortBy === "resources-asc") {
      sorted.sort((a, b) => a.resourceCount - b.resourceCount || a.name.localeCompare(b.name));
    } else if (sortBy === "updated-desc") {
      sorted.sort((a, b) => {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return timeB - timeA || a.name.localeCompare(b.name);
      });
    } else if (sortBy === "created-desc") {
      sorted.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA || a.name.localeCompare(b.name);
      });
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    return sorted;
  }, [authors, filterMode, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAuthors.length / ITEMS_PER_PAGE) || 1;
  const paginatedAuthors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedAuthors.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredAndSortedAuthors]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (mode: "all" | "with-resources" | "without-resources") => {
    setFilterMode(mode);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Control Bar */}
      <AdminToolbar
        search={
          <SearchInput
            placeholder="Search authors by name, slug, website, github, twitter..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange("")}
            className="font-mono text-xs"
          />
        }
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-line hover:bg-surface h-9 gap-1.5 px-3 text-xs font-bold uppercase"
              title="Refresh authors list"
            >
              <ArrowsClockwiseIcon
                weight="bold"
                className={cn("text-brand-green size-4", isRefreshing && "animate-spin")}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <AddButton onClick={handleOpenCreate} className="h-9">
              Add Author
            </AddButton>
          </>
        }
        footer={
          <>
            <div className="flex flex-wrap items-center gap-2">
              <ButtonGroup className="rounded-lg">
                <Button
                  type="button"
                  variant={filterMode === "all" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => handleFilterChange("all")}
                  className="font-mono text-[11px] font-bold uppercase"
                >
                  All ({authors.length})
                </Button>
                <Button
                  type="button"
                  variant={filterMode === "with-resources" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => handleFilterChange("with-resources")}
                  className="font-mono text-[11px] font-bold uppercase"
                >
                  Active ({authors.filter((a) => a.resourceCount > 0).length})
                </Button>
                <Button
                  type="button"
                  variant={filterMode === "without-resources" ? "default" : "ghost"}
                  size="xs"
                  onClick={() => handleFilterChange("without-resources")}
                  className="font-mono text-[11px] font-bold uppercase"
                >
                  Unassigned ({authors.filter((a) => a.resourceCount === 0).length})
                </Button>
              </ButtonGroup>

              {/* Sort Dropdown */}
              <SortSelect
                value={sortBy}
                onValueChange={handleSortChange}
                options={SORT_OPTIONS}
                className="pl-2"
              />
            </div>

            <div className="text-muted-foreground text-[11px]">
              Showing <strong className="text-foreground">{filteredAndSortedAuthors.length}</strong>{" "}
              of <strong className="text-foreground">{authors.length}</strong> authors
            </div>
          </>
        }
      />

      {/* Authors Table */}
      <div className="border-line bg-surface/30 overflow-hidden rounded-lg border-[1.5px] font-mono text-xs shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-line bg-surface/60 hover:bg-surface/60">
              <TableHead className="text-foreground font-bold uppercase">Author</TableHead>
              <TableHead className="text-foreground font-bold uppercase">Slug</TableHead>
              <TableHead className="text-foreground font-bold uppercase">
                Profiles & Links
              </TableHead>
              <TableHead className="text-foreground text-center font-bold uppercase">
                Assigned Resources
              </TableHead>
              <TableHead className="text-foreground text-right font-bold uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAuthors.length > 0 ? (
              paginatedAuthors.map((authorItem) => (
                <TableRow key={authorItem.id} className="border-line hover:bg-surface/50">
                  {/* Name & Avatar */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-primary/10 text-primary border-line flex size-8 shrink-0 items-center justify-center rounded-full border-[1.5px] text-xs font-bold uppercase">
                        {authorItem.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-bold">{authorItem.name}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/authors/${authorItem.slug}`}
                                target="_blank"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ArrowSquareOutIcon className="size-3.5" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>View public author directory</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Slug */}
                  <TableCell className="text-muted-foreground">
                    <code className="bg-paper border-line rounded border-[1.5px] px-1.5 py-0.5 text-[11px]">
                      {authorItem.slug}
                    </code>
                  </TableCell>

                  {/* Social Links */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {authorItem.website && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={authorItem.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <GlobeIcon className="size-3.5" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Website: {authorItem.website}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {authorItem.blog && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={authorItem.blog}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <ArticleIcon className="size-3.5" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Blog: {authorItem.blog}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {authorItem.github && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={
                                authorItem.github.startsWith("http")
                                  ? authorItem.github
                                  : `https://github.com/${authorItem.github}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <Image
                                src="/github.svg"
                                alt="GitHub"
                                width={14}
                                height={14}
                                className="size-3.5 dark:invert"
                              />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>GitHub: {authorItem.github}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {authorItem.twitter && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={
                                authorItem.twitter.startsWith("http")
                                  ? authorItem.twitter
                                  : `https://x.com/${authorItem.twitter.replace(/^@/, "")}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <XLogoIcon className="size-3" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Twitter/X: {authorItem.twitter}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {authorItem.linkedin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={
                                authorItem.linkedin.startsWith("http")
                                  ? authorItem.linkedin
                                  : `https://linkedin.com/in/${authorItem.linkedin}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <Image
                                src="/linkedin.svg"
                                alt="LinkedIn"
                                width={14}
                                height={14}
                                className="size-3.5"
                              />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>LinkedIn: {authorItem.linkedin}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {authorItem.youtube && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={
                                authorItem.youtube.startsWith("http")
                                  ? authorItem.youtube
                                  : `https://youtube.com/${authorItem.youtube}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-line bg-paper/60 hover:border-primary/70 flex size-6 items-center justify-center rounded border-[1.5px] transition-colors"
                            >
                              <Image
                                src="/youtube.svg"
                                alt="YouTube"
                                width={14}
                                height={14}
                                className="size-3.5"
                              />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>YouTube: {authorItem.youtube}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {!authorItem.website &&
                        !authorItem.blog &&
                        !authorItem.github &&
                        !authorItem.twitter &&
                        !authorItem.linkedin &&
                        !authorItem.youtube && (
                          <span className="text-muted-foreground text-[11px]">No links</span>
                        )}
                    </div>
                  </TableCell>

                  {/* Assigned Resources */}
                  <TableCell className="text-center">
                    <Badge
                      variant={authorItem.resourceCount > 0 ? "default" : "secondary"}
                      className="font-mono text-[10px]"
                    >
                      {authorItem.resourceCount}{" "}
                      {authorItem.resourceCount === 1 ? "resource" : "resources"}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <AdminTableRowActions
                      copyJsonText={() => JSON.stringify(authorItem, null, 2)}
                      copyJsonTitle={`Copy JSON for ${authorItem.name}`}
                      onEdit={() => handleOpenEdit(authorItem)}
                      onDelete={() => setDeletingAuthor(authorItem)}
                      editTitle={`Edit ${authorItem.name}`}
                      deleteTitle={`Delete ${authorItem.name}`}
                      deleteDisabled={authorItem.resourceCount > 0}
                      deleteDisabledReason={`Cannot delete "${authorItem.name}". It is assigned to ${authorItem.resourceCount} resource(s).`}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    variant="table"
                    icon={<UserCircleIcon className="size-6" />}
                    title="No Authors Found"
                    description={
                      searchQuery
                        ? `No authors match "${searchQuery}". Try a different term or clear the filter.`
                        : "No authors registered in the database yet."
                    }
                    action={
                      searchQuery ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="text-xs uppercase"
                        >
                          Clear Search
                        </Button>
                      ) : (
                        <AddButton onClick={handleOpenCreate}>Add Author</AddButton>
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedAuthors.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create / Edit Author Modal */}
      <AuthorDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        author={editingAuthor}
        existingAuthors={authors}
        onCreated={(newAuthor) => setAuthors((prev) => [newAuthor, ...prev])}
        onUpdated={(updatedAuthor) =>
          setAuthors((prev) => prev.map((a) => (a.id === updatedAuthor.id ? updatedAuthor : a)))
        }
      />

      <ConfirmDialog
        open={Boolean(deletingAuthor)}
        onOpenChange={(open) => !open && setDeletingAuthor(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Author"
        description={
          <>
            Are you sure you want to permanently delete this author{" "}
            <strong className="text-foreground">&quot;{deletingAuthor?.name}&quot;</strong>? This
            action cannot be undone.
            {deletingAuthor && deletingAuthor.resourceCount > 0 && (
              <span className="text-destructive mt-2 block font-bold">
                Warning: {deletingAuthor.resourceCount} resource(s) are currently assigned to this
                author. You must reassign or delete these resources first before deleting this
                author.
              </span>
            )}
          </>
        }
        confirmLabel="Hold to delete"
      />
    </div>
  );
}

export function AuthorsManager(props: AdminAuthorsClientProps) {
  return (
    <Suspense>
      <AdminAuthorsClientContent {...props} />
    </Suspense>
  );
}
