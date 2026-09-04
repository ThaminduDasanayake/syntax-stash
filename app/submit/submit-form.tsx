"use client";

import {
  ArrowSquareOutIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleNotchIcon,
  GlobeIcon,
  ImageIcon,
  SparkleIcon,
  TagIcon,
  XIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CardIcon } from "@/components/card-icon";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { resourceCategories } from "@/lib/resource-data";
import { cn, getCategoryTheme, Theme, THEME_CONFIG } from "@/lib/utils";

const CATEGORY_OPTIONS = resourceCategories.map((cat) => ({
  label: cat,
  value: cat,
}));

export function SubmitForm() {
  // Form State
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(resourceCategories[0] || "Generators");
  const [author, setAuthor] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [authorTwitter, setAuthorTwitter] = useState("");
  const [authorGitHub, setAuthorGitHub] = useState("");
  const [authorYouTube, setAuthorYouTube] = useState("");
  const [authorLinkedIn, setAuthorLinkedIn] = useState("");
  const [gitHubLink, setGitHubLink] = useState("");
  const [favicon, setFavicon] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam trap

  // Theme Override State for Card Preview
  const [customTheme, setCustomTheme] = useState<Theme | null>(null);
  const activeTheme: Theme = customTheme ?? getCategoryTheme(category);
  const themeClasses = THEME_CONFIG[activeTheme].bg;
  const isBlue = activeTheme === "blue";

  // Request State
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setSubtitle("");
    setDescription("");
    setCategory(resourceCategories[0] || "Generators");
    setAuthor("");
    setAuthorWebsite("");
    setAuthorTwitter("");
    setAuthorGitHub("");
    setAuthorYouTube("");
    setAuthorLinkedIn("");
    setGitHubLink("");
    setFavicon("");
    setOgImage("");
    setTags("");
    setNotes("");
    setHoneypot("");
    setCustomTheme(null);
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
      if (data.authorWebsite) setAuthorWebsite(data.authorWebsite);
      if (data.authorTwitter) setAuthorTwitter(data.authorTwitter);
      if (data.authorGitHub) setAuthorGitHub(data.authorGitHub);
      if (data.authorYouTube) setAuthorYouTube(data.authorYouTube);
      if (data.authorLinkedIn) setAuthorLinkedIn(data.authorLinkedIn);
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

      const resolvedAuthorLink = authorWebsite || authorTwitter || authorGitHub;

      const res = await fetch("/api/submissions", {
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || undefined,
          authorGitHub: authorGitHub.trim() || undefined,
          authorLink: resolvedAuthorLink.trim() || undefined,
          authorLinkedIn: authorLinkedIn.trim() || undefined,
          authorTwitter: authorTwitter.trim() || undefined,
          authorWebsite: authorWebsite.trim() || undefined,
          authorYouTube: authorYouTube.trim() || undefined,
          category,
          description: description.trim(),
          favicon: favicon.trim() || undefined,
          gitHubLink: gitHubLink.trim() || undefined,
          notes: notes.trim() || undefined,
          ogImage: ogImage.trim() || undefined,
          subtitle: subtitle.trim() || undefined,
          tags: tags.trim() || undefined,
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

          {/* Section 2: Title, Subtitle, & Category */}
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

          {/* Subtitle / Tagline */}
          <div className="space-y-2">
            <Label className="text-foreground font-mono text-xs font-bold uppercase">
              Subtitle / Tagline (Optional)
            </Label>
            <div className="h-9">
              <InputField
                placeholder="e.g. The AI powered color palette generator"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                containerClassName="h-9"
                className="font-mono text-xs"
              />
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

          {/* Section 4: Visuals & Media (Favicon & OG Image) */}
          <div className="border-line/40 space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Visual Assets & Media
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Favicon icon and OpenGraph preview banner image.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    Favicon URL
                  </Label>
                  {favicon && (
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                      <CardIcon alt="icon preview" favicon={favicon} className="size-4.5" />
                      <span>Loaded</span>
                    </span>
                  )}
                </div>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://example.com/favicon.ico"
                    value={favicon}
                    onChange={(e) => setFavicon(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    OG Image URL
                  </Label>
                  {ogImage && (
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px]">
                      <ImageIcon className="size-4.5" />
                      <span>Image set</span>
                    </span>
                  )}
                </div>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://example.com/og.png"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* OG Image Preview Thumbnail */}
            {ogImage && (
              <div className="border-line/40 bg-paper/60 flex items-center gap-3 border p-2.5">
                <div className="border-line/60 relative h-14 w-24 shrink-0 overflow-hidden border bg-black/10">
                  <Image
                    src={ogImage}
                    alt="OG Image Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                    OG Image Banner
                  </span>
                  <span className="text-foreground/80 block truncate font-mono text-[11px]">
                    {ogImage}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Creator Attribution */}
          <div className="border-line/40 space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Creator Attribution & Links
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Give credit to the author, designer, or organization who built it with their social
                profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <GlobeIcon className="text-muted-foreground size-3.5" /> Website / Portfolio
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://janedoe.com"
                    value={authorWebsite}
                    onChange={(e) => setAuthorWebsite(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <XLogoIcon weight="bold" className="text-muted-foreground size-3.5" /> X / Twitter
                  Profile
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://x.com/janedoe"
                    value={authorTwitter}
                    onChange={(e) => setAuthorTwitter(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={14}
                    height={14}
                    className="size-3.5 dark:invert"
                  />
                  <span>GitHub Profile</span>
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://github.com/janedoe"
                    value={authorGitHub}
                    onChange={(e) => setAuthorGitHub(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <Image
                    src="/youtube.svg"
                    alt="YouTube"
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                  <span>YouTube Channel</span>
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://youtube.com/@janedoe"
                    value={authorYouTube}
                    onChange={(e) => setAuthorYouTube(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <Image
                    src="/linkedin.svg"
                    alt="LinkedIn"
                    width={14}
                    height={14}
                    className="size-3.5"
                  />
                  <span>LinkedIn Profile</span>
                </Label>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://linkedin.com/in/janedoe"
                    value={authorLinkedIn}
                    onChange={(e) => setAuthorLinkedIn(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Additional Details & Tags */}
          <div className="border-line/40 space-y-4 border-t pt-5">
            <div>
              <h4 className="text-foreground font-mono text-xs font-bold tracking-tight uppercase">
                Additional Details & Tags
              </h4>
              <p className="text-muted-foreground text-[11px]">
                Repository link, topic tags, and note for reviewer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-1.5 font-mono text-xs font-bold uppercase">
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={14}
                    height={14}
                    className="size-3.5 dark:invert"
                  />
                  <span>GitHub Repository (Optional)</span>
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

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Tags / Keywords (Optional)
                </Label>
                <div className="h-9">
                  <InputField
                    placeholder="e.g. color, gradient, generator"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
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

      {/* Right Column: Live Real Card Preview & Guidelines (5 cols) */}
      <div className="space-y-6 lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          {/* Header with Hero Eyebrow Theme Switcher */}
          <div className="border-line bg-paper/50 border p-5 font-mono text-xs">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-bold tracking-wider uppercase">
                  Card Preview
                </span>
              </div>

              {/* Hero Eyebrow Theme Dots Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-[10px] font-bold uppercase">
                  Theme:
                </span>
                <span className="hero-eyebrow-dots">
                  <button
                    type="button"
                    onClick={() => setCustomTheme("orange")}
                    title="Orange theme"
                    aria-label="Select orange theme"
                    className={cn(
                      "bg-c-orange size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                      activeTheme === "orange"
                        ? "ring-ink opacity-100 ring-1 ring-inset"
                        : "opacity-60",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setCustomTheme("blue")}
                    title="Blue theme"
                    aria-label="Select blue theme"
                    className={cn(
                      "bg-c-blue size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                      activeTheme === "blue"
                        ? "ring-ink opacity-100 ring-1 ring-inset"
                        : "opacity-60",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setCustomTheme("pink")}
                    title="Pink theme"
                    aria-label="Select pink theme"
                    className={cn(
                      "bg-c-pink size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                      activeTheme === "pink"
                        ? "ring-ink opacity-100 ring-1 ring-inset"
                        : "opacity-60",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setCustomTheme("green")}
                    title="Green theme"
                    aria-label="Select green theme"
                    className={cn(
                      "bg-c-green size-3.5 cursor-pointer transition-opacity hover:opacity-80",
                      activeTheme === "green"
                        ? "ring-ink opacity-100 ring-1 ring-inset"
                        : "opacity-60",
                    )}
                  />
                </span>
              </div>
            </div>

            {/* Exact Real Syntax Stash Card */}
            <div className="mx-auto w-full max-w-80">
              <article className={cn("card group", themeClasses)}>
                <div className="card-inner">
                  <div className="card-face">
                    <div className="card-header">
                      <span className="card-meta">{category}</span>
                      <CardIcon alt={title || "Preview"} favicon={favicon || undefined} />
                    </div>

                    <h3 className="card-title">{title || "Resource Title"}</h3>

                    {subtitle && <p className="card-subtitle">{subtitle}</p>}

                    <p className="card-description">
                      {description ||
                        "Your tool's description will appear here. It explains the features, purpose, and utility for developers."}
                    </p>

                    {/* Tags preview if any */}
                    {tags && (
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {tags
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((t) => (
                            <span
                              key={t}
                              className={cn(
                                "py-0.2 inline-flex items-center gap-0.5 rounded px-1.5 font-mono text-[9px]",
                                isBlue ? "bg-paper/20 text-paper" : "bg-ink/10 text-ink",
                              )}
                            >
                              <TagIcon className="size-2.5" />
                              {t}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="card-footer">
                      <div className="flex min-w-0 items-center gap-2">
                        {author ? <span className="card-author truncate">{author}</span> : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center justify-center p-1 transition-transform hover:scale-110",
                              isBlue ? "text-paper" : "text-ink",
                            )}
                            title="Open Link"
                          >
                            <ArrowSquareOutIcon weight="bold" className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
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
