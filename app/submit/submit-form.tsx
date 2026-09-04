"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleNotchIcon,
  CrossIcon,
  GlobeIcon,
  SparkleIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { resourceCategories } from "@/lib/resource-data";

const CATEGORY_OPTIONS = resourceCategories.map((cat) => ({
  label: cat,
  value: cat,
}));

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
      const message =
        err instanceof Error ? err.message : "Failed to submit tool. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="border-line bg-paper/60 mx-auto max-w-2xl border p-8 text-center font-mono sm:p-12">
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
      {/* Left Column: Form (7 cols) */}
      <div className="border-line bg-paper/40 border p-6 font-mono text-xs sm:p-8 lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="border-destructive/40 bg-destructive/10 text-destructive border p-4 text-xs leading-relaxed font-semibold">
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

          {/* Section 1: Tool URL with Auto-Fill */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Tool URL <span className="text-destructive">*</span>
              </Label>
              <span className="text-muted-foreground text-[10px]">
                Paste link to auto-detect details
              </span>
            </div>
            <div className="flex gap-2">
              <div className="h-9 flex-1">
                <InputField
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
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoDetect}
                disabled={isDetecting || !url.trim()}
                className="h-8 shrink-0 gap-1.5 font-mono text-xs font-bold uppercase"
              >
                {isDetecting ? (
                  <CircleNotchIcon className="size-3.5 animate-spin" />
                ) : (
                  <SparkleIcon weight="fill" className="text-primary size-3.5" />
                )}
                {isDetecting ? "Fetching..." : "Auto-Fill"}
              </Button>
            </div>
          </div>

          {/* Section 2: Title & Category */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Title <span className="text-destructive">*</span>
              </Label>
              <div className="h-9">
                <InputField
                  placeholder="e.g. Color Studio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="h-9">
                <SelectField
                  value={category}
                  onValueChange={setCategory}
                  options={CATEGORY_OPTIONS}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-2">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Briefly explain what this tool or resource does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="bg-paper min-h-25 font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Section 4: Creator Attribution */}
          <div className="border-line/40 space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Creator Attribution
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Give credit to the author, designer, or organization who built it.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Creator / Author Name
                </Label>
                <div className="h-9">
                  <InputField
                    placeholder="e.g. Jane Doe"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Creator Profile / Website
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://x.com/janedoe"
                    value={authorLink}
                    onChange={(e) => setAuthorLink(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Additional Details */}
          <div className="border-line/40 space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Additional Details
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Optional repository link and submitter notes.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                GitHub Repository (Optional)
              </Label>
              <div className="h-9">
                <InputField
                  type="url"
                  placeholder="https://github.com/owner/repo"
                  value={gitHubLink}
                  onChange={(e) => setGitHubLink(e.target.value)}
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-muted-foreground font-mono text-xs font-bold uppercase">
                Note for Moderator (Optional)
              </Label>
              <div className="h-9">
                <InputField
                  placeholder="Why do you recommend this tool? Any special context?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
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

      {/* Right Column: Live Preview & Guidelines (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          {/* Live Preview Card */}
          <div className="border-line bg-paper/50 border p-5 font-mono text-xs">
            <div className="text-muted-foreground mb-3 flex items-center justify-between font-bold tracking-wider uppercase">
              <span>Live Card Preview</span>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1 text-[11px] hover:underline"
                >
                  Visit Link <ArrowSquareOutIcon className="size-3" />
                </a>
              )}
            </div>

            <div className="border-line bg-paper border p-4 shadow-xs">
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
                    <Badge variant="outline" className="font-mono text-[10px] font-bold uppercase">
                      {category}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mt-1.5 line-clamp-3 text-xs leading-relaxed">
                    {description ||
                      "Your tool's description will appear here. It explains the purpose, features, and target audience."}
                  </p>

                  <div className="border-line/40 mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-[11px]">
                    {author ? (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <GlobeIcon className="size-3" />
                        <span>By {author}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60 italic">No author specified</span>
                    )}

                    {gitHubLink && (
                      <span className="text-muted-foreground text-[10px] font-semibold">
                        Open Source
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="border-line bg-paper/30 border p-5 font-mono text-xs">
            <h4 className="text-foreground font-bold tracking-tight uppercase">
              Submission Guidelines
            </h4>
            <ul className="text-muted-foreground mt-3 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">
                  <CheckIcon weight="bold" className="size-4" />
                </span>
                <span>Useful to frontend/backend developers, designers, or indie creators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">
                  <CheckIcon weight="bold" className="size-4" />
                </span>
                <span>Free, freemium, or open-source developer tooling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600">
                  <CheckIcon weight="bold" className="size-4" />
                </span>
                <span>High-quality, active websites with reliable uptime.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-rose-600">
                  <XIcon weight="bold" className="size-4" />
                </span>
                <span>No spam, duplicate links, or purely promotional landing pages.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
