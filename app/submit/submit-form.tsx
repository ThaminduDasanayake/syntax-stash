"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  GlobeIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resourceCategories } from "@/lib/resource-data";

export function SubmitForm() {
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

      if (data.title) setTitle(data.title);
      if (data.description) setDescription(data.description);
      if (data.favicon) setFavicon(data.favicon);
      if (data.ogImage) setOgImage(data.ogImage);
      if (data.author) setAuthor(data.author);
      if (data.gitHubLink) setGitHubLink(data.gitHubLink);
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

  if (isSubmitted) {
    return (
      <div className="border-line/80 bg-surface/40 mx-auto max-w-2xl rounded border p-8 text-center font-mono sm:p-12">
        <div className="bg-primary/10 text-primary mx-auto mb-5 grid size-16 place-items-center rounded-full">
          <CheckCircleIcon weight="fill" className="size-9" />
        </div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight uppercase sm:text-3xl">
          Submission Received!
        </h2>
        <p className="text-muted-foreground mt-3 text-xs leading-relaxed sm:text-sm">
          Thank you for contributing! Your submission for{" "}
          <strong className="text-foreground">{title}</strong> has been added to the moderation
          queue. We will review and publish it soon.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            className="font-mono text-xs uppercase"
          >
            Submit Another Resource
          </Button>
          <Button asChild size="sm" className="font-mono text-xs font-bold uppercase">
            <Link href="/">Back to Stash</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Form Section (7 cols) */}
      <div className="border-line/70 bg-surface/30 rounded border p-6 font-mono text-xs sm:p-8 lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="border-destructive/40 bg-destructive/10 text-destructive rounded border p-4 text-xs font-semibold leading-relaxed">
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

          {/* Section 1: URL & Auto-detect */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-foreground font-bold uppercase">
                Tool URL <span className="text-destructive">*</span>
              </label>
              <span className="text-muted-foreground text-[10px]">
                Paste link to auto-fill details
              </span>
            </div>
            <div className="flex gap-2.5">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !title) {
                    e.preventDefault();
                    handleAutoDetect();
                  }
                }}
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
                {isDetecting ? "Fetching..." : "Auto-Fill"}
              </Button>
            </div>
          </div>

          {/* Section 2: Title & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
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

            <div className="space-y-2">
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

          {/* Section 3: Description */}
          <div className="space-y-2">
            <label className="text-foreground block font-bold uppercase">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              placeholder="Briefly explain what this tool or resource does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded border px-3 py-2.5 font-mono text-xs leading-relaxed shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden"
            />
          </div>

          {/* Section 4: Author Information */}
          <div className="border-line/40 border-t pt-5">
            <div className="mb-4">
              <h4 className="text-foreground font-bold tracking-tight uppercase">
                Creator Attribution
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Give credit to the author, designer, or team who made it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-foreground block font-bold uppercase">
                  Creator / Author Name
                </label>
                <Input
                  placeholder="e.g. Jane Doe"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-foreground block font-bold uppercase">
                  Creator Profile / Website
                </label>
                <Input
                  type="url"
                  placeholder="https://x.com/janedoe"
                  value={authorLink}
                  onChange={(e) => setAuthorLink(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Extra Details */}
          <div className="border-line/40 border-t pt-5">
            <div className="mb-4">
              <h4 className="text-foreground font-bold tracking-tight uppercase">
                Additional Details
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Optional metadata and pricing information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="text-foreground block font-bold uppercase">Pricing Model</label>
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

            <div className="mt-4 space-y-2">
              <label className="text-muted-foreground block font-bold uppercase">
                Note for Moderator (Optional)
              </label>
              <Input
                placeholder="Why do you recommend this tool? Any special context?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-line/40 flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="font-mono text-xs uppercase"
            >
              Reset
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
      </div>

      {/* Sidebar & Live Preview Section (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          {/* Live Preview Card */}
          <div className="border-line/80 bg-surface/40 rounded border p-5 font-mono text-xs">
            <div className="text-muted-foreground mb-3 flex items-center justify-between font-bold uppercase tracking-wider">
              <span>Live Card Preview</span>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Visit Link <ArrowSquareOutIcon className="size-3" />
                </a>
              )}
            </div>

            <div className="border-line/50 bg-background/90 rounded border p-4 shadow-sm">
              <div className="flex items-start gap-3.5">
                <CardIcon
                  alt={title || "Preview"}
                  favicon={favicon || undefined}
                  className="size-11 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground text-sm font-bold tracking-tight">
                      {title || "Resource Title"}
                    </span>
                    <span className="border-line text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase">
                      {category}
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-1.5 line-clamp-3 text-xs leading-relaxed">
                    {description ||
                      "Your tool's description will appear here. It explains the purpose, features, and target audience."}
                  </p>

                  <div className="border-line/30 mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-[11px]">
                    {author ? (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <GlobeIcon className="size-3" />
                        <span>By {author}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60 italic">No author specified</span>
                    )}

                    <span className="text-muted-foreground text-[10px] uppercase font-bold">
                      {pricing}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="border-line/60 bg-surface/20 rounded border p-5 font-mono text-xs">
            <h4 className="text-foreground font-bold tracking-tight uppercase">
              Submission Guidelines
            </h4>
            <ul className="text-muted-foreground mt-3 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Useful to frontend/backend developers, designers, or indie creators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Free, freemium, or open-source developer tooling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>High-quality, active websites with reliable uptime.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✗</span>
                <span>No spam, duplicate links, or purely promotional landing pages.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
