"use client";

import {
  ArrowsClockwiseIcon,
  ArrowSquareOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  TrashIcon,
  UserCircleIcon,
  XIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { invalidateAuthorCache } from "@/components/submissions/author-combobox";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { slugifyAuthor } from "@/lib/authors";

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
];

export function AdminAuthorsClient({ initialAuthors = [] }: AdminAuthorsClientProps) {
  const [authors, setAuthors] = useState<AdminAuthorItem[]>(initialAuthors);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "with-resources" | "without-resources">(
    "all",
  );
  const [sortBy, setSortBy] = useState<string>("resources-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  // Dialog states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AdminAuthorItem | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<AdminAuthorItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    blog: "",
    github: "",
    linkedin: "",
    name: "",
    slug: "",
    twitter: "",
    website: "",
    youtube: "",
  });
  const [autoSlug, setAutoSlug] = useState(true);

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
    setFormData({
      blog: "",
      github: "",
      linkedin: "",
      name: "",
      slug: "",
      twitter: "",
      website: "",
      youtube: "",
    });
    setAutoSlug(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (authorItem: AdminAuthorItem) => {
    setEditingAuthor(authorItem);
    setFormData({
      blog: authorItem.blog || "",
      github: authorItem.github || "",
      linkedin: authorItem.linkedin || "",
      name: authorItem.name,
      slug: authorItem.slug,
      twitter: authorItem.twitter || "",
      website: authorItem.website || "",
      youtube: authorItem.youtube || "",
    });
    setAutoSlug(false);
    setIsModalOpen(true);
  };

  // Auto-slug on name typing
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug ? slugifyAuthor(val) : prev.slug,
    }));
  };

  // Submit Save/Create
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Author name is required.");
      return;
    }
    if (!formData.slug.trim()) {
      toast.error("Author slug is required.");
      return;
    }

    try {
      setIsWorking(true);
      if (editingAuthor) {
        // PATCH
        const res = await fetch("/api/admin/authors", {
          body: JSON.stringify({
            id: editingAuthor.id,
            blog: formData.blog,
            github: formData.github,
            linkedin: formData.linkedin,
            name: formData.name,
            slug: formData.slug,
            twitter: formData.twitter,
            website: formData.website,
            youtube: formData.youtube,
          }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setAuthors((prev) =>
            prev.map((a) =>
              a.id === editingAuthor.id
                ? {
                    ...a,
                    blog: formData.blog.trim() || null,
                    github: formData.github.trim() || null,
                    linkedin: formData.linkedin.trim() || null,
                    name: formData.name.trim(),
                    slug: formData.slug.trim(),
                    twitter: formData.twitter.trim() || null,
                    website: formData.website.trim() || null,
                    youtube: formData.youtube.trim() || null,
                  }
                : a,
            ),
          );
          toast.success(`"${formData.name}" updated successfully.`);
          invalidateAuthorCache();
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to update author.");
        }
      } else {
        // POST
        const res = await fetch("/api/admin/authors", {
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setAuthors((prev) => [data.author, ...prev]);
          toast.success(`"${formData.name}" created successfully.`);
          invalidateAuthorCache();
          setIsModalOpen(false);
        } else {
          toast.error(data.error || "Failed to create author.");
        }
      }
    } catch {
      toast.error("Network error while saving author.");
    } finally {
      setIsWorking(false);
    }
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
      setIsWorking(true);
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
    } finally {
      setIsWorking(false);
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
      <div className="border-line bg-surface/50 mb-6 space-y-4 rounded-lg border p-4 font-mono text-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <InputField
              placeholder="Search authors by name, slug, website, github, twitter..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              prefix={<MagnifyingGlassIcon className="text-muted-foreground size-4" />}
              containerClassName="h-9"
              className="font-mono text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 p-0.5"
                title="Clear search"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-line hover:bg-surface h-9 gap-1.5 px-3 text-xs font-bold uppercase"
              title="Refresh authors list"
            >
              <ArrowsClockwiseIcon className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-9 gap-1.5 px-3.5 text-xs font-bold uppercase"
            >
              <PlusIcon className="size-4" />
              <span>Add Author</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Sort & Count */}
        <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="border-line flex items-center rounded border p-0.5">
              <button
                type="button"
                onClick={() => handleFilterChange("all")}
                className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                  filterMode === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({authors.length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("with-resources")}
                className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                  filterMode === "with-resources"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active ({authors.filter((a) => a.resourceCount > 0).length})
              </button>
              <button
                type="button"
                onClick={() => handleFilterChange("without-resources")}
                className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                  filterMode === "without-resources"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Unassigned ({authors.filter((a) => a.resourceCount === 0).length})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 pl-2">
              <SlidersHorizontalIcon className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-[11px] font-bold uppercase">Sort:</span>
              <SelectField
                value={sortBy}
                onValueChange={handleSortChange}
                options={SORT_OPTIONS}
                triggerClassName="h-8 font-mono text-xs min-w-[160px]"
              />
            </div>
          </div>

          <div className="text-muted-foreground text-[11px]">
            Showing <strong className="text-foreground">{filteredAndSortedAuthors.length}</strong>{" "}
            of <strong className="text-foreground">{authors.length}</strong> authors
          </div>
        </div>
      </div>

      {/* Authors Table */}
      <div className="border-line bg-surface/30 overflow-hidden rounded-lg border font-mono text-xs shadow-sm">
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
                      <div className="bg-primary/10 text-primary border-line flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold uppercase">
                        {authorItem.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-bold">{authorItem.name}</span>
                          <Link
                            href={`/authors/${authorItem.slug}`}
                            target="_blank"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="View public author directory"
                          >
                            <ArrowSquareOutIcon className="size-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Slug */}
                  <TableCell className="text-muted-foreground">
                    <code className="bg-paper border-line rounded border px-1.5 py-0.5 text-[11px]">
                      {authorItem.slug}
                    </code>
                  </TableCell>

                  {/* Social Links */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {authorItem.website && (
                        <a
                          href={authorItem.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/50 flex size-6 items-center justify-center rounded border transition-colors"
                          title={`Website: ${authorItem.website}`}
                        >
                          <GlobeIcon className="size-3.5" />
                        </a>
                      )}
                      {authorItem.github && (
                        <a
                          href={
                            authorItem.github.startsWith("http")
                              ? authorItem.github
                              : `https://github.com/${authorItem.github}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/50 flex size-6 items-center justify-center rounded border transition-colors"
                          title={`GitHub: ${authorItem.github}`}
                        >
                          <Image
                            src="/github.svg"
                            alt="GitHub"
                            width={12}
                            height={12}
                            className="size-3 opacity-70 hover:opacity-100 dark:invert"
                          />
                        </a>
                      )}
                      {authorItem.twitter && (
                        <a
                          href={
                            authorItem.twitter.startsWith("http")
                              ? authorItem.twitter
                              : `https://x.com/${authorItem.twitter.replace(/^@/, "")}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/50 flex size-6 items-center justify-center rounded border transition-colors"
                          title={`Twitter/X: ${authorItem.twitter}`}
                        >
                          <XLogoIcon className="size-3" />
                        </a>
                      )}
                      {authorItem.linkedin && (
                        <a
                          href={
                            authorItem.linkedin.startsWith("http")
                              ? authorItem.linkedin
                              : `https://linkedin.com/in/${authorItem.linkedin}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/50 flex size-6 items-center justify-center rounded border text-[10px] font-bold transition-colors"
                          title={`LinkedIn: ${authorItem.linkedin}`}
                        >
                          in
                        </a>
                      )}
                      {authorItem.youtube && (
                        <a
                          href={
                            authorItem.youtube.startsWith("http")
                              ? authorItem.youtube
                              : `https://youtube.com/${authorItem.youtube}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-line bg-paper/60 text-muted-foreground hover:text-primary hover:border-primary/50 flex size-6 items-center justify-center rounded border text-[10px] font-bold transition-colors"
                          title={`YouTube: ${authorItem.youtube}`}
                        >
                          yt
                        </a>
                      )}
                      {!authorItem.website &&
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
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenEdit(authorItem)}
                        className="h-7 w-7 p-0"
                        title="Edit Author"
                      >
                        <PencilSimpleIcon className="size-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingAuthor(authorItem)}
                        className="text-muted-foreground hover:text-destructive h-7 w-7 p-0"
                        title="Delete Author"
                      >
                        <TrashIcon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCircleIcon className="text-muted-foreground/60 size-8" />
                    <span>No authors match your search.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="border-line bg-surface/40 flex flex-wrap items-center justify-between gap-3 border-t p-3">
            <div className="text-muted-foreground text-[11px]">
              Page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
              >
                <CaretLeftIcon className="size-3.5" />
                <span>Prev</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-line hover:bg-surface h-8 gap-1 px-2.5 text-xs"
              >
                <span>Next</span>
                <CaretRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Author Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border-line bg-paper max-h-[90vh] min-w-2xl overflow-y-auto font-mono text-xs">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold uppercase">
              {editingAuthor ? `Edit Author: ${editingAuthor.name}` : "Create New Author"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {editingAuthor
                ? "Update author name, slug, website, and linked social profiles."
                : "Add a new creator to the Syntax Stash directory."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            {/* Row 1: Name and Slug Side-by-Side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Author / Creator Name *"
                placeholder="e.g. Vercel or Lee Robinson"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="font-mono text-xs"
              />

              <div className="space-y-2">
                <div className="mb-2 flex items-center justify-between">
                  <Label>Slug *</Label>
                  {!editingAuthor && (
                    <button
                      type="button"
                      onClick={() => setAutoSlug(!autoSlug)}
                      className="text-primary text-[10px] hover:underline"
                    >
                      {autoSlug ? "Manual Slug" : "Auto Slug"}
                    </button>
                  )}
                </div>
                <InputField
                  placeholder="e.g. vercel"
                  value={formData.slug}
                  onChange={(e) => {
                    setAutoSlug(false);
                    setFormData((prev) => ({ ...prev, slug: e.target.value }));
                  }}
                  required
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* URLs Sequentially One After the Other with Icons in Labels */}
            <div className="border-line/60 space-y-3.5 border-t pt-3">
              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <GlobeIcon className="text-muted-foreground size-4" />
                  <span>Website / Portfolio URL</span>
                </Label>
                <InputField
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                  <span>GitHub (Username or URL)</span>
                </Label>
                <InputField
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={(e) => setFormData((prev) => ({ ...prev, github: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <XLogoIcon weight="bold" className="text-muted-foreground size-4" />
                  <span>Twitter / X (@username or URL)</span>
                </Label>
                <InputField
                  placeholder="@username or https://x.com/..."
                  value={formData.twitter}
                  onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
                  <span>LinkedIn (Username or URL)</span>
                </Label>
                <InputField
                  placeholder="username or https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <Image src="/youtube.svg" alt="YouTube" width={16} height={16} />
                  <span>YouTube Channel URL</span>
                </Label>
                <InputField
                  placeholder="https://youtube.com/@channel"
                  value={formData.youtube}
                  onChange={(e) => setFormData((prev) => ({ ...prev, youtube: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold">
                  <GlobeIcon className="text-muted-foreground size-4" />
                  <span>Blog URL</span>
                </Label>
                <InputField
                  placeholder="https://example.com/blog"
                  value={formData.blog}
                  onChange={(e) => setFormData((prev) => ({ ...prev, blog: e.target.value }))}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                disabled={isWorking}
                className="font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isWorking}
                className="font-mono text-xs font-bold uppercase"
              >
                {isWorking ? (
                  "Saving..."
                ) : editingAuthor ? (
                  "Save Changes"
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckIcon weight="bold" className="size-3.5" />
                    <span>Create Author</span>
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={Boolean(deletingAuthor)}
        onOpenChange={(open) => !open && setDeletingAuthor(null)}
      >
        <AlertDialogContent className="border-line bg-paper font-mono text-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground text-base font-bold uppercase">
              Delete Author: {deletingAuthor?.name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-xs leading-relaxed">
              Are you sure you want to permanently delete this author?
              {deletingAuthor && deletingAuthor.resourceCount > 0 && (
                <span className="text-destructive mt-2 block font-bold">
                  Warning: {deletingAuthor.resourceCount} resource(s) are currently assigned to this
                  author. You must reassign or delete these resources first before deleting this
                  author.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-2">
            <AlertDialogCancel
              disabled={isWorking}
              className="border-line hover:bg-surface font-mono text-xs uppercase"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isWorking || Boolean(deletingAuthor && deletingAuthor.resourceCount > 0)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs font-bold uppercase"
            >
              {isWorking ? "Deleting..." : "Delete Author"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
