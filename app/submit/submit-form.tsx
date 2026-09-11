"use client";

import { CheckIcon, CircleNotchIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AuthorSocialFields,
  AuthorSocialValues,
  CandidateOption,
  DetectedFieldSuggestion,
  MediaAssetFields,
  ResourceCardPreview,
  SuggestedAuthorData,
  TagPicker,
} from "@/components/submissions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select-field";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";

export function SubmitForm() {
  const router = useRouter();
  const { categoryOptions } = useCategories();

  // Form State
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [authorTwitter, setAuthorTwitter] = useState("");
  const [authorGitHub, setAuthorGitHub] = useState("");
  const [authorYouTube, setAuthorYouTube] = useState("");
  const [authorLinkedIn, setAuthorLinkedIn] = useState("");
  const [github, setGithub] = useState("");
  const [favicon, setFavicon] = useState("");
  const [faviconOptions, setFaviconOptions] = useState<CandidateOption[]>([]);
  const [iconBg, setIconBg] = useState<"dark" | "light" | "invert">("dark");
  const [ogImage, setOgImage] = useState("");
  const [ogImageOptions, setOgImageOptions] = useState<CandidateOption[]>([]);
  const [suggestedAuthor, setSuggestedAuthor] = useState<SuggestedAuthorData | null>(null);
  const [detectedUpdates, setDetectedUpdates] = useState<{
    description?: string;
    github?: string;
    subtitle?: string;
    title?: string;
  }>({});
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState(""); // anti-spam trap

  // Request State
  const [isDetecting, setIsDetecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setUrl("");
    setTitle("");
    setSubtitle("");
    setDescription("");
    setCategory(categoryOptions[0]?.value || "");
    setAuthor("");
    setAuthorWebsite("");
    setAuthorTwitter("");
    setAuthorGitHub("");
    setAuthorYouTube("");
    setAuthorLinkedIn("");
    setGithub("");
    setFavicon("");
    setFaviconOptions([]);
    setIconBg("dark");
    setOgImage("");
    setOgImageOptions([]);
    setSuggestedAuthor(null);
    setDetectedUpdates({});
    setTags("");
    setNotes("");
    setHoneypot("");
  };

  const handleAuthorFieldChange = (field: keyof AuthorSocialValues, value: string) => {
    switch (field) {
      case "author":
        setAuthor(value);
        break;
      case "authorWebsite":
        setAuthorWebsite(value);
        break;
      case "authorTwitter":
        setAuthorTwitter(value);
        break;
      case "authorGitHub":
        setAuthorGitHub(value);
        break;
      case "authorYouTube":
        setAuthorYouTube(value);
        break;
      case "authorLinkedIn":
        setAuthorLinkedIn(value);
        break;
    }
  };

  const handleAuthorBatchChange = (updates: Partial<AuthorSocialValues>) => {
    if (updates.author !== undefined) setAuthor(updates.author || "");
    if (updates.authorWebsite !== undefined) setAuthorWebsite(updates.authorWebsite || "");
    if (updates.authorTwitter !== undefined) setAuthorTwitter(updates.authorTwitter || "");
    if (updates.authorGitHub !== undefined) setAuthorGitHub(updates.authorGitHub || "");
    if (updates.authorYouTube !== undefined) setAuthorYouTube(updates.authorYouTube || "");
    if (updates.authorLinkedIn !== undefined) setAuthorLinkedIn(updates.authorLinkedIn || "");
  };

  const handleAcceptSuggestedAuthor = (suggested: SuggestedAuthorData) => {
    setAuthor(suggested.name);
    if (suggested.website) setAuthorWebsite(suggested.website);
    if (suggested.twitter) setAuthorTwitter(suggested.twitter);
    if (suggested.github) setAuthorGitHub(suggested.github);
    if (suggested.youtube) setAuthorYouTube(suggested.youtube);
    if (suggested.linkedin) setAuthorLinkedIn(suggested.linkedin);
    setSuggestedAuthor(null);
  };

  const handleAutoDetect = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL first.");
      return;
    }

    try {
      setIsDetecting(true);

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

      const newDetected: {
        description?: string;
        github?: string;
        subtitle?: string;
        title?: string;
      } = {};

      if (data.title) {
        if (title && title.trim().toLowerCase() !== data.title.trim().toLowerCase()) {
          newDetected.title = data.title.trim();
        } else {
          setTitle(data.title);
        }
      }
      if (data.subtitle) {
        if (subtitle && subtitle.trim().toLowerCase() !== data.subtitle.trim().toLowerCase()) {
          newDetected.subtitle = data.subtitle.trim();
        } else {
          setSubtitle(data.subtitle);
        }
      }
      if (data.description) {
        if (
          description &&
          description.trim().toLowerCase() !== data.description.trim().toLowerCase()
        ) {
          newDetected.description = data.description.trim();
        } else {
          setDescription(data.description);
        }
      }
      if (data.github) {
        if (github && github.trim().toLowerCase() !== data.github.trim().toLowerCase()) {
          newDetected.github = data.github.trim();
        } else {
          setGithub(data.github);
        }
      }
      if (data.favicon) setFavicon(data.favicon);
      if (data.faviconOptions) setFaviconOptions(data.faviconOptions);
      if (data.ogImage) setOgImage(data.ogImage);
      if (data.ogImageOptions) setOgImageOptions(data.ogImageOptions);
      if (data.author && data.author.trim()) {
        setSuggestedAuthor({
          blog: data.authorBlog || "",
          github: data.authorGitHub || "",
          linkedin: data.authorLinkedIn || "",
          name: data.author.trim(),
          twitter: data.authorTwitter || "",
          website: data.authorWebsite || "",
          youtube: data.authorYouTube || "",
        });
      }
      if (data.category) {
        setCategory((prev) => prev || data.category);
      }
      setDetectedUpdates(newDetected);
      toast.success("Metadata auto-filled from website!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not fetch metadata from URL.";
      toast.error(message);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim() || !title.trim() || !description.trim() || !category) {
      toast.error("Please fill in all required fields (URL, Title, Category, Description).");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/submissions", {
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || undefined,
          authorGitHub: authorGitHub.trim() || undefined,
          authorLinkedIn: authorLinkedIn.trim() || undefined,
          authorTwitter: authorTwitter.trim() || undefined,
          authorWebsite: authorWebsite.trim() || undefined,
          authorYouTube: authorYouTube.trim() || undefined,
          category,
          description: description.trim(),
          favicon: favicon.trim() || undefined,
          github: github.trim() || undefined,
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

      if (res.status === 409 || data.code === "ALREADY_EXISTS") {
        const resourceTitle = data.title || title.trim();
        const targetUrl = resourceTitle
          ? `/resources?q=${encodeURIComponent(resourceTitle)}`
          : "/resources";

        toast.info(`"${resourceTitle}" is already in Syntax Stash!`, {
          action: {
            label: "View Resource",
            onClick: () => router.push(targetUrl),
          },
        });
        return;
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit resource.");
      }

      toast.success(data.message || "Resource submitted for review!");
      resetForm();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit resource. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Left Column: Form (7 cols) */}
      <div className="border-line bg-paper/40 border p-6 font-mono text-xs sm:p-8 lg:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Section 1: Resource URL with Auto-Fill */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Resource URL <span className="text-destructive">*</span>
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
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Title <span className="text-destructive">*</span>
                </Label>
                <DetectedFieldSuggestion
                  currentValue={title}
                  detectedValue={detectedUpdates.title}
                  onApply={(val) => {
                    setTitle(val);
                    setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                  }}
                  onDismiss={() => {
                    setDetectedUpdates((prev) => ({ ...prev, title: undefined }));
                  }}
                />
              </div>
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
                  value={category || (categoryOptions[0]?.value ?? "")}
                  onValueChange={setCategory}
                  options={categoryOptions}
                  triggerClassName="h-9 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Subtitle / Tagline (Optional)
              </Label>
              <DetectedFieldSuggestion
                currentValue={subtitle}
                detectedValue={detectedUpdates.subtitle}
                onApply={(val) => {
                  setSubtitle(val);
                  setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                }}
                onDismiss={() => {
                  setDetectedUpdates((prev) => ({ ...prev, subtitle: undefined }));
                }}
              />
            </div>
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
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <Label className="text-foreground font-mono text-xs font-bold uppercase">
                Description <span className="text-destructive">*</span>
              </Label>
              <DetectedFieldSuggestion
                currentValue={description}
                detectedValue={detectedUpdates.description}
                onApply={(val) => {
                  setDescription(val);
                  setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                }}
                onDismiss={() => {
                  setDetectedUpdates((prev) => ({ ...prev, description: undefined }));
                }}
              />
            </div>
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
          <MediaAssetFields
            favicon={favicon}
            faviconOptions={faviconOptions}
            iconBg={iconBg}
            onIconBgChange={setIconBg}
            ogImage={ogImage}
            ogImageOptions={ogImageOptions}
            onFaviconChange={setFavicon}
            onOgImageChange={setOgImage}
          />

          {/* Section 5: Creator Attribution */}
          <AuthorSocialFields
            values={{
              author,
              authorGitHub,
              authorLinkedIn,
              authorTwitter,
              authorWebsite,
              authorYouTube,
            }}
            onChange={handleAuthorFieldChange}
            onBatchChange={handleAuthorBatchChange}
            suggestedAuthor={suggestedAuthor}
            onAcceptSuggestedAuthor={handleAcceptSuggestedAuthor}
            onDismissSuggestedAuthor={() => setSuggestedAuthor(null)}
          />

          {/* Section 6: Additional Details & Tags */}
          <div className="border-line space-y-4 border-t pt-5">
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
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <Label className="text-foreground font-mono text-xs font-bold uppercase">
                    GitHub Repository (Optional)
                  </Label>
                  <DetectedFieldSuggestion
                    currentValue={github}
                    detectedValue={detectedUpdates.github}
                    onApply={(val) => {
                      setGithub(val);
                      setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                    }}
                    onDismiss={() => {
                      setDetectedUpdates((prev) => ({ ...prev, github: undefined }));
                    }}
                  />
                </div>
                <div className="h-9">
                  <InputField
                    type="url"
                    placeholder="https://github.com/owner/repo"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    containerClassName="h-9"
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-mono text-xs font-bold uppercase">
                  Tags / Keywords (Optional)
                </Label>
                <TagPicker
                  value={tags}
                  onChange={setTags}
                  allowCustom={true}
                  placeholder="Select tags or type custom..."
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Label className="text-muted-foreground font-mono text-xs font-bold uppercase">
                Note for Moderator (Optional)
              </Label>
              <div className="h-9">
                <InputField
                  placeholder="Why do you recommend this resource? Any special context?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  containerClassName="h-9"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-line flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="border-[1.5px] font-mono text-xs uppercase"
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="border-[1.5px] font-mono text-xs font-bold uppercase"
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
          <ResourceCardPreview
            author={author}
            category={category}
            description={description}
            favicon={favicon}
            iconBg={iconBg}
            subtitle={subtitle}
            tags={tags}
            title={title}
            url={url}
          />

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
