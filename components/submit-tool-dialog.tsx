"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  GlobeIcon,
  PlusIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { resourceCategories } from "@/lib/resource-data";

interface SubmitToolDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SubmitToolDialog({
  children,
  onOpenChange: propOnOpenChange,
  open: propOpen,
}: SubmitToolDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = propOpen !== undefined;
  const open = isControlled ? propOpen : internalOpen;
  const setOpen = isControlled ? propOnOpenChange! : setInternalOpen;

  // Form State
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(resourceCategories[0] || "Generators");
  const [author, setAuthor] = useState("");
  const [authorLink, setAuthorLink] = useState("");
  const [gitHubLink, setGitHubLink] = useState("");
  const [favicon, setFavicon] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [pricing, setPricing] = useState("Free");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam trap

  // Request State
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setDescription("");
    setCategory(resourceCategories[0] || "Generators");
    setAuthor("");
    setAuthorLink("");
    setGitHubLink("");
    setFavicon("");
    setOgImage("");
    setPricing("Free");
    setNotes("");
    setHoneypot("");
    setErrorMsg(null);
    setIsSubmitted(false);
  };

  const handleAutoDetect = async () => {
    if (!url.trim()) {
      setErrorMsg("Please enter a URL first.");
      return;
    }

    try {
      setIsDetecting(true);
      setErrorMsg(null);

      let targetUrl = url.trim();
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = `https://${targetUrl}`;
        setUrl(targetUrl);
      }

      const res = await fetch(`/api/submissions/metadata?url=${encodeURIComponent(targetUrl)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to auto-detect metadata.");
      }

      if (data.title && !title) setTitle(data.title);
      if (data.description && !description) setDescription(data.description);
      if (data.favicon) setFavicon(data.favicon);
      if (data.ogImage) setOgImage(data.ogImage);
      if (data.author && !author) setAuthor(data.author);
      if (data.gitHubLink && !gitHubLink) setGitHubLink(data.gitHubLink);
      if (data.category && resourceCategories.includes(data.category)) {
        setCategory(data.category);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not fetch metadata from URL.";
      setErrorMsg(message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !title.trim() || !description.trim() || !category) {
      setErrorMsg("Please fill in all required fields (URL, Title, Category, Description).");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch("/api/submissions", {
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || undefined,
          authorLink: authorLink.trim() || undefined,
          category,
          description: description.trim(),
          favicon: favicon.trim() || undefined,
          gitHubLink: gitHubLink.trim() || undefined,
          notes: notes.trim() || undefined,
          ogImage: ogImage.trim() || undefined,
          pricing,
          url: url.trim(),
          website_trap: honeypot,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit tool.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit tool. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setTimeout(resetForm, 200);
        }
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-6 font-mono sm:p-8">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight uppercase">
            <PlusIcon weight="bold" className="size-5 text-primary" />
            Submit a Resource
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Suggest a tool, library, generator, or design resource to be added to Syntax Stash.
            Submissions are reviewed before going live.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-primary/10 text-primary mb-4 grid size-14 place-items-center rounded-full">
              <CheckCircleIcon weight="fill" className="size-8" />
            </div>
            <h3 className="text-foreground text-lg font-bold tracking-tight uppercase">
              Submission Received!
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md text-xs leading-relaxed">
              Thank you for contributing! Your submission for <strong className="text-foreground">{title}</strong> has been added to the moderation queue.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="text-xs uppercase"
              >
                Submit Another Tool
              </Button>
              <Button
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs uppercase"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="border-destructive/40 bg-destructive/10 text-destructive rounded border p-3 text-xs leading-relaxed font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Invisible Honeypot Anti-Bot Field */}
            <input
              type="text"
              name="website_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="sr-only"
              aria-hidden="true"
            />

            {/* URL with Auto-detect */}
            <div className="space-y-1.5">
              <label className="text-foreground block font-bold uppercase">
                Tool URL <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAutoDetect}
                  disabled={isDetecting || !url.trim()}
                  className="shrink-0 gap-1.5 font-mono text-xs font-bold uppercase"
                >
                  {isDetecting ? (
                    <CircleNotchIcon className="size-3.5 animate-spin" />
                  ) : (
                    <SparkleIcon weight="fill" className="size-3.5 text-primary" />
                  )}
                  {isDetecting ? "Detecting..." : "Auto-Fill"}
                </Button>
              </div>
            </div>

            {/* Title and Category */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Color Studio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border-input bg-background text-foreground focus-visible:ring-ring flex h-9 w-full rounded border px-3 py-1 font-mono text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
                >
                  {resourceCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-foreground block font-bold uppercase">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                placeholder="Briefly explain what this tool or resource does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded border px-3 py-2 font-mono text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
              />
            </div>

            {/* Author and Author Link */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  Author / Creator Name
                </label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  Author Website / Profile
                </label>
                <Input
                  type="url"
                  placeholder="https://twitter.com/janedoe"
                  value={authorLink}
                  onChange={(e) => setAuthorLink(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* GitHub Link & Pricing */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  GitHub Repository (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={gitHubLink}
                  onChange={(e) => setGitHubLink(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground block font-bold uppercase">
                  Pricing Model
                </label>
                <select
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                  className="border-input bg-background text-foreground focus-visible:ring-ring flex h-9 w-full rounded border px-3 py-1 font-mono text-xs shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
                >
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Submitter Notes */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground block font-bold uppercase">
                Notes for Admin (Optional)
              </label>
              <Input
                placeholder="Why do you recommend this tool? Any special context?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            {/* Live Preview Card */}
            {(title || url) && (
              <div className="border-line/70 bg-surface/50 rounded border p-3.5">
                <div className="text-muted-foreground mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                  <span>Preview Card</span>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit <ArrowSquareOutIcon className="size-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <CardIcon alt={title || "Preview"} favicon={favicon} className="size-10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold tracking-tight">{title || "Untitled Tool"}</span>
                      <span className="border-line text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] uppercase font-bold">
                        {category}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-relaxed">
                      {description || "No description provided yet."}
                    </p>
                    {author && (
                      <div className="text-muted-foreground/80 mt-1.5 flex items-center gap-1 text-[10px]">
                        <GlobeIcon className="size-3" />
                        <span>By {author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="font-mono text-xs font-bold uppercase"
              >
                {isSubmitting ? (
                  <>
                    <CircleNotchIcon className="mr-1.5 size-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit for Review"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
