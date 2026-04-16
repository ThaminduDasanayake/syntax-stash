"use client";

import { Check, Copy, Globe } from "lucide-react";
import { useState } from "react";

import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export default function OgPreviewPage() {
  const [title, setTitle] = useState("syntax-stash — Developer Tools");
  const [description, setDescription] = useState(
    "A curated command center for modern web development. Tools, resources, and snippets — all in one place.",
  );
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n) + "…" : s);

  const generatedTags = `<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />${
    imageUrl ? `\n<meta property="og:image" content="${imageUrl}" />` : ""
  }

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />${
    imageUrl ? `\n<meta name="twitter:image" content="${imageUrl}" />` : ""
  }`;

  return (
    <ToolLayout
      icon={Globe}
      title="Open Graph"
      highlight="Previewer"
      description="Preview how your link will appear when shared on Twitter/X and LinkedIn."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Page Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Page"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of the page..."
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <Input
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImgError(false);
              }}
              placeholder="https://example.com/og-image.png"
            />
          </div>

          {/* Generated tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Generated Meta Tags</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(generatedTags)}
                className="rounded-full font-semibold"
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Textarea readOnly value={generatedTags} rows={12} />
          </div>
        </div>

        {/* Right — Previews */}
        <div className="space-y-6">
          {/* Twitter/X Card */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Twitter / X
            </Label>
            <div className="border-border bg-card overflow-hidden rounded-xl border">
              {imageUrl && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="OG preview"
                  className="h-52 w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="bg-muted flex h-52 w-full items-center justify-center">
                  <Globe size={40} className="text-muted-foreground" />
                </div>
              )}
              <div className="space-y-1 p-3">
                <p className="text-muted-foreground font-mono text-xs uppercase">
                  example.com
                </p>
                <p className="text-foreground line-clamp-1 text-sm font-semibold">
                  {title || "Page Title"}
                </p>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {truncate(description, 120) || "Description"}
                </p>
              </div>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              LinkedIn
            </Label>
            <div className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="flex">
                <div className="bg-muted flex h-28 w-28 shrink-0 items-center justify-center">
                  {imageUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt="OG preview"
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Globe size={28} className="text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 space-y-1 p-4">
                  <p className="text-foreground line-clamp-2 text-sm font-semibold leading-snug">
                    {title || "Page Title"}
                  </p>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {truncate(description, 100) || "Description"}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs uppercase">
                    example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
